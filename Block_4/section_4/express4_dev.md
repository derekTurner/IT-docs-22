# Using mongoose to communicate between express and mongo

In this section we will modify the express app with the mongoose ORM and combine it into the same environment as the database by extending the docker-compose file.

This will be done by creating a copy of express--3 in a new repository express--4.  This can be cloned locally to allow editing of the contents.

The locally edited code will be comitted and synchronised back to express--4 to create a new environment starter..

The new starter will then include a modified  docker compose file which will be used during environment creation create bring up three networked containers.

The local clone can be discarded once the new development environment is up and running.

## Duplicate repository

The starting point for this is the express 3 code so I will copy this into a new repository named express--4 using the instructions at on gitHub docs.

This will create a local copy of the express3 repository which is deleted at the end. 

Start by creating a new public github repository express--4 with a node .gitignore file.

![new repository](newrepo.png)

Create the local bare clone copy working in powershell;

> git clone --bare https://github.com/derekTurner/express--3.git

Move to the now local copy and Mirror push the thew repository

>cd express--3.git

> git push --mirror https://github.com/derekTurner/express--4.git

Then remove the local repository

> cd..

> rm -rf express--3.git

If necessary, manually remove the local copy of express--3.git which is probably in your users directory.

Now clone express--4 to a local folder for working.   Make sure you use a lower case 'e' for express--4 a capital letter here will cause problems!  

Working in powershell make a github directory ready to receive the cloned site.  I will be working in the documents folder.

If you have github desktop then you can use that to create the local clone, but here I am using a git command.

> cd documents

> mkdir github

> cd github

> git clone https://github.com/derekTurner/express--4

```code
Cloning into 'express--4'...
remote: Enumerating objects: 66, done.
remote: Counting objects: 100% (66/66), done.
remote: Compressing objects: 100% (37/37), done.
remote: Total 66 (delta 16), reused 66 (delta 16), pack-reused 0Receiving objects:  37% (25/66)
Receiving objects: 100% (66/66), 43.33 KiB | 887.00 KiB/s, done.
Resolving deltas: 100% (16/16), done.
```

Open the new cloned site in Visual Studio Code.  **Note** that you are now looking at a local copy and note code inside a docker container.

![cloned site](clonedsite.png)

![express-4 starter files](express4starter.webp)


## Database communications

Communicating with an SQL database a user can either use native SQL commands or an intermediary programme which provides an Object Data Model ("ODM") / Object Relational Model ("ORM").

The native approach produces the fastest response from the database.
the
The model approach allows the app to be developed to work with a range of available databases using  same code.

The ODM used here to address the noSQL database Mongo is called [Mongoose](https://mongoosejs.com/).

A [mongoose primer](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Mongoose_primer) is available from Mozilla developer.

## Mongoose

Mongoose will be added to the express app to allow it to communicate with the database.

The current version of Mongoose is 6.7.2


These steps [are based on the tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose)

Update **myapp/package.json** to add [mongoose](https://mongoosejs.com/) into the dependancies.

I have also added configuration for nodemon and a dependency of body-parser, which will be useful later on.

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
    "pug": "^3.0.2",
    "mongoose":"^6.7.2",
    "body-parser":"^1.20.1"
  },
  "nodemonConfig": {
    "delay": "1500",
    "verbose": "true"
  }
}
```

Open app.js and add code to setup the mongoose connection immediately below the reference to var app = express();

**myapp/app.js** (extract)
```javascript
var app = express();
//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb://root:example@mongodb:27017';
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
```

Note the format of the connection string for mongoDB.  This may be differentif not using docker, generally it the database url many references describe localhost:27017/dbname.

As this example is developed we will launch both the database and the express application from a single docker compose file.  In this case docker creates a bridge network between the containers and the connection string format becomes mongodb://databaseContainerName:27017/applicationContainerName.  References to localhost will not work.  This is an essential point to note as it is make or break to connecting application and database.

To work with an Object Data Model we need to define objects which relate to the database.

![database uml](demo.png)

Now create a models folder within myapp and in this create each of author.js, book.js. bookinstance.js and genre.js.

![models](models.png)

The files should be completed as:

**author.js**

```javascript
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
  return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);
