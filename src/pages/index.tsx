import Image from "next/image";
import { Inter } from "next/font/google";
import { Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { LampDemo } from "@/ui/lamp";
import { WavyBackground } from "@/ui/wavy-background";
import { SparklesCore } from "@/ui/sparkles";

const inter = Inter({ subsets: ["latin"] });


 
export function SparklesPreview() {
  return (
    <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        GoBlog
      </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
 
        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
 
        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  return (
    <>


      <div className="h-screen bg-black flex flex-row items-center">
        <SparklesPreview />
      </div>
      <div className="absolute flex flex-row h-screen top-0 left-0 right-0 justify-center items-center gap-x-2 mt-3">
      <Button onClick={() => router.push('/login')} variant="outlined" sx={{color: "white", borderColor: "white", '&:hover': {borderColor: 'white', }}}>Login</Button>
        <Button onClick={() => router.push('/register')} variant="outlined" sx={{color: "white", borderColor: "white", '&:hover': {borderColor: 'white', }}}>Signup</Button>
      </div>



    </>

  );
}

/*

*/ 