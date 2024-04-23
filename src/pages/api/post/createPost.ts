// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import cookie from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const cookies = cookie.parse(req.headers.cookie || '');
      const { title, contents, category } = req.body;
      const selectedCategoryID = category || null;
      if (!title || !contents) {
        return res.status(400).json({ message: "Missing required fields." });
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/validateUserServer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: cookies.token }),
      });
      if (!response.ok) {
        return res.status(401).json({ message: "Invalid token." });
      }
      const data = await response.json();
      await sql`INSERT INTO posts (title, contents, user_id, category_id) VALUES (${title}, ${contents}, ${data.user_id}, ${selectedCategoryID});`
      return res.status(200).json("Post created successfully.");
      
    }
    else {
      return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  } 
}
