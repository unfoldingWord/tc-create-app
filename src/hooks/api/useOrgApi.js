import { OrganizationApi } from "dcs-js";

import useApiConfig from "./useApiConfig";

/**
 * Uses DCS organization API.
 * @param {string} token - Token needed to make secure requests.
 */
const useOrgApi = (config = {}) => {
  const orgConfig = useApiConfig(config);
  const orgClient = new OrganizationApi(orgConfig);
  return orgClient;
};

export default useOrgApi;
