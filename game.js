var realAnswer, question, num1, operator, num2, answers, problem
var settings;

/* Get the element you want displayed in fullscreen mode (a video in this example): */
//var elem = document.getElementById("myvideo");

/* When the openFullscreen() function is executed, open the game in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
function openFullscreen(elem = document.documentElement) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

this.origin = "Grandmath"
this.name = "Grandmath - Game"

window.onlanguagechange = e => console.log(e)
window.onfocus = loadGameSettings

const getRandomItem = (items) =>  items[Math.floor(Math.random() * items.length)];

function setCSSvar(css_var,new_value){
bodyStyles = document.body.style;
    bodyStyles.setProperty(css_var,new_value);
  }

function arrayRange(start, stop, step=1){
  //step = Math.random()
  console.info("arrayRange =",arguments)
  let arr =  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
    );
    return arr
}

const defaultSettings = {
  "operator": ['+'],
  "lowest_value": 0,
  "highest_value": 15,
  "volume":100,
  "textColor": 'Yellow'
};

settings = loadGameSettings();

class Problem extends HTMLElement {
  static counter = 0
  highestNumber=parseInt(settings?.highestNumber);
  lowestNumber=parseInt(settings?.lowestNumber);

  constructor(operator=selectOperator(), highestNumber=settings.highestNumber, lowestNumber=settings.lowestNumber) {
    Problem.counter = Problem.counter + 1
    //ToDo: make that a static function of "Answer" class
    document.getElementById("questions_counter").textContent = ["| Question", Problem.counter].join(" ")
    Answer.counter = 0;
    super();
    console.group("Problem ",Problem.counter)
    
    Problem.highestNumber = highestNumber;
    Problem.lowestNumber = lowestNumber;

    var numbers_set = arrayRange(this.lowestNumber,this.highestNumber,1)
    
    this.class = "problem"
    this.lang = "en-US"
    
    //ToDo: convert the random element choser to an arrow function outside for readability and reusability
    this.num1 = numbers_set[Math.floor(Math.random() * numbers_set.length)];
    this.operator = operator;
    this.num2 = numbers_set[Math.floor(Math.random() * numbers_set.length)];
    
    // Generate the problem and calculate the answer based on the operator
    switch (operator) {
      case '+':
        this.question = `${this.num1} + ${this.num2}`;
        this.answer = this.num1 + this.num2;
        break;
      case '-':
        this.question = `${this.num1} - ${this.num2}`;
        this.answer = this.num1 - this.num2;
        break;
      case '*':
        this.question = `${this.num1} * ${this.num2}`;
        this.answer = this.num1 * this.num2;
        break;
      case '/':
        this.question = `${this.num1} / ${this.num2}`;
        this.answer = this.num1 / this.num2;
        break;
      default:
        this.question = '';
        this.answer = '';
    }
		// Generate 4 random options and set the correct answer
    
    this.answers = Answer.generateRandomAnswers(4, Problem.lowestNumber, Problem.highestNumber,this);

      console.groupEnd("Problem")
      return (this)
  }
static toMath(question_text){
  powers = question_text.match(/\^\d+/)
	return powers
}


static parseQuestion(question_text = this.question) {
  question_text = question_text.toString()
  var numbers = question_text.match(/-?\d+(\.\d+)?/g).map(Number);
  var operators = question_text.match(/[+\-*/^]/g);
  var leftParentheses = [];
  var rightParentheses = [];

  for (var i = 0; i < question_text.length; i++) {
    if (question_text[i] === '(') leftParentheses.push(i);
    if (question_text[i] === ')') rightParentheses.push(i);
  }

  var question = {
    numbers: numbers,
    operators: operators,
    leftParentheses: leftParentheses,
    rightParentheses: rightParentheses
  };

  return question;
}

recalcAnswer(){
  this.answer = eval(this.textContent)
  realAnswer = this.answer
  return this.answer
}

//ToDo: update it to support more operators and variables
displayQuestion() {
      let container = document.getElementById('question-container');
      
      num1 = updateOrCreateElement('num1', this.num1,this.id,'math').classList.add('question_part');
      operator = updateOrCreateElement('operator', this.operator,this.id,'math').classList.add('question_part');
      num2 = updateOrCreateElement('num2', this.num2,this.id,'math').classList.add('question_part');
      return([num1,operator,num2])
  }


