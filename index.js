const Hapi = require("@hapi/hapi");
const MongoDB = require("mongodb");
const MongoClient = new MongoDB.MongoClient("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"], // an array of origins or 'ignore'
        headers: ["Authorization"], // an array of strings - 'Access-Control-Allow-Headers'
        exposedHeaders: ["Accept"], // an array of exposed headers - 'Access-Control-Expose-Headers',
        additionalExposedHeaders: ["Accept"], // an array of additional exposed headers
        maxAge: 60,
        credentials: true // boolean - 'Access-Control-Allow-Credentials'
      }
    }
  });
  const connection = await MongoClient.connect();

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello World!";
    }
  });

  server.route({
    method: "GET",
    path: "/storefronts",
    handler: async (request, h) => {
      const storefronts = await connection
        .db("puppet-scrape")
        .collection("weedmaps.com/storefronts")
        .find({})
        .toArray();
      return storefronts;
    }
  });

  server.route({
    method: "GET",
    path: "/storefronts/{slug}",
    handler: async (request, h) => {
      const storefronts = await connection
        .db("puppet-scrape")
        .collection("weedmaps.com/storefronts")
        .find({ slug: request.params.slug })
        .toArray();
      return storefronts;
    }
  });

  server.route({
    method: "GET",
    path: "/brands",
    handler: async (request, h) => {
      const brands = await connection
        .db("puppet-scrape")
        .collection("weedmaps.com/brands")
        .find({})
        .toArray();
      return brands;
    }
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
})();

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});
