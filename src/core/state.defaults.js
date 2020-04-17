import appPackage from '../../package.json';

const server = process.env.REACT_APP_DOOR43_SERVER_URL;

const config = {
  authentication: {
    server,
    tokenid: appPackage.name,
  },
  repository: {
    urls: [
      server + '/api/v1/repos/unfoldingword/en_ta',
      server + '/api/v1/repos/unfoldingword/en_tw',
      server + '/api/v1/repos/unfoldingword/en_tn',
      server + '/api/v1/repos/unfoldingword/en_obs',
    ],
  },
};

export default {
  fontScale: 100,
  config,
  SERVER_URL: server
};