read(language="en-US"){
  say(this.textContent.replace("-","minus"),this.lang)
}
  // Getters and setters for the properties
  get num1() {
    return this._num1;
  }

  set num1(value) {
    value = parseInt(value)
    /*if (!(this.highestNumber>= value >= this.lowestNumber)) {
      throw new Error(value,'Number must be between '+this.lowestNumber+' and '+ this.highestNumber);
    }*/
    this._num1 = value;
    this.updateQuestion()
    updateOrCreateElement('num1', this.num1); console.trace("updating num1")
  }

  get num2() {
    return this._num2;
  }

  set num2(value) {
    value = parseInt(value)
   /*if (value < this.lowestNumber || value > this.highestNumber) {
      throw new Error('Number must be between {} and {}'.format(this.lowestNumber, this.highestNumber));
    }*/
    this._num2 = value;
    this.updateQuestion()
    updateOrCreateElement('num2', this.num2);  console.trace("updating num2")
  }

  get operator() {
    return this._operator;
  }

  set operator(value) {
    if (value !== '+' && value !== '-' && value !== '*' && value !== '/') {
      throw new Error('Operator must be one of +, -, *, or /');
    }
    this._operator = value;
    this.updateQuestion();
    updateOrCreateElement('operator', this.operator); console.trace("updating operator");
  }

  get highestNumber() {
    return Problem.highestNumber;
  }

  set highestNumber(value) {
    //console.log("set highestNumber",value < this.lowestNumber,value,this.lowestNumber)
    if (value < this.lowestNumber) {
      throw new Error('Highest number must be greater than lowest number');
    }
    Problem.highestNumber = value;
  }

  get lowestNumber() {
    return Problem.lowestNumber;
  }

  /**
   * @param {number} value
   */
  set lowestNumber(value) {
    if (value > Problem.highestNumber) {
      throw new Error('Lowest number must be less than highest number');
    }
    Problem.lowestNumber = value;
  }
	
	  // Getter and setter for the answers property
  get answers() {
    return this._answers;
  }

  set answers(answers_list) {
      this._answers = answers_list;
    }
    
  get question(){
    return this.textContent
  }
  
  updateQuestion(num1=this.num1,operator=this.operator,num2=this.num2){
    if(num1&&operator&&num2){
        let new_question = ([num1,operator,num2]).join(" ")
        console.trace("updateQuestion")
        this.question = new_question
      }
  }
  
  set question(new_question){
    if(this._question != new_question){
    this.textContent = new_question;
    //this._question = new_question

    if(!this._question) {} 
    else{    say("updating question to "+new_question)}
    this.recalcAnswer()} else {say("question is set already")};
    return this
  }
}

customElements.define('math-problem', Problem);


/****************************************************************/

//function over_handler(event) {}

//function enter_handler(event) {console.groupCollapsed(event.target.id+" enter",event)}
function move_handler(event) {if(event.preasure > 0) {console.log(event)}}
//function leave_handler(event) {console.groupEnd(event.target.id+" leave",event)}

//function up_handler(event) {}
function cancel_handler(event) {console.log("canceled",event)}
/*function out_handler(event) {}
function gotcapture_handler(event) {}
function lostcapture_handler(event) {}*/


//Pointer Events Handler
  const id = -1;

  function process_id(event) {
    // Process this event based on the event's identifier
  }
  function process_mouse(event) {
    console.log("Mouse:",event)
    // Process the mouse pointer event
  }
  function process_pen(event) {
    console.log("Pen:",event)
    // Process the pen pointer event
  }
  function process_touch(event) {
    console.log("Touch:",event)
    // Process the touch pointer event
  }
  function process_tilt(tiltX, tiltY) {
    console.log(tiltX, tiltY)
    // Tilt data handler
  }
  function process_pressure(ev,pressure) {
    console.log(ev.target)
    ev.target.classList.add('active');
  }
  function process_non_primary(event) {
    // Non primary handler
  }

