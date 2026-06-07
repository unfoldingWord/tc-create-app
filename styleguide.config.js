const path = require('path');
const upperFirst = require('lodash/upperFirst');
const camelCase = require('lodash/camelCase');
const { name, version, repository } = require('./package.json');
const { styles, theme } = require('./styleguide.styles');

module.exports = {
  title: `${upperFirst(camelCase(name))} v${version}`,
  ribbon: {
    url: repository.url,
    text: 'View me on GitHub'
  },
  webpackConfig: {
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          // uw-content-validation@3.2.1 bundles yaml@2.x, whose browser dist
          // ships modern JS (optional chaining) that webpack 4 cannot parse.
          // Run it through Babel so the styleguidist build succeeds.
          test: /\.js$/,
          include: /node_modules\/uw-content-validation\/node_modules\/yaml/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
        }
      ]
    }
  },
  styles,
  theme,
  getComponentPathLine: (componentPath) => {
    const dirname = path.dirname(componentPath, '.js');
    const file = dirname.split('/').slice(-1)[0];
    const componentName = upperFirst(camelCase(file));
    return `import { ${componentName} } from "${name}";`;
  },
  usageMode: 'expand',
  exampleMode: 'expand',
  pagePerSection: true,
  sections: [
    {
      name: 'Application Stepper',
      components: () => ([
        path.resolve(__dirname, `src/components/application-stepper`, `ApplicationStepper.js`),
      ]),
    },
    {
      name: 'Drawer Menu',
      components: () => ([
        path.resolve(__dirname, `src/components/drawer-menu`, `DrawerMenu.js`),
      ]),
    },
    {
      name: 'Language Select',
      components: () => ([
        path.resolve(__dirname, `src/components/languages`, `LanguageSelect.js`),
      ]),
    },
    {
      name: 'Workspace',
      components: () => ([
        path.resolve(__dirname, `src`, `Workspace.js`),
      ]),
    }
  ]
};
