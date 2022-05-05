import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import {Link as RouterLink} from 'react-router-dom';

import SignIn from './SignIn.jsx';

import {AppBar, Box, Toolbar, Typography, IconButton, Link} from '@mui/material';

export default function UserAppBar() {
  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static" color="transparent">
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
            <Link color="primary" component={RouterLink} to="/">
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