function down_handler(ev) {
    console.log(ev)
    // Calculate the touch point's contact area
    const area = ev.width * ev.height;

    // Compare cached id with this event's id and process accordingly
    if (id === ev.identifier) process_id(ev);

    // Call the appropriate pointer type handler
    switch (ev.pointerType) {
      case "mouse":
        process_mouse(ev);
        break;
      case "pen":
        process_pen(ev);
        break;
      case "touch":
        process_touch(ev);
        break;
      default:
        console.log(`pointerType ${ev.pointerType} is not supported`);
    }

    // Call the tilt handler
    if (ev.tiltX !== 0 && ev.tiltY !== 0) process_tilt(ev.tiltX, ev.tiltY);

    // Call the pressure handler
    process_pressure(ev,ev.pressure);

    // If this event is not primary, call the non primary handler
    if (!ev.isPrimary) process_non_primary(ev);

    ev.target.addEventListener('pointermove',dragMove);
    ev.target.initialX = ev.clientX
    ev.target.initialY = ev.clientY
  }

/*************************************************** */
class Answer extends HTMLElement {
   static counter = 0;
   static problem;
       
  constructor(text,problem=getElementById("problem")) {
   console.group("Answer")

    super();

    this.type = 'math'
    this.lang = "en-US"
    
    //console.log(this.type)
    
    this.classList = 'answer';
    this.classList.add('border');
    this.classList.add('margin');
    this.classList.add('padding');
    
    this.id = ++Answer.counter;
    
    this.initialX
    this.initialY

    this.currentX = 0;
    this.currentY = 0;

    this.textContent = text;
    this.ariaValueNow = text;
    
    /*
    //Move With Mouse
    this.addEventListener('dragstart', drag);
    this.addEventListener('dragmove', dragMove);
    this.addEventListener('dragend', dragEnd);
    */

    this.position = this.getBoundingClientRect()

    this.onpointerdown = down_handler;
    this.onpointerup = dragEnd//up_handler;
    
    //this.onpointerenter = enter_handler;
    //this.onpointerover = over_handler;
    //this.onpointerleave = dragEnd//leave_handler;
    
    //this.onpointermove = dragMove//move_handler;

    this.onpointercancel = cancel_handler;
    
    //this.gotpointercapture = gotcapture_handler;
    //this.lostpointercapture = lostcapture_handler;

    this.setAttribute('draggable', 'true');
    
    this.ariaValueMin = problem.lowestNumber;
    this.ariaValueMax = problem.highestNumber;
    
    
    //console.log(this);
    console.groupEnd("Answer")
    
    return (this)
  }

  // Getters and setters for the properties
  get text() {    return this._textContent;  }

  //get position() {    return this._positions;  }

 set text(new_value) {
  console.trace("set new answer value:",new_value,Array.from(selectAnswerByText(new_value)).length == 0)

  if(Array.from(selectAnswerByText(new_value)).length == 0){
    console.log("new answer:",this)
    this.textContent = new_value;
    this.value = new_value;
    this.ariaValueNow = new_value;
  } else {console.error("duplicated answer!")}
  
  return (this.reset())
  }

get width(){
  return this.style.width;
}

get height(){
  return this.style.height;
}

set width(new_width){
  return this.style.width = new_width;
}

set height(new_highet){
  return this.style.height = new_highet;
}

get id(){
    return this._id
  }
  
  set id(new_id="a_"+this.textContent){
    if(this.id) {console.trace("set id should not be used")}
    if(this.id != new_id){
    if(this.id!=undefined) {say("updating "+this.id+" to "+new_id)}
    this._id = "a_"+new_id
    return (this)
  }
  }
  
read(language=this.lang){  say(this.textContent,language)}

reset(){
  this.removeEventListener('pointermove',dragMove);
  this.classList.remove('incorrect')
  this.classList.remove('correct')
  this.classList.remove('active')
  
  this.currentX = 0
  this.currentY = 0
  //console.trace("answer reset",this.id)
  return (this)
}

get isCorrect() {
  return this.checkAnswer()
}


set currentX(x){
  this._cyrrentX = x
  this.style.left = x+"px";
}

get currentX(){
  return(this.style.left)
}

get currentY(){
  return(this.style.top)
}

set currentY(y){
  this._currentY = y
  this.style.top = y+"px";
}

addToParent(parentElement = getElementById("problem-container")) {
    problem = getElementById('problem')
    parentElement.appendChild(this);
    problem.answer = problem.recalcAnswer() //Should be moved elsewhere if possible
}
  
checkAnswer(){
  try {
      problem = document.getElementById('problem')
      problem.recalcAnswer()//answer = eval(problem.textContent)
      realAnswer = problem.answer
    } catch {undefined}
  return this.textContent == realAnswer
}

