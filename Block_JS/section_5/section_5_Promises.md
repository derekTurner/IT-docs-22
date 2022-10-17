## ES6

## Promise work in progress

Template strings allow long winded concatenation to be replaced with template substitutions.  These string literals use the `tick` rather than the 'apostrophe' or "speech mark".

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
var player = { name: "Flash", age: 2000, ability: "generate a ligntening stike" };

//Standard String Concatenation:
var string = player.name + " is " + player.age + " years old and is able to" + player.ability;

//Templated String
var string = `${player.name} is ${player.age} years old and has the ability to ${player.ability}`;
```

</div>

Usage inside a function;

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
var hero = { name: "Flash", age: 2000, ability: "generate a ligntening stike" };
var villain = { name: "Nemesis", age: 2001, ability: "absorb energy from lightening" };

//Templated String
function showPlayerDetails (player) { 
    var string = `${player.name} is ${player.age} years old and has the ability to ${player.ability}`;
    return string;
}
console.log(showPlayerDetails(hero));
console.log(showPlayerDetails(villain));
```

</div>

Template strings can include html elements and can print multiple lines as whitespace, newlines and indentation are reproduced. ( The console log cannot fully render this, but a document.write element would.)

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
var hero = { name: "Flash", age: 2000, ability: "generate a ligntening stike" };
var villain = { name: "Nemesis", age: 2001, ability: "absorb energy from lightening" };

//Templated String
function showPlayerDetails (player) { 
    var string = `<h1>${player.name} </h1>is ${player.age} years old 
        and has the ability to <em>${player.ability}</em>`;
    return string;
}
console.log(showPlayerDetails(hero));
console.log(showPlayerDetails(villain));
```

</div>