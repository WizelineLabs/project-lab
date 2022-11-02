import Header from "app/core/layouts/Header";
import GoBack from "app/core/layouts/GoBack";
import { useNavigate } from "@remix-run/react";
import { ProjectForm } from "../components/ProjectForm";
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
// import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const data = JSON.parse(body.data);
  console.log(data);
  return redirect("/projects");

  // To do: make create project function in project.server to post to database

  // let data, response;
  // try {
  //   data = {};
  //   // response = await createProject(data)
  //   redirect("/projects/");
  //   return json(response, { status: 201 });
  // } catch (e: any) {
  //   switch (e.code) {
  //     case "NOT_FOUND":
  //       return json({ error: e.message }, { status: 404 });
  //     default:
  //       throw e;
  //   }
  // }
};

const NewProjectPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header title="Create your proposal" />
      <div className="wrapper">
        <h1 className="form__center-text">Create your proposal</h1>
      </div>
      <div className="wrapper">
        <GoBack title="Back to main page" onClick={() => navigate("/")} />
        <ProjectForm projectformType="create" />
      </div>
    </div>
  );
};

export default NewProjectPage;