  static generateRandomAnswers(numAnswers = 4, lowestNumber = 1, highestNumber = 15, problem = document.getElementById("problem")) {
      if (numAnswers > (highestNumber - lowestNumber + 1)) {
        console.error("Too many answers requested");
        numAnswers = (highestNumber - lowestNumber + 1);
        //return [];
      }

      var answers = [];
      for (let i = 0; i < numAnswers; i++) {
        let text = /*arrayRange.shift*/(Math.floor(Math.random() * (highestNumber - lowestNumber + 1)));
        while (answers.includes(text)) {
          text = Math.floor(Math.random() * (highestNumber - lowestNumber + 1) + lowestNumber);
        }
        const answer = new Answer(text, problem);
        console.log(answers.length,answer)
        answers.push(answer)
        answers = Array.from(new Set(answers));
      }
      console.debug("Answers:",Array.from(answers,ans=>ans.innerText))
      return answers;
    }
}

customElements.define('optional-answer', Answer);

function updateOrCreateElement(id, content, containerId = 'question-container',object_type='math') {
    //console.group("updateOrCreateElement") 
    let element = getElementById(id);
            let container;
            
    if (element) {
        element.textContent = content;
        container = element.parentElement
    } else {
        element = document.createElement(object_type);
        element.id = id;
        element.textContent = content;

        if (containerId) {
            container = getElementById(containerId);
            if(!container) {
              new_container = (document.createElement('div')).id = containerId;
              container = document.body.appendChild(new_container);  
            }
        } else {
            container = document.body;  // fallback to body if no containerId provided
            console.log("Parent Element:",element.parentElement,document.body)
        }

        container.appendChild(element);
    }
    //console.groupEnd("updateOrCreateElement") 
    return element
}

function listAllElementsWithID(node=document.documentElement) {
    var elements = [node];
    var children = Array.from(node.children);
    children.forEach(child => elements = elements.concat(listAllElementsWithID(child)));
    return elements.filter(element => element.id!='');
}

//refunction getElementById
function getElementById(element_id,index = 0){
  let all_elements = listAllElementsWithID()
  let elements_with_id = all_elements.filter(element => element.id == element_id);
  
  //console.log("elements_with_id:",element_id,elements_with_id)
  
  if(elements_with_id==[]) {elements_with_id = all_elements.filter(element => element.id.includes(element_id))};
  
  return elements_with_id[index]
}

//Add Context Menu Handler
window.oncontextmenu = (function(e) {
  e.preventDefault();
  e.target?.read();
  return(e.target)
});


function getURLParameters(url) {
  const params = {};
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  let match;

  while ((match = regex.exec(url))) {
    const key = decodeURIComponent(match[1]);
    const value = decodeURIComponent(match[2]);
    try {
      params[key] = JSON.parse(value);
    } catch (error) {
      params[key] = value;
    }
  }

  return params;
}

//console.clear()

/***********************************Adding Read Aloud*********************************************/
/*basic from https://wicg.github.io/speech-api/#speechsynthesisevent*/
var synUtterance = new SpeechSynthesisUtterance("");
var speechQueue = [];
var lastText = "";
synUtterance.lang = "en-US";

synUtterance.onend = function() {
  if (speechQueue.length > 0) {
    say(speechQueue.shift());
  }
};

