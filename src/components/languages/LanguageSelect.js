import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import {
  NoSsr,
} from '@material-ui/core';
import {
} from '@material-ui/icons'

import {
  gatewayLanguages,
  getLanguage,
} from './helpers';
import components from './Components';

function LanguageSelect({
  language,
  onLanguage,
}) {
  const classes = useStyles();
  const handleChange = object => {
    const languageId = object.value;
    const _language = getLanguage({ languageId });
    onLanguage(_language);
  };

  const options = gatewayLanguages
    .map(({ languageId, languageName, localized, region, gateway }) => {
      const value = languageId;
      const name = `${languageId} - ${languageName} - ${localized}`;
      const gatewayLabel = `(${region} ${gateway ? 'Gateway' : 'Other'})`;
      const label = `${name} ${gatewayLabel}`;
      return { value, label };
    });

  let value;
  if (language) {
    value = options.filter(object => (object.value === language.languageId))[0];
  }

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          className="language-select-dropdown"
          classes={classes}
          options={options}
          components={components}
          value={value}
          onChange={handleChange}
          placeholder="Select Language"
        />
        <div className={classes.divider} />
      </NoSsr>
    </div>
  );
}

LanguageSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  language: PropTypes.object,
  onLanguage: PropTypes.func.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    marginBottom: `${theme.spacing(0.5)}px`
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    // overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
}));

export default LanguageSelect;
