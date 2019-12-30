import appPackage from '../../package.json';

const server = 'https://git.door43.org';

const config = {
  authenticationConfig: {
    server,
    tokenid: appPackage.name,
  },
  repositoryConfig: {
    server,
    urls: [
      'https://git.door43.org/api/v1/repos/unfoldingword/en_ta',
      'https://git.door43.org/api/v1/repos/unfoldingword/en_tw',
      'https://git.door43.org/api/v1/repos/unfoldingword/en_tn',
      'https://git.door43.org/api/v1/repos/unfoldingword/en_obs',
    ],
  },
};

export default {
  fontScale: 100,
  config,
};