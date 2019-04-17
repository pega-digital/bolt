const config = {
  // Environmental variable / preset to use
  env: 'drupal',
  buildDir: '../assets/',
  wwwDir: '../',
  verbosity: 1,
  components: {
    global: [
      '@bolt/global',
      '@bolt/components-action-blocks',
      '@bolt/components-background',
      '@bolt/components-background-shapes',
      '@bolt/components-band',
      '@bolt/components-block-list',
      '@bolt/components-blockquote',
      '@bolt/components-breadcrumb',
      '@bolt/components-button',
      '@bolt/components-button-group',
      '@bolt/components-card',
      '@bolt/components-chip',
      '@bolt/components-chip-list',
      '@bolt/components-code-snippet',
      '@bolt/components-copy-to-clipboard',
      '@bolt/components-critical-css',
      '@bolt/components-critical-css-vars',
      '@bolt/components-critical-fonts',
      '@bolt/components-device-viewer',
      '@bolt/components-dropdown',
      '@bolt/components-figure',
      '@bolt/components-form',
      '@bolt/components-grid',
      '@bolt/components-headline',
      '@bolt/components-icon',
      '@bolt/components-icons',
      '@bolt/components-image',
      '@bolt/components-li',
      '@bolt/components-link',
      '@bolt/components-list',
      '@bolt/components-logo',
      '@bolt/components-nav-indicator',
      '@bolt/components-nav-priority',
      '@bolt/components-navbar',
      '@bolt/components-navlink',
      '@bolt/components-ol',
      '@bolt/components-pagination',
      '@bolt/components-placeholder',
      '@bolt/components-ratio',
      '@bolt/components-share',
      '@bolt/components-site',
      '@bolt/components-smooth-scroll',
      '@bolt/components-sticky',
      '@bolt/components-teaser',
      '@bolt/components-text',
      '@bolt/components-tooltip',
      '@bolt/components-ul',
      '@bolt/components-video',
    ],
    individual: [
      '@bolt/components-critical-fonts',
      '@bolt/components-critical-css',
      '@bolt/components-critical-css-vars',
    ],
  },
};

module.exports = config;
