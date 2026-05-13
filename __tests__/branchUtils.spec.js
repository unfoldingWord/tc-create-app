import { ensureUserBranch } from '../src/core/branchUtils';

jest.mock('gitea-react-toolkit', () => ({
  readBranch: jest.fn(),
}));

// eslint-disable-next-line import/first
import { readBranch } from 'gitea-react-toolkit';

const mockConfig = {
  server: 'https://git.door43.org',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'token abc123',
  },
};

const baseParams = {
  config: mockConfig,
  owner: 'test-org',
  repo: 'es_tn',
  branch: 'alice-tc-create-1',
  defaultBranch: 'master',
};

describe('ensureUserBranch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('when the branch already exists', () => {
    it('returns the existing branch object without calling the Gitea API', async () => {
      const existingBranch = { name: 'alice-tc-create-1', commit: { id: 'abc' } };
      readBranch.mockResolvedValue(existingBranch);

      const result = await ensureUserBranch(baseParams);

      expect(result).toBe(existingBranch);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('when the branch does not exist', () => {
    it('POSTs to the branches endpoint with the correct body', async () => {
      const newBranch = { name: 'alice-tc-create-1', commit: { id: 'def' } };
      readBranch.mockResolvedValue(null);
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(newBranch),
      });

      const result = await ensureUserBranch(baseParams);

      expect(result).toEqual(newBranch);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://git.door43.org/api/v1/repos/test-org/es_tn/branches',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            new_branch_name: 'alice-tc-create-1',
            old_branch_name: 'master',
          }),
        })
      );
    });

    it('forwards the Authorization header from config', async () => {
      readBranch.mockResolvedValue(null);
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await ensureUserBranch(baseParams);

      const [, options] = global.fetch.mock.calls[0];
      expect(options.headers).toMatchObject({
        Authorization: 'token abc123',
        'Content-Type': 'application/json',
      });
    });

    it('strips a trailing slash from config.server to avoid double-slash URLs', async () => {
      readBranch.mockResolvedValue(null);
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await ensureUserBranch({
        ...baseParams,
        config: { ...mockConfig, server: 'https://git.door43.org/' },
      });

      const [url] = global.fetch.mock.calls[0];
      expect(url).toBe('https://git.door43.org/api/v1/repos/test-org/es_tn/branches');
    });

    it('throws when Gitea returns a non-2xx response', async () => {
      readBranch.mockResolvedValue(null);
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 422,
        text: () => Promise.resolve('branch already exists'),
      });

      await expect(ensureUserBranch(baseParams)).rejects.toThrow(
        'createBranch failed (HTTP 422)'
      );
    });
  });
});
