import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 6.5l-3 3-3-3" />
      <path d="M12 21.5v-12" />
      <path d="M12 21.5a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
    </svg>
  );
}
