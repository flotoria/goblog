import CreatePostModal from "@/components/CreatePostModal";
import { setUserDetails, getUserDetails } from "@/hooks/userHooks";
import { Box, Grid, CircularProgress, Chip } from "@mui/material";
import QuillEditor from "react-quill";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import PostModal from "@/components/PostModal";
import DashboardLayout from "@/components/DashboardLayout";
import PostGrid from "@/components/PostGrid";
import Cookies from 'js-cookie';
import {useRouter} from 'next/router';

import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { SelectChangeEvent } from '@mui/material';

export default function Dashboard() {
    const { userId, name, email, gender } = getUserDetails();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState('All');

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

    const categories = {'All': 0, 'Tech': 1, 'Design': 2, 'Business': 3, 'Health': 4, 'Games': 5};

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    useEffect(() => {
        sessionStorage.clear();
        getPosts();
    }, []);

    useEffect(() => {
        setFilteredPosts(posts.filter(post => selectedCategory === 'All' || post.category_id === categories[selectedCategory]));
    }, [posts, selectedCategory])
    return (
        <DashboardLayout>
            <Box sx={{ display: "flex", gap: 1 }}>
                {Object.keys(categories).map((category, index) => (
                    <Chip key={index} label={category} onClick={() => handleCategoryChange(category)} variant={selectedCategory === category ? 'filled' : 'outlined'} />
                ))}
            </Box>

            {!loading ?
                (
                    <PostGrid posts={filteredPosts} />
                ) : (
                    <div className="w-full h-screen flex justify-center items-center">
                        <CircularProgress />
                    </div>
                )}
        </DashboardLayout>
    );
}
