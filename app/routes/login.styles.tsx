import styled from "@emotion/styled";

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 7rem;
`;

export const Greet = styled.span`
  font-size: 24px;
  font-weight: 500;
`;

export const StyledLoginForm = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  background-color: rgb(255, 255, 255);
  align-items: center;
  margin-top: 3.25rem;
  border: solid 1px #e6e7e8;
  padding-top: 3rem;
`;

export const Button = styled.button`
  font-size: 0.9rem;
  background-color: #0a76db;
  padding: .7rem 1.5rem;
  color: #f4f4f4;
  margin-top: 1.5rem;
  border-radius: 3px;
  border-width: 0px;
  &:hover {
    cursor: pointer;
    background-color: #0966be;
  }
  width: 19rem;
`;

export const Footer = styled.div`
  height: 4rem;
  background-color: rgb(247, 249, 250);
  margin-top: 3.25rem;
  width: 25rem;
  border-radius: 0.5rem;
`;

export const LoginPageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(50, 50, 93);
  overflow-y: auto;
`;