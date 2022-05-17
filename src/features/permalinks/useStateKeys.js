import { useEffect, useState } from 'react'

export default function useStateKeys(state = {}) {
  const [keys, setKeys] = useState({});
  const { filepath, organization, sourceRepository, language } = state;

  useEffect(() => {
    setKeys({
      organization: organization?.username,
      language: language?.languageId,
      resource: sourceRepository?.full_name.split('/')[1].split('_')[1],
      filepath: filepath,
    })
  }, [filepath, organization?.username, sourceRepository?.full_name, language?.languageId])
  
  return {keys, setKeys}
}