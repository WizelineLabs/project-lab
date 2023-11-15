import styled from "@emotion/styled";

export const HomePageContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(218, 218, 218);
  overflow-y: auto;
`;

export const HomeHeader = styled.div`
  width: 100vw;
  height: 80px;
  background-color: rgb(35, 37, 41);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SecondaryHeader = styled.div`
  width: 100vw;
  height: 90px;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  padding: 10px;
  position: absolute;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

export const HomeTitle = styled.button`
  font-family: "Roboto", sans-serif;
  font-size: 1.5rem;
  color: rgb(175, 46, 51);
  background-color: transparent;
  border: none;
`;

export const PageContainerTitle = styled.h1`
  color: black;
  width: 100%;
  textalign: left;
  padding: 30px;
  font-size: 50px;
  margin: 0;
`;
