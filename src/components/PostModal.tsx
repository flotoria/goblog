import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';

export default function PostModal({ open, handleClose, title, content, timestamp, author }: { open: boolean, handleClose: any, title: string, content: string, timestamp: string, author: string }) {

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <div className="h-screen w-full flex justify-center items-center">
                <Box sx={{
                    width: 3 / 5,
                    height: 4 / 5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: 3
                }}>


                    <div className="w-4/5">
                        <Typography variant="h4">{title}</Typography>
                        <Typography variant="h6">Timestamp: {timestamp} </Typography>
                        <Typography variant="h6">Author: {author} </Typography>
                    </div>
                    
                    <div className="w-4/5 h-4/5 bg-gray-200 overflow-auto border-2 border-slate-400 p-2">
                        <Typography variant="body1">
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                        </Typography>
                    </div>
                </Box>
            </div>
                
        </Modal>
    )
}