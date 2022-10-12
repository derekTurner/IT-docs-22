## Challenge solution

>The challenge is to write code which will cycle around 5 different greeting messages each time a button is clicked.

The solution can be worked through alternatively using class components or function components.

The solution can be extended so that each of the buttons controlling messages in the header, main and footer elements displays a different collection of messages.

## class component solution

Working through the class based solutions.  

### Switch based class solution

Working files **classChallenge1.html** and **classChallenge1**.js.

Initially thinking only about one set of five messages, the button click should control a counter instead of toggle a state. This can have starting value of zero.

```javascript
      this.state = { counter: 0 };
```

When the button is clicked the counter should count up from 0 to 4 and then roll over to 0 again.

```javascript
  handleClick() {
      this.setState(state => ({counter: (state.counter + 1)%5    }));
  }  
```
The counter can be used to to drive a switch statement which returns the required greeting message.

```javascript
          switch(this.state.counter) {
              case 0:
                  return (<h1>counter greeting {this.props.reader} from {this.props.author}!</h1>);
```                  

The full listing of **classChallenge1.js** becomes:

```javascript
const header   = ReactDOM.createRoot(document.getElementById("header"));
const main     = ReactDOM.createRoot(document.getElementById("main"));
const footer   = ReactDOM.createRoot(document.getElementById("footer"));

class Message extends React.Component {
  constructor(props) {
      super(props);
      this.state = { counter: 0 };
      this.handleClick = this.handleClick.bind(this);
      this.greeting = () => { 
          switch(this.state.counter) {
              case 0:
                  return (<h1>counter greeting {this.props.reader} from {this.props.author}!</h1>);
              case 1:
                  return (<h1>Second greeting {this.props.reader} from {this.props.author}!</h1>);
              case 2:                   
                  return (<h1>Third greeting {this.props.reader} from {this.props.author}!</h1>);
              case 3:
                  return (<h1>Fourth greeting {this.props.reader} from {this.props.author}!</h1>);
              case 4:
                  return (<h1>Goodbye greeting {this.props.reader} from {this.props.author}!</h1>);
              default:
                  return (<h1>Default greeting {this.props.reader} from {this.props.author}!</h1>);
          }
      }    
      this.label = () => { return (
          this.state.counter);   
      }
  }
   
  handleClick() {
      this.setState(state => ({counter: (state.counter + 1)%5    }));
  }  

  render() {
      return(
      <span>   
      <button onClick={this.handleClick}>{this.label()}</button>
      {this.greeting()};
      </span>
      );
  }
} 

header.render(<Message reader="Message to our readers" author="yours truely"/>);  
main.render(  <Message reader="dear reader"            author="welcome to main event"/>);
footer.render(<Message reader="Thanks"  
```

### Array based class solution

Either by refactoring the code above or as a first approach a solution based on messages held in arrays can be developed.

Start by defining an epty array of undefined length then push the JSX message lines into the array.  In this way you could increase the number of messages beyond 5 without having to alter the declared array size.  All you would do would be to add extra push statements and alter the range of the counter.

```javascript
      this.messages1 = [];
```
The array is named messages1 to allow for other sets of messages to be created later.

```javascript
this.messages1.push(<h1>Hello greeting {this.props.reader} from {this.props.author}!</h1>);
```
The counter can now be used to index the message returned by the greeting function.

```javascript
this.greeting = () => { return (this.messages1[this.state.counter]); }    
```

The full listing of **classChallenge2.js** becomes:

