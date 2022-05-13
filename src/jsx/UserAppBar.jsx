import React, {useContext} from 'react';
import HomeIcon from '@mui/icons-material/Home';
import {Link as RouterLink} from 'react-router-dom';
import {MaterialUISwitch} from './MaterialUISwitch.jsx';
import SignIn from './SignIn.jsx';
import {AppBar, Box, Toolbar, Typography, IconButton, Link} from '@mui/material';
import {createTheme} from '@mui/material/styles';
import {ThemeContext} from '../context';

export default function UserAppBar() {
  const {theme, setTheme} = useContext(ThemeContext);
  const handleChange = e => {
    const theme = createTheme({
      palette: {
        mode: e.target.checked ? 'light' : 'dark',
      },
    });
    setTheme(theme);
  };

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            component={RouterLink}
            to="/"
            size="small"
            edge="start"
            color="inherit"
            aria-label="Home"
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            <Link color="#fff" sx={{textDecoration: 'none'}} component={RouterLink} to="/">
              cheapcrypto
            </Link>
          </Typography>
          <MaterialUISwitch sx={{m: 1}} defaultChecked onChange={handleChange} />
          <SignIn />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
