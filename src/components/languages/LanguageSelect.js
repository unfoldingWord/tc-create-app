import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
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

function LanguageSelectComponent ({
  classes,
  theme,
  language,
  onLanguage,
}) {
  const handleChange = object => {
    const languageId = object.value;
    const _language = getLanguage({languageId});
    onLanguage(_language);
  };

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  const options = gatewayLanguages
  .map(({languageId, languageName, localized, region, gateway}) => {
    const value = languageId;
    const name = `${languageId} - ${languageName} - ${localized}`;
    const gatewayLabel = `(${region} ${gateway ? 'Gateway' : 'Other'})`;
    const label = `${name} ${gatewayLabel}`;
    return {value, label};
  });

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          classes={classes}
          styles={selectStyles}
          options={options}
          components={components}
          value={
            options.filter(object => (object.value === language.languageId) )[0]
          }
          onChange={handleChange}
          placeholder="Select Language"
        />
        <div className={classes.divider} />
      </NoSsr>
    </div>
  );
}

LanguageSelectComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  language: PropTypes.object.isRequired,
  onLanguage: PropTypes.func.isRequired,
};

LanguageSelectComponent.defaultProps = {
  language: {languageId: "en"},
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
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
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

export const LanguageSelect = withStyles(styles, { withTheme: true })(LanguageSelectComponent);
