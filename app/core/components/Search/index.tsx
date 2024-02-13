import { Search as SearchIcon } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { useState } from "react";

export const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery =
    searchParams.get("q") !== "myProposals" && searchParams.get("q")
      ? searchParams.get("q")
      : "";
  const [searchValue, setSearchValue] = useState(searchQuery);
  const projectsSearch = "/projects";
  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      navigate(`${projectsSearch}?q=${searchValue}`);
    }
  };

  return (
    <TextField
      label="Search Project Name"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      size="small"
      sx={{ width: "200px" }}
      onKeyPress={(e) => {
        handleEnterKeyPress(e);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default Search;