function say(text, language="en-US") {
  console.groupCollapsed("say: ", arguments[0]);
  console.log(arguments[1]);

  if (text === lastText) {
    console.groupEnd("say");
    speechQueue.shift();
    //return;
  }

  lastText = text;

  VOICES = speechSynthesis.getVoices().filter(function (voice) { return voice.lang == language; });

  if (speechSynthesis.speaking) {
    speechQueue.push(text);
    console.groupEnd("say");
    return;
  }

  synUtterance.text = text;
  synUtterance.voice = VOICES[7];
  synUtterance.volume = 100;
  synUtterance.rate = 1; // Make it adjustable from settings menu
  synUtterance.pitch = 1; // Make it adjustable from settings menu

  window.speechSynthesis.speak(synUtterance);

  console.groupEnd("say");
}

// Create the title element
var titleElement = document.createElement('h1');
titleElement.textContent = 'Grandmath';
titleElement.id = 'title';
document.head.appendChild(titleElement);

var questionsCounter = document.createElement('h3');
questionsCounter.textContent = Problem.counter;
questionsCounter.id = 'questions_counter';
titleElement.appendChild(questionsCounter);


/****************************************************************************************/

//touch support
// Function to handle touchstart event
function touchStart(event) {
  event.preventDefault();
  console.group("touchStart") 
  console.group(event);
  event.target.classList.add('active');

  // Reset the target container if the current result is wrong
  const result = getElementById('result');
  if (result.textContent === 'Wrong!') {
    resetTargetContainer();
  }

  // Get the element's position relative to the viewport
  const rect = event.target.getBoundingClientRect();

  // Store the initial touch position relative to the element's center
  const touch = event.touches[0];
  
  event.target.initialX = touch.clientX
  event.target.initialY = touch.clientY
  
  event.target.offsetX = touch.clientX - event.target.initialX
  event.target.offsetY = touch.clientY - event.target.initialY
  //console.log(event.target.offsetX)
  //console.log(event.target.offsetY)
  console.groupEnd("touchStart") 
}

function touchMove(event) {
  console.groupCollapsed("touchMove") 
  console.log(event);
  //event.preventDefault();
  
  const rect = event.target.getBoundingClientRect();

  // Calculate the new position based on the touch movement
  const touch = event.touches[0];
  offsetX = Math.floor(touch.clientX - event.target.initialX);
  offsetY = Math.floor(touch.clientY - event.target.initialY);
  
  // Check if the new position will be out of the screen
  const newRect = {
    top: Math.floor(rect.top + offsetY),
    left: Math.floor(rect.left + offsetX),
    bottom: Math.floor(rect.bottom + offsetY),
    right: Math.floor(rect.right + offsetX)
  };
  
  let errorMessage = "";
  
  if (newRect.top+offsetY < 0) {
    errorMessage += "The top of the element is out of the screen.";
  } else if (newRect.left+offsetX < 0) {
    errorMessage += "The left side of the element is out of the screen.";
  } else if (newRect.bottom-offsetY > window.innerHeight) {
    errorMessage += "The bottom of the element is out of the screen.";
  } else if (newRect.right-offsetX > window.innerWidth) {
    errorMessage += "The right side of the element is out of the screen.";
  }
  
  if (errorMessage) {
    console.group("out of window") 
    // The new position is out of the screen, so log the error message
    console.log(errorMessage);
    console.log(newRect)
    console.log("Offset",[offsetX,offsetY])
    
    console.log("top",newRect.top+offsetY < 0)
    console.log("left",newRect+offsetX.left < 0)
    console.log("botom",newRect.bottom > window.outerHeight)
    console.log("right",newRect.right-offsetX > window.outerWidth)
    
    //event.target.classList.remove("incorrect")
    event.target.classList.add("out-of-window")
    console.groupEnd("out of window") 
    //return;
  } else {event.target.classList.remove("out-of-window")}
  
  event.target.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  event.target.style.position = `translate(${offsetX}px, ${offsetY}px)`;
  console.groupEnd("touchMove") 
}

