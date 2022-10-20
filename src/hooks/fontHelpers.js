import defaults from '../core/state.defaults'

export const getDefaultFontForLanguage = (language) => {
  // RTL gateway languages
  // ar - Arabic
  // ar-x-dcv - Arabic - Dominant Culture Variant
  // fa - Persian (Farsi)
  // pes - Persian, Iranian
  // ps - Pashto, Pushto
  // ur - Urdu
  // ur-x-dcv - Urdu - Dominant Culture Variant
  switch (language.languageId) {
    case 'apd': // Arabic, Sudanese Spoken
      return 'Scheherazade New'
    case 'am': // Amharic
      return 'AbyssinicaSILW'
    case 'hi': // Hindi
    case 'mr': // Marathi
    case 'ne': // Nepali
    case 'ur-Deva': // Urdu Devanagari script
      return 'AnnapurnaSILW'
    case 'ur': // Urdu
      return 'AwamiNastaliqRW'
    case 'km':
      return 'Mondulkiri'
    default:
      return defaults.selectedFont
  }
}
