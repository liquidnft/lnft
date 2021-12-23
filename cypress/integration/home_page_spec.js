describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.visit("/");
  });

  it("links to /market", () => {
    cy.contains("Start exploring").should(
      "have.attr",
      "href",
      "/market"
    );
  });


    it("links to /market", () => {
      cy.contains("View gallery").should(
        "have.attr",
        "href",
        "/market"
      );
    });

    it("links to /activity", () => {
      cy.contains("View more").should(
        "have.attr",
        "href",
        "/activity"
      );
    });
});
