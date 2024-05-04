import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Avatar } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import CommentComponent from '@/components/CommentComponent';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/DashboardLayout';


function convertToReadableDate(timestamp: string) {
    const isoTimestamp = timestamp;
    const date = new Date(isoTimestamp);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    //@ts-ignore
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}

export default function PostPage() {
    const router = useRouter();
    const [comment, setComment] = useState('');
    const [listOfComments, setListOfComments] = useState<any[]>([]);
    const [data, setData] = useState<any>({});  
    const [name, setName] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [updateCommentsIndicator, setUpdateCommentsIndicator] = useState(0);

    const post_id = router.query.post_id;

    const getPostInfo = async () => {
        if (post_id === undefined) return;
        const res = await fetch(`/api/post/getPostInfo/?post_id=${post_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await res.json();

        setData(data);  



        
    }

    
    const getUserInfo = async () => {
        const res = await fetch(`/api/user/getUserInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: data.user_id
            })
        });

        const userData = await res.json();

        setName(userData.name);  
        setProfilePicture(userData.picture);
        
    }



    const handleComment = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comment/createComment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_id: post_id,
                    content: comment
                })
            });
        await getComments();
        setComment('');
    }

    const getComments = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comment/getAllComments?post_id=${post_id}`);
        const data = await res.json();
        setListOfComments(data);
    }

    useEffect(() => {
        getUserInfo();
        getComments();
        getPostInfo();
        
    }, [data, post_id]);

    return (
    <DashboardLayout>
        <div className="h-screen w-full flex justify-center items-center">
            <Box sx={{
                width: 1,
                height: 1,
                display: "flex",
                flexDirection: "row",
                backgroundColor: "white",
                borderRadius: 3
            }}>

                <div className="w-1/2 h-full flex flex-col justify-center items-center overflow-hidden">
                    <div className="w-5/6">
                        <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "2rem" }}>{data.title}</Typography>

                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <Avatar sx={{ width: 60, height: 60, bgcolor: "lightblue" }} aria-label="recipe">
                                {profilePicture ? (<img src={profilePicture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />) : (name ? name.charAt(0) : "?")}

                            </Avatar>
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <Typography sx={{ ml: 1, fontWeight: "bold" }}>
                                    {name ? name : "Loading..."}
                                </Typography>
                                <Typography sx={{ ml: 1 }}>
                                    {convertToReadableDate(data.timestamp)}
                                </Typography>



                            </Box>

                        </Box>
                    </div>

                    <div className="w-5/6 mt-1 h-4/5 bg-gray-100 overflow-auto border-slate-200 drop-shadow-2xl border2 rounded-2xl p-4">
                        <div dangerouslySetInnerHTML={{ __html: data.contents }} />
                    </div>
                </div>
                <div className="w-1/2 p-6 flex flex-col gap-y-2">
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        Comments
                    </Typography>
                    <Box sx={{
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}>

                    {
                        Array.isArray(listOfComments) && listOfComments.map((comment, index) => {
                            return (
                                <CommentComponent key={index} comment_id={comment.id} commenter_id={comment.commenter_id} content={comment.content} timestamp={comment.timestamp} refresh={setUpdateCommentsIndicator}/>
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
                        <Button variant="contained" disabled={comment.length == 0} value={comment} onClick={handleComment}>
                            Comment
                        </Button>
                    </Box>
                </div>
            </Box>
        </div>

    </DashboardLayout>
    )
}