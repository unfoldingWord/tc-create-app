import React, { useContext } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { useLanguages } from 'uw-languages-rcl';

import { AppContext } from '../../App.context';
import { getLanguage } from '../languages/helpers';
import SourceChip from './SourceChip';
import TargetChip from './TargetChip';

export default function FilesHeader() {
  const classes = useStyles();

  const {
    state: {
      language,
      sourceRepository,
      targetRepository,
    },
    giteaReactToolkit: {
      sourceFileHook,
      targetFileHook,
    },
  } = useContext(AppContext);

  const { html_url: sourceFileHtmlUrl, filepath: sourceFilepath } = sourceFileHook.state || {};
  const { html_url: targetFileHtmlUrl } = targetFileHook.state || {};

  const { state: languages } = useLanguages();
  const sourceLanguage = getLanguage({ languageId: sourceRepository.name.split('_')[0], languagesJSON: languages });

  const sourceChip = useDeepCompareMemo(() => {
    const _props = {
      sourceRepository,
      targetRepository,
      sourceFileHtmlUrl,
      sourceFilepath,
      sourceLanguage,
      language,
    };
    return <SourceChip {..._props} />;
  }, [
    sourceRepository,
    targetRepository,
    sourceFileHtmlUrl,
    sourceFilepath,
    sourceLanguage,
    language,
  ]);

  const targetChip = useDeepCompareMemo(() => {
    const _props = {
      sourceRepository,
      targetRepository,
      sourceLanguage,
      targetFileHtmlUrl,
      language,
    };
    return <TargetChip {..._props} />;
  }, [
    sourceRepository,
    targetRepository,
    sourceLanguage,
    targetFileHtmlUrl,
    language,
  ]);

  return (
    <Grid className={classes.headers} container wrap="nowrap" spacing={2}>
      <Grid item xs={12}>
        {sourceChip}
      </Grid>
      <Grid item xs={12}>
        {targetChip}
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({ headers: { marginBottom: `${theme.spacing(0.5)}px` } }));
