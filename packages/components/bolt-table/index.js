import { lazyQueue } from '@bolt/lazy-queue';

lazyQueue(['bolt-table'], async () => {
  await Promise.all([
    import(/* webpackChunkName: 'bolt-table' */ './src/table'),
  ]);
});
