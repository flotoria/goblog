// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const { name, email, gender, password } = req.body;
      if (!name || !email || !gender || !password) {
        res.status(400).json({ message: "Missing required fields." });
      }
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, async function (err, hash) {
        const result = await sql`INSERT INTO users (name, gender, email) VALUES (${name}, ${gender}, ${email}) RETURNING id;`;
        // @ts-ignore
        const id = result.rows[0].id;
        if (id) {
          await sql`INSERT INTO logins (user_id, user_email, hashed_password) VALUES (${id}, ${email}, ${hash});`;
        }
      });
      res.status(200).json({ message: "Created account successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }

}
