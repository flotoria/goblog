// src/pages/api/post/deletePost.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres"; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const commentID = req.body.commentId;
    const token = req.cookies['token'];
    if (!commentID) {
      return res.status(400).json({ message: "Comment ID is required" });
    }

    const userIdResult = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/validateUserServer`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: token }),
    })
    const data = await userIdResult.json();
    const user_id = data.user_id;
    const comment = await sql`SELECT * FROM comments WHERE id = ${commentID as string}`;
    

    //@ts-ignore
    if (comment.rows[0].commenter_id === user_id) {
    // Use a parameterized query to prevent SQL injection and errors
      const result = await sql`DELETE FROM comments WHERE id = ${commentID as string}`;
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Comment not found." });
      }
      else {
        res.status(200).json({ message: "Comment deleted successfully." });
      }
    }
   
    res.status(400).json({ message: "No permission to delete." });
  } catch (error) {
    console.error("Error in deletePost handler:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
