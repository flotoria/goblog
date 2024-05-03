// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { use } from "react";
import { profile } from "console";
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';




export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        if (req.method === "POST") {
            const { profile_picture, type } = req.body;
            const token = req.cookies['token'];
            if (!token || !profile_picture || !type) {
                return res.status(400).json({ message: "Missing required fields." });
            }
            const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/validateUserServer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token }),
            })
            const data = await result.json();
            const user_id = data.user_id;

            const filename = uuidv4();
            const response = await fetch(`${profile_picture}`);
            const blob = await response.blob();

            const { url } = await put(`${filename}.${type}`, blob, {
                access: 'public',
            });

            await sql`UPDATE users SET profile_picture=${url} WHERE id=${user_id};`
            return res.status(200).json({ message: "Profile picture changed successfully." });
        }
        else {
            return res.status(405).json({ message: "Method not allowed." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
}

