import React from 'react';
import { useDeepCompareCallback, useDeepCompareMemo } from 'use-deep-compare';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import { NoSsr } from '@material-ui/core';
import { useLanguages } from 'uw-languages-rcl';

import { getLanguage } from './helpers';
import * as components from './Components';

export default function LanguageSelect({
  language,
  onLanguage,
  organization,
}) {
  const { state: languages } = useLanguages();

  const classes = useStyles();

  const handleChange = useDeepCompareCallback((object) => {
    const languageId = object.langId;
    const _language = getLanguage({ languageId, languagesJSON: languages });
    onLanguage(_language);
  }, [languages]);

  const orgOptions = useDeepCompareMemo(() => {
    const orgLanguages = organization.repo_languages || [''];
    const _orgOptions = orgLanguages.map( (langId) => {
      const formattedLanguage = getLanguage({
        languageId: langId,
        languagesJSON: languages,
      });
      //const value = formattedLanguage.languageId;
      // test whether formattedLanguage has any properties.
      // if it doesn't, then that means that the org has no languages for resources
      let label;

      if ( formattedLanguage.languageName ){
        const name = `${langId} - ${formattedLanguage.languageName} - ${formattedLanguage.localized}`;
        const gatewayLabel = `(${formattedLanguage.region} ${formattedLanguage.gateway ? 'Gateway' : 'Other'})`;
        label = `${name} ${gatewayLabel}`;
      };
      return { langId, label };
    });
    return _orgOptions;
  }, [organization.repo_languages, languages]);

  const value = useDeepCompareMemo(() => {
    let _value;

    if (language) {
      _value = orgOptions.filter((object) => object.value === language.languageId)[0];
    };
    return _value;
  }, [orgOptions]);


  return (
    <div className={classes.root}>
      {
        orgOptions[0].label === undefined ? (
          <div><p>No Languages Found</p></div>
        ) : (
          <NoSsr>
            <Select
              data-test-id={`language-select-${value}`}
              className="language-select-dropdown"
              classes={classes}
              options={orgOptions}
              components={components}
              value={value}
              onChange={handleChange}
              placeholder="Select Language"
            />
            <div className={classes.divider} />
          </NoSsr>
        )
      }
    </div>
  );
}

LanguageSelect.propTypes = {
  language: PropTypes.object,
  onLanguage: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    marginBottom: `${theme.spacing(0.5)}px`,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    // overflow: 'hidden',
  },
  noOptionsMessage: { padding: `${theme.spacing(1)}px ${theme.spacing(2)}px` },
  singleValue: { fontSize: 16 },
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
  divider: { height: theme.spacing(2) },
}));