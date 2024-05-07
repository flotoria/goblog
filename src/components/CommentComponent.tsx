import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { IconButton } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { getUserDetails } from '@/hooks/userHooks';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditCommentModal from '@/components/EditCommentModal';

interface CommentProps {
  comment_id: number;
  commenter_id: number;
  content: string;
  timestamp: string;
  refresh: () => any;
}

function convertToReadableDate(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function CommentComponent({
  comment_id,
  commenter_id,
  content,
  timestamp,
  refresh
}: CommentProps) {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');
  const { userId } = getUserDetails();
  const [openEditCommentModal, setOpenEditCommentModal] = useState(false);

  const deleteComment = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comment/deleteComment`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        commentId: comment_id
      })
    });
    refresh();
  };

  const getUserData = async () => {
    const storedName = sessionStorage.getItem(commenter_id.toString());
    if (storedName) {
      setName(storedName);
      return;
    }

    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getUserInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: commenter_id })
    });
    const userData = await data.json();
    sessionStorage.setItem(commenter_id.toString(), userData.name);
    setName(userData.name);
    setPicture(userData.picture);
  };

  useEffect(() => {
    getUserData();
  }, [commenter_id]);

  return (
    <>
      <EditCommentModal open={openEditCommentModal} handleClose={() => setOpenEditCommentModal(false)} commentID={comment_id} content={content} refresh={refresh} />
      <Card sx={{ minWidth: 275, minHeight: 125, backgroundColor: "rgb(248 250 252)" }} elevation={4}>
          <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "lightblue" }} aria-label="recipe">
              {picture ? (<img src={picture} style={{width: '100%', height: '100%', objectFit: 'cover'}} />) : name && name.charAt(0)}
            </Avatar>
          }
          title={name}
          subheader={convertToReadableDate(timestamp)}
        />
          <CardContent>
          <Typography variant="body2">
              {content}
          </Typography>
        </CardContent>
        
      
        <CardActions>
          {userId === commenter_id &&
              <>
                <IconButton
                  aria-label="delete"
                  onClick={deleteComment}
                  sx={{
                    color: 'gray',

                  }}
                >
                  <DeleteOutlineIcon />

                </IconButton>
                <IconButton
                  aria-label="edit"
                  onClick={() => {
                    setOpenEditCommentModal(true);
                  }}
                  sx={{
                    color: 'gray',

                  }}
                >
                  <EditOutlinedIcon />

                </IconButton>
              </>

            }
        </CardActions>
      </Card>
    </>
  );
}
