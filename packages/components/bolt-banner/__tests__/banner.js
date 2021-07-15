import { render, stopServer, renderWC } from '../../../testing/testing-helpers';
import schema from '../banner.schema';
const componentSelector = 'bolt-banner';
const { status, align } = schema.properties;
let page, fixtures;

afterAll(async () => {
  await stopServer();
  await page.close();
}, 100);

beforeEach(async () => {
  await page.evaluate(() => {
    document.body.innerHTML = '';
  });
});

beforeAll(async () => {
  page = await global.__BROWSER__.newPage();
  await page.goto('http://127.0.0.1:4444/', {
    timeout: 0,
  });

  const defaultData = {
    content: 'This is a banner',
  };

  fixtures = {
    defaultData,
  };
});

describe('Bolt banner', () => {
  // With a Web Component
  test(`default`, async () => {
    const results = await render('@bolt-components-banner/banner.twig', {
      ...fixtures.defaultData,
    });

    const { innerHTML, outerHTML } = await renderWC(
      componentSelector,
      results.html,
      page,
    );

    await expect(results.ok).toBe(true);
    await expect(results.html).toMatchSnapshot();
    await expect(innerHTML).toMatchSnapshot();
    await expect(outerHTML).toMatchSnapshot();
  });

  // Without a Web Component
  test(`default`, async () => {
    const results = await render('@bolt-components-banner/banner.twig', {
      ...fixtures.defaultData,
    });

    await expect(results.ok).toBe(true);
    await expect(results.html).toMatchSnapshot();
  });
});

describe('Bolt banner prop -', () => {
  // Target each of the schema keys with the following pattern
  status.enum.forEach(async option => {
    test(`status: ${option}`, async () => {
      const results = await render('@bolt-components-banner/banner.twig', {
        ...fixtures.defaultData,
        status: option,
      });

      await expect(results.ok).toBe(true);
      await expect(results.html).toMatchSnapshot();
    });
  });

  align.enum.forEach(async option => {
    test(`align: ${option}`, async () => {
      const results = await render('@bolt-components-banner/banner.twig', {
        ...fixtures.defaultData,
        align: option,
      });

      await expect(results.ok).toBe(true);
      await expect(results.html).toMatchSnapshot();
    });
  });
});
