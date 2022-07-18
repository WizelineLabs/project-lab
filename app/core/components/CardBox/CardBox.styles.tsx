import styled from "@emotion/styled"

export const CardBoxStyle = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 7px;
  .CardBox--title {
    color: #252a2f;
    font-size: 22px;
    font-weight: 700;
  }
  .CardBox--content {
    margin-top: 20px;
  }

  @media (max-width: 1024px) {
    .CardBox--title {
      text-align: center;
    }
  }
`
