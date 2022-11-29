

# Library API

The object of the section is to take the express library app, developed in stand alone mode with server side rendering of HTML using pug views, and strip it back to a JSON REST API.

Then a react page is developed to replace the pug views and render the JSON on the client side.

## Duplicate repository

Create a new local folder named library--api and copy the folders, docker and myapp across together with mongo-init.js from express5 ready to start the next stage.

Start by creating a new public github repository libraryAPI with a node .gitignore file.

Create the local bare clone copy working in powershell;

> git clone --bare https://github.com/derekTurner/express--6.git

Move to the now local copy and Mirror push the thew repository

> cd express--6.git

> git push --mirror https://github.com/derekTurner/library--api.git

Then remove the local repository

> cd..

> rm -rf express--6.git

If necessary, manually remove the local copy of express--6.git which is probably in your users directory.

For the final version the API the mongo express database utility is not needed so compose-dev.yaml can be shortened to remove this.

The container names must be kept unique so I have changed these to an API suffix.

Also port 3000 has been used by react (and it is proving difficult to change the port for react) so I will change the server port to 3001.

Your compose file or compose-dev.yaml then becomes.

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
    
    container_name: serverAPI
    ports:
    - 3001:3001
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
    container_name: mongodbAPI
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

networks:
  mongo1_network:
    driver: bridge
```



## Check running app


Edit the  the connection string in app.js

```javascript
const mongoDB = 'mongodb://mongodbAPI:27017/local_library';
```

Make sure all other containers are not running and Docker create a new environment.

![create API environmment](createAPIenv.png)

On successful creation open serverAPI in vscode.

Change the root password to node

>passw

```code
New password: 
Retype new password: 
passwd: password updated successfully
```

>su node

>cd myapp

>npm install

```code
added 257 packages, and audited 258 packages in 6s

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
npm notice 
npm notice New major version of npm available! 8.19.2 -> 9.1.2
npm notice Changelog: https://github.com/npm/cli/releases/tag/v9.1.2
npm notice Run npm install -g npm@9.1.2 to update!
npm notice 
```

>npm run start

```code
> myapp@0.0.0 start
> nodemon ./bin/www

[nodemon] 2.0.20
[nodemon] reading config ./package.json
[nodemon] to restart at any time, enter `rs`
[nodemon] or send SIGHUP to 2049 to restart
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./bin/www`
[nodemon] forking
[nodemon] child pid: 2066
[nodemon] watching 33 files
express-validator: requires to express-validator/check are deprecated.You should just use require("express-validator") instead.
express-validator: requires to express-validator/filter are deprecated.You should just use require("express-validator") instead.
express-validator: sanitize(), sanitizeBody() and other sanitization-only middlewares have been deprecated.
Please use check(), body() and others instead, which must offer the same API, and more.
Running on http://127.0.0.1:3000
```

Despite the fact that this says 3000 it is actually running on 3001!  

This is because the port is forwarded from 3000 to 3001.  Check the port tab in visual studio.

![port forwarding](portForwarding.png)

Hang the mouse over the port display for more  details confirming the port forwarding.

Check that the catalog (and other)
pages are up and running.

![catalog page](catalog.png)

## REST JSON API


The LibraryAPI app can now be edited in stages to replace the calling of pug views with the sending of JSON responses.

In **controllers/bookController.js** edit the render statements in exports to index to res.send(results)

```javascript
exports.index = function(req, res) {   
    
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.send(results);
    });
};
```

View in browser:

> http://127.0.0.1:3001/catalog

![catalog JSON](catalograw.png)

JSON is returned

The firefox browser has a JSON header which provides a pretty view of this.

![catalogJSON](catalogJSON.png)



# Setting up a react developmemnt environment

Now the react client will be based on the consumejsonapi file. This will be copied into a repository named library--client and then adapted.

## Duplicate repository

Create a new local folder named library--client and copy the contents of consumejsonapi to this.

Start by creating a new public github repository libraryAPI with a node .gitignore file.

Create the local bare clone copy working in powershell;

> git clone --bare https://github.com/derekTurner/consumejsonapi.git

Move to the now local copy and Mirror push the thew repository

> cd consumejsonapi.git

