import styled from "@emotion/styled"

export const HeaderInfo = styled.div`
  position: relative;
  .headerInfo--action {
    position: absolute;
    right: 13px;
    height: 44px;
  }
  .headerInfo--edit {
    padding-left: 15px;
    padding-right: 5px;
    display: inline-block;
  }
  .navbar--like {
    height: 100%;
    line-height: 44px;
    font-size: 14px;
  }
  .headerInfo--edit img {
    cursor: pointer;
    width: 25px;
    line-height: 44px;
    height: 44px;
    vertical-align: middle;
  }
  .titleProposal {
    text-align: center;
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 37px;
  }
  .titleProposal h1 {
    color: #252a2f;
    font-family: Poppins;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 30px;
    text-align: center;
  }
  .descriptionProposal {
    color: #000000;
    font-family: Poppins;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 27px;
    padding-left: 24px;
    padding-right: 24px;
    margin-top: 15px;
  }
  .lastUpdateProposal {
    color: #4e5c6e;
    font-size: 14px;
    padding: 0px 24px;
    display: flex;
    justify-content: end;
  }
`

export const DetailMoreHead = styled.div`
  .itemHeadName {
    color: #000000;
    font-family: Poppins;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 27px;
    display: inline-block;
  }
  .itemHeadValue {
    color: #000000;
    font-family: Poppins;
    font-size: 15px;
    letter-spacing: 0;
    line-height: 21px;
    display: inline-block;
    text-align: center;
  }

  .innovationTier {
    color: blue;
    text-decoration: underline blue;
  }

  @media (max-width: 599px) {
    .itemHeadValue {
      margin-bottom: 18px;
    }
  }
`

export const Like = styled.div`
  display: flex;
  align-items: stretch;
`

export const LikeBox = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const EditButton = styled.div`
  cursor: pointer;
`

export default HeaderInfo