```

book.js

```javascript
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}]
  }
);

// Virtual for book's URL
BookSchema
.virtual('url')
.get(function () {
  return '/catalog/book/' + this._id;
});

//Export model
module.exports = mongoose.model('Book', BookSchema);
```

bookinstance.js

```javascript
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bookinstance/' + this._id;
});

//Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
```
genre.js

```javascript
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema(
  {
    name: {type: String, required: true}
  }
);

// Virtual for genre's URL
GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/genre/' + this._id;
});

//Export model
module.exports = mongoose.model('Genre', GenreSchema);
```
## Routes and contollers

With models set the next thought is decide what routes will be needed and then implement controllers for these routes.

This section is based on the tutorial on [Routes and controllers](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes)


In setting up routes we are effectively designing the restful API for the server side of the application.
The URLs that will be needed to access the library data are planned out thinking of the desired CRUD operations.

* catalog/   URL for the index page

* *catalog \<objects>*  
catalog/books  
catalog/authors  
catalog/genres  
catalog/bookinstances  

* *catalog/\<object>/\<id>*  
catalog/book/5899af...23A  
catalog/author/5749af...25A  
catalog/genre/5823af...2AB  
catalog/bookinstance/4799af...63A  

* *catalog/\<object>/create*  
catalog/book/create  
catalog/author/create  
catalog/genre/create  
catalog/bookinstance/create  

* *catalog/\<object>/\<id>update*  
catalog/book/5899af...23A/update  
catalog/author/5749af...25A/update  
catalog/genre/5823af...2AB/update  
catalog/bookinstance/4799af...63A/update  

* *catalog/\<object>/\<id>delete*  
catalog/book/5899af...23A/delete   
catalog/author/5749af...25A/delete   
catalog/genre/5823af...2AB/delete  
catalog/bookinstance/4799af...63A/delete   


Now need route handlers for grouped according to resource type. 

Create route handler callback functions in a new folder named controllers.

```
Express--4 
  /myapp  
    /controllers  
       authorController.js  
       bookController.js  
       bookinstanceController.js  
       genreController.js  
```

![controllers](controllers.png)

**authorController.js**

```javascript
var Author = require('../models/author');

// Display list of all Authors.
exports.author_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Author list');
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
```
**bookinstanceController.js**

```javascript
var BookInstance = require('../models/bookinstance');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance list');
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance detail: ' + req.params.id);
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};
```

**genreController.js**

```javascript
var Genre = require('../models/genre');

// Display list of all Genre.
exports.genre_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre list');
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre detail: ' + req.params.id);
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST.
exports.genre_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create POST');
};

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
```

**bookController.js**

Has an extra index() function to display a site welcome page.

```javascript
var Book = require('../models/book');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all books.
exports.book_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Book list');
};

// Display detail page for a specific book.
exports.book_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};
```

We now need routes which will link URLs to the controllers.

A routes folder already exists and contains index.js and users.js, add a new file **routes/catalog.js** using the routes folder. 

```javascript
var express = require('express');
var router = express.Router();

// Require controller modules.
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookinstanceController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', book_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create', book_controller.book_create_get);

// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);

// GET request to delete Book.
router.get('/book/:id/delete', book_controller.book_delete_get);

// POST request to delete Book.
router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', book_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail);

