import styled from "@emotion/styled";
import { Link } from "@remix-run/react";

export const DropdownPlaceholderContainer = styled.div`
  display: flex;
  cursor: pointer;
  color: ;
  font-size: 0.8rem;
`;

export const DropDownLink = styled(Link)`
  text-decoration: none;

  :visited {
    text-decoration: none;
    color: black;
  }
`;
