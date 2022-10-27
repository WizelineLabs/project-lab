import Header from "app/core/layouts/Header";
import GoBack from "app/core/layouts/GoBack";
import { useNavigate } from "@remix-run/react";
import { ProjectForm } from "../components/ProjectForm";
/*import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData));
  return redirect("/projects");
}; */

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
