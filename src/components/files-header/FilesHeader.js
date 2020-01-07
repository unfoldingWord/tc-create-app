import React, {useMemo, useCallback} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
  Grid,
  Chip,
} from '@material-ui/core';
import {
  Translate,
  Link,
} from '@material-ui/icons';

import { getLanguage } from '../languages/helpers';

function FilesHeader ({
  sourceRepository,
  targetRepository,
  sourceFile,
  targetFile,
  language,
}) {
  const classes = useStyles();
  const openLink = useCallback((link) => window.open(link, '_blank'), []);

  const chip = useCallback(({label, onDelete, style}) => (
    <Chip
      icon={<Translate />}
      label={label}
      onDelete={onDelete}
      deleteIcon={<Link />}
      variant="outlined"
      className={classes.header}
      style={style}
    />
  ), [classes.header]);

  const sourceChip = useMemo(() => {
    const sourceLanguage = getLanguage({languageId: sourceRepository.name.split('_')[0]});
    const label= `${sourceRepository.owner.username} - ${sourceLanguage.languageName}`;
    const onDelete = () => openLink(sourceFile.html_url);
    const style = {background: '#fff9'};
    return chip({label, onDelete, style});
  }, [sourceRepository, sourceFile.html_url, chip, openLink]);

  const targetChip = useMemo(() => {
    const label= `${targetRepository.owner.username} - ${language.languageName}`;
    const onDelete = () => openLink(targetFile.html_url);
    const style = {background: '#fff9'};
    return chip({label, onDelete, style});
  }, [targetRepository, language, targetFile.html_url, chip, openLink]);

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