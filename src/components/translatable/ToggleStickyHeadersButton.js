import React, { useState, useEffect } from "react";
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import { MdOutlineStickyNote2 } from "react-icons/md";
import { MdStickyNote2 } from "react-icons/md";

const STORAGE_KEY = 'sticky-headers-active';

export function ToggleStickyHeadersButton({
  onClick = () => undefined,
  isLoading = false,
  title = "Toggle Sticky Scripture Headers",
  defaultActive = true,
  ...props
}) {
  const [active, setActive] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? JSON.parse(saved) : defaultActive;
  });
  const Icon = !active ? MdStickyNote2 : MdOutlineStickyNote2;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
  }, [active]);

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'sticky-headers-style';
    styleSheet.textContent = `
      [id*="MUIDataTableBodyRow-root"] > [class*="MuiTableCell-root"]:nth-child(1) {
        background: #fff;
        position: relative!important;
        top: 0!important;
        z-index: 1;
      }
    `;

    if (active) {
      document.head.appendChild(styleSheet);
    }

    return () => {
      const existingStyle = document.getElementById('sticky-headers-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [active]);

  const handleClick = () => {
    setActive(!active);
    onClick();
  };

  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          key='toggle-sticky-headers'
          onClick={handleClick}
          aria-label={title}
          style={{ cursor: 'pointer', ...props.style, ...(active ? {color: "rgba(0, 0, 0, 0.26)"} : {})}}
        > 
          <Icon id='update-from-master-icon'/>
        </IconButton>
      </span>
    </Tooltip>
  );
}
