
import { Grid } from '@mui/material';
import PostCard from './PostCard';

export default function PostGrid({ posts }: { posts: any }) {
    return (
        <Grid container spacing={2} sx={{mt: 0.025}}>
            {posts.map((post: any) => (
                <Grid item key={post.id} xs={12} sm={6} md={3} lg={2}>
                    <PostCard id={post.id} title={post.title} content={post.contents} timestamp={post.timestamp} user_id={post.user_id} category_id={post.category_id} thumbnail={post.thumbnail}/>
                </Grid>
            ))}
        </Grid>
    )
}