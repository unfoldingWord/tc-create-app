import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  IconButton,
  Typography,
} from '@material-ui/core';
import {
  ViewDay,
  ViewDayOutlined,
  FormatSize,
  Undo,
} from '@material-ui/icons';
import { Slider } from '@material-ui/lab';

function DrawerMenu ({
  classes,
  sectionable,
  onSectionable,
  fontScale,
  onFontScale,
}) {
  const toggleSectionable = () => onSectionable(!sectionable);
  const handleFontScale = (event, value) => onFontScale(value);
  const handleResetFontScale = () => onFontScale(100);
  return (
    <List>
      <ListItem button onClick={toggleSectionable}>
        <ListItemIcon className={classes.icon}>
          {sectionable ? <ViewDayOutlined /> : <ViewDay />}
        </ListItemIcon>
        <ListItemText primary="Heading Sections" />
        <ListItemSecondaryAction>
          <Switch onChange={toggleSectionable} checked={sectionable} color="primary" />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemIcon className={classes.icon}>
          <FormatSize />
        </ListItemIcon>
        <div className={classes.sliderDiv}>
          <Typography id="label" >
            {`Font Size ${fontScale}%`}
          </Typography>
          <Slider
            classes={{ container: classes.slider }}
            value={fontScale}
            aria-labelledby="label"
            onChange={handleFontScale}
            min={50}
            max={150}
            step={10}
          />
        </div>
        <ListItemSecondaryAction>
          <IconButton className={classes.secondaryIcon} onClick={handleResetFontScale}>
            <Undo />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}

const styles = theme => ({
  icon: {
    margin: 0,
  },
  secondaryIcon: {
    margin: `0 ${theme.spacing.unit}px`,
  },
  sliderDiv: {
    width: '100%',
    padding: `0 ${theme.spacing.unit * 2}px`,
    marginRight: `${theme.spacing.unit * 2}px`,
  },
  slider: {
    padding: `${theme.spacing.unit}px 0`,
  },
});

export default withStyles(styles)(DrawerMenu);