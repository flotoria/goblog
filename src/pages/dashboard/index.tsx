import CreatePostModal from "@/components/createPostModal";
import { setUserDetails, getUserDetails } from "@/hooks/userHooks";
import { Box } from "@mui/material";
import QuillEditor from "react-quill";
import { useState } from "react";

export default function Dashboard() {
    setUserDetails();
    const { userId, name, email, gender } = getUserDetails();
    const [ postModal, openPostModal ] = useState(false);
    return (
        <div>
            <CreatePostModal open={postModal} handleClose={() => openPostModal(false)} />
            <div className="h-20 border-2">
                { userId }
                { name }
                { email }
                { gender }
                <button onClick={() => openPostModal(true)}>open</button>
            </div>
            
        </div>  
    );
}