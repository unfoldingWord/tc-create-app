import React, { useContext } from 'react';
import MenuBookOutlined from '@material-ui/icons/MenuBookOutlined';
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
  Switch,
  RadioGroup, Radio, FormControl, FormLabel, FormControlLabel,
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
  const { fontScale, expandedScripture, validationPriority } = state;
  const { setFontScale, setExpandedScripture, setValidationPriority } = actions;

  const handleFontScale = (event, value) => setFontScale(value);
  const handleExpandScripture = (event) => setExpandedScripture(event.target.checked);
  const handleResetFontScale = () => setFontScale(100);
  const openLink = (link) => window.open(link, '_blank');
  const handleFeedback = () => openLink(appPackage.bugs.url);
  const handleValidationPriorityChange = (event, value) => {
    value && setValidationPriority(value)
  };

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
      <ListItem data-test="expanded-scripture-pane" className={expandedScripture ? 'active' : null}>
        <ListItemIcon className={classes.icon + expandedScripture ? 'active' : null}>
          <MenuBookOutlined />
        </ListItemIcon>
        <ListItemText primary="Expand all Scripture" />
        <div>
          <Switch
            color='primary'
            checked={expandedScripture}
            onChange={handleExpandScripture}
            name="default"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>
      </ListItem>
      <ListItem>
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Set Validation Level</FormLabel>
            <RadioGroup aria-label="validationPriority" name="validationPriority" value={validationPriority} onChange={handleValidationPriorityChange}>
              <FormControlLabel id="high" value="high" control={<Radio />} label="High" />
              <FormControlLabel id="medium" value="med" control={<Radio />} label="Medium and above" />
              <FormControlLabel id="low" value="low" control={<Radio />} label="All" />
            </RadioGroup>
          </FormControl>
        </div>
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
  expandScripture:{ color:'#31ADE3' },
}));

export default DrawerMenu;
