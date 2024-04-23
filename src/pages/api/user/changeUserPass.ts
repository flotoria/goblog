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
    if (req.method === "PATCH") {
        const { email } = req.body;
        const token = req.cookies['token'];
        if (!token || !email) {
          return res.status(400).json({ message: "Missing required fields." });
        } 
        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/validateUserServer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token }),
        })
        const data = await result.json();
        const user_id = data.user_id;


        await sql`UPDATE users SET email=${email} WHERE id=${user_id};`
        await sql`UPDATE logins SET user_email=${email} WHERE user_id=${user_id};`
        return res.status(200).json({message: "Email changed successfully."});   
    }
    else {
      return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}