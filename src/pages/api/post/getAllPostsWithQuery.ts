import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import cookie from 'cookie';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        if (req.method === "GET") {
            const cookies = cookie.parse(req.headers.cookie || '');
            const { query } = req.query;
            if (!query) {
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

            const result = await sql`SELECT * FROM posts WHERE title LIKE ${'%' + query + '%'} OR contents LIKE ${'%' + query + '%'}`;
            return res.status(200).json(result.rows);
        }
        else {
            return res.status(405).json({ message: "Method not allowed" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", error: `${process.env.NEXT_PUBLIC_BASE_URL}` });
    }
}
