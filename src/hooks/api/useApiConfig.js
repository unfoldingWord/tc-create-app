import { SERVER_URL } from '../../core/state.defaults';

const useApiConfig = ({ token, ...config }) => ({
  apiKey: token ? (key) => key === "Authorization" && `token ${token}` : undefined,
  basePath: SERVER_URL + "/api/v1",
  ...config
})

export default useApiConfig