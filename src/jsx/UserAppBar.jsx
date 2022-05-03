import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import {Link as RouterLink} from 'react-router-dom';
import {Link} from '@mui/material';

import SignIn from './SignIn.jsx';

export default function UserAppBar() {
  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            component={RouterLink}
            to="/"
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{mr: 2}}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            <Link color="#fff" component={RouterLink} to="/">
              cheapcrypto.app
            </Link>
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
          <SignIn />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
