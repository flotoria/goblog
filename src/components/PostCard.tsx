import { Card, CardHeader, CardMedia, CardContent, Avatar, IconButton, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import PostModal from './PostModal';

interface PostCardProps {
    title: string;
    content: string;
    user_id: number;
    timestamp: string;
}


export default function PostCard({title, content, user_id, timestamp}: PostCardProps) {

    const [name, setName] = useState('');
    const [postModal, openPostModal] = useState(false);
    

      const getUserData = async () => {
        const data = await fetch('api/user/getUserInfo', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user_id })
          }
        )
        
        const userData = await data.json();

        setName(userData.name);


      }
      useEffect(
        () => {
          getUserData();
        }, []
      )
      return (
        <>
          <PostModal title={title} content={content} open={postModal} handleClose={() => openPostModal(false)} timestamp={timestamp} author={name} />
          <Card onClick={() => openPostModal(true)} sx={{ maxWidth: 345 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'red' }} aria-label="recipe">
                R
              </Avatar>
            }
          
            title={name}
            subheader={timestamp}
          />
          <CardMedia
            component="img"
            height="194"
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKHwlKQQzFpEMHeKdDNBPZNWTOGHIh3m06ElsCfYn04w&s"
            alt=""
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </CardContent>
        </Card> 
    </>)

}