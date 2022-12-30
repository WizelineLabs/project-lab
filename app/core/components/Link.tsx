import React from "react";
import { Link as RemixLink } from "@remix-run/react";
import { styled } from "@mui/material";
import type { RemixLinkProps } from "@remix-run/react/components";

const StyledLink = styled(RemixLink)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

function Link(props: RemixLinkProps) {
  return <StyledLink {...props}>{props.children}</StyledLink>;
}

export default Link;
