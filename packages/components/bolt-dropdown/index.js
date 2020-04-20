import { lazyQueue } from '@bolt/lazy-queue';

lazyQueue(['bolt-dropdown'], async () => {
  await Promise.all([
    import(
      /*
      webpackChunkName: 'bolt-dropdown'
    */ './dropdown.js'
    ).then(BoltDropdown => {
      if (!customElements.get('bolt-dropdown')) {
        customElements.define(
          BoltDropdown.BoltDropdown.is,
          BoltDropdown.BoltDropdown,
        );
      }
    }),
  ]);
});
