import { React, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';

const options = {
    callToAction: ["Visit Website", "Call Phone Number"],
    quickReply: ["Quick Reply"]
  };
  
  export default function SplitButton({ onOptionSelect }) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
  
    const handleClick = () => {
      console.info(
        selectedIndex === null ? 'Add Button clicked' : `You clicked ${options[selectedIndex]}`
      );
    };
  
    const handleMenuItemClick = (event, option) => {
      setSelectedIndex(option);
      onOptionSelect(option); // Pass the selected option to parent component
      setOpen(false);
    };
  
    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
  
    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };
  
    return (
      <>
        <ButtonGroup
          variant="contained"
          ref={anchorRef}
          aria-label="Button group with a nested menu"
        >
          <Button onClick={handleClick}>
            {selectedIndex === null ? 'Add Button' : selectedIndex}
          </Button>
          <Button
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          sx={{ zIndex: 1 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          placement="top-start"
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'bottom' : 'top',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    <ListSubheader>Call to Action Buttons</ListSubheader>
                    {options.callToAction.map((option) => (
                      <MenuItem
                        key={option}
                        selected={selectedIndex === option}
                        onClick={(event) => handleMenuItemClick(event, option)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                    <Divider />
                    <ListSubheader>Quick Reply Buttons</ListSubheader>
                    {options.quickReply.map((option) => (
                      <MenuItem
                        key={option}
                        selected={selectedIndex === option}
                        onClick={(event) => handleMenuItemClick(event, option)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  }
  