import styled from "@emotion/styled"

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
    color: #111823;
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
    color: #111823;
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;
  }
  .ProposalCard__head__description--date {
    color: #111823;
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
    color: #727e8c;
    font-family: Poppins;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 21px;
    margin-top: 10px;
    margin-bottom: 30px;
  }
  .ProposalCard__skills {
    min-height: 29px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .ProposalCard__skills--title {
    margin-right: 5px;
    margin-bottom: 5px;
    background-color: #e94d44;
    color: #fff;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 11px;
  }
  hr {
    height: 1px;
    width: 100%;
    background-color: #111823;
    margin-bottom: 5px;
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
    color: #111823;
    font-size: 12px;
    font-weight: 700;
    line-height: 25px;
  }
  .ProposalCard__status--like {
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: #af2e33;
    font-size: 14px;
    margin-right: 10px;

    & span {
      margin-left: 3px;
    }
  }
`
