import { Box, Chip, Card, CardHeader, CardMedia, CardContent, Avatar, Typography, IconButton, CardActions, Slide, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, MouseEvent } from 'react';
import PostModal from './PostModal';
import EditPostModal from './EditPostModal';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import { getUserDetails } from '@/hooks/userHooks';
import { useRouter } from 'next/router';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

interface PostCardProps {
  id: number;
  title: string;
  content: string;
  user_id: number;
  category_id?: number;
  timestamp: string;
  thumbnail?: string;
}

function convertToReadableDate(timestamp: string) {
  const isoTimestamp = timestamp;
  const date = new Date(isoTimestamp);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  //@ts-ignore
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
}

export default function PostCard({ id, title, content, user_id, timestamp, category_id, thumbnail }: PostCardProps) {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');
  const [postModal, setPostModal] = useState(false);
  const [editPostModal, setEditPostModal] = useState(false);
  const categories: { [key: number]: string } = { 0: 'All', 1: 'Tech', 2: 'Design', 3: 'Business', 4: 'Health', 5: 'Games' };
  const { userId } = getUserDetails();
  const router = useRouter();
  const [openShareSnackbar, setOpenShareSnackbar] = useState(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);

  const getFirstImage = (htmlString: string) => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, 'text/html');
    const img = htmlDoc.querySelector('img');
    return img ? img.src : thumbnail;
  }

  const getUserData = async () => {

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
    setPicture(userData.picture);
  }

  useEffect(() => {
    getUserData();
  }, [user_id]);

  const handleDelete = async (postId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();  // Prevents the card click event
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/post/deletePost?postId=${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setOpenDeleteSnackbar(true);
        window.location.reload();
      } else {
        alert(data.message);  // Server-side error message
      }
    } catch (error) {
      console.error('Failed to delete the post.', error);
    }
  };

  return (
    <>
      <Snackbar
        open={openShareSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenShareSnackbar(false)}
        message="Post URL has been copied to the clipboard."
      />
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenDeleteSnackbar(false)}
        message="Post has been deleted."
      />
      <EditPostModal postID={id} handleClose={() => setEditPostModal(false)} open={editPostModal} />
      <PostModal id={id} title={title} content={content} open={postModal} picture_url={picture} handleClose={() => setPostModal(false)} timestamp={timestamp} author={name} />
      <Card sx={{ width: "100%", position: 'relative', borderRadius: "20px", height: 460 }} elevation={3} >
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: 'lightblue' }}>{picture ? (<img src={picture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />) : name && name.charAt(0)}</Avatar>}
          title={name}
          onClick={() => router.push("/dashboard/user/" + user_id.toString())}
          subheader={(<div className="flex flex-row gap-1"><Chip size="small" label={convertToReadableDate(timestamp)}
          />

            {
              category_id &&
              <Chip size="small" label={categories[category_id]} />
            }</div>)}

        />
        <CardMedia
          component="img"
          height="194"
          image={getFirstImage(content)}
          alt=""
          onClick={() => setPostModal(true)}
          sx={{ objectFit: "cover", height: "250px" }}
        />
        <CardContent onClick={() => setPostModal(true)}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }} color="text.primary">{title.length > 15 ? title.substring(0, 15) + '...' : title}</Typography>
          <Typography variant="body2" color="text.primary">
            {content.replace(/<[^>]*>?/gm, '').length > 15 ? `${content.replace(/<[^>]*>?/gm, '').substring(0, 15)}...` : content.replace(/<[^>]*>?/gm, '')}
          </Typography>
        </CardContent>
        <CardActions>
          {userId === user_id &&
            <>
              <IconButton
                aria-label="delete"
                onClick={(e: any) => {
                  e.stopPropagation(); // Prevents the card click event
                  handleDelete(id, e);
                }}
                sx={{
                  color: 'gray',

                }}
              >
                <DeleteOutlineIcon />

              </IconButton>
              <IconButton
                aria-label="edit"
                onClick={(e: any) => {
                  setEditPostModal(true);
                }}
                sx={{
                  color: 'gray',

                }}
              >
                <EditOutlinedIcon />

              </IconButton>
            </>

          }

          <IconButton
            aria-label="delete"
            sx={{
              color: 'gray'
            }}
            onClick={() => {
              navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/post/${id}`)
              setOpenShareSnackbar(true);
            }}
          >
            <IosShareOutlinedIcon />

          </IconButton>


        </CardActions>
      </Card>
    </>
  );
}