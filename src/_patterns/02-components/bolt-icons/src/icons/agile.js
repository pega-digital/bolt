// import { Preact, h } from '@bolt/core';
const Agile = ({ color, size, ...otherProps }) => {
  color = color || 'currentColor';
  size = size || '24';
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" {...otherProps}>
      <title>brand icons/community/brand-agile</title>
      <defs>
        <path
          d="M31.92 25.65a.994.994 0 0 1 0 .76c-.05.12-.12.23-.21.33l-4.74 4.73a.985.985 0 0 1-.71.3c-.25 0-.51-.1-.71-.3a.996.996 0 0 1 0-1.41l.78-.78 2.26-2.25H17.67a13.5 13.5 0 0 1-9.86-4.29A13.474 13.474 0 0 1 5.08 8.62 13.54 13.54 0 0 1 14.37.41h.01C15.44.14 16.54 0 17.68 0c3.83 0 7.3 1.6 9.76 4.18a13.42 13.42 0 0 1 3.75 9.33c0 .88-.09 1.76-.26 2.62-.25 1.3-.7 2.57-1.33 3.74-.04.09-.1.16-.16.23l-1.46-1.46c.19-.37.35-.75.49-1.14.24-.62.41-1.27.53-1.92.13-.68.19-1.37.19-2.07C29.19 7.16 24.03 2 17.68 2c-4.84 0-9 3-10.69 7.24-.54 1.32-.83 2.76-.83 4.27 0 2.66.91 5.11 2.43 7.06.29.38.61.74.95 1.08a11.444 11.444 0 0 0 8.14 3.38h10.91l-.29-.29-2.01-2-.74-.74a1.008 1.008 0 0 1 0-1.42c.4-.39 1.03-.39 1.42 0l2.16 2.16 2.48 2.48.1.1c.09.09.16.2.21.33zm-24.525-.621a1 1 0 1 1 0 2H1a1 1 0 1 1 0-2h6.395z"
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
export default Agile;
