// import { Preact, h } from '@bolt/core';
const AppExchange = ({ color, size, ...otherProps }) => {
  color = color || 'currentColor';
  size = size || '24';
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" {...otherProps}>
      <title>brand icons/community/brand-app-exchange</title>
      <defs>
        <path
          d="M14.927 2.618v9.903a1 1 0 1 0 2 0V2.618l11.69 5.845-12.69 6.344-12.69-6.344 11.69-5.845zm2 13.926l12.927-6.463v11.837L20.015 17a1 1 0 0 0-.895 1.79l9.497 4.747-11.69 5.846V16.544zm-3.484.771a1 1 0 0 0-1.342-.447L2 21.918V10.081l12.928 6.463v12.838l-11.69-5.846 9.758-4.879a1 1 0 0 0 .448-1.342zm18.411-8.852a.98.98 0 0 0-.109-.435.989.989 0 0 0-.155-.23c-.016-.017-.027-.036-.043-.053a1.022 1.022 0 0 0-.246-.177L16.374.105c-.009-.004-.018-.002-.027-.007a.99.99 0 0 0-.42-.098.99.99 0 0 0-.42.098c-.009.005-.018.003-.027.007L.552 7.568a1.036 1.036 0 0 0-.245.177c-.017.017-.027.036-.043.053a.989.989 0 0 0-.194.32.98.98 0 0 0-.07.345v15.073c0 .011.005.02.006.03.001.052.018.1.027.152.011.058.017.114.038.17a.753.753 0 0 0 .026.065c.005.01.003.02.008.03.03.057.07.104.106.154.016.02.026.041.042.06l.031.034c.015.015.032.024.046.038.062.055.126.104.198.142.01.005.015.015.024.02l14.928 7.463c.01.005.018.003.027.007a.99.99 0 0 0 .42.1.982.982 0 0 0 .42-.1c.008-.004.018-.002.027-.007l14.927-7.464c.01-.004.016-.014.025-.019.072-.038.136-.087.198-.142.014-.014.031-.023.046-.038l.031-.034c.016-.019.026-.04.042-.06.037-.05.077-.097.105-.154.005-.01.004-.02.01-.03a.753.753 0 0 0 .025-.066c.021-.055.027-.11.038-.169.01-.05.026-.1.027-.152.001-.01.006-.019.006-.03V8.463z"
          id="a"
        />
      </defs>
      <g fill="currentColor" fill-rule="evenodd">
        <mask id="b" fill="#fff">
          <use xlinkHref="#a" />
        </mask>
        <g mask="url(#b)" fill="currentColor">
          <path d="M0 0h32v32H0z" />
        </g>
      </g>
    </svg>
  );
};
export default AppExchange;
