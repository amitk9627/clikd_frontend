import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Button } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { SET_AUTH_STATE } from 'store/actions';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
export const AuthLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errEmail, seterrEmail] = useState(false);
  const [errpassword, seterrPassword] = useState(false);

  const funcSetRole = (role) => {
    dispatch({
      type: SET_AUTH_STATE,
      payload: role
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    navigate('/dashboard/default');
    try {
      if (validateEmail(loginForm.email) && loginForm.password != '') {
        const body = {
          email: loginForm.email,
          password: loginForm.password
        };

        const response = await axios.post('http://localhost:4500/login', body);
        // console.log(response.data);

        toast.success(response.data.message);
        funcSetRole(response.data.role);
      } else {
        validateEmail(loginForm.email) ? seterrEmail(false) : seterrEmail(true);
        loginForm.password == '' ? seterrPassword(true) : seterrPassword(false);
      }
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data);
    }
  };
  return (
    <>
      <div>
        <Toaster />
      </div>
      Admin
      <Box className="flex justify-center items-center py-4">
        <form onSubmit={handleLogin} className="w-full">
          <div className="grid grid-cols-1 gap-8">
            <div>
              <FormControl fullWidth>
                <TextField
                  label="Email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </FormControl>
              {errEmail && <p className="text-red-500 ml-2 text-md">Email is not valid</p>}
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
              {errpassword && <p className="text-red-500 ml-2 text-md">Enter yourPassword</p>}
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
