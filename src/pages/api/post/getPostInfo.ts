import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import cookie from 'cookie';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {
        const { post_id } = req.query;
        if (!post_id) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const cookies = cookie.parse(req.headers.cookie || '');
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
        

        const result = await sql`SELECT * FROM posts WHERE id=${post_id as string};`
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
}
