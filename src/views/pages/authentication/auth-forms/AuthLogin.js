import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Button } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { BackendUrl } from 'utils/config';

// function validateEmail(email) {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(email);
// }
export const AuthLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ userName: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // clearing the cache, local storage, session storage
  // useEffect(() => {
  //   const clearStorageAndCache = async () => {
  //     await localStorage.clear();
  //     sessionStorage.clear();
  //   };
  //   clearStorageAndCache();
  // }, []);
  useEffect(() => {
    localStorage.setItem('role', 'ADMIN');
  }, []);

  const funcSetRole = async (role) => {
    // console.log(role);
    if (role) {
      localStorage.setItem('role', role);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (loginForm.userName == '' || loginForm.password == '') {
        window.alert('Missing Field .... ');
        return;
      }
      const body = {
        email: String(loginForm.userName).trim(),
        password: loginForm.password
      };
      const response = await axios.post(`${BackendUrl}/user/login`, body);
      if (response.status == 200) {
        toast.success('User Found Successfully');
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
      console.log(response);
    } catch (err) {
      toast.error('User not Found');
      console.log(err.response.data);
    }
  };
  return (
    <>
      <div>
        <Toaster />
      </div>
      <Box className="flex justify-center items-center py-4">
        <form onSubmit={handleLogin} className="w-full">
          <div className="grid grid-cols-1 gap-8">
            <div>
              <FormControl fullWidth>
                <TextField
                  label="Email"
                  type="email"
                  required
                  value={loginForm.userName}
                  onChange={(e) => setLoginForm({ ...loginForm, userName: e.target.value })}
                />
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((show) => !show)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  autoComplete=""
                />
              </FormControl>
            </div>
            <div>
              <Button type="submit" variant="contained" className="bg-blue-700 text-lg" fullWidth>
                Login
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </>
  );
};
