import CreatePostModal from "@/components/CreatePostModal";
import { setUserDetails, getUserDetails } from "@/hooks/userHooks";
import { Box, Grid, Typography, Button } from "@mui/material";
import QuillEditor from "react-quill";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import PostModal from "@/components/PostModal";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import PostGrid from "@/components/PostGrid";
import { CircularProgress, Avatar } from "@mui/material";

export default function UserPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { name, email, userId } = getUserDetails();  
    const [user, setUser] = useState<any>({});

    const user_id = router.query.user_id;

    const getUserInfo = async () => {
        const res = await fetch(`/api/user/getUserInfo/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id
            })
        });

        const data = await res.json();
        setUser(data);
    }
  
    const getPosts = async () => {

        setLoading(true);
       
        const res = await fetch(`/api/post/getUserPosts/?user_id=${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await res.json();
        setPosts(data);
        setLoading(false);

    }
    useEffect(() => { 
        sessionStorage.clear();
        if (router.query.user_id) {
            getPosts();
            getUserInfo();
        }
    }, [user_id]);

    return (
        
        <DashboardLayout>
 
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Avatar sx={{width: 60, height: 60, bgcolor: "lightblue" }} aria-label="recipe">
                {user.picture ? (<img src={user.picture} style={{width: '100%', height: '100%', objectFit: 'cover'}} />) : user.name && user.name.charAt(0)}
                </Avatar>
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <Typography sx={{ml: 1, fontWeight: "bold"}}>
                        {user.name ? user.name : "Loading..."}
                    </Typography>
                    <Typography sx={{ml: 1}}>
                        {user.email ?  user.email : "Loading..."}
                    </Typography>
                    { user_id === userId.toString() && (
                    <Button onClick={() => router.push("/dashboard/user_settings")}sx={{ml: 1, mt: 0.5}} size="small" variant="contained">
                        Edit Account Info
                    </Button>
                    )}
                </Box>
                
            </Box>

            { !loading ? 
          (
            <PostGrid posts={posts} />
          ) : (
          <div className="w-full h-screen flex justify-center items-center">
            <CircularProgress />
          </div>
          )}
        </DashboardLayout>
    )
}