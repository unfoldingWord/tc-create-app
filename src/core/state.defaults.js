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
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_ta',
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_tw',
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_tn',
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_obs',
    ],
  },
};

export default {
  fontScale: 100,
  config,
};