// Function to handle touchend event
function touchEnd(event) {
  //console.groupCollapsed("touchEnd") 
    event.preventDefault();
    event.target.classList.remove('active');

    // Reset the position of the dragged element
    event.target.reset()

    // Get the data from the touch event's dataTransfer property
    const data = event.target.textContent;
    
    // window.alert(event.target)

    // Mimic drop functionality to check answer on touch release
    const clonedElement = document.createElement('div');
    clonedElement.textContent = data;

    const target = getElementById('target');
    target.appendChild(clonedElement);

    // Store the current problem
    problem = getElementById('problem')

    
    //console.log("touchEnd",event.target)
    //checkAnswer(clonedElement);
    checkAnswer(event.target);
    console.groupEnd("touch") 
}

/****************************************************************************************/

function setContainerFontSize() {
  //return;
  console.group("setContainerFontSize")
  console.count("Updatin font sizes")
  /*const problemContainer = getElementById('problem-container');
  const answerContainer = getElementById('answer-container');
  
  const problemText = document.getElementById('problem');
  //const answers = document.querySelectorAll('.answer');
  
  const answers = document.getElementsByClassName('answer')
  
  const problemFontSize = problemContainer.offsetWidth *0.15; //Let it be editable from the menu
  const answerFontSize = answerContainer.offsetWidth *0.2;	//Let it be editable from the menu
  
  problemText.style.fontSize = problemFontSize + 'px';
  for (answer of answers) {
    answer.style.fontSize = answerFontSize + 'px';
  };*/
  console.groupEnd("setContainerFontSize") 
}

/****************************************************************************************/

function selectAnswerByText(text) {
  //console.group("selectAnswerByText: ",text)
  const selected_answers = Array.from(document.querySelectorAll('.answer')).filter(answer => answer.textContent == text)
  for (const answer of selected_answers) {
      console.log("answer.classList.add('incorrect');")
  }
  //console.groupEnd("selectAnswerByText: ",text) 
  return selected_answers
}

function drag(event) {
  console.group("drag") 
  //event.dataTransfer.setData('text/plain', event.target.textContent);
  //event.dataTransfer.setData('text/plain', event.target.id);

  // Reset the target container if the current result is wrong
  const result = document.getElementById('result');
  if (result.textContent === 'Wrong!') {
    resetTargetContainer();
  }
}

function dragMove(event) {

  const rect = event.target.getBoundingClientRect();

  // Calculate the new position based on the touch movement
  const touch = event
  offsetX = Math.floor(touch.clientX - event.target.initialX);
  offsetY = Math.floor(touch.clientY - event.target.initialY);

  console.log("Movment: ",[event.movementX,event.movementY])
  if(event.pressure == 0 )  {return}
  console.group(event.target.id+" move")
	// Add a class to the dragged element to indicate the active state
  const draggedElement = event.target;
  console.log(event)
  console.dir(event.target)
  draggedElement.classList.add('active');
	
  // Update the position of the dragged element based on mouse movement
  if (draggedElement) {
    draggedElement.style.left = offsetX/*event.clientX - event.offsetX / 2*/ + 'px';
    draggedElement.style.top = offsetY/*event.clientY - event.offsetX / 2 */+ 'px';
  }
  console.groupEnd(event.target.id+" move")
}

function dragEnd(event,autoFullScreen=false) {
  if(autoFullScreen) {openFullscreen()}
  const draggedElement = event.target;

  // Remove the class indicating the active state from the dragged element
  if (draggedElement) {
      draggedElement.classList.remove('active');
      //draggedElement.removeEventListener('pointermove',dragMove);
    }

  // Get the data from the dataTransfer object for the dropped element
  const data = event.target.textContent;

  // Mimic drop functionality to check the answer
  const clonedElement = document.createElement('div');
  clonedElement.textContent = data;

  const target = document.getElementById('target');
  target.appendChild(clonedElement);

  // Store the current problem
  problem = document.getElementById('problem')
console.groupEnd("drag") 
event.srcElement.reset();
  checkAnswer(event.srcElement);
}

function drop(event) {
  console.group("drop") 

  event.preventDefault();
  
  const data = event.dataTransfer.getData('text/plain');
  //console.log("element",data)

  clonedElement = Array.from(answers).filter(answer => answer.id == "a_"+data)[0]
  //console.log(clonedElement.textContent," = ",clonedElement.checkAnswer())

}

