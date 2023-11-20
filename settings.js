console.log("opener: ",this.opener)

const operators_fildset = document.getElementById("operator");

class Operator extends HTMLElement {
  constructor(labelText, svgMarkup, checked = false) {
    super();
      this.className = "operator";
      this.name = "operator";
      this.labelText = labelText;
      this.id = labelText.toString().toLowerCase() + "_operator";
      this.svgMarkup = svgMarkup;
      this._checked = checked;

    // Create label
    const label = document.createElement('label');
      label.className = 'checkbox-wrapper';

    // Create label span
    const labelSpan = document.createElement('span');
      labelSpan.className = 'checkbox-label';
      labelSpan.innerText = this.labelText;

    // Create input
    const input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'checkbox-input';
      input.style.display = "none";
      input.checked = this._checked;
    
      // Create icon span
    const iconSpan = document.createElement('span');
      iconSpan.className = 'checkbox-icon';
      iconSpan.innerHTML = this.svgMarkup;

    // Create tile span
    const tileSpan = document.createElement('span');
      tileSpan.className = 'checkbox-tile';
      tileSpan.appendChild(iconSpan);
      tileSpan.appendChild(labelSpan);


    label.appendChild(input);
    label.appendChild(tileSpan);

    this.appendChild(label);

    this.inputElement = input;
    this.tileSpan = tileSpan;
    this.labelSpan = labelSpan;
    this.icon = iconSpan;

    return (this)
  }

  // rename to all (instead of allOperators)?
static allOperators(){
  let operators = document.getElementsByClassName('operator')
  return operators;
}

static selectedOperators(){
  let operators = this.allOperators()
  return(Array.from(operators,operator=>{if(operator.checked){return operator.title}}).filter(op=>!!op))
}

  toggle() {
    this.checked = !this.checked;
  }

  get checked() {
    return this.inputElement.checked;
  }

  set checked(newState) {
    this.inputElement.checked = newState;
    if (newState) {
      this.color = "blue";
    } else {
      this.color = "";
    }
  }

  set color(newColor) {
    this.icon.children[0].style.fill = newColor;
    this.labelSpan.style.color = newColor;
    this.tileSpan.style.borderColor= newColor;
  }

  get color() {
    return this.icon.children[0].style.fill;
  }

  attachTo(parentElement) {
    let operators_array = Array.from(Operator.allOperators());
    console.warn("already exists:",this.exists(),this.id)
    if(!this.exists()) {parentElement.appendChild(this)};
  }

  exists(){
    let operators_array = Array.from(Operator.allOperators());
    let index = operators_array.findIndex(e=>{return(e.id == this.id)})
    return(index > -1)
  }
}; customElements.define("operator-checkbox", Operator);


voices = speechSynthesis.getVoices().filter(function (voice) { return voice.lang == "en-US"});

const wait = async (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

var settings;

this.name = "Grandmath - Settings"

function formToJson(formElement = document.forms[0]) {
  const formData = new FormData(formElement);
  settings = {};
  settings['operator'] = Operator.selectedOperators()
  formData.forEach((value, key) => {
    if (key in settings) {
      if (!Array.isArray(settings[key])) {
        settings[key] = [settings[key]];
      }
      settings[key].push(value);
    } else {
      settings[key] = value;
      //console.debug(settings[key], typeof(settings[key]))
    }
  });
  return settings;
}

function saveSettings() {
  // console.debug(arguments)
	settings = formToJson()
  console.log("Settings: ",settings)
	
  // Use localStorage.setItem to store the settings object as a string
  window.alert("settings saved")
  localStorage.setItem("grandmath_settings", JSON.stringify(settings));
  this.document.forms[0].submit()
}

function addVoicesOptions(voices){
  try {
   // console.dir(voices)
  select = document.getElementById("voice")
  // console.dir(select)
  voices = speechSynthesis.getVoices().filter(function (voice) { return voice.lang == "en-US"});
  // console.dir(voices)
  for (var i = 0; i<voices.length; i++){
    // console.log(voices[i]);
    var opt = document.createElement('option');
    opt.value = voices[i];
    opt.innerText = voices[i]['name'];
    select.appendChild(opt);
}
  return(voices) 
  } catch (error) {
    
  }
}

function loadSettings(settings = JSON.parse(localStorage.getItem("grandmath_settings"))) {
   // Iterate over the settings object.
  //  console.log(voices);
   for (const [key, value] of Object.entries(settings)) {
    //Set operators checkboxes values
    Array.from(document.getElementById('operator')?.children).filter(e => e.type).map(e => e.checked = settings.operator.includes(e.value))
    // If the value is an array, iterate over it and set the values of the objects on the page with the ids from the array.
    if (Array.isArray(value)) {
      for (const item of value) {
        console.debug(key,item,value)
        const element = document.getElementById(key);
        element.value = value
        if (element) {
          element.value = item;
        }
      }
    } else {
      // If the value is not an array, get the element with the specified id and set its value to the value from the settings object.
      const element = document.getElementById(key);
      if (element) {
        element.value = value;
      }
    }
  }
  addVoicesOptions(); 
}

allRanges = document.querySelectorAll(".slider_wrapper");
allRanges.forEach(wrap => {
  const range = wrap.querySelector(".slider");
  const bubble = wrap.querySelector(".bubble");

  range.addEventListener("input", () => {
    setBubble(range, bubble);
  });
  range.value = range.value;
  setBubble(range, bubble);
  range.value = range.value;
});

function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 50;
  const max = range.max ? range.max : 50;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;

  // Sorta magic numbers based on size of the native UI thumb
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  bubble.style.left = newVal+'%';
}

