import { supportsCSSVars } from '@bolt/core/utils';
import classNames from 'classnames/dedupe';
import {
  customElement,
  BoltElement,
  html,
  styleMap,
  unsafeCSS,
  ifDefined,
} from '@bolt/element';
import menuStyles from './_menu-item.scss';

let cx = classNames.bind(menuStyles);

/*
 * 1 - @todo: remove SSR Hydration from this file, move to base
 */

@customElement('bolt-menu-item')
class BoltMenuItem extends BoltElement {
  static get properties() {
    return {
      url: String,
    };
  }

  constructor() {
    super();
    this.noCssVars = supportsCSSVars ? false : true;
  }

  static get styles() {
    return [unsafeCSS(menuStyles)];
  }

  /* [1] */
  connectedCallback() {
    super.connectedCallback && super.connectedCallback();

    // Check if any `<ssr-keep>` elements have registered themselves here. If so, kick off the one-time hydration prep task.
    if (this.ssrKeep && !this.ssrPrepped) {
      this.ssrHydrationPrep();
    }
  }

  /* [1] */
  ssrHydrationPrep() {
    // @todo: Move this to base-element, possibly as decorator
    this.nodesToKeep = [];

    this.ssrKeep.forEach(item => {
      while (item.firstChild) {
        this.nodesToKeep.push(item.firstChild); // track the nodes that will be preserved
        this.appendChild(item.firstChild);
      }
    });

    // Remove all children not in the "keep" array
    Array.from(this.children)
      .filter(item => !this.nodesToKeep.includes(item))
      .forEach(node => {
        node.parentElement.removeChild(node);
      });

    this.ssrPrepped = true;
  }
  render() {
    console.log('rendering menu item');
    return html`
      <bolt-trigger
        display="block"
        no-outline
        url="${ifDefined(this.url ? this.url : undefined)}"
      >
        <div class="${cx(`c-bolt-menu-item`)}">
          ${this.slotify('default')}
        </div>
      </bolt-trigger>
    `;
  }
}

export { BoltMenuItem };
