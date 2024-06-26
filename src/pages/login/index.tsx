import { TextField, Box, Button, Link, Snackbar, Alert } from '@mui/material';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { setUserDetails } from '@/hooks/userHooks';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wrongCredentials, setWrongCredentials] = useState(false);

  const handleSubmit = async () => {
    const res = await fetch('/api/user/loginUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      }),
      credentials: 'include'
    });

    if (!res.ok) {
      setWrongCredentials(true);
    }
    else {
      router.push('/dashboard');
    }
  }

  const tryToLoginUser = async () => {
    try {
      const res = await fetch('/api/user/validateAndGetUser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        router.push("/dashboard");
      }
    }
    catch {
      router.push("/login");
    }

  }

  useEffect(() => {
    tryToLoginUser();
  }, []);


  return (
    <div className="w-full h-screen bg-slate-200 flex justify-center items-center">
      <Snackbar
        open={wrongCredentials}
        autoHideDuration={2000}
        onClose={() => setWrongCredentials(false)}>
        <Alert onClose={() => setWrongCredentials(false)} severity="error" sx={{ width: '100%' }}>
          Wrong username or password.
        </Alert>
      </Snackbar>
      <div className="w-1/2 flex justify-center items-center">
        <Image src="/logo.png" className="ml-20 w-1/4 h-1/4 rounded-full drop-shadow-lg" alt="Logo" width={600} height={600} />
      </div>
      <div className="w-1/2">
        <div className="w-96 h-96 rounded-3xl bg-slate-100 drop-shadow-md overflow-hidden">

          <Box sx={{
            width: 1,
            height: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>

            <h1 className="text-3xl font-semibold mb-2">Login</h1>

            <TextField sx={{
              width: 0.6,

            }}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              onChange={(e: any) => { setEmail(e.target.value) }} />
            <TextField
              type="password"
              sx={{
                width: 0.6

              }}
              id="outlined-basic"
              label="Password"
              variant="outlined"
              onChange={(e: any) => { setPassword(e.target.value) }} />
            <p className="text-xs">Don&apos;t have an account? <Link className="text-blue-700" href="/register">Register.</Link></p>

            <Button sx={{
              width: 3 / 7,
              padding: '5x 5px',
              fontSize: '18px',
              borderRadius: '15px',
              textTransform: 'none',
            }}
              variant="contained"
              onClick={handleSubmit}
              disabled={email === '' || password === ''}
            >Login</Button>
          </Box>
        </div>
      </div>
    </div>
  );
}