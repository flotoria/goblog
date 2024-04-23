import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';


export default function CommentComponent({commenter_id, content, timestamp}: {commenter_id: number, content: string, timestamp: string}) {
    const [name, setName] = useState('');
    const getUserData = async () => {

        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getUserInfo`, 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: commenter_id })
          }
        )
        
        const userData = await data.json();

        setName(userData.name);


      }

      useEffect(() => {
        getUserData();
      })
  return (
    <Card sx={{ minWidth: 275, minHeight: 130, backgroundColor: "rgb(248 250 252)" }}>
         <CardContent>
        <Typography variant="body2">
            {content}
        </Typography>
      </CardContent>
        <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "lightblue" }} aria-label="recipe">
            R
          </Avatar>
        }
        title={name}
        subheader={timestamp}
      />
     
      <CardActions>
      </CardActions>
    </Card>
  );
}