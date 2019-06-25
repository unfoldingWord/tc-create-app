import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Chip,
} from '@material-ui/core';
import {
  Translate,
  Link,
} from '@material-ui/icons';
import ApplicationStepper from './components/application-stepper/ApplicationStepper';
import {
  DocumentTranslatable,
  SectionTranslatable,
} from 'markdown-translatable';

import {getLanguage} from './components/languages/helpers';

function Workspace ({
  classes,
  authentication,
  onAuthentication,
  authenticationConfig,
  repositoryConfig,
  originalRepository,
  onOriginalRepository,
  translationRepository,
  originalBlob,
  onOriginalBlob,
  originalFile,
  translationFile,
  language,
  onLanguage,
  sectionable,
}) {
  let translationFileContent;
  if (originalFile && translationFile) {
    translationFileContent = translationFile.content;
    const autoInitFileContent = `# ${translationRepository.name}\n\n${translationRepository.description}`;
    const autoInitFile = translationFile.content.trim() === autoInitFileContent;
    if (autoInitFile) translationFileContent = originalFile.content;
  }

  let component;
  if (originalFile && translationFile) {
    const originalLanguage = getLanguage({languageId: originalRepository.name.split('_')[0]});
    let translatableComponent;
    let translatableProps = {
      original: originalFile.content,
      translation: translationFileContent,
      onTranslation: translationFile.saveContent,
    }
    if (sectionable) {
      translatableComponent = <DocumentTranslatable {...translatableProps} />;
    } else {
      translatableComponent = <SectionTranslatable sectionFocus {...translatableProps} />;
    }
    const openLink = (link) => window.open(link,'_blank');
    const originalChipData = {
      label: `${originalRepository.owner.username} - ${originalLanguage.languageName}`,
      handleLink: () => openLink(originalRepository.html_url),
      style: {background: '#fff9'},
    };
    const translationChipData = {
      label: `${translationRepository.owner.username} - ${language.languageName}`,
      handleLink: () => openLink(translationRepository.html_url),
      style: {background: 'white'},
    };
    component = (
      <>
        <Grid className={classes.headers} container wrap="nowrap" spacing={16}>
          <Grid item xs={12}>
            <Chip
              icon={<Translate />}
              label={originalChipData.label}
              onDelete={originalChipData.handleLink}
              deleteIcon={<Link />}
              variant="outlined"
              className={classes.header}
              style={originalChipData.style}
            />
          </Grid>
          <Grid item xs={12}>
            <Chip
              icon={<Translate />}
              label={translationChipData.label}
              onDelete={translationChipData.handleLink}
              deleteIcon={<Link />}
              variant="outlined"
              className={classes.header}
              style={translationChipData.style}
            />
          </Grid>
        </Grid>
        {translatableComponent}
      </>
    );
  } else {
    component = (
      <ApplicationStepper
        authentication={authentication}
        onAuthentication={onAuthentication}
        authenticationConfig={authenticationConfig}
        originalRepository={originalRepository}
        onOriginalRepository={onOriginalRepository}
        repositoryConfig={repositoryConfig}
        originalBlob={originalBlob}
        onOriginalBlob={onOriginalBlob}
        originalFile={originalFile}
        language={language}
        onLanguage={onLanguage}
      />
    );
  }

  return component;
}

const styles = theme => ({
  root: {
  },
  headers: {
    marginBottom: '0.2em',
  },
  header: {
    justifyContent: 'space-between',
    width: '100%',
  }
});

export default withStyles(styles)(Workspace);