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
  FeedbackOutlined,
} from '@material-ui/icons';
import { Slider } from '@material-ui/lab';

import appPackage from '../../../package.json';

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
  const openLink = (link) => window.open(link,'_blank');
  const handleFeedback = () => openLink(appPackage.bugs.url);
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
          <Typography id="label" className={classes.typography}>
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
      <ListItem button onClick={handleFeedback}>
        <ListItemIcon className={classes.icon}>
          <FeedbackOutlined />
        </ListItemIcon>
        <ListItemText primary="Feedback/Suggestions" />
        <ListItemSecondaryAction>
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
  typography: {
    lineHeight: '1',
    marginBottom: '2px',
  },
  sliderDiv: {
    width: '100%',
    padding: `0 ${theme.spacing.unit * 2}px`,
    marginRight: `${theme.spacing.unit * 2}px`,
  },
  slider: {
    padding: `${theme.spacing.unit / 2}px 0`,
  },
});

export default withStyles(styles)(DrawerMenu);