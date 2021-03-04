module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Image',
  type: 'object',
  properties: {
    attributes: {
      type: 'object',
      description:
        'A Drupal-style attributes object with extra attributes to append to this element.',
    },
    fill: {
      type: 'boolean',
      description:
        'Render the image 100% wide, filling up the full width of its parent container.',
    },
    background: {
      type: 'boolean',
      description:
        'Render the image as a background image. This sets the image to be absolute positioned, only use this prop if the image is inside a non-static container.',
    },
  },
};
