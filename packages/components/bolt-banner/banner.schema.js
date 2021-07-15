module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Banner',
  description:
    'A content container that delivers important messages to the user.',
  type: 'object',
  required: ['content'],
  properties: {
    attributes: {
      type: 'object',
      description:
        'A Drupal attributes object. Applies extra HTML attributes to the outer &lt;bolt-menu&gt; tag.',
    },
    content: {
      type: 'any',
      description:
        'Renders the content of the banner. While any element can be passed, only text and links are recommended because banner messages are supposed to be concise.',
    },
    status: {
      type: 'string',
      description: 'Sets the status that the banner is trying to convey.',
      default: 'information',
      enum: ['error', 'warning', 'success', 'information'],
    },
    align: {
      type: 'string',
      description: 'Sets the text alignment of the content.',
      default: 'center',
      enum: ['start', 'center', 'end'],
    },
  },
};
