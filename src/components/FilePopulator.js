import React from 'react';
import {
  withAuthentication,
  withBlob,
  withFile
} from 'gitea-react-toolkit';

function FileComponent ({file}) { return (<></>); }

function FilePopulator ({
  authentication,
  repository,
  blob,
  file,
  onFile,
  fileConfig,
}) {
  if (blob && file && file.filepath !== blob.filepath) onFile();
  const File = withAuthentication(withBlob(withFile(FileComponent)));
  let filePopulator = <></>;
  const needFile = authentication && blob && !file;
  const needUpdate = blob && file && (blob.filepath !== file.filepath);

  const updateFile = (_file) => {
    let __file = {..._file};
    if (fileConfig && fileConfig.defaultContent) {
      const isEmpty = _file.content.trim().length === 0;
      const emptyReadme = `# ${repository.name}\n\n${repository.description}`;
      const isEmptyReadme = _file.content.trim() === emptyReadme;
      if (isEmpty || isEmptyReadme) {
        __file.content = fileConfig.defaultContent;
      }
    }
    onFile(__file);
  }

  if (needFile || needUpdate) {
    filePopulator = (
      <File
        authentication={authentication}
        authenticationConfig={authentication.config}
        repository={repository}
        blob={blob}
        file={file}
        onFile={updateFile}
        fileConfig={fileConfig}
      />
    );
  }
  
  return filePopulator;
}

export default FilePopulator;