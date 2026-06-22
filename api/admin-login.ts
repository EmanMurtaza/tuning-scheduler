import crypto from "node:crypto";

function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(Buffer.alloc(bufA.length), Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username = "", password = "" } = req.body ?? {};
  const adminUser = process.env.ADMIN_USER ?? "";
  const adminPass = process.env.ADMIN_PASS ?? "";
  const jwtSecret = process.env.ADMIN_JWT_SECRET ?? "";

  if (!adminUser || !adminPass || !jwtSecret) {
    return res.status(500).json({ error: "Server not configured" });
  }

  if (
    !timingSafeCompare(String(username), adminUser) ||
    !timingSafeCompare(String(password), adminPass)
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", jwtSecret).update(payload).digest("base64url");

  return res.status(200).json({ token: `${payload}.${sig}` });
}
