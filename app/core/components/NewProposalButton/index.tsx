import styled from "@emotion/styled"
import { useNavigate } from "@remix-run/react"

const Wrapper = styled.div`
  button {
    background-image: url(/add.png);
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: 5px 50%;
    border: none;
    color: #ffffff;
    font-family: Poppins;
    font-size: 12px;
    font-weight: 600;
    width: 120px;
    letter-spacing: 0;
    line-height: 27px;
    cursor: pointer;
    border-radius: 4px;
    background-color: #e94d44;
    padding: 4px 4px 4px 20px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  }
`

export const NewProposalButton = () => {
  const navigate = useNavigate()

  const goToCreateNewProposal = () => {
    navigate("/projects/create")
  }
  return (
    <Wrapper>
      <button onClick={goToCreateNewProposal}>New proposal</button>
    </Wrapper>
  )
}
