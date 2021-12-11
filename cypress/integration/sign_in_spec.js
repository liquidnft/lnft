describe("/login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("greets with Sign In", () => {
    cy.contains("h2", "Sign In");
  });

  it("links to /register", () => {
    cy.contains("Don't have an account?").should(
      "have.attr",
      "href",
      "/register"
    );
  });

  it("links to /forgot-password", () => {
    cy.contains("Forgot password?").should(
      "have.attr",
      "href",
      "/forgot-password"
    );
  });

  it("requires email", () => {
    cy.get("form").contains("Sign In").click();
    cy.get("h2").should("contain", "Sign In");
  });

  it("requires password", () => {
    cy.get("[data-cy=user]").type("user", { force: true });
    cy.get("[data-cy=password]").type("", { force: true });
    cy.get(".primary-btn").click();
    cy.get("h2").should("contain", "Sign In");
  });

  it("requires valid username and password", () => {
    cy.get("[data-cy=user]").type("user", { force: true });
    cy.get("[data-cy=password]").type("password", { force: true });
    cy.get(".primary-btn").click();
    cy.get("h2").should("contain", "Sign In");
  });

  it("navigates to / on succussful login", () => {
    cy.get("[data-cy=user]").type("alice", { force: true });
    cy.get(".primary-btn").click();
    cy.get("img[key=alice]");
  });
});