```javascript
const header   = ReactDOM.createRoot(document.getElementById("header"));
const main     = ReactDOM.createRoot(document.getElementById("main"));
const footer   = ReactDOM.createRoot(document.getElementById("footer"));

class Message extends React.Component {
  constructor(props) {
      super(props);
      this.state = { counter: 0 };
      this.messages1 = [];
        this.messages1.push(<h1>Hello greeting {this.props.reader} from {this.props.author}!</h1>);
        this.messages1.push(<h1>Second greeting {this.props.reader} from {this.props.author}!</h1>);
        this.messages1.push(<h1>Third greeting {this.props.reader} from {this.props.author}!</h1>);
        this.messages1.push(<h1>Fourth greeting greeting {this.props.reader} from {this.props.author}!</h1>);
        this.messages1.push(<h1>Fifth greeting {this.props.reader} from {this.props.author}!</h1>);

      
      this.message = "";
      this.handleClick = this.handleClick.bind(this);
      this.greeting = () => { return (this.messages1[this.state.counter]); }    
      this.label = () => { return (this.state.counter);   
      }
  }
   
  handleClick() {
    this.setState(state => ({counter: (state.counter + 1)%5    }));
}  
  render() {
      return(
      <span>   
      <button onClick={this.handleClick}>{this.label()}</button>
      {this.greeting()};
      </span>
      );
  }
} 

header.render(<Message reader="Message to our readers" author="yours truely"/>);  
main.render(  <Message reader="dear reader"            author="welcome to main event"/>);
footer.render(<Message reader="Thanks"                 author="yours truely"/>);
```

### multiple array based class solution

The desire to have different sets of messages displayed in different HTML elements; header, main and footer suggests passing the messages in to the class via an additional message prop, which in this example is called select.

```javascript
main.render(  <Message select= {messages2} reader="dear reader"            author="welcome to main event"/>);
```

If the message arrays are to be passed in to the Message class using props the arrays must be constructed outside the class.

An original message line would be for example:

```javascript
<h1>Hello greeting {this.props.reader} from {this.props.author}!</h1>
```

A first idea might be to add a line like this to the array.  However, because this code is outside the class the properties, reader and author are no longer in the scope of the code. 

The JSX line is like a template which has a text , a prop, a text, a prop and a closing text.  It is only the text sections which are being passed in from the array, the props are passed in separately, so the text elements should be passed in via separate array elements.

There is a separate issue that each JSX fragment being passed in must be complete so:

```javascript
<h1>Hello greeting 
```

would be rejected.  There is a missing `</h1>` element.  If an `<h1></h1>` element is required for the display around the assembled JSX it will have to be provided inside the class.

By using benign elements such as `<span></span>` the array text can be arranged into threeJSX fragments.

```javascript
messages1[0].push(<em>First greeting</em>);
messages1[0].push(<span>from</span>);
messages1[0].push(<em>!</em>);
```

Since each complete message is now represented by three array elements, the five required messages must be assembled into a multidimensional array.

```javascript
const messages1 = [[],[],[],[],[]];
```

Each of the other messages is defined i its own multidimentional array.

```javascript
const messages2 = [[],[],[],[],[]];

const messages3 = [[],[],[],[],[]];
```

Within the class the prop elements must be concatenated to make the complete message.  This is done by stating each prop within a series of {} parenthesis.  There is no need for + signs which would be used for javascript concatenation because at this point the code is JSX rather than javascript.

```javascript
this.greeting = () => { return <h1> 
                              {this.props.select[this.state.counter][0]} {this.props.reader} 
                              {this.props.select[this.state.counter][1]} {this.props.author} 
                              {this.props.select[this.state.counter][2]} </h1>; }    
      this.label = () => { return (this.state.counter);   
      }
```

The full listing of **classChallenge3.js** becomes:

