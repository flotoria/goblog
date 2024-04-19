import CreatePostModal from "@/components/CreatePostModal";
import { setUserDetails, getUserDetails } from "@/hooks/userHooks";
import { Box, Grid, CircularProgress } from "@mui/material";
import QuillEditor from "react-quill";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import PostModal from "@/components/PostModal";
import DashboardLayout from "@/components/DashboardLayout";
import PostGrid from "@/components/PostGrid";

export default function Dashboard() {
    const { userId, name, email, gender } = getUserDetails();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getPosts = async () => {
        setLoading(true);
        const res = await fetch('/api/post/getAllPosts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        setPosts(data);
        setLoading(false);
    
    }
    useEffect(() => {
        getPosts();
    }, []);
    
    return (
        <DashboardLayout>
          { !loading ? 
          (
            <PostGrid posts={posts} />
          ) : (
          <div className="w-full h-screen flex justify-center items-center">
            <CircularProgress />
          </div>
          )}
        </DashboardLayout>
    );
}