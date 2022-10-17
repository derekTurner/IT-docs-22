## local script


The head region is often used to define functions which can be called from short javascript statements associated with elements.

<script>
function toggle(myElement) {
    if (myElement.innerText == "OFF") {
        myElement.innerText = "ON ";
    } else {
        myElement.innerText = "OFF";
    }
}
</script>

```javascript
<script>
function toggle(myElement) {
    if (myElement.innerText == "OFF") {
        myElement.innerText = "ON ";
    } else {
        myElement.innerText = "OFF";
    }
}
</script>
```
The function is called from the inline code on the button.

```html
<button style=" width:4em" onclick="toggle(this);">OFF</button>
```

<button id="b1" style =" width:4em" onclick = 'toggle(this);' >OFF</button>


