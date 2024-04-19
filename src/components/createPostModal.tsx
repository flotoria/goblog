import { setUserDetails, getUserDetails } from "@/hooks/userHooks";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function CreatePostModal({ open, handleClose }: { open: boolean, handleClose: any }) {
    
    const [editorHtml, setEditorHtml] = useState('');
    const [title, setTitle] = useState('');
    const [loadEditor, setLoadEditor] = useState(false);

    const handleChange = (html: any) => {
        setEditorHtml(html);
    };

    const modules = {
        toolbar: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
      };

    const handleSubmit = () => {
        fetch('/api/post/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                contents: editorHtml
            })

        })
        handleClose();
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
                <Box sx={{width: 3/5, 
                    height: 4/5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center", 
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: 3}}>
             
                        <div className="w-3/5 h-1/8 p-2">
                            <TextField fullWidth label="Title" onChange={(e) => setTitle(e.target.value)} />
                        </div>
                    <div className="h-3/4 w-3/4 flex flex-col items-center items-start overflow-auto">
                        
                     
                        {loadEditor && (
                                <ReactQuill
                                    theme="snow"
                                    value={editorHtml}
                                    onChange={handleChange}
                                    modules={modules}
                                    style={{ width: '100%', height: '100%'}}
                                />
                        )}
                    </div>
                    <div className="h-1/8 flex flex-row justify-center items-center">
                        <Button variant="contained" onClick={handleSubmit}>Upload</Button>
                    </div>
                </Box>
            </div>

        </Modal>
    );
}