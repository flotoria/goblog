import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "PATCH") {
      const { password, confirmPassword, email } = req.body;
      if (!email ||!password ||!confirmPassword) {
        return res.status(400).json({ message: "Missing required fields." });
      }
      if (password!== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      const userResult = await sql`SELECT * FROM users WHERE email = ${email};`;
      const user = userResult.rows[0];
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await sql`UPDATE users SET password = ${hashedPassword} WHERE email = ${email};`
      await sql`UPDATE logins SET password = ${hashedPassword} WHERE email = ${email};`
      return res.status(200).json({ message: "Password reset successfully." });
    } else {
      return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}