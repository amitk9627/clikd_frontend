import { useRoutes } from 'react-router-dom';
import { useState, useEffect } from 'react';
// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isAuthenticated = localStorage.getItem('token');
  // console.log(isAuthenticated);
  const routes = isAuthenticated ? [MainRoutes] : [AuthenticationRoutes];
  // console.log(isAuthenticated ? 'called' : 'not cALLED');
  return useRoutes(routes);
}