```javascript
const header   = ReactDOM.createRoot(document.getElementById("header"));
const main     = ReactDOM.createRoot(document.getElementById("main"));
const footer   = ReactDOM.createRoot(document.getElementById("footer"));

const messages1 = [[],[],[],[],[]];

messages1[0].push(<em>First greeting</em>);
messages1[0].push(<span>from</span>);
messages1[0].push(<em>!</em>);

messages1[1].push(<em>Second greeting</em>);
messages1[1].push(<span>from</span>);
messages1[1].push(<em>!</em>);

messages1[2].push(<em>Third greeting</em>);
messages1[2].push(<span>from</span>);
messages1[2].push(<em>!</em>);

messages1[3].push(<em>Fourth greeting</em>);
messages1[3].push(<span>from</span>);
messages1[3].push(<em>!</em>);

messages1[4].push(<em>Fifth greeting</em>);
messages1[4].push(<span>from</span>);
messages1[4].push(<em>!</em>);

const messages2 = [[],[],[],[],[]];

messages2[0].push(<em>First salutation</em>);
messages2[0].push(<span>from</span>);
messages2[0].push(<em>!!</em>);

messages2[1].push(<em>Second salutation</em>);
messages2[1].push(<span>from</span>);
messages2[1].push(<em>!!</em>);

messages2[2].push(<em>Third salutation</em>);
messages2[2].push(<span>from</span>);
messages2[2].push(<em>!!</em>);

messages2[3].push(<em>Fourth salutation</em>);
messages2[3].push(<span>from</span>);
messages2[3].push(<em>!!</em>);

messages2[4].push(<em>Fifth salutation</em>);
messages2[4].push(<span>from</span>);
messages2[4].push(<em>!!</em>);

const messages3 = [[],[],[],[],[]];

messages3[0].push(<em>First felicitation</em>);
messages3[0].push(<span>from</span>);
messages3[0].push(<em>!!!</em>);

messages3[1].push(<em>Second felicitation</em>);
messages3[1].push(<span>from</span>);
messages3[1].push(<em>!!!</em>);

messages3[2].push(<em>Third felicitation</em>);
messages3[2].push(<span>from</span>);
messages3[2].push(<em>!!!</em>);

messages3[3].push(<em>Fourth felicitation</em>);
messages3[3].push(<span>from</span>);
messages3[3].push(<em>!!!</em>);

messages3[4].push(<em>Fifth felicitation</em>);
messages3[4].push(<span>from</span>);
messages3[4].push(<em>!!!</em>);

class Message extends React.Component {
  constructor(props) {
      super(props);
      this.state = { counter: 0 };
      this.handleClick = this.handleClick.bind(this);
      this.greeting = () => { return <h1> 
                              {this.props.select[this.state.counter][0]} {this.props.reader} 
                              {this.props.select[this.state.counter][1]} {this.props.author} 
                              {this.props.select[this.state.counter][2]} </h1>; }    
      this.label = () => { return (this.state.counter);   
      }
  }
   
  handleClick() {
    this.setState(state => ({counter: (state.counter + 1)%5    }));
}  
  render() {
      //console.log({reader});
      return(
      <span>   
      <button onClick={this.handleClick}>{this.label()}</button>
      {this.greeting()};
      </span>
      );
  }
} 

header.render(<Message select= {messages1} reader="Message to our readers" author="yours truely"/>);  
main.render(  <Message select= {messages2} reader="dear reader"            author="welcome to main event"/>);
footer.render(<Message select= {messages3} reader="Thanks"                 author="yours truely"/>);
```

## class component solution

Working through the function based solutions.  

### Switch based function solution

Working files **functionChallenge1.html** and **functionChallenge1.js**.

Initially thinking only about one set of five messages, the button click should control a counter instead of toggle a state. This can have starting value of zero.

```javascript
    const [ counter, setcounter ] = React.useState(0);
```

When the button is clicked the counter should count up from 0 to 4 and then roll over to 0 again.

```javascript
    function handleClick(evt) {
        setcounter((counter + 1)%5);
    }  
```
The counter can be used to to drive a switch statement which returns the required greeting message.

```javascript
         switch(counter) {
            case 0:
                return (<h1>Hello greeting {reader} from {author}!</h1>);
```                  

The full listing of **functionChallenge1.js** becomes:

```javascript
const header   = ReactDOM.createRoot(document.getElementById("header"));
const main     = ReactDOM.createRoot(document.getElementById("main"));
const footer   = ReactDOM.createRoot(document.getElementById("footer"));

// import {useState} from 'react'

function Message({reader, author} ) {
    const [ counter, setcounter ] = React.useState(0);

    function handleClick(evt) {
        setcounter((counter + 1)%5);
    }  
 
    const greeting = () => {         
        switch(counter) {
            case 0:
                return (<h1>Hello greeting {reader} from {author}!</h1>);
            case 1:
                return (<h1>Second greeting {reader} from {author}!</h1>);
            case 2:                   
                return (<h1>Third greeting {reader} from {author}!</h1>);
            case 3:
                return (<h1>Fourth greeting {reader} from {author}!</h1>);
            case 4:
                return (<h1>Goodbye greeting {reader} from {author}!</h1>);
            default:
                return (<h1>Default greeting {reader} from {author}!</h1>);
        }
    }

    const label = () => { return (counter );}   

    return (
        <span>
            <button onClick={handleClick}>{label()}</button>
            {greeting()}
        </span>
    );
} 

header.render(<Message reader="Message to our readers" author="yours truely"/>);  
main.render(  <Message reader="dear reader"            author="welcome to main event"/>);
footer.render(<Message reader="Thanks"                 author="yours truely"/>);
```

