//import styled from "@emotion/styled"
import { Link } from "@remix-run/react"
import { Box } from "@mui/material"
import { styled } from '@mui/material/styles';

export const LinkTabStyles = styled(Link)(({ theme }) => `
  background-color:  ${(theme.palette.mode === "dark"  ? "#1f1f1f;" : "#ebebeb;")}
  background-color:  ${(theme.palette.mode === "dark"  ? "#1f1f1f;" : "#ebebeb;")}
  color: ${(theme.palette.mode === "dark"  ? "#ebebeb;" : "#1f1f1f;")}
  font-family: Poppins, sans-serif;
  font-weight: 600;
  margin-right: 1em;
  border-radius: 4px;
  border-color: transparent;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  text-decoration: none;
  padding: 12px 16px;
`
);


export const LinkStyles = styled(Link)(({ theme }) => `
  margin: 0 10px;
  padding: 0;
  align-self: center;
  font-size: 18px;
  font-weight: 600;
  font-family: Poppins, sans-serif;
  text-transform: initial;
  text-decoration: none;
  cursor: pointer;
  color: ${(theme.palette.mode === "dark"  ? "#fff;" : "#252a2f;")}   

  :hover {
    color: #e94d44;
  }
`
);

export const EditPanelsStyles = styled('div')`
  margin-top: -1em;

  .MuiBox-root {
    margin-bottom: 2em;
  }
  .MuiTabs-root,
  .MuiTabs-scroller {
    overflow: visible;
  }
  .MuiTabs-indicator {
    visibility: hidden;
  }
  .linkSelected {
    color: #e94d44;
  }
  .tabSelected {
    background-color: #e94d44;
    color: white;
  }
`

export const NavBarTabsStyles = styled('div')(({ theme }) => `
  background-color: ${(theme.palette.mode === "dark"  ? "#121212;" : "#fff;")}  
  height: 58px;
  border-radius: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 21px;

  & > div {
    margin-top: 0;
    margin-left: 20px;
  }

  @media (max-width: 1025px) {
    justify-content: center;
    margin-bottom: 10px;

    & > div {
      margin-left: 0;
    }
  }
`
);

export const BoxStyles = styled(Box)`
  margin-top: 40px;
`