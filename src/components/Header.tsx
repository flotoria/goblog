import Image from "next/image";
import { Avatar, Button, Paper, MenuList, MenuItem } from "@mui/material";
import CreatePostModal from "./CreatePostModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUserDetails, setUserDetails } from "@/hooks/userHooks";

export default function Header() {

    const { loading } = setUserDetails();
    const [postModal, openPostModal] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [id, setId] = useState(0);
    const router = useRouter();
    const { userId, name } = getUserDetails();

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

   
    useEffect(() => {
        setId(userId);
    }, [loading]);

    return (
        <header className="bg-slate-100 text-white w-full flex flex-row h-12 drop-shadow-md">
            <div className="w-1/2" onClick={() => router.push("/dashboard")}>
                <Image src="/logo.png" className="w-12 h-12" alt="Logo" width={600} height={600} />
            </div>
            <div className="w-1/2 items-center flex flex-row justify-end px-2">
                <CreatePostModal open={postModal} handleClose={() => openPostModal(false)} />
                <Button sx={{ height: 0.75, whiteSpace: "nowrap" }} variant="contained" onClick={() => openPostModal(true)} >Create Post</Button>
                <div>
                    <Avatar onClick={() => { setDrawerOpen(!drawerOpen) }} sx={{ bgcolor: 'lightblue' }} className="ml-3">{name.charAt(0)}</Avatar>
                    {drawerOpen && (
                        <div className="absolute right-0">
                            <Paper>
                                <MenuList>
                                    <MenuItem onClick={() => { setDrawerOpen(!drawerOpen); router.push(`/dashboard/user/${id.toString()}`) }}>Profile</MenuItem>
                                    <MenuItem>My account</MenuItem>
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