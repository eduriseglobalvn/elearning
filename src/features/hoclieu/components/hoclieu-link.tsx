import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

type HocLieuLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href?: string;
  to?: string;
  prefetch?: boolean;
  children: ReactNode;
};

export function HocLieuLink({ href, to, prefetch, children, ...props }: HocLieuLinkProps) {
  void prefetch;

  const target = to ?? href ?? "#";

  if (target === "#" || target.startsWith("http") || target.startsWith("mailto:")) {
    return (
      <a href={target} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={target} {...props}>
      {children}
    </RouterLink>
  );
}
