"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["lanes", "Lanes"],
  ["checkpoint", "Checkpoint"],
  ["artifacts", "Artifacts"],
  ["overlap", "Overlap"],
  ["finalize", "Final split"],
  ["receipt", "Receipt"]
] as const;

export function ProjectNav({ projectId }: { projectId: number }) {
  const pathname = usePathname();
  return (
    <nav className="project-nav" aria-label="Project workflow">
      {items.map(([path, label]) => {
        const href = `/projects/${projectId}/${path}`;
        return <Link key={path} href={href} className={pathname === href ? "active" : ""}>{label}</Link>;
      })}
    </nav>
  );
}
