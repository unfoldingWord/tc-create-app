import appPackage from '../../package.json';

export const SERVER_URL = process.env.REACT_APP_DOOR43_SERVER_URL;

// removed for now (issue 684)
// SERVER_URL + '/api/v1/repos/unfoldingWord/en_obs-sq',
// Used to fake 7col unfoldingWord tN resource:
// SERVER_URL + '/api/v1/repos/test_tn_7col_format/en_tn',
const config = {
  authentication: {
    server: SERVER_URL,
    tokenid: appPackage.name,
  },
  repository: {
    urls: [
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_ta',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_tw',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_twl',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_tn',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_tq',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_sq',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_sn',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_obs',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_obs-tq',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_obs-tn',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_obs-sn',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_obs-sq',
      SERVER_URL + '/api/v1/repos/unfoldingWord/en_tl',
    ],
  },
};

export default {
  validationPriority: 'high',
  expandedScripture: true,
  scriptureOptimization: false,
  fontScale: 100,
  selectedFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",\n' +
    '    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",\n' +
    '    sans-serif',
  config,
};