> git push --mirror https://github.com/derekTurner/library--client.git

Then remove the local repository

> cd..

> rm -rf consumejsonapi.git




### note on 3000
There are a number of ways to [change the default port which react uses away from port 3000](https://www.cloudhadoop.com/reactjs-change-default-port/). 


Unfortunately none of them work in the docker environment, thats why I changed the server port number!

In theorey the plan to change the react port number should be:

The simplest reccomendation is to change the .env file.

It doesnt work so don't: Add a file named .env to the same folder as the package.json file (my-app) with contents:

```code
PORT=4000
```

Create a new docker environment:

![create library client](library--clientcreate.png)


(I found I needed to restart Docker to get this to create successfully.

Open library--client in vscode and set the password to 'node'

>passwd

```code
New password: 
Retype new password: 
passwd: password updated successfully
```
>cd my-app

>npm install

```
(#########⠂⠂⠂⠂⠂⠂⠂⠂⠂) ⠦ idealTree: timing idealTree Completed in 569ms

npm WARN deprecated stable@0.1.8: Modern JS already guarantees Array#sort() is a stable sort, so this library is deprecated. See the compatibility table on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#browser_compatibility
npm WARN deprecated svgo@1.3.2: This SVGO version is no longer supported. Upgrade to v2.x.x.

added 1467 packages, and audited 1468 packages in 2m

212 packages are looking for funding
  run `npm fund` for details

9 vulnerabilities (8 high, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
npm notice 
npm notice New major version of npm available! 8.19.2 -> 9.1.2
npm notice Changelog: https://github.com/npm/cli/releases/tag/v9.1.2
npm notice Run npm install -g npm@9.1.2 to update!
npm notice 
```

I am not going to chace these warnings at this point.


> su node

Make sure you are the node user here.

>npm run start

```code
Compiled successfully!

You can now view my-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://172.24.0.2:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```
Now browse to 

> http://127.0.0.1:3000

![contact listt](contact3000.png)


# Edit app to read json from api


In library--api **Library**/src/App.js** edit the fetch command.

```javascript
    fetch('http://jsonplaceholder.typicode.com/users')
```
to

```javascript
    fetch('http://localhost:3001/catalog')
```

Then in **src/components/contacts.js** change the details to be displayed.

```javascript
 // src/components/contacts.js

 import React from 'react'

 const Contacts = ({ contacts }) => {
  return (
    <div>
      <center><h1>Contact List</h1></center>
      {contacts.map((contact, index) => (
        <Card key={index}>
          <Card.Body>
            <Card.Text>{contact.book_count}</Card.Text>
            <Card.Text>{contact.book_instance_available_count}</Card.Text>
            <Card.Text>{contact.book_instance_counte}</Card.Text>
            <Card.Text>{contact.genre_count}</Card.Text>
            <Card.Text>{contact.book_count}</Card.Text>
          </Card.Body>
        </Card>

      ))}
    </div>
  )
};

 export default Contacts
```

This does not work ye because of CORS policy.

![cors](cors.png)

That is not a react issue, but a security feature so that only authorised sites may access the server.

  The express server on port 3001 will only respond to a call from localhost and not one from localhost:3000.  The object here is to prevent malicious use calling data from an unauthorised location.

The CORS policy of the express server needs to be added.  For our purpose we might allow the express server to be accessed from any location, which is the simplest case, but we could at a later date introduce a more fine grained approach where every response was given its own CORS policy.

The CORS module is normally used with [express server](https://expressjs.com/en/resources/middleware/cors.html). 

If a public api is required the CORS access should be unrestricted.  Some references suggest using an asterix as a wild card, but this does not work in all cases.


### Fixing CORS

**In Server API**

Stop the server

>ctrl + C

>npm install cors

```code
added 1 package, and audited 259 packages in 1s

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```
Within library--api  **myapp/routes/index.js**

Apply CORS to the get request which redirects to catalog.

```javascript
var express = require('express');
var router = express.Router();
var cors = require('cors');

router.use(cors());

// GET home page.
router.get('/', function(req, res) {
  res.redirect('/catalog');
});

module.exports = router;
```
Then for the library--api  **/myapp/routes/catalog js** add cors to the top of the file.

```javascript
var express = require('express');
var router = express.Router();
var cors = require('cors');

// Require controller modules.
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookinstanceController');

router.use(cors());
```
> http://localhost:3000

![type error](typeError.png)

This is not an error in the code.  This code previously recieved an array of JSON objects which it printed as a list, but now the response consists of a single JSON object.  This not being an array it does not have a .map() method associated with it.

We will tidy up by adding a new component to handle the single object and then the current component will be a template to use for the cases where an array is returned from the database.

### Customising components

In react--client  **/src/components**, make a copy of contacts.js and name this catalog.js

Modify the code to use a single JSON object.

```javascript
// src/components/catalog.js

import React from 'react';
import Card from 'react-bootstrap/Card';

const Catalog = ({ libCatalog }) => {
  return (
    <div>
      <center><h1>Local Library Home</h1></center>  
      <p>Welcome to Local Library a very basic Express website rendered by React</p>
      <p>&nbsp;</p>
      <center><h1>Dynamic Content</h1></center>
      <p>The library has the following record counts:</p>
      <Card>
          <Card.Body>
          <ul>
            <li><Card.Text>Books: {libCatalog.book_count}</Card.Text></li>
            <li><Card.Text>Copies: {libCatalog.book_instance_available_count}</Card.Text></li>
            <li><Card.Text>Copies Available: {libCatalog.book_instance_counte}</Card.Text></li>
            <li><Card.Text>Authors: {libCatalog.genre_count}</Card.Text></li>
            <li><Card.Text>Genres: {libCatalog.book_count}</Card.Text></li>
          </ul> 
          </Card.Body>
        </Card>
    </div>
  )
};

export default Catalog
```
This makes a new component for displaying the catalog.  A principle of React is that a component only does one thing, so we will need a seperate component to display the results of each database enquiry.  In other words we will be creating components which are equivalent to the pug views we used in the server side application.

The data to be displayed is passed in to the props of Catalog with property name libCatalog.

The react--client  **/src/App.js** will need to be ammended to use the catalog component rather than contacts.

```javascript
import {useState, useEffect} from 'react'
import Catalog from './components/catalog';

function App() {

  const [libCatalog, setlibCatalog] = useState([]);
  useEffect(() => {getCatalog();},[]);

  const getCatalog = () => {
    fetch('http://127.0.0.1:3001/catalog')
    .then(res => res.json())
    .then(
      (data) => {
        console.log ("data: ",data );
  
        setlibCatalog (data );
      },
      (error) => {
        console.log(error);
        setlibCatalog(null);
      }
    );
  };

 if (!libCatalog) return <div>No Record Found</div>;
  return (
    <Catalog libCatalog={libCatalog} />
  )
 
}  

export default App;
```
Note that libCatalog is a reactHook for the App function.


The data returned from the database is stored into the librCatalog state and this is then passed as a prop to the Catalog component.

![catalog](catalogReactClient.png)


At this point data flow from the database to react section) will be to develop the react application with routing and forms to match the views needed for the entire CRUD application

Take a pause here.  Stop the client and server and back up to github.

# References

## Local topics

### Port Changing
[Changing Default Port 3000 in create-react-app](https://tech.amikelive.com/node-830/reactjs-changing-default-port-3000-in-create-react-app/)

### Routing
 * How to handle routing with [react router](https://www.digitalocean.com/community/tutorials/how-to-handle-routing-in-react-apps-with-react-router)

## General react reading

A number of general references to consilidate or develop your React knowledge.  Please dip in an use the ones which you kind most useful.

* [W3cubDocs/React](https://docs.w3cub.com/react/) - not using react? This site's homepage offers a wide choice of topic.

* Digital Ocean: [how to code in react.js](https://www.digitalocean.com/community/tutorial_series/how-to-code-in-react-js)

* [Getting started with react](https://scotch.io/starters/react/getting-started-with-react-2019-edition?ref=home-start-here) (SCOTCH) Tutorials 1 - 33
* [A beginners guide to React with ES6](https://medium.com/the-andela-way/a-beginners-guide-to-react-with-es6-a2ed0b5c977e) (online of ebook)


## React Developer tools

* [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)
* [Google Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)