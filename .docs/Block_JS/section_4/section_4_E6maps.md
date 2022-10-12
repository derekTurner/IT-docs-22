## Maps

Maps are data structures which like Objects hold name value pairs, but they have some key features which distinguishes them from Objects. (You can see Maps as being a refinement of associative arrays).

-   Maps have no default keys so there is no chance of a naming conflict between default keys and our own.
-   Maps keys can be of any type, objedt keys must be strings or symbols.
-   Maps are ordered as entries are made and directly iterable.
-   Maps have a size property
-   Map entries are manipulated using `set()`, `get()` and `delete()` and may be interrogated by `has()`.

### Map set and get

This allows an array to be created from an object with a length or which is iterable using forEach.

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const points = new Map;

points.set("coin",10);
points.set("goblet",15);
points.set("plate",20);
points.set("urn",30);
points.set("chalice",40);
points.set("ring",65);

const listPoints = ((value, key, map) => {console.log(`map.get('${key}') = ${value}`);});

points.forEach(listPoints)

```
</div>

The points per item can now be combined with an inventory to work up a points tally.


<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const points = new Map;

points.set("coin",10);
points.set("goblet",15);
points.set("plate",20);
points.set("urn",30);
points.set("chalice",40);
points.set("ring",65);

const pointInventory = ((points, ...items) => {
let count = 0;
let totalPoints = 0;
console.log(`${items.length} items in inventory`);
for (let i in items){ console.log(`${i}: ${items[i]}`);
  totalPoints += points.get(items[i]);
}
return totalPoints
});

pointInventory(points,"coin", "ring", "coin", "urn", "plate","goblet","chalice");
```
</div>



### Sets

An set is a collection of unique items of any type.  Items are added by `add()` , removed by `delete()` and interrogated by `has()`, iteration can be done by `for of`. 

Even though a set is a constant object you can still add to its contents.

Sets are the stuff of venn diagrams and set operations are `isSuperset()`, `union()`, `intersection()`, `difference()`, `symmetricDifference()`, 

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const gold   = new Set(["coin", "chalice", "ring", "urn", "plate"]);
const silver = new Set(["coin", "goblet", "ring", "urn"]);
const pewter = new Set([ "plate","bowl","urn"]);

console.log (`pewter set size ${pewter.size}`);
pewter.add("jug");
console.log (`pewter set size ${pewter.size}`);

if (pewter.has("jug")) console.log("pewter jug is in the set");

for (const item of silver){console.log(`silver ${item}`)};
```
</div>

The set operations are then illustrated.


WORKING ON THIS

<div
  data-runkit
  data-runkit-evaluate-on-load="true"
  data-runkit-gutter-style="none"
  data-runkit-node-version="18"
>

```javascript
const gold   = new Set(["coin", "chalice", "ring", "urn", "plate"]);
const silver = new Set(["coin", "goblet", "ring", "urn"]);
const pewter = new Set([ "plate","bowl","urn"]);

function isSuperset(set, subset) {
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

function union(setA, setB) {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

function intersection(setA, setB) {
  const _intersection = new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

function symmetricDifference(setA, setB) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    if (_difference.has(elem)) {
      _difference.delete(elem);
    } else {
      _difference.add(elem);
    }
  }
  return _difference;
}

function difference(setA, setB) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

const listMembers = ((value, key, map) => {console.log(`map.get('${key}') = ${value}`);});

isSuperset(pewter, gold).forEach((value) => console.log(value));  
console.log(`union ${(union(pewter, gold))}` )       ;        
console.log(`intersection ${intersection(pewter, gold)}`  )  ;   
console.log(`symmetricDifference ${symmetricDifference(pewter, gold)}` );
console.log(`difference ${difference(pewter, gold)}`  )     ;     
```
</div>



### Reference

[W3schools maps](https://www.w3schools.com/js/js_object_maps.asp)
[MDN sets](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
