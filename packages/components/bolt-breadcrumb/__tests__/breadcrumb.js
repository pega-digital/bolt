import { render, stopServer, renderWC } from '../../../testing/testing-helpers';
const componentSelector = 'bolt-breadcrumb';
let page, fixtures;

beforeEach(async () => {
  await page.evaluate(() => {
    document.body.innerHTML = '';
  });
  await page.setViewport({ width: 600, height: 200 });
});

beforeAll(async () => {
  page = await global.__BROWSER__.newPage();
  await page.goto('http://127.0.0.1:4444/', {
    timeout: 0,
  });

  const linkOne = await render('@bolt-elements-text-link/text-link.twig', {
    content: 'Home',
    attributes: {
      href: '#!',
    },
  });

  const linkTwo = await render('@bolt-elements-text-link/text-link.twig', {
    content: 'Other Page',
    attributes: {
      href: '#!',
    },
  });

  const linkThree = await render('@bolt-elements-text-link/text-link.twig', {
    content: 'Sub Page',
    attributes: {
      href: '#!',
    },
  });

  const linkFour = await render('@bolt-elements-text-link/text-link.twig', {
    content: 'Fourth Page',
    attributes: {
      href: '#!',
      'aria-current': true,
    },
  });

  fixtures = {
    linkOne,
    linkTwo,
    linkThree,
    linkFour,
  };
});

afterAll(async () => {
  await stopServer();
  await page.close();
});

describe('Bolt Breadcrumb', () => {
  test('default', async () => {
    const results = await render(
      '@bolt-components-breadcrumb/breadcrumb.twig',
      {
        contentItems: [
          fixtures.linkOne.html,
          fixtures.linkTwo.html,
          fixtures.linkThree.html,
        ],
      },
    );

    await expect(results.ok).toBe(true);
    await expect(results.html).toMatchSnapshot();
  });

  test('basic usage with contentItems including rendered components and strings', async () => {
    const results = await render(
      '@bolt-components-breadcrumb/breadcrumb.twig',
      {
        contentItems: [
          fixtures.linkOne.html,
          fixtures.linkTwo.html,
          fixtures.linkThree.html,
          fixtures.linkFour.html,
        ],
      },
    );

    await expect(results.ok).toBe(true);
    await expect(results.html).toMatchSnapshot();
  });
});
