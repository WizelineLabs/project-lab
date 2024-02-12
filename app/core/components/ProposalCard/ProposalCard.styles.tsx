import { styled } from "@mui/material/styles";

export const ProposalCardWrap = styled("div")`
  display: flex;
  flex-direction: column;
  position: relative;
  font-size: 1rem;

  .ProposalCard__head {
    display: flex;
    align-items: center;
  }
  .ProposalCard__head__icon span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border: 2px solid #111823;
    border-radius: 50%;
    font-weight: bold;
    font-size: 16px;
  }
  .ProposalCard__head__icon img {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    object-fit: cover;
  }
  .ProposalCard__head__description {
    margin-left: 20px;
    width: calc(100% - 60px - 20px);
  }
  .ProposalCard__head__description--title {
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;
  }
  .ProposalCard__head__description--date {
    font-weight: 700;
    font-size: 12px;
  }
  .ProposalCard__head__description--isOwner {
    color: #e94d44;
    font-weight: 700;
    font-size: 15px;
    text-decoration: underline;
  }
  .ProposalCard__status {
    width: 100%;
    bottom: 5px;
    right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    & > div {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
  .ProposalCard__status--display {
    font-size: 1rem;
    height: 25px;
    font-weight: 700;
    line-height: 25px;
  }
  .ProposalCard__tier {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ProposalCard__head__description--tier--extra {
    font-weight: 700;
    margin-left: 15px;
  }
  hr {
    width: 100%;
    color: #ececec;
  }
`;

export const ProposalCardSkills = styled("div")`
  padding-top: 10px;
`;

export const ProposalCardStatus = styled("div")(
  ({ theme }) => `
  border-top: 1px solid #ececec;
  padding-top: 10px;
  width: 95%;

  .ProposalCard__status{
    display: flex;
    justify-content: end;
    padding-top: 5px;
    flex-direction: row;
  }
  .ProposalCard__display{
    color: #111823;
    background: ${theme.palette.mode === "dark" ? "#999999;" : "#00000066;"} 
    border-radius: 50%;
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -3px;
  }
  .ProposalCard__status--icons {
    display: flex;
    flex-direction: row;
    justify-content: center;

    & span {
      color: ${theme.palette.mode === "dark" ? "#000;" : "#fff;"}
      font-size: 10px;
      font-weight: 800;
    }
  }
`
);
