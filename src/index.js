//Create a web server that will use the express framework and express-session, with support for socket.io.
//The server should listen on port 8080 if the port is not specified.

//Import the express framework and express-session.
let express = require("express");
let session = require("express-session");
let ejs = require("ejs");
let fs = require("fs");
let path = require("path");

let app = express();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(express.json());

app.engine("html", ejs.renderFile);
app.set("view engine", "html");

const data_dir = path.resolve(`${process.cwd()}${path.sep}src`);
const template_dir = path.resolve(`${data_dir}${path.sep}templates`);

const renderTemplate = (res, req, template, data = {}) => {
  let baseData = {};

  res.render(
    path.resolve(`${template_dir}${path.sep}${template}`),
    Object.assign(baseData, data)
  );
};

//Load all the routers from /src/routers and mount them on the app.

//Get the list of routers from the routers directory.
let routers = fs.readdirSync(path.join(__dirname, "/routers"));

//For each router, import the router and mount it on the app.
routers.forEach((router) => {
  let routerName = router.replace(".js", "");
  let routerPath = path.join(__dirname, "/routers", router);
  let routerModule = require(routerPath);
  app.use(routerModule(app, renderTemplate));
});

app.use(express.static("src/static"));

// 404
app.use(function (req, res, next) {
  res.status(404);
  res.set("Cache-control", "no-cache, must-revalidate, max-age=0");
  renderTemplate(res, req, "404.ejs");
});

// 500
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500);
  renderTemplate(res, req, "500.ejs", {
    error: error,
  });
});

//Start the server.
app.listen(8080);
console.log("Server started on port 8080");
