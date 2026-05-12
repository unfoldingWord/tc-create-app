import { readBranch } from 'gitea-react-toolkit';

/**
 * Creates a new branch on Gitea by forking from an existing branch.
 * POST /api/v1/repos/{owner}/{repo}/branches
 */
const createBranch = async ({ config, owner, repo, newBranch, oldBranch }) => {
  // Strip any trailing slash so the URL never contains a double-slash.
  // (The toolkit avoids this by using axios baseURL + relative path; we must
  // handle it ourselves because we use fetch with a fully-formed URL.)
  const server = config.server.replace(/\/+$/, '');
  const url = `${server}/api/v1/repos/${owner}/${repo}/branches`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...config.headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      new_branch_name: newBranch,
      old_branch_name: oldBranch,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`createBranch failed (HTTP ${response.status}): ${text}`);
  }

  return response.json();
};

/**
 * Ensures a user branch exists on Gitea. If the branch already exists this is
 * a no-op. If it does not exist it is created from `defaultBranch` at its
 * current HEAD.
 *
 * Creating the branch eagerly — before `useFile` loads the file — means the
 * file blob SHA stored in memory is the SHA in the *user branch*, not in
 * master. Master can therefore advance independently without invalidating the
 * in-memory SHA, preventing the stale-SHA conflict described in issue #1712.
 *
 * @param {object} params
 * @param {object} params.config - authentication.config (server, headers)
 * @param {string} params.owner - repository owner (organisation username)
 * @param {string} params.repo - repository name
 * @param {string} params.branch - user branch name, e.g. "alice-tc-create-1"
 * @param {string} params.defaultBranch - name of the default branch, e.g. "master"
 * @returns {Promise<object>} the branch object returned by Gitea
 */
export const ensureUserBranch = async ({ config, owner, repo, branch, defaultBranch }) => {
  const existing = await readBranch({ config, owner, repo, branch });

  if (existing) {
    return existing;
  }

  return createBranch({
    config,
    owner,
    repo,
    newBranch: branch,
    oldBranch: defaultBranch,
  });
};
