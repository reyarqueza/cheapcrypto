import React from 'react';
import {createTheme} from '@mui/material/styles';

export const UserContext = React.createContext({
  user: {},
  setUser: () => {},
});

export const ThemeContext = React.createContext({
  theme: createTheme({
    palette: {
      mode: 'light',
    },
  }),
  setTheme: () => {},
});
