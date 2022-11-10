import styled from "@emotion/styled"
import { Link } from "@remix-run/react"

interface IProps {
  title: string
  to: string
}

function GoBack({ title, to }: IProps) {
  return (
    <>
      <Wrapper className="wrapper__back">
        <Link to={to}>
          <span className="wrapper__back--icon" />
          <span className="wrapper__back--text">{title}</span>
        </Link>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  margin-left: 12px;
  display: flex;
  height: 51px;
  margin-bottom: 35px;
  .wrapper__back--icon {
    width: 23px;
    height: 23px;
    background-size: contain;
    background-image: url(/arrow-back.png);
    cursor: pointer;
  }
  .wrapper__back--text {
    color: #000000;
    font-family: Poppins;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 27px;
    margin-left: 14px;
  }
`

export default GoBack
