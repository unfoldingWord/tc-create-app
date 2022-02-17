import Path from 'path';
import React, { useCallback } from 'react';
import { GetApp } from '@material-ui/icons';

import { SERVER_URL } from '../../core/state.defaults';
import FileChip from './FileChip';

export default function SourceChip({
  sourceRepository,
  targetRepository,
  sourceFileHtmlUrl,
  sourceFilepath,
  sourceLanguage,
  language,
}) {
  let sourceCompareLink;

  const sourceOwner = sourceRepository.owner.username;
  const targetOwner = targetRepository.owner.username;

  const sourceBranch = sourceRepository?.branch || sourceRepository?.default_branch;
  const targetBranch = targetRepository?.branch || targetRepository?.default_branch;

  if (sourceLanguage.languageName === language.languageName) {
    if (sourceRepository.full_name === targetRepository.full_name) {
      sourceCompareLink = `${targetRepository.html_url}/compare/${targetBranch}...${sourceBranch}`;
    } else {
      sourceCompareLink = `${targetRepository.html_url}/compare/${targetBranch}...master`;
    }
  } else {
    sourceCompareLink = `${targetRepository.html_url}/compare/${targetBranch}...master`;
  };

  let label = `${sourceLanguage.languageName} - ${sourceRepository.full_name}/${sourceBranch}`;

  let openDcsLink = sourceFileHtmlUrl;

  let licenseLink = sourceRepository.html_url + '/src/branch/' + sourceBranch + '/LICENSE.md';

  // test for translator role and override lable, dcs link and compare link
  if ( sourceRepository.full_name !== targetRepository.full_name && sourceRepository?.catalog?.prod?.branch_or_tag_name) {
    // https://qa.door43.org/unfoldingWord/en_tn/src/tag/v47/en_tn_66-JUD.tsv
    const prodTag = sourceRepository.catalog.prod.branch_or_tag_name;
    label = `${sourceLanguage.languageName} - ${sourceRepository.full_name}/${prodTag}`;
    openDcsLink = SERVER_URL + '/' + Path.join('unfoldingword',sourceRepository.name,'src','tag', prodTag, sourceFilepath);
    licenseLink = SERVER_URL + '/' + Path.join('unfoldingword',sourceRepository.name,'src','tag', prodTag, 'LICENSE.md');
  };

  const openLink = useCallback((link) => window.open(link, '_blank'), []);
  const onClick = useCallback(() => openLink(openDcsLink), [openLink, openDcsLink]);

  const onDelete = () => ((targetOwner !== sourceOwner) ? false : sourceCompareLink && openLink(sourceCompareLink));

  const style = { background: '#fff9' };

  const deleteIcon = (targetOwner !== sourceOwner) ? <GetApp style={{ color:'#d3d3e6' }} /> : <GetApp />;

  const iconTooltip='OpenSourceText';

  const deleteIconTooltip = (targetOwner !== sourceOwner) ? 'Cannot compare source branch in translation mode.' : 'CompareSource';

  const chipProps = {
    label,
    onDelete,
    style,
    onClick,
    deleteIcon,
    iconTooltip,
    deleteIconTooltip,
    licenseLink,
  };

  return <FileChip {...chipProps} />;
};