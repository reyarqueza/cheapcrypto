import React, {useState} from 'react';
import {Tooltip, Button, ClickAwayListener} from '@mui/material';

export default function MyTooltip({label, title}) {
  const [open, setOpen] = useState(false);
  const handleTooltipClose = () => {
    setOpen(false);
  };
  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={title}
          placement="top"
          arrow
        >
          <Button onClick={handleTooltipOpen}>{label}</Button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}
