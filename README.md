
## GoBlog 

GoBlog is a blog management system.
Users can create, edit, and delete posts and manage their own comments on those posts. 
The system supports user authentication, allowing users to sign up, log in, and manage their profiles.
GoBlog uses the DALLE-3 API in order to generate image for the blog post thumbnails.

**YouTube Demo:** https://www.youtube.com/watch?v=N1SvO1vCgik

## Place the .env.local into the root GoBlog folder (root Next.js folder) 
```
POSTGRES_URL=****
POSTGRES_PRISMA_URL=****
POSTGRES_URL_NO_SSL=****
POSTGRES_URL_NON_POOLING=***
POSTGRES_USER=****
POSTGRES_HOST=****
POSTGRES_PASSWORD=****
POSTGRES_DATABASE=****
JWT_SECRET=****
NEXT_PUBLIC_BASE_URL=****
BLOB_READ_WRITE_TOKEN=****
OPENAI_API_KEY=****
```
- All the PostgreSQL environment variables are automatically copied from the Vercel website. 
- The JWT_SECRET is your chosen secret key for encoding all the JWTs.
- The NEXT_PUBLIC_BASE_URL will be either localhost:3000 (or a port of your choosing) or your current domain.
- The BLOD_READ_WRITE_TOKEN is a token you can retrieve when making the BLOB storage on Vercel.
- The OPENAI_API_KEY is a token you can generate from the OpenAI website.

## How to run in dev mode
- ```git clone https://github.com/flotoria/goblog.git```
- ```npm run dev```
