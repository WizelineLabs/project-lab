import styled from "@emotion/styled"

type wrapperProps = {
  filtersOpen?: boolean
}

const Wrapper = styled.div<wrapperProps>`
  position: relative;
  margin-top: 35px;
  margin-bottom: 100px;
  max-width: 1250px;
  margin-left: auto;
  margin-right: auto;
  .homeWrapper__navbar {
    background-color: #fff;
    height: 58px;
    border-radius: 4px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 21px;
  }
  .homeWrapper__navbar__sort {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  .homeWrapper__navbar__tabs {
    display: flex;
    margin-left: 20px;
  }
  .homeWrapper__navbar__tabs--title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 10px;
    cursor: pointer;

    :hover {
      color: #e94d44;
    }
  }
  .homeWrapper__navbar__tabs--title--selected {
    color: #e94d44;
  }
  .homeWrapper__navbar__button {
    display: flex;
    align-items: center;
    margin-right: 49px;
  }
  .homeWrapper__navbar__button button {
    background-image: url(/add.png);
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: 15px 50%;
    border: none;
    color: #ffffff;
    font-family: Poppins;
    font-size: 15px;
    font-weight: 600;
    width: 160px;
    letter-spacing: 0;
    line-height: 29px;
    cursor: pointer;
    border-radius: 4px;
    background-color: #e94d44;
    padding: 7px 7px 8px 41px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  }

  .homeWrapper--content {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .homeWrapper__information {
    width: 100%;
    max-width: 100%;
  }
  .homeWrapper__information--row {
    margin-bottom: 20px;
    width: 100%;
  }
  .homeWrapper__information--row:last-child {
    margin-bottom: 0px;
  }
  .homeWrapper__popular {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    row-gap: 35px;
    column-gap: 15px;
    margin-bottom: 35px;
    align-items: center;
    justify-items: center;
  }
  .homeWrapper__myProposals {
    row-gap: 2px;
    width: 100%;
    max-width: 250px;
    margin-right: 15px;
  }
  .homeWrapper__myProposals--filters {
    margin: 0 4px 2px 0;
  }
  .homeWrapper__myProposals--list {
    list-style-type: none;
    font-size: 0.8em;
  }
  .homeWrapper__accordion {
    box-shadow: none;
  }
  .homeWrapper__accordion::before {
    background-color: transparent !important;
  }
  .pageButton {
    margin-right: 10px;
  }
  .homeWrapper__pagination-buttons {
    display: flex;
  }

  .homeWrapper__mobile-filters {
    display: none;
  }

  .filter__mobile-close-button {
    display: none;
  }

  .filter__mobile-button {
    display: none;
  }
  .filter__title {
    display: flex;
    justify-content: center;
    color: #252a2f;
    font-size: 22px;
    font-weight: 700;
  }
  .filter__box {
    padding: 15px 13px;
  }
  .filter__content__card {
    margin-top: 0px !important;
  }
  .homeWrapper__accordion .MuiAccordionSummary-root {
    min-height: 30px;
  }
  .homeWrapper__accordion .MuiPaper-root {
  }
  .accordion__filter__title .MuiAccordionSummary-content {
    margin: 0px;
  }
  @media (max-width: 1025px) {
    margin-top: 10px;

    .homeWrapper__navbar {
      justify-content: center;
      margin-bottom: 10px;
    }

    .homeWrapper__navbar__tabs {
      margin-left: 0px;
    }

    .homeWrapper__myProposals {
      position: absolute;
      left: ${(props) => (props.filtersOpen ? "0" : "-24rem")};
      z-index: 99;
      transition: all 0.3s ease-in-out;
      top: 68px;
      border-radius: 7px;
      box-shadow: 10px 10px 24px 1px rgba(0, 0, 0, 0.1), 10px -10px 32px 1px rgba(0, 0, 0, 0.1);
    }
    .homeWrapper__popular {
      justify-content: center;
    }
    .homeWrapper__navbar__sort {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 20px;
    }
    .homeWrapper__pagination-buttons {
      justify-content: space-around;
    }

    .homeWrapper__mobile-filters {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
    }

    .homeWrapper__information {
      max-width: 100%;
    }

    .filter__mobile-button {
      display: block;
      position: relative;
      border: none;
      color: #ffffff;
      font-family: Poppins;
      font-size: 13px;
      font-weight: 600;
      width: 100px;
      letter-spacing: 0;
      line-height: 27px;
      cursor: pointer;
      border-radius: 4px;
      background-color: #e94d44;
      padding: 4px 15px 4px 4px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
      margin-left: 20px;
    }

    .filter__mobile-close-button {
      display: block;
      position: absolute;
      top: 25px;
      right: 5%;
    }
  }
  @media (max-width: 480px) {
    .homeWrapper__navbar__sort {
      justify-content: space-around;
    }
    .homeWrapper__myProposals--list {
      font-size: 0.9em;
    }
  }
`

export default Wrapper
