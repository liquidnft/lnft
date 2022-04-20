import fastify from "fastify";
import fastifyStatic from "fastify-static";
import path from "path";

export const app = fastify();

app.register(fastifyStatic, {
  root: path.join("/export"),
  prefix: "/public/", // optional: default '/'
});

app.listen(8091, "0.0.0.0", function (err, address) {
  if (err) {
    console.log(err);
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
