import React, { useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Chip,
  Tooltip,
} from '@material-ui/core';
import {
  Translate,
  Publish,
  GetApp,
} from '@material-ui/icons';

import { getLanguage } from '../languages/helpers';
import { localString } from '../../core/localStrings';

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

  const chip = useCallback(({ label, onDelete, style, onClick, deleteIcon, iconTooltip, deleteIconTooltip }) => (
    <Chip
      onClick={onClick}
      icon={<Tooltip title={localString(iconTooltip)} arrow><Translate /></Tooltip> }
      label={label}
      onDelete={onDelete}
      deleteIcon={<Tooltip title={localString(deleteIconTooltip)} arrow>{deleteIcon}</Tooltip>}
      variant="outlined"
      className={classes.header}
      style={style}
    />
  ), [classes.header]);

  const sourceBranch = sourceRepository.branch || sourceRepository.default_branch;
  const targetBranch = targetRepository.branch || targetRepository.default_branch;

  let sourceCompareLink, targetCompareLink;
  const sourceLanguage = getLanguage({ languageId: sourceRepository.name.split('_')[0] });
  if (sourceLanguage.languageName === language.languageName) {
    if (sourceRepository.full_name === targetRepository.full_name) {
      sourceCompareLink = `${targetRepository.html_url}/compare/${targetBranch}...${sourceBranch}`
      targetCompareLink = `${sourceRepository.html_url}/compare/${sourceBranch}...${targetBranch}`
    } else {
      const sourceOwner = sourceRepository.owner.username;
      const targetOwner = targetRepository.owner.username;
      sourceCompareLink = `${sourceRepository.html_url}/compare/${sourceBranch}...${targetOwner}:${targetBranch}`
      targetCompareLink = `${targetRepository.html_url}/compare/${targetBranch}...${sourceOwner}:${sourceBranch}`
    }
  }

  const sourceChip = useMemo(() => {
    const { full_name } = sourceRepository;
    const label = `${sourceLanguage.languageName} - ${full_name}/${sourceBranch}`;
    const onClick = () => openLink(sourceFile.html_url);
    const onDelete = () => sourceCompareLink && openLink(sourceCompareLink);
    const style = { background: '#fff9' };
    const deleteIcon = <GetApp />;
    const iconTooltip='OpenSourceText';
    const deleteIconTooltip = 'CompareSource'
    return chip({ label, onDelete, style, onClick, deleteIcon, iconTooltip, deleteIconTooltip });
  }, [sourceRepository, sourceFile.html_url, chip, openLink, sourceCompareLink, sourceBranch, sourceLanguage.languageName]);

  const targetChip = useMemo(() => {
    const { full_name } = targetRepository;
    const label = `${language.languageName} - ${full_name}/${targetBranch}`;
    const onClick = () => openLink(targetFile.html_url);
    const style = { background: '#fff9' };
    const onDelete = () => targetCompareLink && openLink(targetCompareLink);
    const deleteIcon = <Publish />;
    const iconTooltip='OpenTargetText';
    const deleteIconTooltip = 'CompareTarget'
    return chip({ label, onDelete, style, onClick, deleteIcon, iconTooltip, deleteIconTooltip });
  }, [targetRepository, language, targetFile.html_url, chip, openLink, targetCompareLink, targetBranch]);

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