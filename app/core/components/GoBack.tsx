import styled from "@emotion/styled";
import { Link } from "@remix-run/react";
import { ArrowBack } from "@mui/icons-material";
interface IProps {
  title: String;
  href: any;
}

function GoBack({ title, href }: IProps) {
  return (
    <>
      <Wrapper className="wrapper__back">
        <Link className="link_button wrapper__link" to={href}>
          <ArrowBack className="wrapper__back--icon"></ArrowBack>
          <div className="wrapper__back--text">{title}</div>
        </Link>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  margin-left: 12px;
  display: flex;
  height: 51px;
  margin-bottom: 35px;
  .wrapper__link {
    display: flex;
    align-items: center;
  }
  ,
  .wrapper__back--icon {
    width: 23px;
    height: 23px;
    background-size: contain;
    cursor: pointer;
    font-size: 1.2em;
  }
  .wrapper__back--text {
    color: #000000;
    font-family: Poppins;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 27px;
    margin-left: 14px;
  }
`;

export default GoBack;