// Function to check the answer
//ToDo: rename 'answer' to 'given_answer' in this context
function checkAnswer(answer_object) {
    //console.group("checkAnswer function",answer_object.textContent) 
      
      //console.log("answer object",answer_object)
      answer_object.isCorrect = answer_object.checkAnswer()
      
    answer = answer_object.textContent
    
    //console.dir("answer",answer)
    
    const problem = document.getElementById('problem')
    const calculated_answer = problem.answer
    const target = document.getElementById('target');
    result_element = document.getElementById('result');
    
     if (answer == calculated_answer) {
      result = "equals"
    } else if (answer < calculated_answer) {
      result = 'smaller';
    } else {
      result = 'bigger';
    }
    
    if (result == "equals"){
        target.classList.add('correct')
        result_element.textContent = 'Correct!';
      
        //speak(result.textContent+" "+problem+" equals "+answer)
        result_element.classList.remove('incorrect')
        result_element.classList.add('correct')
        say("next question:")
        resetGame();
      }	else {      
        if (result == "smaller"){
        say("try a bigger number")    
      } else {
        say("try a smaller number")
      } 

        result_element.classList.add('incorrect')
        wrong_answer = selectAnswerByText(answer.toString())[0]
        wrong_answer.classList.remove('active');
        wrong_answer.classList.add('incorrect')
    
  }

  //console.groupEnd("checkAnswer function",answer_object.textContent) 
  }
  
  
// Drag and drop functionality
function allowDrop(event) {
  event.preventDefault();
}

// Function to get a random answer
function getRandomAnswer(max=15, min=0) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function selectOperator(operators_list = settings.operator){
  //console.debug("selectOperator",JSON.stringify(settings),settings.operator)
	ranom_index = Math.floor(Math.random() * operators_list.length)
	return operators_list[ranom_index]
}

// Function to display the problem and answers
function displayProblem(problem,canSpeak = true) {
  //console.group("displayProblem") 
  operator = problem.operator
  highestNumber = problem.highestNumber
  lowestNumber = problem.lowestNumber
  
  problemElement = getElementById('problem');
  answers = document.querySelectorAll('.answer');
  
  //say("display problem")
  
  if (problem.question !== '') {
    problemElement.textContent = problem.question;
		//console.trace("displayProblem: ",problem.question)
    question = problem.question
    //console.log("displayProblem generate answers",question)

    // Generate unique answers that include the real answer
    var uniqueAnswers = [];
    const realAnswer = problem.answer;


    // Assign unique answers to the answers elements
    answers.forEach((answer, index) => {
      optional_answer = getRandomAnswer(highestNumber,lowestNumber)
      //console.log("option ",index)
      //answer.reset()
      answer.text = optional_answer
    });
    
		(document.querySelectorAll('.answer'))[Math.floor(Math.random() * answers.length)].text = problem.answer;
  } else {
    problemElement.textContent = 'Invalid operator';
  }
  if(canSpeak)  {problem.read()}
  
}

// Function to reset the target container
function resetTargetContainer() {
  
	const result_element = document.getElementById('result');
	result_element.innerText=""
	result_element.textContent=""
	result_element.classList.remove('incorrect')
	result_element.classList.remove('correct')
	
	const question = document.getElementById('problem')
  question.ondragover = allowDrop;
  question.ondrop = drop;
	
	const target = document.getElementById('target');
  target.innerHTML = '';
  target.style.backgroundColor = 'transparent';
  target.ondragover = allowDrop;
  target.ondrop = drop;
  
			target.classList.remove('incorrect')
			target.classList.remove('correct')
			target.classList.remove('active');
}



// Function to reset the game state
function resetGame(can_speak = true) {
  speechQueue = [];
  const result = document.getElementById('result');
  const draggedElement = document.querySelector('.active');
  if (draggedElement) {    draggedElement.reset()  }

 resetTargetContainer()
  
	result.textContent = '';
	
	hidden_target = document.getElementById('target');
	hidden_target.style.visibility='collapse';
	
  //say("reset game")
  problem = new Problem()
  problem.read()

  console.info(problem)
  displayProblem(problem,can_speak);
}

