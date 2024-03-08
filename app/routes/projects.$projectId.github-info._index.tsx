import { GitHub, Refresh } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkIcon from "@mui/icons-material/Link";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Container,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ValidatedForm } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import GitHubActivity from "~/core/components/GitHub/GitHubActivity";
import GoBack from "~/core/components/GoBack";
import Header from "~/core/layouts/Header";
import { getReleasesListData } from "~/models/githubReleases.server";
import {
  getActivityStadistic,
  getGitActivityData,
} from "~/models/githubactivity.server";
import { getProject } from "~/models/project.server";
import { week, currentdate, numberOfDays } from "~/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const validator = withZod(
  zfd.formData({
    body: z.string().min(1),
    parentId: z.string().optional().nullable(),
    id: z.string().optional(),
  })
);

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.projectId, "projectId not found");
  const url = new URL(request.url);
  let weekParams = 0;
  weekParams = parseInt(url.searchParams.get("week") as string);
  const projectId = params.projectId;
  const project = await getProject({ id: params.projectId });
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  const realeasesList = await getReleasesListData(projectId);

  const activityData = await getGitActivityData(projectId);
  const activityChartData = await getActivityStadistic(
    weekParams ? weekParams : week,
    projectId
  );

  return json({
    project,
    projectId,
    activityData,
    activityChartData,
    weekParams,
    realeasesList,
  });
};

const cleanURL = (repoInfo: { url: string }[]): string => {
  if (repoInfo[0] && repoInfo[0].url !== "") {
    return repoInfo[0].url.substring(repoInfo[0].url.lastIndexOf("/") + 1);
  } else {
    return "";
  }
};

export default function GitHubInfo() {
  const submit = useSubmit();

  const itemsSelect = [];

  const {
    project,
    projectId,
    activityData,
    activityChartData,
    weekParams,
    realeasesList,
  } = useLoaderData<typeof loader>();

  const week = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
  const selectedWeek = weekParams ? weekParams : week;

  for (let index = 1; index <= week; index++) {
    itemsSelect.push(
      <MenuItem key={index} selected={index == selectedWeek} value={index}>
        {index}
      </MenuItem>
    );
  }

  const dataChart = {
    labels: activityChartData.map(
      (activity: { typeEvent: string }) => activity.typeEvent
    ),
    datasets: [
      {
        data: activityChartData.map((activity: { count: number }) =>
          Number(activity.count)
        ),
        backgroundColor: "#3B72A4",
        borderColor: "#3B72A4",
      },
    ],
  };

  const options = {
    responsive: true,
    color: "#A7C7DC",
    plugins: {
      title: {
        display: true,
        text: `Events per Week`,
        color: "#A7C7DC",
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#A7C7DC",
        },
      },
      y: {
        title: {
          display: false,
        },
        ticks: {
          color: "#4BA4E1",
        },
        grid: {
          color: "#6C7176",
        },
      },
    },
  };

  const handleSubmit = async (event: SelectChangeEvent<number>) => {
    const body = {
      week: event.target.value,
    };

    submit(body);
  };

  const createReleaseItems = (textList: string) => {
    return textList.split("*");
  };

  return (
    <>
      <Header title="" />
      <Container sx={{ marginBottom: 2 }}>
        <Paper
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
            paddingBottom: 2,
          }}
        >
          <GoBack title="Back to project" href={`/projects/${projectId}`} />
          <Grid container justifyContent="space-between">
            <Grid item>
              <h1 style={{ marginBottom: 0 }}>
                <GitHub /> {project.name}
              </h1>
              <Typography color="text.secondary">Last commit:</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Container>
        <Paper sx={{ padding: 2, width: 1 }}>
          <Grid sx={{ margin: 2 }}>
            <Grid container justifyContent="space-between">
              <Typography color="text.primary">Project Releases</Typography>
            </Grid>
            <Grid container sx={{ padding: 2, width: 1 }}>
              {realeasesList.map((release) => (
                <Accordion key={release.id} sx={{ width: "50%" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>
                      {release.name + " Author: " + release.author}
                    </Typography>
                    <List>
                      <ListItem
                        sx={{ alignContent: "center", alignItems: "center" }}
                      ></ListItem>
                    </List>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Button
                      target="_blank"
                      href={release.link}
                      variant="outlined"
                      endIcon={<LinkIcon />}
                    >
                      Go to the release
                    </Button>
                    <ul>
                      {createReleaseItems(release.body).map((item, id) => {
                        return <li key={id}>{item}</li>;
                      })}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Container>
        <Paper sx={{ padding: 2, width: 1 }}>
          <Grid sx={{ margin: 2 }}>
            <Grid container justifyContent="space-between">
              <Typography color="text.primary">
                Project Participation
              </Typography>
              <Button variant="contained" endIcon={<Refresh />} />
            </Grid>
            <Grid container sx={{ padding: 2, width: 1 }}>
              {project.repoUrls ? (
                <GitHubActivity
                  projectId={projectId}
                  repoName={cleanURL(project.repoUrls)}
                  activityData={activityData}
                />
              ) : null}
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Container>
        <Paper sx={{ padding: 2, width: 1 }}>
          <Grid container sx={{ margin: 2 }} justifyContent="space-between">
            <Typography color="text.primary">Statistics</Typography>
          </Grid>
          <Grid container sx={{ padding: 2, width: 1 }}>
            <ValidatedForm action="./" method="post" validator={validator}>
              <InputLabel id="week-select-label">Select a Week:</InputLabel>
              <Select
                id="actions-select"
                label="Select a Week:"
                style={{ width: "100%" }}
                value={selectedWeek}
                onChange={(event) => handleSubmit(event)}
              >
                {itemsSelect.map((item) => item)}
              </Select>
            </ValidatedForm>
            {activityChartData.length > 0 ? (
              <Bar options={options} data={dataChart} />
            ) : null}
          </Grid>
          {activityChartData.length == 0 ? (
            <Stack>
              <Alert severity="warning">There is no data to show.</Alert>
            </Stack>
          ) : null}
        </Paper>
      </Container>
    </>
  );
}
