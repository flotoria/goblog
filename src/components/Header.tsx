import Image from "next/image";
import { Avatar, Button } from "@mui/material";
import CreatePostModal from "./CreatePostModal";
import { useState } from "react";

export default function Header() {
    const [ postModal, openPostModal ] = useState(false);

    return (
        <header className="bg-slate-100 text-white w-full flex flex-row h-12 drop-shadow-md">
            <div className="w-1/2">
                <Image src="/logo.png" className="w-12 h-12" alt="Logo" width={600} height={600} />
            </div>
            <div className="w-1/2 items-center flex flex-row justify-end px-2">
                <CreatePostModal open={postModal} handleClose={() => openPostModal(false)} />
                <Button sx={{height: 0.75}} variant="contained" onClick={() => openPostModal(true)} >Create Post</Button>
                <Avatar sx={{bgcolor: 'red'}} className="ml-3">R</Avatar>
            </div>
        </header>
    );
}