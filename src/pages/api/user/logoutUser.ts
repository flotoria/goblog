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
      res.setHeader('Set-Cookie', `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`);
        res.status(200).json({ message: "Logout successful." });
    }
    else {
      res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }

}
