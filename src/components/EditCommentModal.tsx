import { setUserDetails, getUserDetails } from "@/hooks/userHooks";
import { Box, FormControl, Select, InputLabel, MenuItem, CircularProgress, Button } from "@mui/material";
import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function EditCommentModal({ open, handleClose, commentID, content, refresh }: { open: boolean, handleClose: any, commentID: number, content: string, refresh: any}) {

    const [comment, setComment] = useState(content);
    const handleSubmit = async () => { 
        await fetch('/api/comment/editComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment_id: commentID,
                contents: comment
            })
        })
        handleClose();
        refresh();
    }
    
    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{ zIndex: 9999 }}
        >
            <div className="h-screen w-full flex justify-center items-center">
                <Box sx={{
                    width: 1/2,
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: 3
                }}>

                    <div className="w-full h-1/8 p-2 flex flex-col gap-2">
                        <TextField fullWidth label="Comment" value={comment} onChange={(e: any) => setComment(e.target.value)} />
                        <Button variant="contained" onClick={handleSubmit}>Update</Button>
                    </div>
                    


                </Box>
            </div>
        </Modal >
    );
}
