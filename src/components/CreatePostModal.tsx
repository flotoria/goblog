import { setUserDetails, getUserDetails } from "@/hooks/userHooks";
import { Box, FormControl, Select, InputLabel, MenuItem, CircularProgress } from "@mui/material";
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
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories:{ [key: string]: number } = { 'All': 0, 'Tech': 1, 'Design': 2, 'Business': 3, 'Health': 4, 'Games': 5 };
    const [disableButton, setDisableButton] = useState(false);
    
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

    const handleSubmit = async () => {
        setDisableButton(true);
        await fetch('/api/post/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                contents: editorHtml,
                category: categories[selectedCategory]
            })

        })
        setDisableButton(false);
        handleClose();
        window.location.reload();
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
            sx={{ zIndex: 9999999 }}
        >
            <div className="h-screen w-full flex justify-center items-center">
                <Box sx={{
                    width: 0.6,
                    height: 0.9,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: 3
                }}>

                   

                <div className="w-3/5 h-1/8 p-2">
                    <TextField fullWidth label="Title" onChange={(e: any) => setTitle(e.target.value)} />
                </div>

                <div className="h-3/4 w-3/4 flex flex-col items-center items-start overflow-auto">


                    {loadEditor && (
                        <ReactQuill
                            theme="snow"
                            value={editorHtml}
                            onChange={handleChange}
                            modules={modules}
                            style={{ width: '100%', height: '100%' }}
                        />
                    )}
                </div>

                <div className="h-1/8 mt-2 flex flex-col justify-center items-center"> 
                <Box sx={{ width: '100%', marginBottom: 2 }}>
                            <FormControl fullWidth sx={{ }}>
                                <InputLabel id="category-select-label">Category</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    id="category-select"
                                    value={selectedCategory}
                                    label="Category"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    MenuProps={{ style: { zIndex: 9999 } }}
                                >

                                {Object.keys(categories).map((category, index) => (
                                    category !== 'All' &&
                                        <MenuItem key={index} value={category}>{category}</MenuItem>
                                ))} 
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className="flex flex-row gap-x-2">
                        <Button disabled={disableButton} variant="contained" onClick={handleSubmit}>Upload</Button>
                        {disableButton && <CircularProgress />}
                    </Box>
                </div>
            </Box>
        </div>

        </Modal >
    );
}
