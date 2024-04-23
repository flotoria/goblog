import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import CommentComponent from './CommentComponent';

export default function PostModal({ open, handleClose, id, title, content, timestamp, author }: { open: boolean, handleClose: any, id: number, title: string, content: string, timestamp: string, author: string }) {
    const [comment, setComment] = useState('');
    const [listOfComments, setListOfComments] = useState<any[]>([]);
    const handleComment = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comment/createComment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_id: id,
                    content: comment
                })
            });
        await getComments();    
    }

    const getComments = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comment/getAllComments?post_id=${id}`);
        const data = await res.json();
        setListOfComments(data);
    }

    useEffect(() => {
        getComments();
    }, []);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{ zIndex: 9999999 }}
        >
            <div className="h-screen w-full flex justify-center items-center">
                <Box sx={{
                    width: 0.9,
                    height: 0.9,
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "white",
                    borderRadius: 3
                }}>

                    <div className="w-1/2 h-full flex flex-col justify-center items-center">
                        <div className="w-5/6">
                            <Typography variant="h4">{title}</Typography>
                            <Typography variant="h6">Timestamp: {timestamp} </Typography>
                            <Typography variant="h6">Author: {author} </Typography>
                        </div>

                        <div className="w-5/6 h-4/5 bg-gray-200 overflow-auto border-2 border-slate-400 p-2">
                            <Typography variant="body1">
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            </Typography>
                        </div>
                    </div>
                    <div className="w-1/2 p-2 flex flex-col gap-y-2">
                        <Typography variant="h5">
                            Comments
                        </Typography>
                        <Box sx={{
                            overflow: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                        }}>
                           
                            {
                                listOfComments.map((comment, index) => {
                                    return (
                                        <CommentComponent key={index} commenter_id={comment.commenter_id} content={comment.content} timestamp={comment.timestamp} />
                                    )
                                })
                            }
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row"
                            }}>
                            <TextField value={comment} onChange={(e) => setComment(e.target.value)} fullWidth label="Comment" />
                            <Button variant="contained" onClick={handleComment}>
                                Comment
                            </Button>
                        </Box>
                    </div>
                </Box>
            </div>

        </Modal>
    )
}