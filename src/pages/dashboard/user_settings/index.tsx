import DashboardLayout from "@/components/DashboardLayout";
import { getUserDetails } from "@/hooks/userHooks";
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState } from "react";

export default function UserSettings() {

    const { name, gender, email, phone_number } = getUserDetails();

    const [newName, setNewName] = useState(name);
    const [newGender, setNewGender] = useState(gender);
    const [newEmail, setNewEmail] = useState(email);
    const [newPhoneNumber, setNewPhoneNumber] = useState(phone_number);
    const [password, setPassword] = useState('');

    const onSaveChanges = async () => {
        // Create a payload object with all the new values
        const payload = {
            name: newName,
            gender: newGender,
            email: newEmail,
            phone_number: newPhoneNumber,
            // Include password only if it's been changed
            ...(password && { password }),
        };

        // Make an API request to a route that handles updates for all fields
        const res = await fetch('/api/user/updateUserDetails', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Check if the update was successful
        if (res.ok) {
            console.log("Update successful!");
        } else {
            console.error("Update failed!");
        }
    };

    return (
        <DashboardLayout>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1
            }}>
                {/* Name field */}
                <TextField value={newName}  onChange={(e) => setNewName(e.target.value)} label="Name" variant="outlined" />
                
                {/* Gender field */}
                <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                        value={newGender}
                        label="Gender"
                        onChange={(e) => setNewGender(e.target.value)}
                    >
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Female"}>Female</MenuItem>
                        <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                </FormControl>

                {/* Email field */}
                <TextField value={newEmail} onChange={(e) => setNewEmail(e.target.value)} label="Email" variant="outlined" />

                {/* Phone Number field */}
                <TextField
                    label="Phone Number"
                    variant="outlined"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                />
                
                {/* Password field */}
                <TextField value={password} onChange={(e) => setPassword(e.target.value)} label="Password" variant="outlined" />

                {/* Save Changes Button */}
                <Button variant="contained" onClick={onSaveChanges}>Save Changes</Button>
            </Box>
        </DashboardLayout>
    )
}