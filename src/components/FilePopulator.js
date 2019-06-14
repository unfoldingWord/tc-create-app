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
  const updateFile = () => onFile();
  if (blob && file && file.filepath !== blob.filepath) updateFile();
  const File = withAuthentication(withBlob(withFile(FileComponent)));
  let filePopulator = <></>;
  const needFile = authentication && blob && !file;
  const needUpdate = blob && file && (blob.filepath !== file.filepath);
  if (needFile || needUpdate) {
    filePopulator = (
      <File
        authentication={authentication}
        authenticationConfig={authentication.config}
        repository={repository}
        blob={blob}
        file={file}
        onFile={onFile}
        fileConfig={fileConfig}
      />
    );
  }
  
  return filePopulator;
}

export default FilePopulator;