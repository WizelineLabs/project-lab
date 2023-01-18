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

type CommitListRecord = {
  id: number;
  author: { login: string; avatar_url: string; html_url: string };
  date: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
    url: string;
  };
  html_url: string;
};

interface HeadTable {
  id: keyof CommitListRecord;
  label: string;
}

function cleanUrlRepo(repoInfo: Repos[]): string {
  if (repoInfo[0].url) {
    return repoInfo[0].url.substring(repoInfo[0].url.lastIndexOf("/") + 1);
  } else {
    return "";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function GitHubCommits(commitsList) {
  const header: HeadTable[] = [
    {
      id: "author",
      label: "Author",
    },
    {
      id: "date",
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

  return (
    <>
      <Card>
        <CardHeader title="GitHub commits" />
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
                {commitsList &&
                  commitsList?.map((row: CommitListRecord, index) => {
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
                            href={row.author.html_url}
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
                          {formatDate(row.commit.author.date)}
                        </TableCell>

                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="center"
                        >
                          {row.commit.message}
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
                            href={row.html_url}
                          >
                            Commit
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}
