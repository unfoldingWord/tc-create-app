import Path from 'path';
import React, { useCallback, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Chip,
  Tooltip,
} from '@material-ui/core';

import {
  Publish,
  GetApp,
} from '@material-ui/icons';
import { useDeepCompareCallback, useDeepCompareMemo } from 'use-deep-compare';
import { License } from 'scripture-resources-rcl';
import { useLanguages } from 'uw-languages-rcl';

import { AppContext } from '../../App.context';
import { getLanguage } from '../languages/helpers';
import { localString } from '../../core/localStrings';
import { SERVER_URL } from '../../core/state.defaults';

function FilesHeader() {
  const classes = useStyles({ header: { cursor: 'pointer' } });

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

  const { state: languages } = useLanguages();

  const { html_url: sourceFileHtmlUrl, filepath: sourceFilepath } = sourceFileHook.state || {};
  const { html_url: targetFileHtmlUrl } = targetFileHook.state || {};

  const openLink = useCallback((link) => window.open(link, '_blank'), []);

  const chip = useDeepCompareCallback(({
    label, onDelete, style, onClick, deleteIcon, iconTooltip, deleteIconTooltip, licenseLink,
  }) => (
    <Chip
      onClick={onClick}
      icon={<License rights='View License' licenseLink={licenseLink} /> }
      label={<Tooltip title={localString(iconTooltip)} arrow><span>{label}</span></Tooltip>}
      onDelete={onDelete}
      deleteIcon={<Tooltip title={deleteIconTooltip} arrow>{deleteIcon}</Tooltip>}
      variant="outlined"
      className={classes.header}
      style={style}
      data-test-id={`file-chip-${label}`}
    />
  ), [classes.header]);

  const sourceBranch = sourceRepository?.branch || sourceRepository?.default_branch;
  const targetBranch = targetRepository?.branch || targetRepository?.default_branch;

  let sourceCompareLink, targetCompareLink;
  const sourceLanguage = getLanguage({ languageId: sourceRepository.name.split('_')[0], languagesJSON: languages });

  const sourceOwner = sourceRepository.owner.username;
  const targetOwner = targetRepository.owner.username;

  if (sourceLanguage.languageName === language.languageName) {
    if (sourceRepository.full_name === targetRepository.full_name) {
      sourceCompareLink = `${targetRepository.html_url}/compare/${targetBranch}...${sourceBranch}`;
      targetCompareLink = `${sourceRepository.html_url}/compare/${sourceBranch}...${targetBranch}`;
    } else {
      sourceCompareLink = `${targetRepository.html_url}/compare/${targetBranch}...master`;
      targetCompareLink = `${targetRepository.html_url}/compare/master...${targetBranch}`;
    }
  } else {
    sourceCompareLink = `${targetRepository.html_url}/compare/${targetBranch}...master`;
    targetCompareLink = `${targetRepository.html_url}/compare/master...${targetBranch}`;
  };

  const sourceChip = useDeepCompareMemo(() => {
    const { full_name } = sourceRepository;
    let label = `${sourceLanguage.languageName} - ${full_name}/${sourceBranch}`;
    let openDcsLink = sourceFileHtmlUrl;
    let licenseLink= sourceRepository.html_url + '/src/branch/' + sourceBranch + '/LICENSE.md';

    // test for translator role and override lable, dcs link and compare link
    if ( full_name !== targetRepository.full_name && sourceRepository?.catalog?.prod?.branch_or_tag_name) {
      // https://qa.door43.org/unfoldingWord/en_tn/src/tag/v47/en_tn_66-JUD.tsv
      const prodTag = sourceRepository.catalog.prod.branch_or_tag_name;
      label = `${sourceLanguage.languageName} - ${full_name}/${prodTag}`;
      openDcsLink = SERVER_URL + '/' + Path.join('unfoldingword',sourceRepository.name,'src','tag', prodTag, sourceFilepath);
      licenseLink = SERVER_URL + '/' + Path.join('unfoldingword',sourceRepository.name,'src','tag', prodTag, 'LICENSE.md');
    };

    const onClick = () => openLink(openDcsLink);
    const onDelete = () => ((targetOwner !== sourceOwner) ? false : sourceCompareLink && openLink(sourceCompareLink));
    const style = { background: '#fff9' };
    const deleteIcon = (targetOwner !== sourceOwner) ? <GetApp style={{ color:'#d3d3e6' }} /> : <GetApp />;
    const iconTooltip='OpenSourceText';
    const deleteIconTooltip = (targetOwner !== sourceOwner) ? 'Cannot compare source branch in translation mode.' : 'CompareSource';
    return chip({
      label, onDelete, style, onClick, deleteIcon, iconTooltip, deleteIconTooltip, licenseLink,
    });
  }, [sourceRepository, targetRepository, sourceFileHtmlUrl, sourceFilepath, chip, openLink, sourceCompareLink, sourceBranch, sourceLanguage.languageName, sourceOwner, targetOwner ]);

  const targetChip = useDeepCompareMemo(() => {
    const { full_name } = targetRepository;
    const label = `${language.languageName} - ${full_name}/${targetBranch}`;
    const onClick = () => openLink(targetFileHtmlUrl);
    const style = { background: '#fff9' };
    const onDelete = () => targetCompareLink && openLink(targetCompareLink);
    const deleteIcon = <Publish />;
    const iconTooltip='OpenTargetText';
    const deleteIconTooltip = 'CompareTarget';
    const licenseLink= targetRepository.html_url +
      '/src/branch/' + targetBranch + '/LICENSE.md';
    return chip({
      label, onDelete, style, onClick, deleteIcon, iconTooltip, deleteIconTooltip, licenseLink,
    });
  }, [targetRepository, language, targetFileHtmlUrl, chip, openLink, targetCompareLink, targetBranch]);

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
  headers: { marginBottom: `${theme.spacing(0.5)}px` },
  header: {
    justifyContent: 'space-between',
    width: '100%',
  },
}));

export default FilesHeader;