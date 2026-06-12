"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, to, className, children, onClick, ...props }) {
  const pathname = usePathname();
  const targetPath = href || to;
  
  // Exact match for home "/", prefix match for other routes
  const isActive = targetPath === '/' ? pathname === '/' : pathname?.startsWith(targetPath);
  
  const computedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <Link href={targetPath} className={computedClassName} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
