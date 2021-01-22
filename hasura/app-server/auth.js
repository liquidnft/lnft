const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const { HASURA_JWT } = process.env;

const client = jwksClient({
  cache: true, // Default Value
  cacheMaxEntries: 5, // Default value
  cacheMaxAge: 600000, // Defaults to 10m
  jwksUri: JSON.parse(HASURA_JWT).jwk_url,
});

module.exports = {
  preValidation(req, res, done) {
    let fail = () => res.code(401).send("Unauthorized");
    if (!req.headers.authorization) fail();
    let token = req.headers.authorization.split(" ")[1];
    if (!token) fail();
    client.getSigningKeys((err, keys) => {
      if (err) fail();
      let key = keys[0].getPublicKey();
      try {
        req.token = jwt.verify(token, key);
        done();
      } catch (e) {
        console.log(e.message);
        fail();
      }
    });
  },
};
