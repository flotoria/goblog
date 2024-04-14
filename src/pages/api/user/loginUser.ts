// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Missing required fields." });
        return;
      }
      const result = await sql`SELECT * FROM logins WHERE user_email = ${email};`;
      const hashed_password = result.rows[0].hashed_password.toString('utf8');
      const user_id = result.rows[0].user_id;
      await bcrypt.compare(password, hashed_password, function(err, isMatch) {
        if (err) {
          res.status(500).json({ message: "Error comparing passwords." });
          return;
        }
        if (isMatch) {
          const token = jwt.sign({ user_id }, process.env.JWT_SECRET!, { expiresIn: '6h' });
          res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly`);
          res.status(200).json({ message: "Login successful.", token: token });
          return;
        } else {
          res.status(401).json({ message: "Invalid credentials." });
          return;
        }
      });
    }
    else {
      res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }

}
