import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const { name, gender, email, phone_number, password } = req.body;

      if (!name || !email || !gender || !phone_number || !password) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);

      const userResult = await sql`
        INSERT INTO users (name, gender, email, phone_number) 
        VALUES (${name}, ${gender}, ${email}, ${phone_number}) 
        RETURNING id;
      `;
      const userId = userResult.rows[0].id;
      
      await sql`
        INSERT INTO logins (user_id, user_email, hashed_password) 
        VALUES (${userId}, ${email}, ${hash});
      `;

      res.status(200).json({ message: "Created account successfully." });
    }
    else {
      res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}
