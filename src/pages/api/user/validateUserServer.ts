// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { use } from "react";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Missing required fields." });
      } else {  
        await jwt.verify(token, process.env.JWT_SECRET!, async (err: any, decoded: any) => {
          if (err) {
            console.error(err);
            return res.status(401).json({ message: "Invalid token." });
          }
          const result = await sql`SELECT name, email, gender FROM users WHERE id = ${decoded?.user_id};`
          const name = result.rows[0].name;
          const email = result.rows[0].email;
          const gender = result.rows[0].gender;
          return res.status(200).json({ valid: true, user_id: decoded?.user_id, name, email, gender });
        });
      }
    } else {
      return res.status(405).json({ message: "Method not allowed." });
 
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}