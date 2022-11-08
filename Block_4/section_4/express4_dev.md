# Using mongoose to communicate between express and mongo

In this section we will modify the express app with the mongoose ORM and combine it into the same environment as the database by extending the docker-compose file.

This will be done by bringing all the relevant starter code together into a new github repository "Express-4" and editing the docker compose file to bring up three networked containers.

Working in a local folder, copy the ,docker folder and the mongo-init.js files from Mongo1 into a new folder Express-4 and add to this the myapp folder from Express-3.  (Take care not to copy the .git and .gitnore files across, these will be generated when a new repository is created. )


![express-4 starter files](express4starter.webp)


## Database communications

Communicating with an SQL database a user can either use native SQL commands or an intermediary programme which provides an Object Data Model ("ODM") / Object Relational Model ("ORM").

The native approach produces the fastest response from the database.
the
The model approach allows the app to be developed to work with a range of available databases using  same code.

The ODM used here to address the noSQL database Mongo is called Mongoose.

A [mongoose primer](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Mongoose_primer) is available from Mozilla developer.

## Mongoose

Mongoose will be added to the express app to allow it to communicate with the database.



These steps [are based on the tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose)

Update **myapp/package.json** will to add [mongoose](https://mongoosejs.com/) into the dependancies.

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
    "core-js": "^3.19.1",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1",
    "nodemon": "^2.0.14",
    "pug": "^3.0.2",
    "mongoose":"^6.0.13",
    "body-parser":"^1.19.0"
  },
  "nodemonConfig": {
    "delay": "1500",
    "verbose": "true"
  }
}
```

Open app.js and add code to setup the mongoose connection immediately below the reference to var app = express();

app.js (extract)
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

Note that the connection string for mongoDB is the database url many references describe localhost:27017/dbname.

As this example is developed we will launch both the database and the express application from a single docker compose file.  In this case docker creates a bridge network between the containers and the connection string format becomes mongodb://databaseContainerName:27017/applicationContainerName.  References to localhost will not work.  This is an essential point to note as it is make or break to connecting application and database.

To work with an Object Data Model we need to define objects which relate to the database.

![database uml](demo.png)

Now create a models folder within myapp and in this create each of author.js, book.js. bookinstance.js and genre.js.

```code
express_app3
  /myapp
    /models
       author.js
       book.js
       bookinstance.js
       genre.js
```
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

Create route handler callback functions in the folder controllers.

```
express_app3  
  /myapp  
    /controllers  
       authorController.js  
       bookController.js  
       bookinstanceController.js  
       genreController.js  
```

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

A routes folder already exists and contains index.js and users.js, add a new file **catalog.js** inside the routes folder. 

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
The Express-4 folder should now include

``` 
  .dockerDocker
    docker-compose.yaml
  /myapp  
    app.js
    start.js
    package.json
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
      /images
      /javascripts
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
mongo-init.js                 
```
## Launching containers using Docker Compose

In the previous section we used a docker compose file which launced the database and an editor in a single dev environment.  This must be modified to include the express server application.

Edit docker-compose.yml so that it will start this app, the mongo database and the mongo admin site.

The app container will start, but at this point it will need dependencies to be loaded.  This should be possible to do using a dockerfile in the future as more documentation becomes available for the docker developmemt environment preview.

**Docker Alert**

**To progress beyond this point it is necessary to rename the repository Express-4.  Docker does not start the server service if the repository name contains a capital letter, a minus sign, a hyphen or a number.  I have no idea why this is but by changing the repository from "Express-4" to "expressiv" the application below moves from failing to working!**

**More reasonably, Docker does not allow you to have two containers using the same name, this can be achieved by adding a version number to the container names: mongodb4, mongo-express4, server4.**

So adding the docker compose file to include a service named server4.

**docker-compose.yaml**


```yaml
# Use root/example as user/password credentials
version: "3.8"

services:
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
    networks: 
      - mongo1_network 
  
    depends_on:
      - mongo
      
  server:
    image: node
    restart: always
    
    container_name: server4
    ports:
    - 3000:3000
    environment:
      MONGODB_CONNSTRING: mongodb://root:example@mongodb:27017
    depends_on:
      - mongo
    networks: 
      - mongo1_network 

networks:
  mongo1_network:
    driver: bridge

```



I have set the version of the docker compose format to 3.8.  The syntax employed here requires at least version 3.2.  You can tell whether this is all compatible by looking at docker version in docker desktop.


![docker version](dockerversion.webp)



My machine has docker engine version 20.  On the docker website the [docker-compose](https://docs.docker.com/compose/compose-file/) format is discussed. The version 3.8 requires docker version 19.03.0 or greater.  Look through this reference to review some of the syntax for the docker compose file.

## Setting up the express-4 environment

Now from github desktop make a new github project **expressiv** cloning from the local Express-4 directory and adding a gitnore file appropriate to a node environment.


From docker desktop, create an new project.



![docker environment for express 4](express4Environment.webp)

Open the server 4 container in vscode from the docker desktop.

![container server 4](containerServer4.webp)

Note that the files impoorted match the  steps outlined above.

The database and its' editor should both be working as normal.

> http://localhost:8081/db/local_library/author

![still working](stillworking.webp)

and the editor and database will work as before.  However the server 4 environment will not have installed dependencies. 

To obtain root access a bash shell can be opened in the container using a docker command issued in a separate terminal  (either in a separate VSC terminal window or in the powershell app):

# Installing node modules as root user

>  docker exec -u 0 -it server4 bash

```code
root@8b2a7b8df766:/#
```
So, as root user:

> cd com.docker.devenvironments.code

> cd myapp

> npm install

```code
added 251 packages, and audited 252 packages in 1m

27 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
npm notice
npm notice New patch version of npm available! 8.1.2 -> 8.1.4
npm notice Changelog: https://github.com/npm/cli/releases/tag/v8.1.4
npm notice Run npm install -g npm@8.1.4 to update!
npm notice
```

No need to update for this small step in npm, so 

>exit

Exit the bash shell (you can discart this terminal now).
Return back to the VScode window for the container server 4 in the terminal there as the node user.

*Turns out I did not need to leave the container as at the moment the user in the container is root).*

>cd myapp

>npm start

```code

```

The app can be viewed in a browser at port 3000.

> http://localhost:3000/catalog

![catalog not implemented](catalog.webp)

> http://localhost:3000/catalog/authors

![catalog authors not implemented](catalogAuthors.webp)

## check operation of stack at this stage

View the admin site in the browser at port 8081 and check some of the data noting the unique id values.


Using this information check the following testing links.

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