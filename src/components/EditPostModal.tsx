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

export default function EditPostModal({ open, handleClose, postID }: { open: boolean, handleClose: any, postID: number }) {

    const [editorHtml, setEditorHtml] = useState('');
    const [title, setTitle] = useState('');
    const [loadEditor, setLoadEditor] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories:{ [key: string]: number } = { 'All': 0, 'Tech': 1, 'Design': 2, 'Business': 3, 'Health': 4, 'Games': 5 };
    const categoriesByKey:{ [key: number]: string } = { 0: 'All', 1: 'Tech', 2: 'Design', 3: 'Business', 4: 'Health', 5: 'Games' };
    const [disableButton, setDisableButton] = useState(false);
    
    const getPostContent = async () => {
        const res = await fetch(`/api/post/getPostInfo/?post_id=${postID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        setTitle(data.title);
        setEditorHtml(data.contents);
        setSelectedCategory(categoriesByKey[data.category_id]);
    }

    
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
        await fetch('/api/post/editPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                contents: editorHtml,
                category: categories[selectedCategory],
                post_id: postID
            })

        })
        setDisableButton(false);
        handleClose();
        window.location.reload();

    }

    useEffect(() => {
        getPostContent();
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
            sx={{ zIndex: 9999 }}
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
                    <TextField fullWidth label="Title" value={title} onChange={(e: any) => setTitle(e.target.value)} />
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

                <div className="h-1/8 flex mt-2 flex-col justify-center items-center"> 
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
