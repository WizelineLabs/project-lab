// import { Autocomplete, CircularProgress, TextField } from "@mui/material";
// import { Fragment, PropsWithoutRef, useState } from "react";
// import getDisciplines from "app/disciplines/queries/getDisciplines";
import type { PropsWithoutRef } from "react";

interface DisciplinesSelectProps {
  defaultValue?: any[];
  customOnChange?: (arg: any) => void;
  fullWidth?: boolean;
  name: string;
  label: string;
  helperText?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  size?: "small" | "medium";
  style?: object;
  parentName?: string;
  submitting?: boolean;
}

export const DisciplinesSelect = ({
  customOnChange,
  defaultValue = [],
  fullWidth,
  name,
  label,
  helperText,
  outerProps,
  size,
  style,
  parentName,
  submitting,
}: DisciplinesSelectProps) => {
  // const [searchTerm, setSearchTerm] = useState<string>("")
  // const [data, { isLoading }] = useQuery(
  //   getDisciplines,
  //   {
  //     where: { name: { contains: searchTerm, mode: "insensitive" } },
  //     orderBy: { name: "asc" },
  //   },
  //   { suspense: false }
  // );

  // const { disciplines } = data || { disciplines: [] };

  return (
    //   <div {...outerProps}>
    //     <Autocomplete
    //       multiple={true}
    //       fullWidth={fullWidth ? fullWidth : false}
    //       style={style ? style : { margin: "1em 0" }}
    //       disabled={submitting}
    //       loading={isLoading || !data}
    //       options={disciplines}
    //       filterSelectedOptions
    //       isOptionEqualToValue={(option, value) => option.name === value.name}
    //       getOptionLabel={(option) => option.name}
    //       onInputChange={(_, value) => setSearchTermDebounced(value)}
    //       value={input.value ? input.value : defaultValue}
    //       onChange={(_, value) => {
    //         input.onChange(value);
    //         if (customOnChange) customOnChange(value);
    //       }}
    //       renderInput={(params) => (
    //         <TextField
    //           {...params}
    //           label={label}
    //           error={isError}
    //           helperText={isError ? error : helperText}
    //           disabled={submitting}
    //           InputProps={{
    //             ...params.InputProps,
    //             endAdornment: (
    //               <Fragment>
    //                 {isLoading ? (
    //                   <CircularProgress color="inherit" size={20} />
    //                 ) : null}
    //                 {params.InputProps.endAdornment}
    //               </Fragment>
    //             ),
    //           }}
    //           size={size}
    //           style={{ width: "100%", ...style }}
    //         />
    //       )}
    //     />
    //   </div>
    <></>
  );
};

export default DisciplinesSelect;
