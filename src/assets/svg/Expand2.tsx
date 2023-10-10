import type { SVGProps } from 'react';
const SvgExpand2 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 50 7"
    {...props}
  >
    <rect width={500} height={7} fill="#EDEDED" rx={3.5} />
  </svg>
);
export default SvgExpand2;
