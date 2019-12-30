import React, {useMemo} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
  Grid,
  Chip,
} from '@material-ui/core';
import {
  Translate,
  Link,
} from '@material-ui/icons';

import { Translatable as MarkDownTranslatable } from 'markdown-translatable';
import { DataTable } from 'datatable-translatable';

import RowHeader from './RowHeader';
import { getLanguage } from '../languages/helpers';

function Translatable ({
  sourceRepository,
  targetRepository,
  sourceFile,
  targetFile,
  language,
}) {
  const classes = useStyles();
  const sourceLanguage = getLanguage({languageId: sourceRepository.name.split('_')[0]});

  const translatableComponent = useMemo(() => {
    let _translatable = <h3>Unsupported File. Please select .md or .tsv files.</h3>;
    if (sourceFile && targetFile && sourceFile.content && targetFile.content) {
      if (sourceFile.filepath.match(/\.md$/)) {
        let translatableProps = {
          original: sourceFile.content,
          translation: targetFile.content,
          onTranslation: targetFile.saveContent,
        };
        _translatable = <MarkDownTranslatable {...translatableProps} />;
      } else if (sourceFile.filepath.match(/\.tsv$/)) {
        const delimiters = { row: '\n', cell: '\t'};
        const rowHeader = (rowData, actionsMenu) => (
          <RowHeader rowData={rowData} actionsMenu={actionsMenu} delimiters={delimiters} />
        );
        const config = {
          compositeKeyIndices: [0,1,2,3],
          columnsFilter: ['Chapter', 'SupportReference'],
          columnsShowDefault: ['SupportReference', 'OrigQuote', 'Occurrence', 'OccurrenceNote'],
          rowHeader,
        };
        let translatableProps = {
          sourceFile: sourceFile.content,
          targetFile: targetFile.content,
          onSave: targetFile.saveContent,
          delimiters,
          config,
        };
        _translatable = <DataTable {...translatableProps} />;
      }
    }
    return _translatable;
  }, [sourceFile, targetFile]);

  const openLink = (link) => window.open(link, '_blank');
  const sourceChipData = {
    label: `${sourceRepository.owner.username} - ${sourceLanguage.languageName}`,
    handleLink: () => openLink(sourceFile.html_url),
    style: {background: '#fff9'},
  };
  const targetChipData = {
    label: `${targetRepository.owner.username} - ${language.languageName}`,
    handleLink: () => openLink(targetFile.html_url),
    style: {background: 'white'},
  };

  return (
    <>
      <Grid className={classes.headers} container wrap="nowrap" spacing={2}>
        <Grid item xs={12}>
          <Chip
            icon={<Translate />}
            label={sourceChipData.label}
            onDelete={sourceChipData.handleLink}
            deleteIcon={<Link />}
            variant="outlined"
            className={classes.header}
            style={sourceChipData.style}
          />
        </Grid>
        <Grid item xs={12}>
          <Chip
            icon={<Translate />}
            label={targetChipData.label}
            onDelete={targetChipData.handleLink}
            deleteIcon={<Link />}
            variant="outlined"
            className={classes.header}
            style={targetChipData.style}
          />
        </Grid>
      </Grid>
      {translatableComponent}
    </>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
  },
  headers: {
    marginBottom: `${theme.spacing(0.5)}px`,
  },
  header: {
    justifyContent: 'space-between',
    width: '100%',
  }
}));

export default Translatable;