### Array based function solution

Either by refactoring the code above or as a first approach a solution based on messages held in arrays can be developed.

Start by defining an epty array of undefined length then push the JSX message lines into the array.  In this way you could increase the number of messages beyond 5 without having to alter the declared array size.  All you would do would be to add extra push statements and alter the range of the counter.

```javascript
    const messages1 = [];
```
The array is named messages1 to allow for other sets of messages to be created later.

```javascript
messages1.push(<h1>First greeting {reader} from {author}!</h1>);
```
The counter can now be used to index the message returned by the greeting function.

```javascript
    const greeting = () => {   return messages1[counter];}    
```

The full listing of **functionChallenge2.js** becomes:

```javascript
const header   = ReactDOM.createRoot(document.getElementById("header"));
const main     = ReactDOM.createRoot(document.getElementById("main"));
const footer   = ReactDOM.createRoot(document.getElementById("footer"));

// import {useState} from 'react'

function Message({reader, author} ) {
    const [ counter, setcounter ] = React.useState(0);

    function handleClick(evt) {
        setcounter((counter + 1)%5);
    }  
 
    const messages1 = [];
        messages1.push(<h1>First greeting {reader} from {author}!</h1>);
        messages1.push(<h1>Second greeting {reader} from {author}!</h1>);
        messages1.push(<h1>Third greeting {reader} from {author}!</h1>);
        messages1.push(<h1>Fourth greeting greeting {reader} from {author}!</h1>);
        messages1.push(<h1>Fifth greeting {reader} from {author}!</h1>);

    const greeting = () => {   return messages1[counter];}     


    const label = () => { return (counter );}   

    return (
        <span>
            <button onClick={handleClick}>{label()}</button>
            {greeting()}
        </span>
    );
} 

header.render(<Message reader="Message to our readers" author="yours truely"/>);  
main.render(  <Message reader="dear reader"            author="welcome to main event"/>);
footer.render(<Message reader="Thanks"                 author="yours truely"/>);
```

### multiple array based function solution

The desire to have different sets of messages displayed in different HTML elements; header, main and footer suggests passing the messages in to the class via an additional message prop, which in this example is called select.

```javascript
main.render(  <Message select= {messages2} reader="dear reader"            author="welcome to main event"/>);
```

If the message arrays are to be passed in to the Message class using props the arrays must be constructed outside the class.

An original message line would be for example:

```javascript
<h1>First greeting {reader} from {author}!</h1>
```

A first idea might be to add a line like this to the array.  However, because this code is outside the class the properties, reader and author are no longer in the scope of the code. 

The JSX line is like a template which has a text , a prop, a text, a prop and a closing text.  It is only the text sections which are being passed in from the array, the props are passed in separately, so the text elements should be passed in via separate array elements.

There is a separate issue that each JSX fragment being passed in must be complete so:

```javascript
<h1>First greeting 
```

would be rejected.  There is a missing `</h1>` element.  If an `<h1></h1>` element is required for the display around the assembled JSX it will have to be provided inside the class.

By using benign elements such as `<span></span>` the array text can be arranged into threeJSX fragments.

```javascript
messages1[0].push(<em>First greeting</em>);
messages1[0].push(<span>from</span>);
messages1[0].push(<em>!</em>);
```

Since each complete message is now represented by three array elements, the five required messages must be assembled into a multidimensional array.

```javascript
const messages1 = [[],[],[],[],[]];
```

Each of the other messages is defined i its own multidimentional array.

```javascript
const messages2 = [[],[],[],[],[]];

const messages3 = [[],[],[],[],[]];
```

Within the class the prop elements must be concatenated to make the complete message.  This is done by stating each prop within a series of {} parenthesis.  There is no need for + signs which would be used for javascript concatenation because at this point the code is JSX rather than javascript.

