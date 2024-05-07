import Image from "next/image";
import { Avatar, Button, Paper, MenuList, MenuItem } from "@mui/material";
import CreatePostModal from "./CreatePostModal";
import { useEffect, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { getUserDetails, setUserDetails } from "@/hooks/userHooks";
import AccountCircle from '@mui/icons-material/AccountCircle';


export default function Header() {

    const { loading } = setUserDetails();
    const [postModal, openPostModal] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [id, setId] = useState(0);
    const router = useRouter();
    const { userId, name } = getUserDetails();
    const [picture, setPicture] = useState('');

    const handleLogout = () => {
        setDrawerOpen(!drawerOpen);
        fetch('/api/user/logoutUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            router.push('/login');
        });
    }

    const fetchPicture = async () => {
        await fetch('/api/user/getUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId
            })
        }).then(res => res.json()).then(data => {
            setPicture(data.picture);
        }
        )
    }


    useEffect(() => {
        setId(userId);

    }, [loading]);

    useEffect(() => {
        fetchPicture();
    }, [id]);

    return (
        <header className="bg-slate-100 text-white w-full flex flex-row h-12 drop-shadow-md sticky z-[9995]">
            <div className="w-1/2 flex flex-row items-center" >
                <Image src="/logo.png" className="w-12 h-12" alt="Logo" width={600} height={600} onClick={() => router.push("/dashboard")} />
            </div>
            <div className="w-1/2 items-center flex flex-row justify-end px-2">
                <CreatePostModal open={postModal} handleClose={() => openPostModal(false)} />
                <Button sx={{ height: 0.75, whiteSpace: "nowrap" }} variant="contained" onClick={() => openPostModal(true)} >Create Post</Button>
                <div>
                    <Avatar onClick={() => { setDrawerOpen(!drawerOpen) }} sx={{ bgcolor: 'lightblue' }} className="ml-3">{picture ? (<img src={picture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />) : name && name.charAt(0)}</Avatar>
                    {drawerOpen && (
                        <div className="absolute right-0">
                            <Paper>
                                <MenuList>
                                    <MenuItem onClick={() => { setDrawerOpen(!drawerOpen); router.push(`/dashboard/user/${id.toString()}`) }}>Profile</MenuItem>
                                    <MenuItem onClick={() => router.push("/dashboard/user_settings")}>My account</MenuItem>
                                    <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
                                </MenuList>
                            </Paper>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}