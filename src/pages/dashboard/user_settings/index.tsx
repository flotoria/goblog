import DashboardLayout from "@/components/DashboardLayout";
import { getUserDetails } from "@/hooks/userHooks";
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Snackbar, Avatar, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material/Select';
import { profile } from "console";

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
  
function formatPhoneNumber(value: string): string {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;

    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }

    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

export default function UserSettings() {

    const { name, email, gender, phone_number, profile_picture } = getUserDetails();

    const [newName, setNewName] = useState(name);
    const [newEmail, setNewEmail] = useState(email);
    const [password, setPassword] = useState('');
    const [newGender, setNewGender] = useState(gender);
    const [newPhoneNumber, setNewPhoneNumber] = useState(formatPhoneNumber(phone_number));
    const [openSnackbar, setOpenSnackbar] = useState(false);    
    const [picture, setPicture] = useState('');
    
    useEffect(() => {
        setNewName(name);
        setNewEmail(email);
        setNewGender(gender);
        setNewPhoneNumber(formatPhoneNumber(phone_number));
        setPicture(profile_picture);
    }, [name, email, gender, phone_number, profile_picture]);

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

            setPicture(base64String as string);
          };
      

          reader.readAsDataURL(file);
        }
        setOpenSnackbar(true);
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
        setOpenSnackbar(true);
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
        setOpenSnackbar(true);
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
        setOpenSnackbar(true);
    }

    const onSubmitChangePhoneNumber = () => {
        fetch('/api/user/changeUserPhoneNumber', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone_number: newPhoneNumber
            })
        })
        setOpenSnackbar(true);
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
        setOpenSnackbar(true);
    }


    return (
        <DashboardLayout>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                message="Account settings changed."
                />
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1
            }}>
                <Box sx={{display: "flex", flexDirection: "row", mb: 1}}>
                    
                    <Avatar sx={{width: 60, height: 60, bgcolor: "lightblue" }} aria-label="recipe">
                        {picture ? (<img src={picture} style={{width: '100%', height: '100%', objectFit: 'cover'}} />) : name && name.charAt(0)}
                    </Avatar>
                    
     
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <Typography sx={{ml: 1, fontWeight: "bold"}}>
                        {name ? name : "Loading..."}
                    </Typography>
                    <Typography sx={{ml: 1}}>
                        {email ?  email : "Loading..."}
                    </Typography>
                    <Typography sx={{ml: 1}}>
                        {phone_number ?  formatPhoneNumber(phone_number) : "Loading..."}
                    </Typography>
                </Box>
                
            </Box>
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

                <TextField
                    value={newPhoneNumber}
                    onChange={(e: any) => setNewPhoneNumber(formatPhoneNumber(e.target.value))}
                    label="Phone Number"
                    variant="outlined"
                />
                <Button variant="contained" onClick={onSubmitChangePhoneNumber}>Change Phone Number</Button>
                
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