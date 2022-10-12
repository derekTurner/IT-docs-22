## Destructure and Spread

Destructuing assignment is a way of unpacking values from arrays or properties from objects into discrete variables.

### Destructure

The array on the right hand side of the assigment is destructured into the variables on the left hand of the assignment.  The destructuring can cover the full array or partial array.

Destructuring an array, note that the fourth array element `true` is not destructured, but this does not cause an error.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const hero = ["Flash", 2000, "generate lightening", true];
let [a,b,c,d] = hero;

console.log(`name: ${a}, age: ${b}. ability: ${c}`);
```
</div>

The `...rest` can be used to capture the trailing section of the array 



<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const hero = ["Flash", 2000, "generate lightening", true];
let [a,,...d] = hero;

console.log(`name: ${a}, specifications: ${d}`);
```
</div>

Destructuring and object in its entirity. Note that `{ }` are used to destructure objects and `[ ]` to destructure arrays. For objects, destructure into variable names which match the property names.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const hero = {name:"Flash", age:2000, ability:"generate lightening", isActive:true};
let {name,age,ability,isActive} = hero;
console.log(`name: ${name}, specifications: ${age}, ability: ${ability}, isActive: ${isActive}`);
```
</div>

### Destructuring function return values

If a function returns an array or object these vlaues can be destructured in a consice syntax.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const nextFour = ((start)=> {return [start + 1, start + 2, start + 3, start + 4]});
let starter = 100; 

const [first, second, third, forth] = nextFour(starter);
console.log(first, second, third,forth);
```

</div>

### Rest parameters

By defining the parameters in a function definition using `...rest` an undefined number of parameters can be passed into the function.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const showInventory = ((...items) => {
  let count = 0;
  console.log(`${items.length} items in inventory`);
  for (let i in items){ console.log(`${i}: ${items[i]}`);}
});

showInventory("coin", "goblet", "coin", "urn", "plate");
showInventory("coin", "ring", "coin", "urn", "plate","goblet","chalice");
```

</div>

### Spread parameters

Spread syntax looks the same as rest syntax, but this allows an array to be spread into separate variables to match the parameters of a function.  The number of parameter passed must match.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const data = [1, 2, 7, 9, 5, 14];

let differences = ((a,b,c,d,e,f) => {
    return [b-a, c-b, d-c, e-d, f-e ];
});

console.log(differences(...data));
```

</div>


### Reference

[MDN spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
