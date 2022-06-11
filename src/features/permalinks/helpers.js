export function getStateKeys(state = {}) {
  const { filepath, organization, sourceRepository, language } = state;
  return {
    organization: organization?.username,
    language: language?.languageId,
    resource: sourceRepository?.full_name.split('/')[1].split('_')[1],
    filepath: filepath,
  }
}

export const getFormattedLink = (state) => {
  const search = window.location.search;
  const keys = getStateKeys(state);
  const entry = 'project';
  const org = keys?.organization;
  const lang = keys?.language;
  const repo = keys?.resource;
  const filepath = keys?.filepath;

  const path = [org, lang, repo, filepath].filter(Boolean).join('/');
  if (!!path) {
    const permalink = entry + '/' + path;
    return search ? permalink + search : permalink;
  }
};

export function getHistoryState(state) {
  const historyState = window.history.state || window.history.replaceState(state, null);
  return historyState || state;
}