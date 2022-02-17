import React, { useCallback } from 'react';
import { Publish } from '@material-ui/icons';

import FileChip from './FileChip';

export default function TargetChip({
  sourceRepository,
  targetRepository,
  targetFileHtmlUrl,
  sourceLanguage,
  language,
}) {
  let targetCompareLink;

  const sourceBranch = sourceRepository?.branch || sourceRepository?.default_branch;
  const targetBranch = targetRepository?.branch || targetRepository?.default_branch;

  if (sourceLanguage.languageName === language.languageName) {
    if (sourceRepository.full_name === targetRepository.full_name) {
      targetCompareLink = `${sourceRepository.html_url}/compare/${sourceBranch}...${targetBranch}`;
    } else {
      targetCompareLink = `${targetRepository.html_url}/compare/master...${targetBranch}`;
    }
  } else {
    targetCompareLink = `${targetRepository.html_url}/compare/master...${targetBranch}`;
  };

  const label = `${language.languageName} - ${targetRepository.full_name}/${targetBranch}`;

  const openLink = useCallback((link) => window.open(link, '_blank'), []);
  const onClick = useCallback(() => openLink(targetFileHtmlUrl), [openLink, targetFileHtmlUrl]);

  const style = { background: '#fff9' };

  const onDelete = () => targetCompareLink && openLink(targetCompareLink);

  const deleteIcon = <Publish />;

  const iconTooltip='OpenTargetText';

  const deleteIconTooltip = 'CompareTarget';

  const licenseLink= targetRepository.html_url + '/src/branch/' + targetBranch + '/LICENSE.md';

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

  return (
    <FileChip {...chipProps} />
  );
};
