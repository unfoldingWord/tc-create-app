import appPackage from '../../package.json';

const server = process.env.REACT_APP_DOOR43_SERVER_URL

const config = {
  authenticationConfig: {
    server,
    tokenid: appPackage.name,
  },
  repositoryConfig: {
    server,
    urls: [
      `${process.env.REACT_APP_DOOR43_SERVER_URL}/api/v1/repos/unfoldingword/en_ta`,
      `${process.env.REACT_APP_DOOR43_SERVER_URL}/api/v1/repos/unfoldingword/en_tw`,
      `${process.env.REACT_APP_DOOR43_SERVER_URL}/api/v1/repos/unfoldingword/en_tn`,
      `${process.env.REACT_APP_DOOR43_SERVER_URL}/api/v1/repos/unfoldingword/en_obs`,
    ],
  },
};

export default {
  fontScale: 100,
  config,
};