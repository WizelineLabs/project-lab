import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to make a proposal", () => {
    const testProject = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentences(1),
    };
    cy.login();

    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /projects/i }).click();
    cy.findByText("Active Projects");

    cy.findByRole("link", { name: /new proposal/i }).click();

    cy.get("#name").type(testProject.name);
    cy.get("#description").type(testProject.description);
    cy.findByRole("button", { name: /submit/i }).click();

    cy.findByText(testProject.description);
  });
});
