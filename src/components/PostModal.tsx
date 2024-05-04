import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Avatar } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import CommentComponent from './CommentComponent';


function convertToReadableDate(timestamp: string) {
    const isoTimestamp = timestamp;
    const date = new Date(isoTimestamp);
  
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    //@ts-ignore
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  }

export default function PostModal({ open, handleClose, id, title, content, timestamp, author, picture_url }: { open: boolean, handleClose: any, id: number, title: string, content: string, timestamp: string, author: string, picture_url: string }) {
    const [comment, setComment] = useState('');
    const [listOfComments, setListOfComments] = useState<any[]>([]);
    const [updateCommentsIndicator, setUpdateCommentsIndicator] = useState(0);

    
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
    }, [updateCommentsIndicator]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{ zIndex: 9995 }}
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

                    <div className="w-1/2 h-full flex flex-col justify-center items-center overflow-hidden">
                        <div className="w-5/6">
                            <Typography variant="h4" sx={{fontWeight: "bold", fontSize: "2rem"}}>{title}</Typography>
                       
                            <Box sx={{ display: "flex", flexDirection: "row" }}>
                                <Avatar sx={{ width: 60, height: 60, bgcolor: "lightblue" }} aria-label="recipe">
                                    {picture_url ? (<img src={picture_url} style={{width: '100%', height: '100%', objectFit: 'cover'}} />) : (author ? author.charAt(0) : "?")}
             
                                </Avatar>
                                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={{ ml: 1, fontWeight: "bold" }}>
                                        {author ? author : "Loading..."}
                                    </Typography>
                                    <Typography sx={{ ml: 1 }}>
                                        {convertToReadableDate(timestamp)}
                                    </Typography>
            
            
                              
                                </Box>

                            </Box>
                        </div>

                        <div className="w-5/6 mt-1 h-4/5 bg-gray-100 overflow-auto border-slate-200 drop-shadow-2xl border2 rounded-2xl p-4">
                            <Typography variant="body1">
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            </Typography>
                        </div>
                    </div>
                    <div className="w-1/2 p-6 flex flex-col gap-y-2">
                        <Typography variant="h5" sx={{fontWeight: "bold"}}>
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
                                        <CommentComponent key={index} comment_id={comment.id} commenter_id={comment.commenter_id} content={comment.content} timestamp={comment.timestamp} refresh={() => setUpdateCommentsIndicator(oldKey => oldKey + 1)} />
                                    )
                                })
                            }
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 2
                            }}>
                            <TextField value={comment} onChange={(e: any) => setComment(e.target.value)} fullWidth label="Comment" />
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