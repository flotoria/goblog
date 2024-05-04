// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import cookie from 'cookie';
import { JSDOM } from 'jsdom';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';


const checkFirstImage = (htmlString: string) => {
  const dom = new JSDOM(htmlString);
  const img = dom.window.document.querySelector('img');
  return img ? true : false;
}

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

      
      if (!checkFirstImage(contents)) {
        const gptRes = await fetch('https://api.openai.com/v1/images/generations', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            "model": "dall-e-3",
            "prompt": `Generate an image based on the following text -
            The title is: ${title}, the content is ${contents}. 
            If the content does not make sense to DALLE, generate a random image.`,
            "n": 1,
            "size": "1024x1024"
          }),
        })
        const gptData = await gptRes.json();
        const imgData = await fetch(gptData.data[0].url);
        const imgBlob = await imgData.blob();

        const filename = uuidv4();

        const { url } = await put(`${filename}.png`, imgBlob, {
          access: 'public',
      });

        await sql`INSERT INTO posts (title, contents, user_id, category_id, thumbnail) VALUES (${title}, ${contents}, ${data.user_id}, ${selectedCategoryID}, ${url});`
        return res.status(200).json("Post created successfully.");
      }

      await sql`INSERT INTO posts (title, contents, user_id, category_id) VALUES (${title}, ${contents}, ${data.user_id}, ${selectedCategoryID});`
      return res.status(200).json("Post created successfully.");

    }
    else {
      return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", error: error });
  }
}
