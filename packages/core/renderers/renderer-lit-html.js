import { html, render } from 'lit-html';

import {
  withComponent,
  shadow,
  props,
  hasNativeShadowDomSupport,
  findParentTag,
  stateListener,
} from '../utils';
import { BoltBase } from './bolt-base';

export { html, render } from 'lit-html';

export function withLitHtml(Base = HTMLElement) {
  return class extends withComponent(BoltBase(Base)) {
    static props = {
      onClick: props.string,
      onClickTarget: props.string,
      isServer: {
        ...props.boolean,
        ...{ default: bolt.isServer },
      },
      isClient: {
        ...props.boolean,
        ...{ default: bolt.isClient },
      },
    };

    constructor(...args) {
      super(...args);
    }

    renderStyles(styles) {
      if (styles) {
        return html`
          <style>
            ${styles}
          </style>
        `;
      }
    }

    slot(name) {
      if (typeof this.slots[name] === 'undefined') {
        this.slots[name] = [];
      }

      // prettier-ignore
      // Remove line breaks before and after lit-html template tags, causes unwanted space on inline elements
      if (this.useShadow && hasNativeShadowDomSupport) {
        if (name === 'default') {
          return html`<slot />`;
        } else {
          return html`<slot name="${name}" />`;
        }
      } else {
        if (name === 'default') {
          return html`${this.slots.default}`;
        } else if (this.slots[name] && this.slots[name] !== []) {
          return html`${this.slots[name]}`;
        } else {
          return ''; // No slots assigned so don't return any markup.
          console.log(`The ${name} slot doesn't appear to exist...`);
        }
      }
    }

    updated(oldProps) {
      super.updated && super.updated();

      const changedProps = new Set();
      const newProps = Object.assign({}, oldProps, this.props);

      for (const [key, value] of Object.entries(this.props)) {
        if (oldProps[key] !== value) {
          changedProps.add(key);
        }
      }

      stateListener.emit('change', oldProps, newProps, changedProps, this);
    }

    renderer(root, call) {
      render(call(), root);
    }
  };
}
