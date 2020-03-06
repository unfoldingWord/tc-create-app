import appPackage from '../../package.json';

const server = 'https://bg.door43.org';

const config = {
  authenticationConfig: {
    server,
    tokenid: appPackage.name,
  },
  repositoryConfig: {
    server,
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
};