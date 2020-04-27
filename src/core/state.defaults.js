import appPackage from '../../package.json';

export const SERVER_URL = process.env.REACT_APP_DOOR43_SERVER_URL;
const REPO_URL = process.env.REACT_APP_DOOR43_REPO_URL;

const config = {
  authentication: {
    server: REPO_URL,
    tokenid: appPackage.name,
  },
  repository: {
    urls: [
      REPO_URL + '/api/v1/repos/unfoldingword/en_ta',
      REPO_URL + '/api/v1/repos/unfoldingword/en_tw',
      REPO_URL + '/api/v1/repos/unfoldingword/en_tn',
      REPO_URL + '/api/v1/repos/unfoldingword/en_obs',
    ],
  },
};

export default {
  fontScale: 100,
  config
};