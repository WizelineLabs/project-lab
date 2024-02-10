import {
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

interface gitHubActivitySchema {
  id: string;
  typeEvent: string;
  created_at: Date;
  author: string;
  avatar_url: string;
  projectId: string | null;
}

export default function GitHubActivity({
  repoName,
  projectId,
  activityData,
}: {
  repoName: string;
  projectId: string;
  activityData: gitHubActivitySchema[];
}) {
  return (
    <Card sx={{ width: 1, overflowY: "scroll", height: 600 }}>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Event Type</TableCell>
                <TableCell align="right">Author</TableCell>
                <TableCell align="right">Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activityData &&
                activityData.map((event) => (
                  <TableRow
                    key={event.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {event.typeEvent}
                    </TableCell>
                    <TableCell align="right">{event.author}</TableCell>
                    <TableCell align="right">
                      {new Intl.DateTimeFormat([], {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                      }).format(new Date(event.created_at))}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
