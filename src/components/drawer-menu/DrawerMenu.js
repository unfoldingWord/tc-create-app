import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Slider,
} from '@material-ui/core';
import {
  FormatSize,
  Undo,
  FeedbackOutlined,
  BugReportOutlined,
} from '@material-ui/icons';

import appPackage from '../../../package.json';
import { AppContext } from '../../App.context';

function DrawerMenu() {
  const classes = useStyles();

  const { state, actions } = useContext(AppContext);
  const { fontScale } = state;
  const { setFontScale } = actions;

  const handleFontScale = (event, value) => setFontScale(value);
  const handleResetFontScale = () => setFontScale(100);
  const openLink = (link) => window.open(link, '_blank');
  const handleFeedback = () => openLink(appPackage.bugs.url);
  return (
    <List>
      <ListItem>
        <ListItemIcon className={classes.icon}>
          <FormatSize />
        </ListItemIcon>
        <div className={classes.sliderDiv}>
          <Typography id="label" className={classes.typography}>
            {`Font Size ${fontScale}%`}
          </Typography>
          <Slider
            // classes={{ container: classes.slider }}
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
        <ListItemText primary="Report Bug or Feedback" />
        <ListItemSecondaryAction>
          <IconButton className={classes.secondaryIcon} onClick={handleFeedback}>
            <BugReportOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}

const useStyles = makeStyles(theme => ({
  icon: { margin: 0 },
  secondaryIcon: { margin: `0 ${theme.spacing(1)}px` },
  typography: {
    lineHeight: '1',
    marginBottom: '2px',
  },
  sliderDiv: {
    width: '100%',
    marginRight: `${theme.spacing(2)}px`,
    paddingRight: `${theme.spacing(2)}px`,
  },
  slider: { padding: `${theme.spacing(0.5)}px 0` },
}));

export default DrawerMenu;
