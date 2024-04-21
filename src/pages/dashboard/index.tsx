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

import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { SelectChangeEvent } from '@mui/material';

export default function Dashboard() {
    const { userId, name, email, gender } = getUserDetails();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState('');

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

    const categories = ['Tech', 'Design', 'Business', 'Health', 'Game']; // Example categories

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setSelectedCategory(event.target.value as string);
    };

    const filteredPosts = posts.filter(post => selectedCategory === '' || post.category === selectedCategory);
    
    useEffect(() => {
        getPosts();
    }, []);
    
    return (
        <DashboardLayout>
          <Box sx={{ width: '10%', marginBottom: 2 }}>
            <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={selectedCategory}
                    label="Category"
                    onChange={handleCategoryChange}
                >
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem>
                    {categories.map((category, index) => (
                        <MenuItem key={index} value={category}>{category}</MenuItem>
                    ))}
                </Select>
            </FormControl>
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
    );
}
