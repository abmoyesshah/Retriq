"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * A Next.js-compatible NavLink that mimics React Router's NavLink API.
 * - `to` becomes `href`
 * - `activeClassName` is applied when the current pathname matches `href`
 * - `pendingClassName` is ignored (Next.js App Router doesn't expose a simple pending flag; works only for active state)
 */
const NavLink = ({ href, className, activeClassName, pendingClassName, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(className, isActive && activeClassName)}
      {...props}
    />
  );
};

export { NavLink };