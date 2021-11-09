describe("issue assets", () => {
  it("can issue assets", async () => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    let query = `query { artworks_aggregate {
      aggregate { count }
    }}`

  cy.request({
    method: "POST",
      body: { query },
      url: "https://mavennft.io/v1/graphql",
      headers: { "X-Hasura-Admin-Secret": "liquidart" },
    }).then((res) => {
      console.log(res);
      let next = res.body.data.artworks_aggregate.aggregate.count + 1;

      let j = 1;
      cy.fixture("files.json").then((files) => {
        files.map((file) => {
          for (let i = 0; i < 10; i++) {
            j++;
            let name = `Vida Verde Harvest Share ${j}`;
            let ticker = `HS${j}`;
            if (j < next) continue;

            cy.reload();

            cy.window().then((win) => {
              win.sessionStorage.removeItem("token");
              cy.request("POST", "https://mavennft.io/api/login", {
                email: "vidaverde",
                password: "liquidart",
              }).then((response) => {
                win.sessionStorage.setItem("token", response.jwt_token);
              });
            });

            // if (i > 0) cy.pause();

            cy.visit("https://mavennft.io/market");
            cy.contains("Submit a new").click({ force: true });

            //      cy.get("input[type=file]").attachFile(file);
            cy.fixture(file, { encoding: "base64" }).then((fileContent) => {
              cy.get("input[type=file]").attachFile({
                fileContent,
                fileName: file,
                mimeType: "video/mp4",
                encoding: "base64",
              });
            });

            cy.contains("Upload complete", { timeout: 10000 });

            cy.get('[placeholder*="title"]')
              .clear({ force: true })
              .type(name, { force: true });

            cy.wait(6000);
            cy.get("#ticker")
              .clear({ force: true })
              .type(ticker, { force: true });

            cy.get("button").contains("Submit").click({ force: true });

            if (j === next) {
              cy.get(".dialog").contains("Continue").click({ force: true });
            }

            cy.get(".text-3xl");
          }
        });
      });
    });
  });
});
