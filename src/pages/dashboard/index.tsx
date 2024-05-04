import CreatePostModal from "@/components/CreatePostModal";
import { setUserDetails, getUserDetails } from "@/hooks/userHooks";
import { Box, Grid, CircularProgress, Chip, TextField, InputAdornment, Button } from "@mui/material";
import QuillEditor from "react-quill";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import PostModal from "@/components/PostModal";
import DashboardLayout from "@/components/DashboardLayout";
import PostGrid from "@/components/PostGrid";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';


import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { SelectChangeEvent } from '@mui/material';


export default function Dashboard() {
  const { userId, name, email, gender } = getUserDetails();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [queryInput, setQueryInput] = useState("");
  const router = useRouter();

  type CategoryKey = 'All' | 'Tech' | 'Design' | 'Business' | 'Health' | 'Games';
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('All');

  const getPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/post/getAllPosts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      // Ensure that 'data' is an array before setting it to state
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('Data fetched is not an array:', data);
        setPosts([]); // Set to an empty array if data is not an array
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); // In case of an error, set to an empty array
    }
    setLoading(false);
  };

  const getPostsBasedOnQuery = async () => {
    if (queryInput !== "") {
    setLoading(true);
    try {
      const res = await fetch(`/api/post/getAllPostsWithQuery?query=${queryInput}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('Data fetched is not an array:', data);
        setPosts([]); 
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); 
    }
    setLoading(false);
  } else {
    getPosts();
  }
  };

  const categories: { [key: string]: number } = { 'All': 0, 'Tech': 1, 'Design': 2, 'Business': 3, 'Health': 4, 'Games': 5 };

  const handleCategoryChange = (category: CategoryKey) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    sessionStorage.clear();
    getPosts();
  }, []);


  useEffect(() => {
    if (Array.isArray(posts)) {
      const filtered = posts.filter(post =>
        selectedCategory === 'All' || post.category_id === categories[selectedCategory]
      );
      console.log("Filtered posts:", filtered); // Log to see the filtered data
      setFilteredPosts(filtered);
    }
  }, [posts, selectedCategory]);
  
  return (
    <DashboardLayout>
      <Box sx={{height: 1}}>
        <TextField
          id="input-with-search"
          label=""
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
        <Button sx={{ height: 30, ml: 2, whiteSpace: "nowrap" }} variant="outlined" onClick={getPostsBasedOnQuery}>Search</Button>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        {Object.keys(categories).map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => handleCategoryChange(category as CategoryKey)}
            variant={selectedCategory === category ? 'filled' : 'outlined'}
          />
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
