import { setUserDetails, getUserDetails } from "@/hooks/userHooks";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function CreatePostModal({ open, handleClose }: { open: boolean, handleClose: any }) {
    const [editorHtml, setEditorHtml] = useState('');
    const [loadEditor, setLoadEditor] = useState(false);

    const handleChange = (html: any) => {
        setEditorHtml(html);
    };

    const handleSubmit = () => {
        fetch('/api/post/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Test",
                contents: editorHtml
            })

        })
    }

    useEffect(() => {
        if (open) {
            setLoadEditor(true);
        } else {
            setLoadEditor(false);
        }
    }, [open]);

    return (

        <Modal
            open={open}
            onClose={handleClose}
        >
            <div className="h-screen w-full flex justify-center items-center">
                <Box sx={{width: 4/5, 
                    height: 4/5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center", 
                    alignItems: "center",
                    backgroundColor: "white"}}>
                    <Typography variant="h4">
                        Create post
                    </Typography>
                    <div className="h-3/4 w-3/4 flex justify-center items-center overflow-auto">
                        {loadEditor && (
                                <ReactQuill
                                    theme="snow"
                                    value={editorHtml}
                                    onChange={handleChange}
                                />
                        )}
                    </div>
                    <Button variant="contained" onClick={handleSubmit}>Upload</Button>
                </Box>
            </div>

        </Modal>
    );
}