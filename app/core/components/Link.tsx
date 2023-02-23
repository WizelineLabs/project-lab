import { Link as RemixLink } from "@remix-run/react";
import { styled, useMediaQuery } from "@mui/material";
import type { RemixLinkProps } from "@remix-run/react/dist/components";

const StyledLink = styled(RemixLink)(({ theme }) => ({}));

function Link(props: RemixLinkProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <StyledLink
      {...props}
      sx={{ color: prefersDarkMode ? "#AF2E33" : "#701D21" }}
    >
      {props.children}
    </StyledLink>
  );
}

export default Link;
