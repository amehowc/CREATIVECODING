// september 2019

let ft;
let editfont = false;
let fonts = [];

function setup() {
  createCanvas(800, 400);
  noStroke();
  textAlign(CENTER, CENTER);
  initHTML();
}

function draw() {
  background("BLUE");
  // set the textFont variable to the selected font in the list
  for (let i = 0; i < fonts.length; i++) {
    let ftload = str(fonts[i]);
    if (sel.value() == ftload) {
      ft = sel.value();
    }
  }

  textFont(ft);
  fill(255);
  textSize(64);
  text("Hey", width / 2, height / 2);
  // hide/show the box
  if (editfont == true) {
    inp.show();
  } else {
    inp.hide();
  }
}
// a goofy way to make a button execute multiple callbacks
function buttonClicked() {
  updateHTML();
  fontInputDisplay();
}

function initHTML() {
  // the text box that contains the font list
  inp = select("#textfield");
  inp.position(25, height + 25);

  // splitting the string
  inpValue = "Roboto";
  fonts = inpValue.split(",");
  sel = createSelect();
  sel.position(25, 40);
  sel.id("selector");
  for (let i = 0; i < fonts.length; i++) {
    let ftload = str(fonts[i]);
    sel.option(ftload);
  }

  // hide / display the text box
  // the button also refresh the html code and redraw the canvas
  editFontList = createButton("Edit Fonts List");
  editFontList.position(200, height + 25);
  editFontList.mousePressed(buttonClicked);
}

// the function that edit the html code
function updateHTML() {
  sel.remove();
  fonts = [];
  inpValue = inp.value();
  fonts = inpValue.split(",");

  sel = createSelect();
  sel.position(25, 40);
  for (let i = 0; i < fonts.length; i++) {
    let ftload = str(fonts[i]);
    sel.option(ftload);
  }

  let ftlist = fonts.join("|");
  let link = document.createElement("link");
  link.id = "font";
  link.href =
    "https://fonts.googleapis.com/css?family=" + ftlist + "&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
  draw();
}

function fontInputDisplay() {
  if (editfont == true) {
    editfont = false;
  } else {
    editfont = true;
  }
}
