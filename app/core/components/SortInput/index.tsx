import { MenuItem, TextField } from "@mui/material"

interface iProps {
  setSortQuery: (query: { field: string; order: string }) => void
  sortBy: string
}

export const SortInput = ({ setSortQuery, sortBy }: iProps) => {
  //sorting options
  const sortOptions = [
    {
      label: "Most recent",
      value: "mostRecent",
      order: "desc",
    },
    {
      label: "Most voted",
      value: "votesCount",
      order: "desc",
    },
    {
      label: "Project Members",
      value: "projectMembers",
      order: "desc",
    },
    {
      label: "Last Updated",
      value: "updatedAt",
      order: "desc",
    },
  ]

  const handleSortByChange = (e: any) => {
    setSortQuery({
      field: e.target.value,
      order: sortOptions.find((option) => option.value === e.target.value)?.order || "",
    })
  }

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
      {sortOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
