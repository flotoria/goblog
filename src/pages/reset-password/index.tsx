import { TextField, Box, Button } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    if (password!== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const res = await fetch('/api/user/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
      router.push('/login');
  };

  return (
    <div className="w-full min-h-screen bg-slate-200 flex justify-center items-center">
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

            <h1 className="text-3xl font-semibold mb-2">Reset Password</h1>

            <TextField sx={{
              width: 0.7,
            }}
              id="outlined-basic"
              label="Email"
              type="email"
              variant="outlined"
              onChange={(e) => { setEmail(e.target.value); }} />

            <TextField sx={{
              width: 0.7,
            }}
              id="outlined-basic"
              label="New Password"
              type="password"
              variant="outlined"
              onChange={(e) => { setPassword(e.target.value); }} />

            <TextField sx={{
              width: 0.7,
            }}
              id="outlined-basic"
              label="Confirm Password"
              type="password"
              variant="outlined"
              onChange={(e) => { setConfirmPassword(e.target.value); }} />

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
              Reset Password
            </Button>

            <p className="text-xs">Back to <Link className="text-blue-700" href="/login">Login.</Link></p>
          </Box>
        </div>
      </div>
    </div>
  );
}