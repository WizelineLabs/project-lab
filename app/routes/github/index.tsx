import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { json } from "react-router";
import Header from "~/core/layouts/Header";
import { getCommits } from "../api/github/get-commits";

export async function loader() {
  return json(await getCommits());
}
type CommitListRecord = {
  id: number;
  author: { login: string };
  date: string;
  commit: string;
  url: string;
};

interface HeadTable {
  id: keyof CommitListRecord;
  label: string;
}

function formatDate(dateString: string) {
  var options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString([], options);
}

export default function GitHubCommits() {
  const [rows, setRows] = useState<CommitListRecord[]>([]);
  const comittsList = useLoaderData();

  console.log(comittsList.data);

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
      id: "url",
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
                {comittsList.data.map((row, index) => {
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
                          {row.commit.author.name}
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
