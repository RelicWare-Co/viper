import { NavLink } from "@mantine/core";
import { useRouter } from "@tanstack/react-router";

export function Link({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const isActive = href === "/" ? router.parseLocation().pathname === href : router.parseLocation().pathname.startsWith(`${href}/`);
  return <NavLink href={href} label={label} active={isActive} />;
}
