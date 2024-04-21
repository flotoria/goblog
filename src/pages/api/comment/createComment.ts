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
      const { content, post_id } = req.body;
      if (!post_id || !content) {
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
      await sql`INSERT INTO comments (content, commenter_id, post_id) VALUES (${content}, ${data.user_id}, ${post_id});`
      return res.status(200).json("Comment created successfully.");
      
    }
    else {
      return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  } 
}
