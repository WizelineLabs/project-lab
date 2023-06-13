import styled from "@emotion/styled";

export const Grid = styled.div`
  display: grid;
  column-gap: 2rem;
  grid-template-columns: 1fr 1fr;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    row-gap: 1rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    max-height: 75vh;
    overflow: scroll;
  }
`;

export const FormDivContainer = styled.div`
  h1 {
    margin: 0.5rem 0 1rem 0;
  }

  .question {
    margin-top: 0.5rem !important;
    margin-bottom: 0.7rem;
  }
`;

export const CommitmentDivContainer = styled.div`
  display: flex;
  flex-direction: column;

  .title {
    margin: 1rem 0 1.5rem 0;
    font-weight: bold;
  }

  .paragraph {
    flex: 1;
    overflow: scroll;
    max-height: 400px;
  }
`;
