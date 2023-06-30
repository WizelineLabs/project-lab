/* eslint-disable jest-dom/prefer-in-document */
import { describe, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InnovationTiers, { loader } from "../innovation-tiers";
import "@testing-library/jest-dom";

describe("Innovation Tiers test", () => {
  // mocking remix module to handle Loaders
  vi.mock("@remix-run/react", async () => {
    const remix: any = await vi.importActual("@remix-run/react");
    return {
      ...remix,
      // get useFetcher to return an idle state initially and an empty submit
      useFetcher: vi.fn().mockReturnValue({ state: "idle", submit: () => ({}) }),
      useLoaderData: vi.fn().mockReturnValue({
        innovationTiers: [
          {
            id: "12345",
            name: "Test Innovation Tier",
            requisites: "Test requsitees",
            goals: "Test goals",
            benefits: "Test benefits",
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
          push: () => ({}),
        },
      ]),
      ValidatedForm: ({ children }: any) => <>{children}</>,
    };
  });

  vi.mock("app/core/components/InputSelect", async () => {
    return {
      InputSelect: "",
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
    const request = new Request(
      "http://localhost:3000/manager/filter-tags/innovation-tiers"
    );

    const response = await loader({ request, params: {}, context: {} });

    expect(response).toBeInstanceOf(Response);
  });

  test("Innovation tiers renders Tiers from loader", () => {
    render(<InnovationTiers />);
    expect(screen.getByText(/Test Innovation Tier/i)).toBeDefined();
  });

  test("Delete button opens the delete modal", async () => {
    const deleteButton = userEvent.setup();
    render(<InnovationTiers />);
    expect(
      await screen.findByTestId("testInnovationDelete")
    ).toBeInTheDocument();
    await deleteButton.click(screen.getByTestId("testInnovationDelete"));
    await waitFor(() => {
      expect(screen.getByTestId("deleteTierModal")).toBeInTheDocument();
    });
  });

  test("Create button opens the create modal", async () => {
    const saveButton = userEvent.setup();
    render(<InnovationTiers />);
    expect(
      await screen.findByTestId("testInnovationCreate")
    ).toBeInTheDocument();
    await saveButton.click(screen.getByTestId("testInnovationCreate"));
    await waitFor(() => {
      expect(screen.getByTestId("testCreateTierModal")).toBeInTheDocument();
    });
  });
});
