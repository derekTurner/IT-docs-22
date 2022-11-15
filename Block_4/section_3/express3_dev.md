## Restful server

In the previous sections have shown the process of setting up general node projects and specifically express-generated projects and getting the platform working.

Now look at how the express application is developed to produce a restful interface.

In this section an express server app is set up with initial routing to respond to a GET request with a response message.

To have data to work with a mongo database is set up and initiallised with data.  To facilitate testing the database will be accessed by a mongo-express editor.  That will mean running programmes in two containers which can communicate together.

The stages which will follow in subsequent documents will develop the routes of the express server app to respond to a requested url and the http commands GET, POST, DELETE to facilitate 
Create, Read, Update, Delete operations on the database which will be rendered on the server.

A final stage will be to turn off server rendering and then return JSON data to a react application which can render the pages on the client.

## Starting a new environment

Express--2 will be used as the starter code for the next milestone which will be created in an new environment named Express--3.    Since the code is preserved in github it is not necessary to maintain the old development environments in docker, but I am saving them as milestones.

### Duplicate repository

The starting point for this is the express 1 code so I will copy this into a new repository named express--2 using the instructions at on [gitHub docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository). 

This will create a local copy of the express1 repository which is deleted at the end.  I found I had to delete this manually!

Start by creating a new public github repository express--3 with a not .gitignore file.

Create the local bare clone copy working in powershell;

> git clone --bare https://github.com/derekTurner/express--2.git

Move to the now local copy and Mirror push the thew repository

> cd express--2.git

> git push --mirror https://github.com/derekTurner/express--3.git

Then remove the local repository

> cd..

Manually remove the local copy of express--2.git which is probably in your users directory.

Now use docker desktop to create a new environment from the express--3 repository.

![Express 3 environment](create3.png)

The environment names will change each time they are created, but the repository name will always be the first item.  As you follow the notes you should substitute your own environment names.

## express--3

Open your new Express-3 environment in Visual studio code.

The code is loaded from github into a development environment which can be accessed by the 'node' username.

For me this is opening as root access.

```code
root@3165d4aa8563:/com.docker.devenvironments.code# 
```
However on other machines this may still open with node as the user.

```code
node@b846c088532a:/com.docker.devenvironments.code$
```

The node modules listed in package.json have not yet been loaded into the environment.  The installation of elements which are not in the devenvironments folder will need root access.

If you need to you can obtain root access a bash shell can be opened in the container using a docker command issued in a separate terminal  (either in a separate VSC terminal window or in the powershell app) I like powershell for this as it gives a sense of separation of tasks:

>  docker exec -u 0 -it flamboyant_perlman bash

```code
root@b846c088532a:/#
```
With Docker desktop 4.13.0 there is a new integrated terminal feature which accesses the root user without the need for a third party terminal.

![terminal](terminal.png)

Either way, as root user:

> cd com.docker.devenvironments.code

> cd myapp

> npm install

Take note of these steps as they will recur each time a new node environment is generated.

```code
npm WARN deprecated core-js@2.6.12: core-js@<3.23.3 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Some versions have web compatibility issues. Please, upgrade your dependencies to the actual version of core-js.

added 157 packages, and audited 158 packages in 6s

12 packages are looking for funding
  run `npm fund` for details

4 vulnerabilities (2 low, 2 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues, run:
  npm audit fix --force

Run `npm audit` for details.
```
> npm install core-js

```
up to date, audited 158 packages in 956ms

12 packages are looking for funding
  run `npm fund` for details

4 vulnerabilities (2 low, 2 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues, run:
  npm audit fix --force

Run `npm audit` for details.
```
Then to be complete:

> npm audit fix -- force

