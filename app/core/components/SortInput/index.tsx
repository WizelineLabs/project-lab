import { MenuItem, TextField } from "@mui/material";

interface iProps {
  setSortQuery: (query: { field: string; order: string }) => void;
  sortBy: string;
}

interface SortOption {
  label: string;
  value: string;
  order: string;
}

export const SortInput = ({ setSortQuery, sortBy }: iProps) => {
  //sorting options
  const sortOptions: { [key: string]: SortOption } = {
    mostRecent: {
      label: "Most recent",
      value: "mostRecent",
      order: "desc",
    },
    votesCount: {
      label: "Most voted",
      value: "votesCount",
      order: "desc",
    },
    projectMembers: {
      label: "Project Members",
      value: "projectMembers",
      order: "desc",
    },
    updatedAt: {
      label: "Last Updated",
      value: "updatedAt",
      order: "desc",
    },
  };

  const handleSortByChange = (e: any) => {
    setSortQuery({
      field: e.target.value,
      order: sortOptions[e.target.value]?.order || "",
    });
  };

  return (
    <TextField
      select
      label="Sort By"
      value={sortBy}
      onChange={handleSortByChange}
      sx={{
        width: "120px",
      }}
      size="small"
      InputProps={{ style: { fontSize: "13px" } }}
    >
      {Object.values(sortOptions).map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