function loadGameSettings() {
  applied_settings = ""
  // Use localStorage.getItem to retrieve the settings string
  let settingsString = localStorage.getItem("grandmath_settings");
  // Check if the settings string exists
  if (settingsString) {
    // Use JSON.parse to convert the string back into an object
    applied_settings = JSON.parse(settingsString); 
    }
    else {
      applied_settings = defaultSettings//JSON.parse(defaultSettings)
      localStorage.setItem("grandmath_settings",JSON.stringify(defaultSettings))
      // window.alert("default settings loaded")
    }

    document.body.style.setProperty('--main-color', applied_settings['textColor']);
    document.body.style.setProperty('--font-size-multiplier', (applied_settings['fontSizeMultiplier']*0.1));
    return applied_settings
  }

//Function to open the settings window
function openSettingsWindow(game_window=window) {
  console.group("openSettingsWindow")
  console.log(arguments)
  var settings_window = window.open("settings.html", "_blank")
  console.log(settings_window);
  console.groupEnd("openSettingsWindow")
}

// Function to dynamically create the HTML elements and set up the game
function setupGame() {
  document.body.appendChild(titleElement);

  
//Get The saved settings
settings = loadGameSettings();
  // window.alert(JSON.stringify(settings))
	
	//titleElement.addEventListener("dblclick", openSettingsWindow);
  titleElement.addEventListener("click", openFullscreen(self));
	
	//operators_menu = document.getElementById('operators-menu');
	//operators_menu.visibility = 'collapse'
	
	// Create the problem container
  //console.log("כאן הבעיה בשאלה כנראה")
  var problemContainer = document.createElement('div');
  problemContainer.classList.add('container')
  problemContainer.id = 'problem-container';
  document.body.appendChild(problemContainer);

  // Create the problem element
  var problemElement = new Problem();
  problem = problemElement;
  problemElement.id = 'problem';
	
  problemContainer.appendChild(problemElement);

  // Create the options container
  //ToDo: move this to be a function of "problem" element
  var answersContainer = document.createElement('div');
  answersContainer.classList.add('container')
  answersContainer.id = 'answers_container';
  problemContainer.appendChild(answersContainer);

  // Create the answer container
  var answerContainer = document.createElement('div');
  //answerContainer.classList.add('container')
  answerContainer.id = 'answer-container';
  document.body.appendChild(answerContainer);

  // Create the target element
  var targetElement = document.createElement('div');
  targetElement.id = 'target';
  targetElement.ondrop = drop;
  targetElement.ondragover = allowDrop;
  answerContainer.appendChild(targetElement);

  // Create the result element
  var resultElement = document.createElement('div');
  resultElement.id = 'result';
  answerContainer.appendChild(resultElement);

  // Generate answers dynamically
  //ToDo: Check where it is used and use Answer.generateRandomAnswers() instead of answers=[]
  var answers = [];
  for (var i = 0; i < 4; i++) {
    
   let answer = problemElement.answers[i]
    answersContainer.appendChild(answer);
  }


// Call the setContainerFontSize function initially and on window resize
setContainerFontSize();
window.addEventListener('resize', setContainerFontSize);

  // Event listener for the "New Question" button
  //titleElement.addEventListener('click', resetGame);

  // Initial game setup
  resetGame();
  //displayProblem(problemElement,true);
  problemElement.displayQuestion()
}

/************************************************** */
document.addEventListener('DOMContentLoaded', function() {
  const popover = document.getElementById('popover-container');
  
  fetch('settings.html')
  .then(response => response.text())
  .then(data => {
    popover.innerHTML = data;
    loadSettings();
  })
  .catch(error => {
    console.error('Error:', error);
  });

  titleElement.addEventListener('dblclick', function() {
    popover.style.display = (popover.style.display === 'none' || popover.style.display === '') ? 'block' : 'none';
    if(popover.style.display !== 'none'){
      Operator.allOperators()[0].remove()
      Operator.allOperators()[0].remove()
      addOperatorsIcons();}
  }
  );
});
/************************************************** */

// Call the setupGame function to create the HTML elements and set up the game
setupGame();