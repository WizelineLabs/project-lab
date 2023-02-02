import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Repos } from "@prisma/client";
import { useMemo, useState } from "react";
import { getCommits } from "~/routes/api/github/get-commits";
import { getComparator, stableSort } from "~/utils/filtering";
import type { Order } from "~/utils/filtering";
import { getUserInfo } from "~/routes/api/github/git-getUserInfo";

export type CommitListRecord = {
  url: string;
  sha: string;
  node_id: string;
  html_url: string;
  comments_url: string;
  commit: {
    url: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    avatar_url: string;
    url: string;
    html_url: string;
  };
};

interface HeadTable {
  id: keyof CommitListRecord;
  label: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function GitHubCommits({ repoName }: { repoName: string }) {
  const page: number = 0;
  const rowsPerPage: number = 30;
  const [commitListMemo, setcommitListMemo] = useState<CommitListRecord[]>([]);
  const [orderBy, setOrderBy] = useState<keyof CommitListRecord>("author");
  const [order, setOrder] = useState<Order>("asc");

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - commitListMemo?.length)
      : 0;

  const header: HeadTable[] = [
    {
      id: "author",
      label: "Author",
    },
    {
      id: "commit",
      label: "Date",
    },
    {
      id: "commit",
      label: "Commit",
    },
    {
      id: "html_url",
      label: "URL",
    },
  ];

  useMemo(
    () =>
      getUserInfo("martin.robledo@wizeline.com")
        .then((data) => {
          console.log(data);
        })
        .catch((error) => console.log(error)),
    []
  );

  return (
    <>
      <Card>
        <CardHeader title="List of Commits" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {header.map((cell) => (
                    <TableCell key={cell.id} align="center" padding="normal">
                      {cell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {commitListMemo &&
                  stableSort(commitListMemo, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow hover tabIndex={0} key={index}>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            align="center"
                          >
                            <Link
                              rel="noreferrer"
                              target="_blank"
                              href={row.author.html_url ?? "#"}
                            >
                              <Stack
                                direction={"row"}
                                spacing={1}
                                alignItems="center"
                                justifyContent="space-evenly"
                              >
                                <Avatar
                                  alt={row.commit.author.name}
                                  src={row.author.avatar_url}
                                />
                                {row.commit.author.name}
                              </Stack>
                            </Link>
                          </TableCell>

                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            align="center"
                          >
                            {formatDate(row.commit.author.date as string)}
                          </TableCell>

                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            align="center"
                          >
                            {row.commit ? row.commit?.message : ""}
                          </TableCell>

                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            align="center"
                          >
                            <Link
                              rel="noreferrer"
                              target="_blank"
                              href={row.html_url as string}
                            >
                              Commit
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}
