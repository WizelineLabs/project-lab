import styled from "@emotion/styled";

export const ProposalCardWrap = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

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
  .ProposalCard--description {
    height: 40px;
    font-family: Poppins;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 21px;
    margin-top: 10px;
    margin-bottom: 30px;
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
    height: 25px;
    font-weight: 700;
    line-height: 25px;
  }
  .ProposalCard__status--like {
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: #e94d44;
    margin-right: 10px;

    & span {
      margin-left: 3px;
    }
  }
  .ProposalCard__status--members {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-right: 10px;

    & span {
      margin-left: 3px;
    }
  }
  .ProposalCard__head__description--tier {
    font-weight: 700;
    cursor: pointer;
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
