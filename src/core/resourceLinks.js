import { testament } from './bcv.js';

// ALL application default resourceLinks:
const hebrewResourceLink = 'unfoldingWord/hbo/uhb/master';
const greekResourceLink = 'unfoldingWord/el-x-koine/ugnt/master';
const enUltResourceLink = 'unfoldingWord/en/ult/master';
const enUstResourceLink = 'unfoldingWord/en/ust/master';

export const defaultResourceLinks = [
  enUltResourceLink,
  enUstResourceLink,
  hebrewResourceLink,
  greekResourceLink,
];

// for changing the postion of resource in scripture RCL
// to display the orginal language to first ORIGINAL_LANG_POSITION to first = 1 also read line no 32
// default orignal language will be displayed last 
  
export const ORIGINAL_LANG_POSITION = 0

export const generateAllResourceLinks = ({ bookId, resourceLinks = [] }) => {
  const reference = { bookId };
  const _testament = testament(reference);
  let originalLink =
  _testament === 'old' ? hebrewResourceLink : greekResourceLink;
  const _resourceLinks = resourceLinks || [];

  // need to add reference bookId to resource links
  // To change the position of scripture resource in the panel, move the elements in different index in allResourceLinks
  // eg move "originalLink" to the last index to move hebrew / greek to last 
  const allResourceLinks = [
    enUltResourceLink,
    enUstResourceLink,
    ..._resourceLinks,
    originalLink,
  ];

  // Add bookId to all resource paths:
  const allResourceLinksWithBookId = allResourceLinks.map((link) => {
    return link + '/' + bookId;
  });

  return allResourceLinksWithBookId;
};

export const stripDefaultsFromResourceLinks = ({ resourceLinks, bookId }) => {
  const stripBookIdExpression = new RegExp('/' + bookId + '$');

  const persistedResourceLinks = resourceLinks
    .map((resourceLink) => {
      // Strip book ID:
      return resourceLink.replace(stripBookIdExpression, '');
    })
    // Filter default resources:
    .filter((resourceLink) => !defaultResourceLinks.includes(resourceLink));

  return persistedResourceLinks;
};
