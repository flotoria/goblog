import { TextField, Box, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import { useRouter } from 'next/router';



export default function Register() {

    const router = useRouter();

    const handleSubmit = async () => {
        
        const res = await fetch('/api/user/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                gender,
                email,
                phone_number: phoneNumber,
                password
            })
        });

        router.push('/login');
    }

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="w-full min-h-screen bg-slate-200 flex justify-center items-center">
            <div className="w-1/2 md:flex hidden justify-center items-center">
                <div className="w-128 h-128 flex justify-center items-center">
                    <Image src="/logo.png" className="w-96 h-96 rounded-full drop-shadow-lg" alt="Logo" width={600} height={600} />
                </div>
            </div>
            <div className="w-1/2 h-dvh flex items-center">
                <div className="w-128 h-128 rounded-3xl bg-slate-100 drop-shadow-md overflow-hidden">

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
                            label="Phone Number"
                            variant="outlined"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)} />

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

