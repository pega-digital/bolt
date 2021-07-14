import { render, stopServer } from '../../../testing/testing-helpers';
import schema from '../popover.schema';
const { placement, spacing, theme } = schema.properties;

describe('<bolt-popover> Component', () => {
  afterAll(async () => {
    await stopServer();
  }, 100);

  // Basic Usage
  test('basic usage', async () => {
    const results = await render('@bolt-components-popover/popover.twig', {
      trigger:
        '<button type="button" class="e-bolt-button">This triggers a popover</button>',
      content:
        'This is the content of the popover with a <a href="https://pega.com" class="e-bolt-text-link">call to action</a>.',
    });
    expect(results.ok).toBe(true);
    expect(results.html).toMatchSnapshot();
  });

  // Props
  placement.enum.forEach(async placementChoice => {
    test(`content placement: ${placementChoice}`, async () => {
      const results = await render('@bolt-components-popover/popover.twig', {
        trigger:
          '<button type="button" class="e-bolt-button">This triggers a popover</button>',
        content:
          'This is the content of the popover with a <a href="https://pega.com" class="e-bolt-text-link">call to action</a>.',
        placement: placementChoice,
      });
      expect(results.ok).toBe(true);
      expect(results.html).toMatchSnapshot();
    });
  });

  spacing.enum.forEach(async spacingChoice => {
    test(`content spacing: ${spacingChoice}`, async () => {
      const results = await render('@bolt-components-popover/popover.twig', {
        trigger:
          '<button type="button" class="e-bolt-button">This triggers a popover</button>',
        content:
          'This is the content of the popover with a <a href="https://pega.com" class="e-bolt-text-link">call to action</a>.',
        spacing: spacingChoice,
      });
      expect(results.ok).toBe(true);
      expect(results.html).toMatchSnapshot();
    });
  });

  theme.enum.forEach(async themeChoice => {
    test(`content theme: ${themeChoice}`, async () => {
      const results = await render('@bolt-components-popover/popover.twig', {
        trigger:
          '<button type="button" class="e-bolt-button">This triggers a popover</button>',
        content:
          'This is the content of the popover with a <a href="https://pega.com" class="e-bolt-text-link">call to action</a>.',
        theme: themeChoice,
      });
      expect(results.ok).toBe(true);
      expect(results.html).toMatchSnapshot();
    });
  });

  test(`UUID of the popover`, async () => {
    const results = await render('@bolt-components-popover/popover.twig', {
      trigger:
        '<button type="button" class="e-bolt-button">This triggers a popover</button>',
      content:
        'This is the content of the popover with a <a href="https://pega.com" class="e-bolt-text-link">call to action</a>.',
      uuid: 'custom-unique-id',
    });
    expect(results.ok).toBe(true);
    expect(results.html).toMatchSnapshot();
  });
});
