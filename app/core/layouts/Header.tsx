import styled from "@emotion/styled"

import { Link, useSubmit } from "@remix-run/react";
import { useUser } from "~/utils";
import DropDownButton from "../components/DropDownButton"
import Search from "../components/Search"
import { NewProposalButton } from "../components/NewProposalButton"

interface IProps {
  title: String
}
export interface MenuItemArgs {
  text: string
  "data-testid"?: string
  onClick?: () => void
  to: string
}

const Header = ({ title }: IProps) => {
  const currentUser = useUser()
  const submit = useSubmit()

  const options: MenuItemArgs[] =
    [
      {
        onClick: async () => {
          submit(null, { method: "post", action: "/logout" })
        },
        to: '/',
        text: "Sign out",
        "data-testid": "sign-out-button",
      },
      ...(currentUser?.role === "ADMIN" ? [{
        to: '/manager/filter-tags/labels',
        text: "Manager",
        "data-testid": "go-to-admin",
      }] : []),
    ]

  return (
    <>
      <Wrapper>
        <header>
          <div className="content">
            <Link className="logo" to="/">
              <div className="logo--img">
                <img src="/wizeline.png" alt="wizeline" height={30} width={50} />
              </div>
              <div className="logo--text">Wizelabs</div>
            </Link>
            <div className="actions--container">
              <Search />
              <div className="actions--container__button">
                <NewProposalButton />
              </div>
            </div>
            <div className="actions">
              <DropDownButton options={options}>
                <div className="actions__user">
                  <span className="actions__user--name">{currentUser?.email}</span>
                </div>
              </DropDownButton>
            </div>
          </div>
        </header>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  header {
    width: 100vw;
    height: 70px;
    background-color: #fff;
  }
  .content {
    position: relative;
    max-width: 1024px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
  }
  .logo {
    display: flex;
    align-items: center;
    width: 200px;
    cursor: pointer;
    margin-left: 20px;
    text-decoration: none;
  }
  .logo--img {
    margin-right: 7px;
  }
  .logo--text {
    height: 32px;
    width: 307px;
    color: #252a2f;
    font-family: Poppins;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: .5px;
    line-height: 30px;
  }
  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
  }
  .actions .actions__user {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .actions .actions__user .actions__user--name {
    color: #000000;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 17px;
  }
  .actions--search {
    width: 24px;
    height: 24px;
    background-image: url(/search.png);
    background-repeat: no-repeat;
    background-size: 15px;
    background-position: 50%;
    margin-right: 40px;
    cursor: pointer;
  }
  .actions--container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .actions--container__button {
    margin-right: 20px;
  }

  @media (max-width: 768px) {
    header {
      height: 145px;
    }
    .actions--container {
      position: absolute;
      right: calc(50% - 155px);
      top: 70px;
    }
    .logo {
      width: 150px;
    }
    .logo--text {
      font-size: 16px;
    }
  }

  @media (max-width: 468px) {
    .logo {
      margin-left: 5px;
    }

    .logo--text {
      font-size: 0.875rem;
    }

    .logo {
      width: 40%;
    }
  }
`

export default Header