document.addEventListener("focusin", function() {
  loadSettings();
  addOperatorsIcons();
  wait(1500).then(addVoicesOptions(voices));
});

function addOperatorsIcons(operators_fildset = document.getElementsByClassName("operators")[0]){
    console.log(operators_fildset)

    addition = new Operator("Addition",'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg><rect width="256" height="256" fill="none"><path d="M74.4017,80A175.32467,175.32467,0,0,1,128,72a175.32507,175.32507,0,0,1,53.59754,7.99971" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"></path>                <path d="M181.59717,176.00041A175.32523,175.32523,0,0,1,128,184a175.32505,175.32505,0,0,1-53.59753-7.99971" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"></path>                <path d="M155.04392,182.08789l12.02517,24.05047a7.96793,7.96793,0,0,0,8.99115,4.20919c24.53876-5.99927,45.69294-16.45908,61.10024-29.85086a8.05225,8.05225,0,0,0,2.47192-8.38971L205.65855,58.86074a8.02121,8.02121,0,0,0-4.62655-5.10908,175.85294,175.85294,0,0,0-29.66452-9.18289,8.01781,8.01781,0,0,0-9.31925,5.28642l-7.97318,23.91964" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"></path>                <path d="M100.95624,182.08757l-12.02532,24.0508a7.96794,7.96794,0,0,1-8.99115,4.20918c-24.53866-5.99924-45.69277-16.459-61.10006-29.85069a8.05224,8.05224,0,0,1-2.47193-8.38972L50.34158,58.8607a8.0212,8.0212,0,0,1,4.62655-5.1091,175.85349,175.85349,0,0,1,29.66439-9.18283,8.0178,8.0178,0,0,1,9.31924,5.28642l7.97318,23.91964" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"></path></svg>',true);
    addition.attachTo(operators_fildset)
    addition.addEventListener('click', addition.toggle.bind(addition));
    addition.title = '+'
    
    substruction = new Operator("Substruction",'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path></svg>');
    substruction.attachTo(operators_fildset)
    substruction.addEventListener('click', substruction.toggle.bind(substruction));
    substruction.title = '-'

    muliplication = new Operator("Muliplication",'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>                <rect width="256" height="256" fill="none"></rect>                <polygon points="72 40 184 40 240 104 128 224 16 104 72 40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"></polygon>                <polygon points="177.091 104 128 224 78.909 104 128 40 177.091 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"></polygon>                <line x1="16" y1="104" x2="240" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"></line>              </svg>');
    muliplication.attachTo(operators_fildset)
    muliplication.addEventListener('click', muliplication.toggle.bind(muliplication));
    muliplication.title = '*'
    
    division = new Operator("Division",'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM128,80a16,16,0,1,0-16-16A16,16,0,0,0,128,80Zm0,96a16,16,0,1,0,16,16A16,16,0,0,0,128,176Z"></path></svg>                <rect x="36" y="36" width="184" height="184" rx="48" stroke-width="12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"></rect>                <circle cx="180" cy="75.99998" r="10"></circle>              </svg>');
    division.attachTo(operators_fildset)
    division.addEventListener('click', division.toggle.bind(division));
    division.title = '/'
}