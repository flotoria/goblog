// src/pages/api/user/changeUserGender.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "PATCH") {
        const { gender } = req.body;
        const token = req.cookies['token'];
        if (!token || !gender) {
          return res.status(400).json({ message: "Missing required fields." });
        }
        
        // Assume validateUserServer returns the user id after validating the token
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/validateUserServer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token }),
        }).then(response => response.json());
        
        const user_id = data.user_id;
        
        // Update the user's gender in the database
        await sql`UPDATE users SET gender=${gender} WHERE id=${user_id};`
        return res.status(200).json({ message: "Gender updated successfully." });   
    } else {
      return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
