import { testament } from './bcv.js';

// ALL application default resourceLinks:
const hebrewResourceLink = 'unfoldingWord/hbo/uhb/master';
const greekResourceLink = 'unfoldingWord/el-x-koine/ugnt/master';
const enUltResourceLink = 'unfoldingWord/en/ult/master';
const enUstResourceLink = 'unfoldingWord/en/ust/master';

export const defaultResourceLinks = [
  hebrewResourceLink,
  greekResourceLink,
  enUltResourceLink,
  enUstResourceLink,
];

export const generateAllResourceLinks = ({ bookId, resourceLinks = [] }) => {
  const reference = { bookId };
  const _testament = testament(reference);
  let originalLink =
    _testament === 'old' ? hebrewResourceLink : greekResourceLink;

  const _resourceLinks = resourceLinks || [];

  // need to add reference bookId to resource links
  const allResourceLinks = [
    originalLink,
    enUltResourceLink,
    enUstResourceLink,
    ..._resourceLinks,
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
