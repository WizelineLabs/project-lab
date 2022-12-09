import styled from "@emotion/styled";
import type { TooltipProps } from "@mui/material/Tooltip";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} placement="top" classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "#000",
    maxWidth: 320,
    fontSize: "16px",
    border: "1px solid #dadde9",
  },
}));

export const TipBubble = styled.span`
  background-color: #fff;
  text-align: center;
  width: 20px;
  height: 20px;
  display: inline-block;
  margin: 0 2px;
  color: #e94d44;
  border-radius: 100%;
  font-size: 12px;
  cursor: pointer;
`;

export const CompleteDate = styled.span`
  background-color: #f8f8f8;
  padding: 5px;
  border: solid 1px #999;
  display: inline-flex;
  border-radius: 8px;
  font-size: 12px;
`;

export const CompleteIcon = styled.span`
  svg path {
    fill: #e94d44;
  }
`;

export const IncompleteIcon = styled.span`
  svg path {
    fill: #999;
  }
`;
