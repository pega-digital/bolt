#!/usr/bin/env node
const { render, renderString } = require('@bolt/twig-renderer');
const shell = require('shelljs');
const globby = require('globby');
const path = require('path');
const arraySort = require('array-sort');
const prettier = require('prettier');
const { getConfig } = require('@bolt/build-utils/config-store');
const fs = require('fs');
const events = require('@bolt/build-utils/events');

const tableRows = [];

let config,
  boltUrls,
  filteredBoltPackages,
  pendingRequests = [],
  processedComponents = [];

async function finishRendering(rows, callback) {
  config = config || (await getConfig());

  renderString(`
    {% include "@bolt-components-table/table.twig" with {
      first_col_fixed_width: true,
      borderless: true,
      attributes: {
        class: [
          "t-bolt-xlight"
        ],
        id: "component-status"
      },
      headers: {
        top: {
          cells: [
            {
              content: "Component",
              attributes: {
                class: [
                  "sort"
                ],
                "data-sort": "component"
              },
            },
            "Sass",
            "Twig",
            "Web Component",
            "Jest",
            "Nightwatch",
            "TESTING.md",
            "README.md"
          ]
        },
      },
      rows: ${JSON.stringify(arraySort(rows, 'cells'))},
    } only %}
  `).then(renderedResults => {
    const formattedTable = prettier.format(renderedResults.html, {
      parser: 'html',
    });

    fs.writeFile(
      path.join(config.buildDir, 'status-board.twig'),
      formattedTable,
      'utf8',
      function(err) {
        if (err) {
          console.log('An error occured while writing JSON Object to File.');
          return console.log(err);
        }

        callback();
        events.emit('api-tasks/status-board:generated');
      },
    );
  });
}

async function generateStatusBoard() {
  config = config || (await getConfig());

  return new Promise(async (resolve, reject) => {
    const dataFile = path.resolve(
      path.join(
        config.wwwDir,
        'pattern-lab/styleguide/data/patternlab-data-all.js',
      ),
    );

    delete require.cache[dataFile];
    const data = require(dataFile);
    boltUrls = data.globalData.link;

    boltPackages = JSON.parse(
      shell.exec('npx lerna ls --json --all', { silent: true }).stdout,
    );

    filteredBoltPackages = boltPackages.filter(pkg =>
      pkg.name.includes('@bolt/components'),
    );

    filteredBoltPackages.sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    Object.keys(boltUrls).forEach(function(url) {
      if (!url.includes('viewall')) {
        delete boltUrls[url];
      } else if (url.includes('visual-styles') || url.includes('pages-')) {
        delete boltUrls[url];
      }
    });

    filteredBoltPackages.forEach(function(boltPackage) {
      const pkgName = boltPackage.name;
      const componentPath = boltPackage.location;
      const pkg = require(`${boltPackage.location}/package.json`);
      const pkgAlias = pkg['pattern-alias'] || ''; // allows an optional 'pattern-alias' config to be defined in the component's package.json to match up a component's normal name with one or two oddly named component folders in Pattern Lab

      const jsFound = globby.sync([
        `${componentPath}/**/*.js`,
        `!${componentPath}/__tests__/**/*.js`,
      ]);

      const manualTestingDocs = globby.sync([`${componentPath}/**/TESTING.md`]);

      const scssFound = globby.sync([`${componentPath}/**/*.scss`]);
      const twigFound = globby.sync([`${componentPath}/**/*.twig`]);
      const jestTestsFound = globby.sync(
        `${componentPath}/__tests__/__snapshots__/*.js.snap`,
      );
      const nightwatchTestsFound = globby.sync(
        `${componentPath}/__tests__/*.e2e.js`,
      );
      const hasjestTests = jestTestsFound.length > 0;
      const hasNightwatchTests = nightwatchTestsFound.length > 0;
      const hasJs = jsFound.length === 1;
      const probablyAWebComponent = jsFound.length > 1;
      const hasScss = scssFound.length > 0;
      const isPrivate = pkg.private;
      const hasTwig = twigFound.length > 0;
      const hasManualTestingDocs = manualTestingDocs.length > 0;
      const readmeDocs = globby.sync(`${componentPath}/README.md`);
      let docsFound;

      if (readmeDocs.length > 0) {
        docsFound = fs.statSync(readmeDocs[0]);
      } else {
        docsFound = false;
      }

      Object.keys(boltUrls).forEach(async function(url, urlIndex, urlArray) {
        const urlAddress = boltUrls[url];
        const normalizedUrlName = url.replace(
          'viewall-components-',
          '@bolt/components-',
        );

        const normalizedUrl = urlAddress.replace('../../', '/pattern-lab/');

        // if a component's package.json has defined a pattern alias, use that to match up with a PL folder vs using the default pkg name
        if (
          (pkgAlias !== '' &&
            normalizedUrlName === pkgAlias &&
            !processedComponents.includes(pkgName)) ||
          (normalizedUrlName === pkgName &&
            !processedComponents.includes(pkgName))
        ) {
          processedComponents.push(pkgName);
          pendingRequests.push(pkgName);

          const formattedPackageName = pkgName
            .replace('@bolt/components-', '')
            .replace(/\-/g, ' ')
            .replace(/\b\w/g, function(l) {
              return l.toUpperCase();
            });

          const results = await renderString(`
            {% include "@bolt-elements-text-link/text-link.twig" with {
              content: "<strong>${formattedPackageName}</strong>",
              reversed_underline: true,
              attributes: {
                href: "${normalizedUrl}",
              }
            } %}
          `);
          const html = results.html;

          tableRows.push({
            cells: [
              isPrivate ? `${html} (unreleased)` : html,
              hasScss ? '✅' : '',
              hasTwig ? '✅' : '',
              probablyAWebComponent ? '✅' : hasJs ? '' : '',
              hasjestTests ? '✅' : '🚫',
              hasNightwatchTests ? '✅' : '🚫',
              hasManualTestingDocs ? '✅' : '🚫',
              docsFound.size >= 300 ? '✅' : '❓',
            ],
          });

          pendingRequests.pop();

          if (pendingRequests.length === 0) {
            await checkToSeeIfFinishedPrerendering(resolve);
          }
        }
      });
    });
  });
}

async function checkToSeeIfFinishedPrerendering(resolve) {
  // Only wait a second or so for re-renders to complete before skipping.
  let retryAttempts = 3;
  // @todo: refactor to use promises
  const waitForRequestsToFinish = setInterval(async function() {
    if (pendingRequests.length === 0 || retryAttempts === 0) {
      // console.log(processedComponents.length);
      await finishRendering(tableRows, resolve);
      clearInterval(waitForRequestsToFinish);
    } else if (pendingRequests !== 0) {
      console.log(`Waiting for ${pendingRequests.length} requests to finish.`);
      retryAttempts -= 1;
    }
  }, 100);
}

module.exports = {
  generateStatusBoard,
};
