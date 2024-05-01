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
    const postId = req.query.postId;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // Use a parameterized query to prevent SQL injection and errors
    const result = await sql`DELETE FROM posts WHERE id = ${postId as string}`;
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error in deletePost handler:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
