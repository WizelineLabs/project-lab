import Header from "app/core/layouts/Header";
import GoBack from "app/core/layouts/GoBack";
import { useNavigate } from "@remix-run/react";
import { ProjectForm } from "../components/ProjectForm";



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
        {/* <ProjectForm
          projectformType="create"
          submitText="Create Project"
          initialValues={INIT_VAUES_PROJECTFORM}
          schema={FullCreate}
          onSubmit={projectFormOnSubmit}
          disabled={savingProject}
          buttonType="button"
        /> */}
        <ProjectForm />
      </div>
    </div>
  );
}

export default NewProjectPage