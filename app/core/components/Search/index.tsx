import { useState } from "react"
import { Box, InputAdornment, TextField } from "@mui/material"
import styled from "@emotion/styled"
import SearchIcon from "@mui/icons-material/Search"
import { useNavigate, useSearchParams } from "@remix-run/react"

export const Wrapper = styled.div`
  max-width: 997px;
  margin-left: auto;
  margin-right: 20px;
  margin-bottom: 15px;

  .CardBox--content {
    margin-top: 0;
    display: flex;
    justify-content: flex-end;
  }

  .search__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
  }
`

export const Search = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("q") !== "myProposals" && searchParams.get("q") ? searchParams.get("q") : ""
  const [searchValue, setSearchValue] = useState(searchQuery)
  const projectsSearch = "/projects"

  const goToSearch = () => {
    navigate(`${projectsSearch}?q=${searchValue}`)
  }

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      goToSearch()
    }
  }

  return (
    <Wrapper>
      <Box
        component="div"
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          height: "40px",
        }}
      >
        <TextField
          label="Search Project Name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            width: "150px",
            height: "30px",
            "& .MuiInput-root": { marginTop: "10px" },
            "& .MuiInputLabel-root": { fontSize: "15px", lineHeight: "13px", top: "-5px" },
            "& .MuiInputLabel-shrink": { top: "0" },
            "& .MuiOutlinedInput-input": { fontSize: "13px" },
            "& .MuiOutlinedInput-root": { height: "35px" },
          }}
          onKeyPress={(e) => {
            handleEnterKeyPress(e)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Wrapper>
  )
}

export default Search
