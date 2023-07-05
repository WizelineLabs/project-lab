/* eslint-disable jest-dom/prefer-in-document */
import { describe, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Labels from "../labels";
import { loader } from "../labels";
import "@testing-library/jest-dom";

describe("Labels test", () => {
  // mocking remix module to handle Loaders
  vi.mock("@remix-run/react", async () => {
    let remix: any = await vi.importActual("@remix-run/react");
    return {
      ...remix,
      // get useFetcher to return an idle state initially and an empty submit
      useFetcher: vi.fn().mockReturnValue({ state: "idle", submit: () => {} }),
      useLoaderData: vi.fn().mockReturnValue({
        labels: [
          {
            id: "12345",
            name: "Test Label",
          },
        ],
        projects: [],
      }),
      useTransition: vi.fn().mockReturnValue({
        type: "",
      }),
    };
  });
  vi.mock("remix-validated-form", async () => {
    const validateForm: any = await vi.importActual("remix-validated-form");
    return {
      ...validateForm,
      useFieldArray: vi.fn().mockReturnValue([
        [],
        {
          push: () => {},
        },
      ]),
      ValidatedForm: ({ children }: any) => <>{children}</>,
    };
  });
  // Mocking LabeledTextField as it is not tested here
  vi.mock("app/core/components/LabeledTextField", async () => {
    const LabeledTextField = "";
    return {
      default: LabeledTextField,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Path loader", async () => {
    let request = new Request(
      "http://localhost:3000/manager/filter-tags/labels"
    );

    const response = await loader({ request, params: {}, context: {} });

    expect(response).toBeInstanceOf(Response);
  });

  test("Labels from loader rendered", () => {
    render(<Labels />);
    expect(screen.getByText(/Test Label/i)).toBeDefined();
  });

  test("Delete button opens the delete modal", async () => {
    const deleteButton = userEvent.setup();
    render(<Labels />);
    expect(await screen.findByTestId("testLabelDelete")).toBeInTheDocument();
    await deleteButton.click(screen.getByTestId("testLabelDelete"));
    await waitFor(() => {
      expect(screen.getByTestId("deleteLabelModal")).toBeInTheDocument();
    });
  });

  test("Create button opens the create modal", async () => {
    const saveButton = userEvent.setup();
    render(<Labels />);
    expect(await screen.findByTestId("testLabelCreate")).toBeInTheDocument();
    await saveButton.click(screen.getByTestId("testLabelCreate"));
    await waitFor(() => {
      expect(screen.getByTestId("testCreateNewLabelModal")).toBeInTheDocument();
    });
  });
  test("Edit button opens the create modal", async () => {
    const saveButton = userEvent.setup();
    render(<Labels />);
    expect(await screen.findByTestId("testLabelEdit")).toBeInTheDocument();
    await saveButton.click(screen.getByTestId("testLabelEdit"));
    await waitFor(() => {
      expect(screen.getByTestId("testEditLabelModal")).toBeInTheDocument();
    });
  });
});
