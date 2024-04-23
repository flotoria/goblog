import CreatePostModal from "@/components/CreatePostModal";
import { setUserDetails, getUserDetails } from "@/hooks/userHooks";
import { Box, Grid } from "@mui/material";
import QuillEditor from "react-quill";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import PostModal from "@/components/PostModal";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import PostGrid from "@/components/PostGrid";
import { CircularProgress } from "@mui/material";

export default function UserPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const user_id = router.query.user_id;

  
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
        }
    }, [user_id]);

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
    )
}