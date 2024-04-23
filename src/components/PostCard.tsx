import { Card, CardHeader, CardMedia, CardContent, Avatar, IconButton, Typography, MenuItem, Paper, MenuList } from '@mui/material';
import { useState, useEffect } from 'react';
import PostModal from './PostModal';

interface PostCardProps {
    id: number;
    title: string;
    content: string;
    user_id: number;
    timestamp: string;
}


export default function PostCard({id, title, content, user_id, timestamp}: PostCardProps) {

    const [name, setName] = useState('');
    const [postModal, openPostModal] = useState(false);

    const getFirstImage = (htmlString: string) => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(htmlString, 'text/html');
      const img = htmlDoc.querySelector('img');
      return img ? img.src : 'https://cdn.pixabay.com/photo/2015/11/03/08/56/question-mark-1019820_960_720.jpg';
    }
    

      const getUserData = async () => {
        const cachedName = sessionStorage.getItem(user_id.toString());
        if (cachedName) {
          setName(cachedName);
          return;
        }
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getUserInfo`, 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user_id })
          }
        )
        
        const userData = await data.json();

        sessionStorage.setItem(user_id.toString(), userData.name);

        setName(userData.name);


      }
      useEffect(
        () => {
          getUserData();
        }, []
      )
      return (
        <>
        
          <PostModal id={id} title={title} content={content} open={postModal} handleClose={() => openPostModal(false)} timestamp={timestamp} author={name} />
          <Card onClick={() => openPostModal(true)} sx={{ width: "100%" }}>
          <CardHeader
            avatar={
              <div>
                <Avatar sx={{ bgcolor: 'lightblue' }} aria-label="recipe">
                  {name.charAt(0)}
                  
                </Avatar>
                
            </div>
            }
          
            title={name}
            subheader={timestamp}
          />
          <CardMedia
            component="img"
            height="194"
            image={getFirstImage(content)}
            alt=""
            sx={{ objectFit: 'cover' }}
          />
          <CardContent>
            <Typography variant="body1" color="text.primary">
              {title}
            </Typography>
          </CardContent>
        </Card> 
    </>)

}