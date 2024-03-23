import { faker } from "@faker-js/faker";

describe("Form Page Tests", () => {
  afterEach(() => {});

  it("should display the application form with all required fields", () => {
    cy.login();

    cy.visitAndCheck("/applicationForm/1");

    cy.get('input[name="personalEmail"]').should("exist");
    cy.get('input[name="fullName"]').should("exist");
    cy.get('input[name="nationality"]').should("exist");
    cy.get('input[name="dayOfBirth"]').should("exist");
    cy.get('input[name="homeAddress"]').should("exist");
    cy.get('input[name="phone"]').should("exist");
    cy.get('[aria-labelledby="country"]').should("exist");
    cy.get('[role="combobox"]').should("exist");
    cy.get('input[name="startDate"]').should("exist");
    cy.get('input[name="endDate"]').should("exist");
    cy.get('input[name="hoursPerWeek"]').should("exist");
    cy.get("#Form-Button").should("exist");
    cy.get('[aria-labelledby="howDidYouHearAboutUs"]').should("exist");
    cy.get('[aria-labelledby="participatedAtWizeline"]').should("exist");
  });
});
