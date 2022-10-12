// importer.js
import { name, age, ability } from "./characters1.js";
import { listcharacter } from "./listCharacters1.js";

document.getElementById("output").innerHTML = listcharacter(name, age, ability);