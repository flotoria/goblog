// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import cookie from 'cookie';
import { JSDOM } from 'jsdom';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        if (req.method === "POST") {
            const cookies = cookie.parse(req.headers.cookie || '');
            const { contents, comment_id } = req.body;
            if (!contents || !comment_id) {
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


            await sql`UPDATE comments SET content=${contents} WHERE id=${comment_id} AND commenter_id=${data.user_id};`
            return res.status(200).json("Comment edited successfully.");


        }
        else {
            return res.status(405).json({ message: "Method not allowed." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
