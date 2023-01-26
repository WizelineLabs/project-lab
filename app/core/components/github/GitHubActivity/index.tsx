import { Card, CardHeader, CardContent } from "@mui/material";
import { useMemo, useState } from "react";
import { getActivity } from "~/routes/api/github/get-activity";

export default function GitHubActivity({ repoName }: { repoName: string }) {
  const [activityList, setActivityList] = useState<any[]>();

  useMemo(
    () =>
      getActivity(repoName)
        .then((data) => {
          const commitData = data.data;
          console.log(data);
          commitData ? setActivityList(commitData) : setActivityList([]);
        })
        .catch((error) => console.log(error)),
    [repoName]
  );

  return (
    <>
      <Card>
        <CardHeader title="Repo Activity" />
        <CardContent></CardContent>
      </Card>
    </>
  );
}
