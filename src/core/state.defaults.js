import appPackage from '../../package.json';

export const SERVER_URL = 'https://bg.door43.org';

const config = {
  authentication: {
    server: SERVER_URL,
    tokenid: appPackage.name,
  },
  repository: {
    urls: [
      SERVER_URL + '/api/v1/repos/unfoldingword/en_ta',
      SERVER_URL + '/api/v1/repos/unfoldingword/en_tw',
      SERVER_URL + '/api/v1/repos/unfoldingword/en_tn',
      SERVER_URL + '/api/v1/repos/unfoldingword/en_obs',
    ],
  },
};

export default {
  fontScale: 100,
  config,
};