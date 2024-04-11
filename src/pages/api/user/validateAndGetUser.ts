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
      const { json } = req.body;
      if (!json) {
        res.status(400).json({ message: "Missing required fields." });
      }
      
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }

}
