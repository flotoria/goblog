import { Box, Chip, Card, CardHeader, CardMedia, CardContent, Avatar, IconButton, Typography, MenuItem, Paper, MenuList } from '@mui/material';
import { useState, useEffect } from 'react';
import PostModal from './PostModal';

interface PostCardProps {
  id: number;
  title: string;
  content: string;
  user_id: number;
  category_id?: number;
  timestamp: string;
}

function convertToReadableDate(timestamp: string) {
  const isoTimestamp = timestamp;
  const date = new Date(isoTimestamp);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  //@ts-ignore
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
}


export default function PostCard({ id, title, content, user_id, timestamp, category_id }: PostCardProps) {

  const [name, setName] = useState('');
  const [postModal, openPostModal] = useState(false);
  const categories: {[key: number]: string} = {0: 'All', 1: 'Tech', 2: 'Design', 3: 'Business', 4: 'Health', 5: 'Games'};

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
      <Card onClick={() => openPostModal(true)} sx={{ width: "100%", borderRadius: "20px" }} elevation={3}>
        <CardHeader
          avatar={
            <div>
              <Avatar sx={{ bgcolor: 'lightblue' }} aria-label="recipe">
                {name && name.charAt(0)}

              </Avatar>
            </div>
          }

          title={name}
          subheader={(<div className="flex flex-row gap-1"><Chip size="small" label={convertToReadableDate(timestamp)} />
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
          sx={{ objectFit: "cover", height: "250px" }}
        />
        <CardContent>
          <Typography variant="body1" sx={{fontWeight: "bold"}} color="text.primary">
            {title}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {content.replace(/<[^>]*>?/gm, '').length > 30 ? content.replace(/<[^>]*>?/gm, '').substring(0, 30) + '...' : content.replace(/<[^>]*>?/gm, '')}
          </Typography>
        </CardContent>
      </Card>
    </>)

}