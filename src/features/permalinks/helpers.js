export function getStateKeys(state = {}) {
  const { filepath, organization, sourceRepository, language } = state;
  return {
    organization: organization?.username,
    language: language?.languageId,
    resource: sourceRepository?.full_name.split('/')[1].split('_')[1],
    filepath: filepath,
  }
}
