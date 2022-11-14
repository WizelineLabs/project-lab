import styled from "@emotion/styled"
import Tab from "@mui/material/Tab"

export const TabStyles = styled(Tab)`
  text-transform: initial;
  background-color: #ebebeb;
  color: #1f1f1f;
  font-family: Poppins, sans-serif;
  font-weight: 600;
  margin-right: 1em;
  border-radius: 4px;
  border-color: transparent;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: 0.3s box-shadow ease-out;
  transition-delay: 1;

  &[aria-selected="true"] {
    background-color: #e94d44;
    color: white;
    border-color: transparent;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.14);
    transition-delay: 0;
  }
`

export const TitleTabStyles = styled(Tab)`
  margin: 0 10px;
  padding: 0;
  font-size: 18px;
  font-weight: 600;
  font-family: Poppins, sans-serif;
  text-transform: initial;
  cursor: pointer;
  color: #252a2f;

  :hover {
    color: #e94d44;
  }

  &[aria-selected="true"] {
    color: #e94d44;
  }
`

export const EditPanelsStyles = styled.div`
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
`

export const NavBarTabsStyles = styled.div`
  background-color: #fff;
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
