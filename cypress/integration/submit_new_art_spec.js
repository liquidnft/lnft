describe("Submit new artwork", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("token");
  });
  it("successfully works", () => {
    cy.visit("/market");
    cy.get("[data-cy=new-artwork]").click();
    cy.get("div").contains("Upload").attachFile("test_image.png");
    cy.get("input").contains("What's your artwork title?").type("testimage");
    cy.get(".primary-btn").click();
    //test not finished yet
  });
});
