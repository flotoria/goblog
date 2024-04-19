import CreatePostModal from "@/components/CreatePostModal";
import { setUserDetails, getUserDetails } from "@/hooks/userHooks";
import { Box, Grid } from "@mui/material";
import QuillEditor from "react-quill";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import PostModal from "@/components/PostModal";

export default function Dashboard() {
    setUserDetails();
    const { userId, name, email, gender } = getUserDetails();
    const [posts, setPosts] = useState<any[]>([]);

    const getPosts = async () => {
        const res = await fetch('/api/post/getAllPosts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        setPosts(data);
    
    }
    useEffect(() => {
        getPosts();
    }, []);
    
    return (
        <div>
            <Grid container spacing={1}>
            {posts.map((post) => (
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <PostCard title={post.title} user_id={post.user_id} content={post.contents} timestamp={post.timestamp}/>
                </Grid>
            ))}
            </Grid>  
            
            
        </div>  
    );
}