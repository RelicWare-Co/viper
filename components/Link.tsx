import { usePageContext } from "vike-react/usePageContext";
import { NavLink } from "@mantine/core";
import { navigate } from "vike/client/router";

export function Link({ href, label }: { href: string; label: string }) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const isActive = href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  return <NavLink onClick={(e) => {e.preventDefault(); navigate(href)}}  label={label} active={isActive} />;
}
