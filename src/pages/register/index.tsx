import { TextField, Box, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';



export default function Register() {

    const handleSubmit = async () => {
        
        const res = await fetch('/api/user/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                gender,
                password
            })
        });
    }

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="w-full h-dvh bg-slate-200 flex justify-center items-center overflow-hidden">
            <div className="w-1/2 flex justify-center items-center">
                <Image src="/logo.png" className="w-1/4 h-1/4 rounded-full drop-shadow-lg" alt="Logo" width={600} height={600} />
                <h1 className="text-[2vw] font-bold">GoBlog</h1>
            </div>
            <div className="w-1/2">
                <div className="w-96 h-128 rounded-3xl bg-slate-100 drop-shadow-md overflow-hidden">

                    <Box sx={{
                        width: 1,
                        height: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.9
                    }}>

                        <h1 className="text-3xl font-semibold mb-2">Register</h1>

                        <TextField sx={{
                            width: 0.7,
                        }}
                            id="outlined-basic"
                            label="Name"
                            variant="outlined"
                            onChange={(e) => { setName(e.target.value); }} />

                        <FormControl sx={{ width: 0.7 }}>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                label="Gender"
                                onChange={(e: SelectChangeEvent) => { setGender(e.target.value); }}
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>


                        <TextField sx={{
                            width: 0.7,

                        }}
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            onChange={(e) => { setEmail(e.target.value); }} />
                        <TextField
                            type="password"
                            sx={{
                                width: 0.7

                            }}
                            id="outlined-basic"
                            label="Password"
                            variant="outlined"
                            onChange={(e) => { setPassword(e.target.value); }} />
                        <p className="text-xs">Already have an account? <Link className="text-blue-700" href="/login">Login.</Link></p>
                        <Button
                            onClick={handleSubmit}
                            sx={{
                                width: 3 / 7,
                                padding: '5x 5px',
                                fontSize: '18px',
                                borderRadius: '15px',
                                textTransform: 'none',
                            }}
                            variant="contained">
                            Register
                        </Button>
                    </Box>

                </div>
            </div>
        </div>
    );
}

