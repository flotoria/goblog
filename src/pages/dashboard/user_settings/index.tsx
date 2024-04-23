import DashboardLayout from "@/components/DashboardLayout";
import { getUserDetails } from "@/hooks/userHooks";
import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";

export default function UserSettings() {

    const { name, email } = getUserDetails();

    const [newName, setNewName] = useState(name);
    const [newEmail, setNewEmail] = useState(email);
    const [password, setPassword] = useState('');

    const onSubmitChangeName = () => {
        fetch('/api/user/changeUserName', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newName
            })
        })
    }

    const onSubmitChangeEmail = () => {
        fetch('/api/user/changeUserEmail', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: newEmail
            })
        })
    }

    return (
        <DashboardLayout>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1
            }}>
                <TextField value={newName}  onChange={(e) => setNewName(e.target.value)} label="Name" variant="outlined" />
                <Button variant="contained" onClick={onSubmitChangeName}>Change Name</Button>
                <TextField value={newEmail} onChange={(e) => setNewEmail(e.target.value)} label="Email" variant="outlined" />
                <Button variant="contained" onClick={onSubmitChangeEmail}>Change Email</Button>
                <TextField value={password} onChange={(e) => setPassword(e.target.value)} label="Password" variant="outlined" />
                <Button variant="contained">Change Password</Button>
            </Box>
        </DashboardLayout>
    )
}