```code
p to date, audited 158 packages in 956ms

12 packages are looking for funding
  run `npm fund` for details

# npm audit report

clean-css  <4.1.11
Regular Expression Denial of Service in clean-css - https://github.com/advisories/GHSA-wxhq-pm8v-cw75
fix available via `npm audit fix`
node_modules/clean-css
  pug-filters  <=3.0.2
  Depends on vulnerable versions of clean-css
  node_modules/pug-filters

pug-code-gen  <2.0.3
Severity: high
Remote code execution via the `pretty` option. - https://github.com/advisories/GHSA-p493-635q-r6gr
fix available via `npm audit fix --force`
Will install pug@2.0.4, which is outside the stated dependency range
node_modules/pug-code-gen
  pug  0.1.0 - 2.0.0-rc.4
  Depends on vulnerable versions of pug-code-gen
  Depends on vulnerable versions of pug-filters
  node_modules/pug

4 vulnerabilities (2 low, 2 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues, run:
  npm audit fix --force
 ``` 
At express--2 we left pug at version 2 but now we will update this.

> npm install pug

```code
up to date, audited 158 packages in 647ms

12 packages are looking for funding
  run `npm fund` for details

4 vulnerabilities (2 low, 2 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
```
> npm audit fix --force

```code
npm WARN using --force Recommended protections disabled.
npm WARN audit Updating pug to 3.0.2, which is a SemVer major change.

added 6 packages, removed 30 packages, changed 19 packages, and audited 131 packages in 4s

12 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Pug is now at version 3 as shown in package.json

```json
{
  "name": "myapp",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "nodemon ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "core-js": "^3.26.0",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1",
    "nodemon": "^2.0.20",
    "pug": "^3.0.2"
  }
}
```

it is a good idea to set the root password to "node"

> root@3165d4aa8563:/com.docker.devenvironments.code/myapp# passwd

```code
New password: 
Retype new password: 
passwd: password updated successfully
```

You can now quit the bash shell. Or change to the node user.

>su node

### using http
If you use https the browser should require a certificate.  Browsers are becoming stricter and may require a certificate even for https on localhost.  That may lead to the application not connecting to the browser.

If this becomes a problem the formal fix is to create a certificate for localhost.

As a workaround just use http for localhost.  To do this you can add a console log line to **myapp/bin/www.js**

```javascript
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log(`Running on http://127.0.0.1:${port}`);
```

Note that the server port used by this script is **3000** not 8080 as was the case in the previous example!

This will generate an output to the terminal when npm run start is invoked later down these notes:

```code
> myapp@0.0.0 start
> nodemon ./bin/www

[nodemon] 2.0.20
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./bin/www`
Running on http://127.0.0.1:3000
GET / 304 103.559 ms - -
GET /stylesheets/style.css 304 2.328 ms - -
```
The http link is clickable and will open in the browser.



## Developing the app with basic routing

There is no database yet so routing is just to provide confirmatory messages for a couple of URLs.

### app.js

The file structure in express_app 3 is:

```code
 
\---myapp
    |   app.js
    |   package.json
    |   start.js
    |   
    +---bin
    |       www
    |       
    +---public
    |   +---images
    |   +---javascripts
    |   \---stylesheets
    |           style.css
    |           
    +---routes
    |       index.js
    |       users.js
    |       
    \---views
            error.pug
            index.pug
            layout.pug

```

Take a look at **app.js** section by section.

Node modules essential to operation are imported using the require function. These have already been called into the environment by npm install acting on the list of dependencies in package.json; so, no downloading is happening here.

