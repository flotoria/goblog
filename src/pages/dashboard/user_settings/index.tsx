import DashboardLayout from "@/components/DashboardLayout";
import { getUserDetails } from "@/hooks/userHooks";
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { SelectChangeEvent } from '@mui/material/Select';

// Function to get file extension from MIME type
function getExtension(mimeType: string) {
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/gif':
        return 'gif';
      default:
        return '';
    }
  }
  

export default function UserSettings() {

    const { name, email, gender } = getUserDetails();

    const [newName, setNewName] = useState(name);
    const [newEmail, setNewEmail] = useState(email);
    const [password, setPassword] = useState('');
    const [newGender, setNewGender] = useState(gender);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          const fileType = file.type;


        if (!file.type.startsWith('image/')) {
            console.error('Selected file is not an image');
            return;
        }   
      
          const reader = new FileReader();
          reader.onloadend = () => {
            // The result attribute contains the Base64 string
            const base64String = reader.result as string;
  
            fetch('/api/user/addUserProfilePicture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    profile_picture: base64String,
                    type: getExtension(fileType)
                })
            }) 
          };
      
          reader.readAsDataURL(file);
        }
      };

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

    const onSubmitChangeGender = () => {
        fetch('/api/user/changeUserGender', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gender: newGender
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

    const onSubmitChangePassword = () => {
        fetch('/api/user/changeUserPass', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password
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
                <TextField value={newName} onChange={(e: any) => setNewName(e.target.value)} label="Name" variant="outlined" />
                <Button variant="contained" onClick={onSubmitChangeName}>Change Name</Button>
                <TextField value={newEmail} onChange={(e: any) => setNewEmail(e.target.value)} label="Email" variant="outlined" />
                <Button variant="contained" onClick={onSubmitChangeEmail}>Change Email</Button>
                <FormControl>
                    <InputLabel>Gender</InputLabel>
                    <Select
                        label="Gender"
                        value={newGender}
                        onChange={(e: SelectChangeEvent) => { setNewGender(e.target.value); }}
                    >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={onSubmitChangeGender}>Change Gender</Button>

                <TextField type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} label="Password" variant="outlined" />
                <Button variant="contained" onClick={onSubmitChangePassword}>Change Password</Button>
                <Button
                    variant="contained"
                    component="label"
     
                >
                    Update Profile Picture
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
            </Box>
        </DashboardLayout>
    )
}