import { RepositoryApi } from "dcs-js";

import useApiConfig from "./useApiConfig";

/**
 * Uses DCS Repository API.
 * @param {string} token - Token needed to make secure requests.
 */
const useRepoApi = (config = {}) => {
  const repoConfig = useApiConfig(config);
  const repoClient = new RepositoryApi(repoConfig);
  return repoClient;
};

export default useRepoApi;