[http-errors](https://www.npmjs.com/package/http-errors)  
[express](https://www.npmjs.com/package/express)  
[path](https://nodejs.org/api/path.html)  
[cookie-parser](https://www.npmjs.com/package/cookie-parser)  
[morgan](https://www.npmjs.com/package/morgan)

```javascript
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
```

Import the modules which are in the routes directory as index.js and users.js. These routes will be edited and used later.

```javascript
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
```

Create an instance of an express server object in the app variable using the express constructor. 

Then set up view templates by editing the properties of the app instance. First add the views directory to the app path. Then set the view engine to the choice made at the time of generating the project, which was [pug](https://pugjs.org/api/getting-started.html).

```javascript
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
```


The next functions call app.use() to add middleware which has already been imported into variables. So for example logger is an object imported from morgan.

The use of [express static](https://expressjs.com/en/starter/static-files.html) allows the server to serve static web pages from the folder listed. That allows for html pages, images, audio files etc to be served from the public directory. Other directories could also be added as required.

```javascript
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
```

Route handling code which has already been imported to variables indexRouter and usersRouter is added to the request handling chain of the express server named app.

Requests with a prefix /users such as users/list will be handled by the routes set up in the users file. Other files can be added to set up a complex rest API

```javascript
app.use("/", indexRouter);
app.use("/users", usersRouter);
```

Errors from asynchronous functions invoked by route handlers must be passed to the next function for [error handling](https://expressjs.com/en/guide/error-handling.html).

```javascript
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
```

Finally the app is fully configured. Exporting it allows it to be imported by .bin/www and the application can be started.

```javascript
module.exports = app;
```
## Routes

The contents of **routes/index.js**  have already been imported to the express server. When a GET request '/' is recieved a simple home page is rendered.

```javascript
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express monitored by Nodemon" });
});

module.exports = router;
```

The home page is rendered by response.render written as [res.render](http://expressjs.com/en/4x/api.html#res.render)(view \[, locals] \[, callback])
The view is defined by the template in **views/index.pug**

```pug
extends layout

block content
  h1= title
  p Welcome to #{title}
```

In a similar way any HTTP requests which come in to '/users' such as '/users/fred' or '/users/jane' will be served by the routes described in **route/users.js**

users.js does not render a page into the response, but simply sends a text message.

```javascript
var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
```

To see the output of the users route, with myapp2 running, browse to:

> localhost:3000/

![/](rootroute.png)

> localhost:3000/users

![user](users.png)


To see a 404 error browse to:

> localhost:3000/empty

![empty](empty.png)

At this point make sure that all changes for Express-3 are committed and synchronised and github for Express-3 is up to date.

> ctrl + C 

This closes the express app and you can then close the VSC code view and stop the current environment in docker desktop.

We will need in a later step to connect the express app to a data source, so we leave the express app for now and turn attention to the data source.

# Database and controller

In this section attention is turned to the database application.

An official **mongo database** image is supplied on [docker hub](https://hub.docker.com/_/mongo) providing a free and open-source cross-platform document-oriented database program. Classified as a [NoSQL](https://www.mongodb.com/nosql-explained) database program, MongoDB uses [JSON](https://www.json.org/)-like documents with [schemata](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1).



**Mongo-express** is described on docker hub as web-based MongoDB admin interface written in Node.js, Express.js, and Bootstrap3.  This is useful for us to investigate the database operation.

Initially the database and its admin interface will be run together and this section will not reference the express application which we have made.

To get this started a new environment will be created featuring both these two applications and at a later point we will make the step to run the database with the express server.

I note that the current version of mongodB is 6.0.2.  The current version of mongo-express is 0.54.0 (there is a 1.o version but this is only an alpha release).

Create a new public github repository named **mongo--1** project. Add a gitnore file as you work in github.com based on Node. Add the following initial file to the .docker directory and nothing else:

**.docker/docker-compose.yaml**

```yaml
# Use root/example as user/password credentials
version: "3.8"

services:
  mongodb:
    image: mongo:5.0
    restart: always
    container_name: mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: local_library
    volumes:
    - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    networks: 
      - mongo1_network
    ports: 
      - 27017:27017

  mongo-express:
    image: mongo-express:0.54.0
    restart: always
    container_name: mongo-express
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: example
      ME_CONFIG_MONGODB_AUTH_USERNAME: root
      ME_CONFIG_MONGODB_AUTH_PASSWORD: example
      ME_CONFIG_MONGODB_AUTH_DATABASE: local_library
      MONGODB_CONNSTRING: mongodb://root:example@mongodb:27017
      ME_CONFIG_MONGODB_SERVER: mongodb
      ME_CONFIG_MONGODB_PORT: 27017
#     ME_CONFIG_MONGODB_ENABLE_ADMIN: "true"
      ME_CONFIG_BASICAUTH_USERNAME: root
      ME_CONFIG_BASICAUTH_PASSWORD: example
    networks: 
      - mongo1_network 
  
    depends_on:
      - mongodb

networks:
  mongo1_network:
    driver: bridge
```
The [compose file](https://docs.docker.com/compose/) describes two services each built from named images on docker hub.  The required ports are exposed for use.  The version 3.8 denotes the version of docker compose which should be compatible with the docker engine version being used.  A compatibility table is available [here](https://docs.docker.com/compose/compose-file/) with the full compose file specification.


![mongo1 repository](compose.png)

In order to use this docker compose file you must ensure that compose V2 is selected in docker desktop.

![v2 selected](composeV2.png)




The volumes line in docker-compose.yaml includes reference to a file mongo-init.js which we hve not created yet.  This will be used to initialise the database.

```yaml

    volumes:
    - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro

```



## Create and populate a database

In this section I am following the tutorial example at [Mozilla developer](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose)

An app will be developed to administer a book library.

For this purpose the objects which need to be described in the database are:

1. Book: described by title author ISBN etc
2. BookInstance: The library can hold several copies of one book. When it is loaned each book instance will have a due date for return.
3. Author: name and birth/death dates
4. Genre: Crime, Sci-fi, Romance etc

The relationships between these are:

- 1 book may have 0..many instances
- 1..many books may be written by 1 author (ignore multiple authors for the time being)
- 0..many books may match 0..many genres (a book might fit more than one genre or defy categorisation)

This relationship is captured in the UML diagram:

![database uml](demo.png)

So examples of inital database entries would be:

Book:

- title:'The Name of the Wind (The Kingkiller Chronicle, #1)',
- summary:'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.',
- ISBN: '9781473211896',
- author: authors[0],
- genre: [genres[0],]

BookInstance

- book: books[0],
- imprint: 'London Gollancz, 2014.',
- due_back: false,
- status: 'Available'

Author:

- first_name:'Patrick',
- family_name:'Rothfuss',
- d_birth:'1973-06-06',
- d_death:false

Genre:  
name: "Fantasy"


### Populating the dataase


Docker provides a method to populate the database which is described in the environmental variables section of the docker hub [mongo page](https://hub.docker.com/_/mongo/).


This is referenced by the environment section of the docker compose file docker-compose.yml

```yml
environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: local_library
    volumes:
    - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
```

The environment variable MONGO_INITDB_DATABASE contains the name of the database which is required to be initialise. If this is omitted the default database will be 'db'.

When the docker compose file is read in the creation of the dev environment the volumes line will cause the file mongo-init to be copied into a reserved name mount point '/docker-entrypoint-initdb.d/'.

When the container is brought up, _if the database is empty,_ the scripts in the '/docker-entrypoint-initdb.d/' mountpoint will be run. Only one script is used in this example, but it is possible to use multiple scripts. These scripts can initialise the database.

Starting and stopping the app again does not cause the database to be altered.

Add a file **mongo-init.js** to the mongo1 github site which will initialise the data for the local-library database. Working through this file:

First set up variables, the database will have four collections as previously described, the data which is going into each of these will be stored to an array.

```javascript
let error = false;

let genres = [];
let authors = [];
let books = [];
let bookinstances = [];
```

Each container will need a function to allow data passed in to be added as a JSON object to the matching array. When the function is called it will also push the JSON data into the res array. No need to declare the res array, it is a keyword representing the response which the script will send to the database.
The overall strategy is to store command objects to the res array (in the correct order) and then output the response.

The function for the genre collection is simplest. The genre just has one name element.

```javascript
function genreCreate(name) {
  genredetail = { name: name };
  genres.push(genredetail);
  res.push(db.genre.insert(genredetail));
}
```

The contents of the res array are now defined.  

The first lines are commands to create the four empty connections. Note that although the database is called local_library, the reference in this file is still to the default database name 'db'.

```javascript
let res = [
  db.book.drop(),
  db.author.drop(),
  db.bookinstance.drop(),
  db.genre.drop(),
```

The next group of commands create the indexes for each of the collections. Note that you need the index name and a number, which in this example is always 1. If a field is to contain unique data this should be noted.

```javascript
  db.book.createIndex({ title: 1 },{ unique: true }),
  db.book.createIndex({ summary: 1 }),
  db.book.createIndex({ author: 1 }),
  db.book.createIndex({ isbn: 1 }),
  db.book.createIndex({ genre: 1 }),
```

The definition of res is now closed off

```javascript
]
```

The functions to create the data can now be called. For authors all the data is known, so the calls are straightforward.

```javascript
authorCreate("Patrick1", "Rothfuss", "1973-06-06", false);
```

For other collections, such as 'book' the related data needs to be included.

```javascript
bookCreate("The Wise Man's Fear ... the unassuming pub landlord.', '9788401352836', authors[0], [genres[0],]);
```

Note that this refers to authors[0], so the authorCreate() calls must all be done before the bookCreate() calls.
In an SQL database a reference authorID would be inserted here. However in a noSQL database every document must be complete and stand alone, so the full JSON object description is added at this point. If you request a book, you don't need to make another request to find out who the author is with authorID 'xxxx'.

Because a book could match zero to many genres, an array of the matching genre objects is included.

A noSQL database does not work with structured querey language, but it does have a structure and there are relationships between data elements.

The last stage is to hope for no errors and send the response to the database.

```javascript
printjson(res);

if (error) {
  print("Error, exiting");
  quit(1);
}
```

The *full listing* for **mongo-init.js** for the local_library tutorial is:

```javascript
let error = false;

let genres = [];
let authors = [];
let books = [];
let bookinstances = [];

function authorCreate(first_name, family_name, d_birth, d_death) {
  authordetail = {
    first_name: first_name,
    family_name: family_name,
    d_birth: null,
    d_death: null
  };
  if (d_birth != false) authordetail.d_birth = d_birth;
  if (d_death != false) authordetail.d_death = d_death;
  authors.push(authordetail);
  res.push(db.author.insert(authordetail));
}

function genreCreate(name) {
  genredetail = { name: name };
  genres.push(genredetail);
  res.push(db.genre.insert(genredetail));
}

function bookCreate(title, summary, isbn, author, genre) {
  bookdetail = {
    title: title,
    summary: summary,
    author: author,
    isbn: isbn,
    genre: null
  };
  if (genre != false) bookdetail.genre = genre;
  books.push(bookdetail);
  res.push(db.book.insert(bookdetail));
}

function bookInstanceCreate(book, imprint, due_back, status) {
  bookinstancedetail = {
    book: book,
    imprint: imprint,
    due_back: null,
    status: null
  };
  if (due_back != false) bookinstancedetail.due_back = due_back;
  if (status != false) bookinstancedetail.status = status;
  bookinstances.push(bookinstancedetail);
  res.push(db.bookinstance.insert(bookinstancedetail));
}

let res = [
  db.book.drop(),
  db.author.drop(),
  db.bookinstance.drop(),
  db.genre.drop(),

  db.book.createIndex({ title: 1 }, { unique: true }),
  db.book.createIndex({ summary: 1 }),
  db.book.createIndex({ author: 1 }),
  db.book.createIndex({ isbn: 1 }),
  db.book.createIndex({ genre: 1 }),

  db.author.createIndex({ first_name: 1 }),
  db.author.createIndex({ family_name: 1 }),
  db.author.createIndex({ d_birth: 1 }),
  db.author.createIndex({ d_death: 1 }),

  db.bookinstance.createIndex({ book: 1 }),
  db.bookinstance.createIndex({ imprint: 1 }),
  db.bookinstance.createIndex({ due_back: 1 }),
  db.bookinstance.createIndex({ status: 1 }),

  db.genre.createIndex({ name: 1 })
];

authorCreate("Patrick", "Rothfuss", "1973-06-06", false);
authorCreate("Ben", "Bova", "1932-11-8", false);
authorCreate("Isaac", "Asimov", "1920-01-02", "1992-04-06");
authorCreate("Bob", "Billings", false, false);
authorCreate("Jim", "Jones", "1971-12-16", false);

genreCreate("Fantasy");
genreCreate("Science Fiction");
genreCreate("French Poetry");

bookCreate(
  "The Name of the Wind (The Kingkiller Chronicle, #1)",
  "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
  "9781473211896",
  authors[0],
  [genres[0]]
);
bookCreate(
  "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
  "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
  "9788401352836",
  authors[0],
  [genres[0]]
);
bookCreate(
  "The Slow Regard of Silent Things (Kingkiller Chronicle)",
  "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.",
  "9780756411336",
  authors[0],
  [genres[0]]
);
bookCreate(
  "Apes and Angels",
  "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
  "9780765379528",
  authors[1],
  [genres[1]]
);
bookCreate(
  "Death Wave",
  "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
  "9780765379504",
  authors[1],
  [genres[1]]
);
bookCreate("Test Book 1", "Summary of test book 1", "ISBN111111", authors[4], [
  genres[0],
  genres[1]
]);
bookCreate(
  "Test Book 2",
  "Summary of test book 2",
  "ISBN222222",
  authors[4],
  false
);

bookInstanceCreate(books[0], "London Gollancz, 2014.", false, "Available");
bookInstanceCreate(books[1], " Gollancz, 2011.", "2020-06-06", "Loaned");
bookInstanceCreate(books[2], " Gollancz, 2015.", false, false);
bookInstanceCreate(
  books[3],
  "New York Tom Doherty Associates, 2016.",
  false,
  "Available"
);
bookInstanceCreate(
  books[3],
  "New York Tom Doherty Associates, 2016.",
  false,
  "Available"
);
bookInstanceCreate(
  books[3],
  "New York Tom Doherty Associates, 2016.",
  false,
  "Available"
);
bookInstanceCreate(
  books[4],
  "New York, NY Tom Doherty Associates, LLC, 2015.",
  false,
  "Available"
);
bookInstanceCreate(
  books[4],
  "New York, NY Tom Doherty Associates, LLC, 2015.",
  false,
  "Maintenance"
);
bookInstanceCreate(
  books[4],
  "New York, NY Tom Doherty Associates, LLC, 2015.",
  false,
  "Loaned"
);
bookInstanceCreate(books[0], "Imprint XXX2", false, false);
bookInstanceCreate(books[1], "Imprint XXX3", false, false);

printjson(res);

if (error) {
  print("Error, exiting");
  quit(1);
}
```

The file is added to github:

![mongo-init.js](mongo-init.png)

## Create a database dev environment 

Create the new environment in Docker desktop.

![create environment](createEnviron.png)

### troubleshooting

**VPN error**
I have a VPN connected on my machine.  This autostarts, but I normally switch it off.

If docker desktop is opened before the vpn has been closed it will make login credentials for registry-1.docker which will not work when the VPN is subsequently turned off.

This results in an error on port 443 related to registry-1.docker.  To fix this cancel the existing login from within powershell

>  docker logout registry-1.docker.io

```code
Removing login credentials for registry-1.docker.io
```
Now creating the environment runs.

The pull is completed and the environment is running:

![pulled](pulled.png)

Inspect the database at

> http://localhost:8081/



If the browser asks you to sign in.  The Username was set to root and the password to example.

![sign in](signin.png)


Note that the local_library database has been created:

![database running](databaseRunning.png)

View the local-library to see the collections: author, book, bookinstance and genre.

![collectionscreated](collectionscreated.png)

View the details of the authors collection

![authorspopulated](authorspopulated.png)

Double click an individual entry line to see the JSON object representation including a unique id.

![json author](rothfuss.png)

Step back in the browser till you return to the main editor menu and then view the book collection.  Notice that the documents in the book collection contain objects representing the full author details for each book.

![book details](bookcollection.png)

Note that the author field contains an object. Each object has a clickable icon. A small circle with a horizontal line. Click this to see the json view of that object.

Note that 'test book 1' had two genres attributed so you can see both represented as {}. Each inner object has a small circle icon with a cross to open the JSON view of that object.

Double click the 'test book 1' line to see how this is represented in JSON

![book with genres](testbook1.png)

Spend some time inspecting the data and check out the import export functions of mongo express.

You can add or update database entrie froom this editor.

When you have finished stop the dev environment.

## mongo 6 - not yet!

**MONGO 6**

If you change the mongodb version from 5.0 to 6.0 the first you will know about it is and error message which says mongo is unknown.  I tried this and from the code had used previously I tried removing

```yaml
    depends_on:
      - mongo
```
This was causing an unknown dependancy error

This pulls the dependant images and starts the environment and all initially looks well, however when you come to view the library it will offer an error.

```code
...
Network mongo--1-interesting_gates_mongo1_network  Creating
Network mongo--1-interesting_gates_mongo1_network  Created
Container mongodb  Creating
Container mongo-express  Creating
Container mongo-express  Created
Container mongodb  Created
Container mongodb  Starting
Container mongo-express  Starting
Container mongo-express  Started
Container mongodb  Started
```

![all set](allset.png)

Select "done" and continue.


In docker desktop create a new environment based on https://github.com.yourRepo/mongo1.


When the build is complete you will see that the environment starts two containers.  These will automatically be connected by a [docker network ](https://docs.docker.com/network/) for connecting between separate containers. and able to cross communicate.

The mongo express log can be seen by clicking the name on docker desktop.  This shows that there are a number of failed attempts to connect to mongodb, presumably this is while the database is starting, the end of the log shows success.

```code
Waiting for mongodb:27017...
Tue Nov  8 11:20:00 UTC 2022 retrying to connect to mongodb:27017 (2/5)
Tue Nov  8 11:20:01 UTC 2022 retrying to connect to mongodb:27017 (3/5)
Tue Nov  8 11:20:02 UTC 2022 retrying to connect to mongodb:27017 (4/5)
Tue Nov  8 11:20:03 UTC 2022 retrying to connect to mongodb:27017 (5/5)
Welcome to mongo-express
------------------------


Mongo Express server listening at http://0.0.0.0:8081
Waiting for mongodb:27017...
Tue Nov  8 11:20:05 UTC 2022 retrying to connect to mongodb:27017 (2/5)
Welcome to mongo-express
------------------------


Mongo Express server listening at http://0.0.0.0:8081
Database connected
Admin Database connected
```


Inspect the database at

> http://localhost:8081/


The browser asks you to sign in.  The Username was set to root and the password to example.

![sign in](signin.png)


Note that the local_library database has been created:



![unsupported](unsupported.png)

[Mongo 6.0 is a major update and some legacy code used by mongo-express 0.5 is not supported](https://www.mongodb.com/docs/v6.0/release-notes/6.0-compatibility/#legacy-opcodes-removed).  Since mongo-express 1.0 is still in alpha I suggest not using mongo 6 for the time being.

## exercise

Design and create your own database for a simple example.

## references

[How To Build a Node.js Application with Docker](https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker) sharks webpage

[express](https://expressjs.com/)

[How to create a REST API with Express.js in Node.js](https://www.robinwieruch.de/node-express-server-rest-api/)

[Creating a skeleton website](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website#app.js)

