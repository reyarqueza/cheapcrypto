import React, {useState} from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';

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
          placement="right"
          arrow
        >
          <Button onClick={handleTooltipOpen}>{label}</Button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}