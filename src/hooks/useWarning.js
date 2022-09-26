import { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  readBranch
} from 'gitea-react-toolkit';

export function useWarning(applicationStateReducer) {
  const {
    state: {
      authentication,
      sourceRepository,
      targetRepository,
      config: _config,
    },
    actions: {
      setCacheWarningMessage,
    }
  } = applicationStateReducer;

  const config = authentication?.config || _config.authentication;

  useEffect(() => {
    const compareBranches = async () => {
      if (sourceRepository?.default_branch) {
        if (targetRepository?.branch) {
          const branch = await readBranch({
            owner: targetRepository?.full_name.split("/")[0],
            repo: targetRepository?.full_name.split("/")[1],
            branch: targetRepository?.branch,
            config
          });
          const masterBranch = await readBranch({
            owner: sourceRepository?.full_name.split("/")[0],
            repo: sourceRepository?.full_name.split("/")[1],
            branch: sourceRepository?.default_branch,
            config
          });
          const date1 = new Date(masterBranch?.commit.timestamp);
          const date2 = new Date(branch?.commit.timestamp);
          date2.setDate(date2.getDate() + 14);
          if (date2 <= date1) {
            setCacheWarningMessage('out of date');
            console.log("WARNING - BRANCH IS OLD")
          }
        }
      }
    };
    compareBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceRepository, targetRepository, config]);
}

useWarning.propTypes = {
  state: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};