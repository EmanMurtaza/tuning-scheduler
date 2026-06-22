import crypto from "node:crypto";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const { token = "" } = req.body ?? {};
  const jwtSecret = process.env.ADMIN_JWT_SECRET ?? "";

  if (!jwtSecret) {
    return res.status(500).json({ ok: false });
  }

  const parts = String(token).split(".");
  if (parts.length !== 2) {
    return res.status(401).json({ ok: false });
  }

  const [payload, sig] = parts;
  const expected = crypto
    .createHmac("sha256", jwtSecret)
    .update(payload)
    .digest("base64url");

  try {
    const sigBuf = Buffer.from(sig, "base64url");
    const expBuf = Buffer.from(expected, "base64url");
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return res.status(401).json({ ok: false });
    }
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (Date.now() > exp) {
      return res.status(401).json({ ok: false, reason: "expired" });
    }
  } catch {
    return res.status(401).json({ ok: false });
  }

  return res.status(200).json({ ok: true });
}