```javascript
    const greeting = () => {   
      return <h1> {select[counter][0]} {reader} {select[counter][1]} {author} {select[counter][2]} </h1>;
    }  
```

The full listing of **functionChallenge3.js** becomes:

```javascript
const header   = ReactDOM.createRoot(document.getElementById("header"));
const main     = ReactDOM.createRoot(document.getElementById("main"));
const footer   = ReactDOM.createRoot(document.getElementById("footer"));

const messages1 = [[],[],[],[],[]];
//const messages1 = new Array(5);

messages1[0].push(<em>First greeting</em>);
messages1[0].push(<span>from</span>);
messages1[0].push(<em>!</em>);

messages1[1].push(<em>Second greeting</em>);
messages1[1].push(<span>from</span>);
messages1[1].push(<em>!</em>);

messages1[2].push(<em>Third greeting</em>);
messages1[2].push(<span>from</span>);
messages1[2].push(<em>!</em>);

messages1[3].push(<em>Fourth greeting</em>);
messages1[3].push(<span>from</span>);
messages1[3].push(<em>!</em>);

messages1[4].push(<em>Fifth greeting</em>);
messages1[4].push(<span>from</span>);
messages1[4].push(<em>!</em>);

const messages2 = [[],[],[],[],[]];

messages2[0].push(<em>First salutation</em>);
messages2[0].push(<span>from</span>);
messages2[0].push(<em>!!</em>);

messages2[1].push(<em>Second salutation</em>);
messages2[1].push(<span>from</span>);
messages2[1].push(<em>!!</em>);

messages2[2].push(<em>Third salutation</em>);
messages2[2].push(<span>from</span>);
messages2[2].push(<em>!!</em>);

messages2[3].push(<em>Fourth salutation</em>);
messages2[3].push(<span>from</span>);
messages2[3].push(<em>!!</em>);

messages2[4].push(<em>Fifth salutation</em>);
messages2[4].push(<span>from</span>);
messages2[4].push(<em>!!</em>);

const messages3 = [[],[],[],[],[]];

messages3[0].push(<em>First felicitation</em>);
messages3[0].push(<span>from</span>);
messages3[0].push(<em>!!!</em>);

messages3[1].push(<em>Second felicitation</em>);
messages3[1].push(<span>from</span>);
messages3[1].push(<em>!!!</em>);

messages3[2].push(<em>Third felicitation</em>);
messages3[2].push(<span>from</span>);
messages3[2].push(<em>!!!</em>);

messages3[3].push(<em>Fourth felicitation</em>);
messages3[3].push(<span>from</span>);
messages3[3].push(<em>!!!</em>);

messages3[4].push(<em>Fifth felicitation</em>);
messages3[4].push(<span>from</span>);
messages3[4].push(<em>!!!</em>);

// import {useState} from 'react'

function Message({select, reader, author} ) {
    const [ counter, setcounter ] = React.useState(0);

    function handleClick(evt) {
        setcounter((counter + 1)%5);
    }  
 
    const greeting = () => {   
      return <h1> {select[counter][0]} {reader} {select[counter][1]} {author} {select[counter][2]} </h1>;
    }   

    const label = () => { return (counter );}   

    return (
        <span>
            <button onClick={handleClick}>{label()}</button>
            {greeting()}
        </span>
    );
} 

header.render(<Message select= {messages1} reader="Message to our readers" author="yours truely"/>);  
main.render(  <Message select= {messages2} reader="dear reader"            author="welcome to main event"/>);
footer.render(<Message select= {messages3} reader="Thanks"                 author="yours truely"/>);
```

Finally the code will render as:

![functionChallenge3](functionChallenge3.png)








References\:

[How to use Props in React](https://www.robinwieruch.de/react-pass-props-to-component/)

[Add react to a website](https://reactjs.org/docs/add-react-to-a-website.html)

[If else in JSX](https://react-cn.github.io/react/tips/if-else-in-JSX.html)



[When and why to use arrow functions](https://www.freecodecamp.org/news/when-and-why-you-should-use-es6-arrow-functions-and-when-you-shouldnt-3d851d7f0b26/)