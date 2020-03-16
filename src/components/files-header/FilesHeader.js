import React, { useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Chip,
} from '@material-ui/core';
import {
  Translate,
  Publish
} from '@material-ui/icons';

import { getLanguage } from '../languages/helpers';

function FilesHeader({
  sourceRepository,
  targetRepository,
  sourceFile,
  targetFile,
  language,
}) {
  const classes = useStyles({
    header: {
      cursor: 'pointer'
    }
  });
  const openLink = useCallback((link) => window.open(link, '_blank'), []);

  const chip = useCallback(({ label, onDelete, style, onClick }) => (
    <Chip
      onClick={onClick}
      icon={<Translate />}
      label={label}
      onDelete={onDelete}
      deleteIcon={<Publish />}
      variant="outlined"
      className={classes.header}
      style={style}
    />
  ), [classes.header]);
  const sourceBranchMatches = sourceFile.url.match(/\?ref=(.*)/) || [];
  const sourceBranch = sourceBranchMatches[1];
  const targetBranchMatches = targetFile.url.match(/\?ref=(.*)/) || [];
  const targetBranch = targetBranchMatches[1];
  const sourceOwner = sourceRepository.owner.login;
  const targetOwner = targetRepository.owner.login;
  const sourceCompareLink = `${sourceRepository.html_url}/compare/${sourceBranch}...${targetOwner}:${targetBranch}`
  const targetCompareLink = `${targetRepository.html_url}/compare/${targetBranch}...${sourceOwner}:${sourceBranch}`

  const sourceChip = useMemo(() => {
    const sourceLanguage = getLanguage({ languageId: sourceRepository.name.split('_')[0] });
    const label = `${sourceRepository.owner.username} - ${sourceLanguage.languageName}`;
    const onClick = () => openLink(sourceFile.html_url);
    const onDelete = () => openLink(sourceCompareLink);
    const style = { background: '#fff9' };
    return chip({ label, onDelete, style, onClick });
  }, [sourceRepository, sourceFile.html_url, chip, openLink, sourceCompareLink]);

  const targetChip = useMemo(() => {
    const label = `${targetRepository.owner.username} - ${language.languageName}`;
    const onClick = () => openLink(targetFile.html_url);
    const style = { background: '#fff9' };
    const onDelete = () => openLink(targetCompareLink);
    return chip({ label, onDelete, style, onClick });
  }, [targetRepository, language, targetFile.html_url, chip, openLink, targetCompareLink]);

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
}

const useStyles = makeStyles(theme => ({
  headers: {
    marginBottom: `${theme.spacing(0.5)}px`,
  },
  header: {
    justifyContent: 'space-between',
    width: '100%',
  }
}));

export default FilesHeader;