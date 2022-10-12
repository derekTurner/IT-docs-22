## Modules

Modules provide a way to separate code into separate files.  The internal variables and function in each file are independant.  Two files could use the same counter `itemCounter` and there would be no clash.  

To make functions or variables useable between files there is an export and import process.

### Export

Exports can either be performed on individual properties and functions from a file, or they can be gathered into a single export statement.  In the first example module three properties are exported in separate statements.

```javascript
// characters1.js
export const name = "Flash";
export const age = 2000;
export const ability= "generate a ligntening stike";
```
In the second example module the function listcharacter is exported.

```javascript
// listcharacters.js
export const listcharacter = (name, age, ability) => { 
    return  `imported values ${name} is ${age} years old and has the ability to ${ability}`
};
```

### Import
For these two modules to be used they must be imported into a third file.  Although this does not export any modules it still is regarded as a module as it is isolated.  The file can't share any content with any other javascript file except by the export inport process.

```javascript
// importer.js
import { name, age, ability } from "./characters1.js";
import { listcharacter } from "./listCharacters1.js";

document.getElementById("output").innerHTML = listcharacter(name, age, ability);
```

### Example

When javascript files are running in a node runtime environment they stand alone and don't need any other files.  However to illustrate the use of these modules when javascript is running in a browser an html file is needed which will link to the importing javascript file.  I have named this importer.html.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>JS Modules demo 1</title>
    </head>
    <body>
        <h1>Importing character data</h1>
        <p id="output">Opening paragraph.</p>
    </body>
    <script type="module" src="./importer.js"></script>
</html>
```

This file features a paaraph with the text "Opening paragraph" which has an id = "output".  It is essential that the document object model which includes this element is established in the browser before javascript tries to access it.  One way to achieve this is to add the `<script>` tag linking to importer.js after the closing `</body>` tag.

The  innerHTML of the paragraph will  be changed to the output of the listcharacter function immediately as the importer.js runs.  This happens too quickly to see  the "Opening paragraph" text.  The resulting output is:

<iframe 
    height="200" 
    width="100%" 
    scrolling="no" 
    title="Hello.html" 
    src="Block_JS/section_4/importer.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>