// GET request for list of all Book items.
router.get('/books', book_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// POST request for creating BookInstance. 
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/bookinstances', book_instance_controller.bookinstance_list);

module.exports = router;
```

Edit the existing **index.js** to redirect the index page to the index created at path /catalog.

```javascript
// GET home page.
router.get('/', function(req, res) {
  res.redirect('/catalog');
});
```
The use of the redirect() method will send HTTP status code "302 Found".

The last step in setting up routes is to add them into **app.js** below existing routes.

```javascript
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site
```

and also in app.js

```javascript
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.
```
These routes don't yet access the database but should print messages to show they are working.

The complete listing of app.js at this point is

```javascript
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

var app = express();
//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb://root:example@mongodb:27017';
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

```
The express--4 folder should now include

``` 
  .docker
    config.json
  /myapp  
    /bin
      www
    /controllers  
       authorController.js  
       bookController.js  
       bookinstanceController.js  
       genreController.js  
    /models
       author.js
       book.js
       bookinstance.js
       genre.js 
    /public
      /stylesheets
    /routes
      catalog.js
      index.js
      users.js  
    /views
      error.pug
      index.pug
      layout.pug  
  app.js
  package-lock.json
  package.json
.gitnore 
compose-dev.yaml
                 
```
## Launching containers using Docker Compose

In the previous section we used a docker compose file which launced the database and an editor in a single dev environment.  This must be modified to include the express server application.

I will edit docker-compose.yml so that it will start this app, the mongo database and the mongo admin site.



**Docker Alert**


**Docker does not allow you to have two containers using the same name, this can be achieved by adding a version number to the container names: mongodb4, mongo-express4, server4.**

*I spent a l-o-n-g time getting this next file to work and a key factor is the order in which you declare the services.  If you declare the database services then the eventual docker environment will run node 12 and the app will fail.  If you declare the server first the docker environment will run node 19 and the app will work!*

Note also that from docker version 4.13 you do not need to have files in the .docker folder, but rather the environment reads compose-dev.yaml in the root directory.  Since I have version 4.13.1 this is the way I have gone.

So editing the docker compose file to include a service named server4.

You can delete the file compose-dev.yaml then create a new docker-compose file in the .docker folder or compose-dev.yaml not in the docker folder as noted.

Delete .docker/config.json it's function will be replaced by the compose file.

**compose-dev.yaml** or .docker/docker-compose.yaml


```yaml
# Use root/example as user/password credentials
version: "3.8"

services:
  server:
    entrypoint:
    - sleep
    - infinity
    image: node:latest
    init: true
    volumes:
    - type: bind
      source: /var/run/docker.sock
      target: /var/run/docker.sock
    # build:
    #  context: myapp
    restart: always
    
    container_name: server4
    ports:
    - 3000:3000
    environment:
      MONGODB_CONNSTRING: mongodb://root:example@mongodb:27017
    depends_on:
      - mongodb
    networks: 
      - mongo1_network
    # command: ["npm", "run", "start"]  

  mongodb:
    image: mongo:5.0
    restart: always
    container_name: mongodb4
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
    container_name: mongo-express4
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
      # ME_CONFIG_MONGODB_ENABLE_ADMIN: "true"
      ME_CONFIG_BASICAUTH_USERNAME: root
      ME_CONFIG_BASICAUTH_PASSWORD: example
    depends_on:
      - mongodb  
    networks: 
      - mongo1_network 
      


networks:
  mongo1_network:
    driver: bridge
```



I have set the version of the docker compose format to 3.8.  The syntax employed here requires at least version 3.2.  You can tell whether this is all compatible by looking at docker version in docker desktop.


![docker version](dockerengine.png)



The current docker engine version is 20.  On the docker website the [docker-compose](https://docs.docker.com/compose/compose-file/) format is discussed. The version 3.8 requires docker version 19.03.0 or greater.  Look through this reference to review some of the syntax for the docker compose file.

## Initialise the database

When working on mongo--1 the mongo-init.js file was added to the root of the folder.

Copy this across into express--4

**mongo-init.js**
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

The preparations are now laid.  Commit these changes and **synchronise to github**.

Provided that there are no errors, your local copy of express-4 can be deleted. (Keep it for now, just in case there are errors!).



## Create the express-4 environment

From docker desktop, create an new development environment

![create environment](createexpress--4.png)


![docker environment for express 4](express4Environment.png)

Open the server 4 container in vscode from the docker desktop.

![container server 4](server4run.png)

Note that the files impoorted match the  steps outlined above.

Set the root password to "node" follow which user is used as below (not sure if this is essential, but it works!).

Now to install dependencies.  

>node@3f6d4c7e7674:/com.docker.devenvironments.code/myapp$ npm install

```code
added 252 packages, and audited 253 packages in 14s

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
npm notice 
npm notice New major version of npm available! 8.19.2 -> 9.1.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v9.1.1
npm notice Run npm install -g npm@9.1.1 to update!
npm notice 
```
Ok so updating this:

>root@3f6d4c7e7674:/com.docker.devenvironments.code/myapp# npm install -g npm@9.1.1

```code
removed 13 packages, changed 74 packages, and audited 223 packages in 5s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```
Now the app can be started:

>root@3f6d4c7e7674:/com.docker.devenvironments.code/myapp# su node

>node@3f6d4c7e7674:/com.docker.devenvironments.code/myapp$ npm run start

```code
> myapp@0.0.0 start
> nodemon ./bin/www

[nodemon] 2.0.20
[nodemon] reading config ./package.json
[nodemon] to restart at any time, enter `rs`
[nodemon] or send SIGHUP to 17098 to restart
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./bin/www`
[nodemon] forking
[nodemon] child pid: 17111
[nodemon] watching 20 files
Running on http://127.0.0.1:3000
```

The database and its' editor should both be working as normal. (using username root and password example)

> http://localhost:8081/db/local_library/author

![still working](stillworking.png)

and the editor and database will work as before.  

The app can be viewed in a browser at port 3000.  I have gone over to edge because firefox was so fussy about lot liking http.

> http://localhost:3000/catalog

![catalog not implemented](catalog.png)

> http://localhost:3000/catalog/authors

![catalog authors not implemented](catalogAuthors.png)

## check operation of stack at this stage

View the admin site in the browser at port 8081 and check some of the data noting the unique id values.


Using this information check the following testing links which should all give the appropriate "not implemented" message.

[catalog/](http://localhost:3000/catalog)   

 
[catalog/books](http://localhost:3000/catalog/books)  
[catalog/authors](http://localhost:3000/catalog/authors)  
[catalog/genres](http://localhost:3000/catalog/genres)  
[catalog/bookinstances](http://localhost:3000/catalog/bookinstances)  


[catalog/book/:id](http://localhost:3000/catalog/book/5dc21650ae5da3ca57ebc53d)  
[catalog/author/:id](http://localhost:3000/catalog/author/5dc21650ae5da3ca57ebc535)  
[catalog/genre/:id](http://localhost:3000/catalog/genre/5dc21650ae5da3ca57ebc53a)  
[catalog/bookinstance/:id](http://localhost:3000/catalog/bookinstance/5dc21650ae5da3ca57ebc544)  

 
[catalog/book/create](http://localhost:3000/catalog/book/create)  
[catalog/author/create](http://localhost:3000/catalog/author/create)  
[catalog/genre/create](http://localhost:3000/catalog/genre/create)  
[catalog/bookinstance/create](http://localhost:3000/catalog/bookinstance/create)  


[catalog/book/:id/update](http://localhost:3000/catalog/book/5dc21650ae5da3ca57ebc53d/update)  
[catalog/author/:id/update](http://localhost:3000/catalog/author/5dc21650ae5da3ca57ebc535/update)  
[catalog/genre/:id/update](http://localhost:3000/catalog/genre/5dc21650ae5da3ca57ebc53a/update)  
[catalog/bookinstance/:id/update](http://localhost:3000/catalog/bookinstance/5dc21650ae5da3ca57ebc544/update)  


[catalog/book/:id/delete](http://localhost:3000/catalog/book/5dc21650ae5da3ca57ebc53d/delete)  
[catalog/author/:id/delete](http://localhost:3000/catalog/author/5dc21650ae5da3ca57ebc535/delete)  
[catalog/genre/:id/delete](http://localhost:3000/catalog/genre/5dc21650ae5da3ca57ebc53a/delete)  
[catalog/bookinstance/:id/delete](http://localhost:3000/catalog/bookinstance/5dc21650ae5da3ca57ebc544/delete) 


Next step will be to implement these routes.