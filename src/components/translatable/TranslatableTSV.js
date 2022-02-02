import React, {
  useState,
  useCallback,
  useContext,
} from 'react';
import { useDeepCompareCallback, useDeepCompareMemo } from 'use-deep-compare';

import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';

import { DataTable } from 'datatable-translatable';

import { ResourcesContextProvider, ResourcesContext } from 'scripture-resources-rcl';

import * as cv from 'uw-content-validation';
import * as csv from '../../core/csvMaker';
import {
  defaultResourceLinks,
  stripDefaultsFromResourceLinks,
  generateAllResourceLinks,
} from '../../core/resourceLinks';
import { SERVER_URL } from '../../core/state.defaults';

import { AppContext } from '../../App.context';
import RowHeader from './RowHeader';

const delimiters = { row: '\n', cell: '\t' };
const _config = {
  compositeKeyIndices: [0, 1, 2, 3],
  columnsFilter: ['Chapter', 'Verse', 'SupportReference'],
  columnsShowDefault: [
    'SupportReference',
    'OccurrenceNote',
  ],
};

const serverConfig = {
  server: SERVER_URL,
  cache: {
    maxAge: 1 * 1 * 1 * 60 * 1000, // override cache to 1 minute
  },
};

function TranslatableTSVWrapper({
  onSave,
  onEdit,
  onContentIsDirty,
}) {
  // manage the state of the resources for the provider context
  const [resources, setResources] = useState([]);
  const [open, setOpen] = React.useState(false);

  const {
    state: {
      resourceLinks,
      expandedScripture,
      validationPriority,
      organization,
    },
    actions: { setResourceLinks },
    sourceFile,
    targetFile,
  } = useContext(AppContext);

  const bookId = sourceFile.state.filepath.split(/\d+-|\./)[1].toLowerCase();

  const onResourceLinks = useCallback((_resourceLinks) => {
    // Remove bookId and remove defaults:
    const persistedResourceLinks = stripDefaultsFromResourceLinks({
      resourceLinks: _resourceLinks,
      bookId,
    });
    // Persist to App context:
    setResourceLinks(persistedResourceLinks);
  }, [bookId, setResourceLinks]);

  // Build bookId and add defaults:
  const defaultResourceLinksWithBookId = generateAllResourceLinks({ bookId, defaultResourceLinks });
  const allResourceLinksWithBookId = generateAllResourceLinks({ bookId, resourceLinks });

  const generateRowId = useCallback((rowData) => {
    const [chapter] = rowData[2].split(delimiters.cell);
    const [verse] = rowData[3].split(delimiters.cell);
    const [uid] = rowData[4].split(delimiters.cell);
    return `header-${chapter}-${verse}-${uid}`;
  }, []);

  const handleClose = useCallback( () => {
    setOpen(false);
  }, [setOpen]);

  const _onValidate = useDeepCompareCallback(async (rows) => {
    // sample name: en_tn_08-RUT.tsv
    // NOTE! the content on-screen, in-memory does NOT include
    // the headers. So the initial value of tsvRows will be
    // the headers.
    if ( targetFile.state && rows ) {
      const _name = targetFile.state.name.split('_');
      const langId = _name[0];
      const bookID = _name[2].split('-')[1].split('.')[0];
      let rowsString = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n';

      for (let i=0; i < rows.length; i++) {
        let rowString = '';

        for (let j=0; j < rows[i].length; j++) {
          rowString += rows[i][j];

          if ( j < (rows[i].length-1) ) {
            rowString += '\t';
          };
        };
        rowsString += rowString;
        rowsString += '\n';
      }
      // const rawResults = await cv.checkTN_TSV9Table(langId, 'TN', bookID, 'dummy', rowsString, '', {suppressNoticeDisablingFlag: false});

      const rawResults = await cv.checkDeprecatedTN_TSV9Table(organization.username, langId, bookID, targetFile.state.name, rowsString, { suppressNoticeDisablingFlag: false });
      const nl = rawResults.noticeList;
      let hdrs = ['Priority','Chapter','Verse','Line','Row ID','Details','Char Pos','Excerpt','Message','Location'];
      let data = [];
      data.push(hdrs);
      let inPriorityRange = false;

      Object.keys(nl).forEach ( key => {
        inPriorityRange = false; // reset for each
        const rowData = nl[key];

        if ( validationPriority === 'med' && rowData.priority > 599 ) {
          inPriorityRange = true;
        } else if ( validationPriority === 'high' && rowData.priority > 799 ) {
          inPriorityRange = true;
        } else if ( validationPriority === 'low' ) {
          inPriorityRange = true;
        };

        if ( inPriorityRange ) {
          csv.addRow( data, [
            String(rowData.priority),
            String(rowData.C),
            String(rowData.V),
            String(rowData.lineNumber),
            String(rowData.rowID),
            String(rowData.fieldName || ''),
            String(rowData.characterIndex || ''),
            String(rowData.extract || ''),
            String(rowData.message),
            String(rowData.location),
          ]);
        }
      });

      if ( data.length < 2 ) {
        alert('No Validation Errors Found');
        setOpen(false);
        return;
      };

      let ts = new Date().toISOString();
      let fn = 'Validation-' + targetFile.state.name + '-' + ts + '.csv';
      csv.download(fn, csv.toCSV(data));
    };
    setOpen(false);
  },[targetFile.state, validationPriority, organization.username]);

  const onValidate = useCallback( (rows) => {
    setOpen(true);
    setTimeout( () => _onValidate(rows), 1);
  }, [_onValidate]);

  const options = {
    page: 0,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 100],
  };

  const rowHeader = useDeepCompareCallback((rowData, actionsMenu) => (
    <RowHeader
      open={expandedScripture}
      rowData={rowData}
      actionsMenu={actionsMenu}
      delimiters={delimiters}
    />
  ), [expandedScripture, delimiters]);

  const datatable = useDeepCompareMemo(() => {
    _config.rowHeader = rowHeader;
    return (
      <DataTable
        sourceFile={sourceFile.state.content}
        targetFile={targetFile.state.content}
        onSave={onSave}
        onEdit={onEdit}
        onValidate={onValidate}
        onContentIsDirty={onContentIsDirty}
        delimiters={delimiters}
        config={_config}
        generateRowId={generateRowId}
        options={options}
      />
    );
  }, [sourceFile.state.content, targetFile.state.content, onSave, onEdit, onValidate, onContentIsDirty, generateRowId, options, rowHeader]);

  return (
    <ResourcesContextProvider
      reference={{ bookId }}
      defaultResourceLinks={defaultResourceLinksWithBookId}
      resourceLinks={allResourceLinksWithBookId}
      onResourceLinks={onResourceLinks}
      resources={resources}
      onResources={setResources}
      config={serverConfig}
    >
      <TranslatableTSV datatable={datatable} />
      {
        open && <Dialog
          disableBackdropClick
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Validation Running, Please Wait'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div style={{ textAlign: 'center' }}>
                <CircularProgress />{' '}
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      }
    </ResourcesContextProvider>
  );
}

function TranslatableTSV({ datatable }) {
  const { state: { books } } = useContext(ResourcesContext);
  return books ? datatable : (
    <div style={{
      width: '100%', display: 'flex', justifyContent: 'center',
    }}
    >
      <CircularProgress />
    </div>
  );
};

export default TranslatableTSVWrapper;