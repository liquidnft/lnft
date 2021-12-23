describe("/forgot-password", () => {
  it("successfully loads", () => {
    cy.visit("/forgot-password");
  });
  it("sends email", () => {
    cy.visit("/forgot-password");
    cy.get("input[placeholder=Email]").type("test@email.com", { force: true });
    cy.get(".primary-btn").click();
    cy.get("p").contains("Thank you");
  });
});
