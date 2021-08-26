import React, {
  useState, useCallback, useContext, useMemo,
} from 'react';

import { CircularProgress } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

import { DataTable } from 'datatable-translatable';
import * as parser from 'uw-tsv-parser';

import { ResourcesContextProvider, ResourcesContext } from 'scripture-resources-rcl';
import { FileContext } from 'gitea-react-toolkit';

import {
  defaultResourceLinks,
  stripDefaultsFromResourceLinks,
  generateAllResourceLinks,
} from '../../core/resourceLinks';
import { SERVER_URL } from '../../core/state.defaults';
import { TargetFileContext } from '../../core/TargetFile.context';

import { AppContext } from '../../App.context';
import RowHeaderSq from './RowHeaderSq';

import * as cv from 'uw-content-validation';
import * as csv from '../../core/csvMaker';

const delimiters = { row: '\n', cell: '\t' };

// columns Reference	ID	Tags	Quote	Occurrence	Question	Response
const _config = {
  compositeKeyIndices: [0, 1],
  columnsFilter: ['Reference', 'ID', 'Tags', 'Quote', 'Occurrence','Response'],
  columnsShowDefault: [
    'Reference','Question',
  ],
}
;



function TranslatableSqTSVWrapper({ onSave, onContentIsDirty }) {
  // manage the state of the resources for the provider context
  const [resources, setResources] = useState([]);
  const [open, setOpen] = React.useState(false);

  const {
    state: { resourceLinks, expandedScripture, validationPriority },
    actions: { setResourceLinks },
  } = useContext(AppContext);

  const { state: sourceFile } = useContext(FileContext);
  const { state: targetFile } = useContext(
    TargetFileContext
  );

  //const bookId = sourceFile.filepath.split(/\d+-|\./)[1].toLowerCase();
  // filename pattern tn_TIT.tsv
  const bookId = sourceFile.filepath
  .split('_')[1]
  .split('.')[0]
  .toLowerCase();

  
  const onResourceLinks = useCallback(
    (_resourceLinks) => {
      // Remove bookId and remove defaults:
      const persistedResourceLinks = stripDefaultsFromResourceLinks({
        resourceLinks: _resourceLinks,
        bookId,
      });
      // Persist to App context:
      setResourceLinks(persistedResourceLinks);
    },
    [bookId, setResourceLinks]
  );

  // Build bookId and add defaults:
  const defaultResourceLinksWithBookId = generateAllResourceLinks({
    bookId,
    defaultResourceLinks,
  });
  const allResourceLinksWithBookId = generateAllResourceLinks({
    bookId,
    resourceLinks,
  });

  const generateRowId = useCallback((rowData) => {
    const reference = rowData[1].split(delimiters.cell)[0];
    const [chapter, verse] = reference.split(":");
    const uid = rowData[2].split(delimiters.cell)[1];
    let rowId = `header-${chapter}-${verse}-${uid}`;
    return rowId;
  }, []);

  const serverConfig = {
    server: SERVER_URL,
    cache: {
      maxAge: 1 * 1 * 1 * 60 * 1000, // override cache to 1 minute
    },
  };

  const handleClose = useCallback( () => {
    setOpen(false);
  }, [setOpen]);

  const _onValidate = useCallback(async (rows) => {
    // sample name: en_tn_08-RUT.tsv
    // NOTE! the content on-screen, in-memory does NOT include
    // the headers. So the initial value of tsvRows will be
    // the headers.
    if ( targetFile && rows ) {
      const _name  = targetFile.name.split('_');
      const langId = _name[0];
      const bookID = _name[2].split('-')[1].split('.')[0];
      // const rawResults = await checkQuestionsTSV7Table(languageCode, repoCode, bookID, filename, tableText, givenLocation, checkingOptions);
      const rawResults = await cv.checkQuestionsTSV7Table(langId, 'TQ2', bookID, 'dummy', rows, '', {suppressNoticeDisablingFlag: false});
      const nl = rawResults.noticeList;
      let hdrs =  ['Priority','Chapter','Verse','Line','Row ID','Details','Char Pos','Excerpt','Message','Location'];
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
        }
        if ( inPriorityRange ) {
          csv.addRow( data, [
              String(rowData.priority),
              String(rowData.C),
              String(rowData.V),
              String(rowData.lineNumber),
              String(rowData.rowID),
              String(rowData.fieldName || ""),
              String(rowData.characterIndex || ""),
              String(rowData.extract || ""),
              String(rowData.message),
              String(rowData.location),
          ])
        }
      });

      if ( data.length < 2 ) {
        alert("No Validation Errors Found");
        setOpen(false);
        return;
      }

      let ts = new Date().toISOString();
      let fn = 'Validation-' + targetFile.name + '-' + ts + '.csv';
      csv.download(fn, csv.toCSV(data));
  
      //setOpen(false);
    }
    setOpen(false);
  },[targetFile, validationPriority]);

  const onValidate = useCallback( (rows) => {
    setOpen(true);
    setTimeout( () => _onValidate(rows), 1);
  }, [_onValidate]);

  const options = {
    page: 0,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 100],
  };

  const rowHeader = useCallback((rowData, actionsMenu) => (<RowHeaderSq
    bookId={bookId}
    open={expandedScripture}
    rowData={rowData}
    actionsMenu={actionsMenu}
    delimiters={delimiters}
  />), [expandedScripture, bookId]);


  const datatable = useMemo(() => {
    _config.rowHeader = rowHeader;
    return (
      <DataTable
        sourceFile={sourceFile.content}
        targetFile={targetFile.content}
        onSave={onSave}
        onValidate={onValidate}
        onContentIsDirty={onContentIsDirty}
        delimiters={delimiters}
        config={_config}
        generateRowId={generateRowId}
        options={options}
        parser={parser}
      />
    );
  }, [sourceFile.content, targetFile.content, onSave, onValidate, onContentIsDirty, generateRowId, options, rowHeader]);

  return (
    <>
    <ResourcesContextProvider
      reference={{ bookId }}
      defaultResourceLinks={defaultResourceLinksWithBookId}
      resourceLinks={allResourceLinksWithBookId}
      onResourceLinks={onResourceLinks}
      resources={resources}
      onResources={setResources}
      config={serverConfig}
    >
      <TranslatableSqTSV datatable={datatable} />
      {open &&  <Dialog
        disableBackdropClick
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Validation Running, Please Wait"}</DialogTitle>
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
    </>
  );
}

function TranslatableSqTSV({ datatable }) {
  const { state: { books } } = useContext(ResourcesContext);
  return books ? datatable :
    (<div style={{
      width: '100%', display: 'flex', justifyContent: 'center',
    }}
    ><CircularProgress /></div>);
}

export default TranslatableSqTSVWrapper;