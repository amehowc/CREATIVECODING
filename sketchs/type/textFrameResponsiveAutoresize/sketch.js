// August 2019

//Updated version of Mat Ranson text-colour Pen
// https://codepen.io/matr/pen/BaBpXQw?fbclid=IwAR0xKjfx06QkgdOzIZXJwRdjNbhXV0sIz8CcoMfHVaQiKlwle-RAu6ZjGZw

const input =
  "Psychoanalysis and Repetition: Why Do We Keep Making the Same Mistakes?";
let words = [];
let fontSize = 60;
let myWord = "";
let myWordWidth = 0;
let myWordHeight = fontSize * 1.2;
let h = 0; // colour hue
let a = 0; // sin angle for counting
let pg, pgwidth, pgheight;
let t;
let maxFrames = 60;

function setup() {
  createCanvas(700, 700);
  textFont("Helvetica");
  controls();
  words = input.split(" ");
}

function draw() {
  clear();
  background("BLUE");
  initValues();
  //update : putting everything in a p5.object
  pg = createGraphics(pgwidth, pgheight);
  pg.colorMode(HSB, 360, 100, 100);
  pg.background(0, 20, 10);
  pg.textSize(fontSize);
  pg.textStyle(BOLD);
  t = (frameCount * 0.5) / maxFrames;

  // Create position variables
  let xPos = 20;
  let yPos = 20;
  let wordWidthTemp = -999;
  let linesheigthTemp = -999;

  // Loop through all words in the array
  for (let i = 0; i < words.length; i++) {
    // Each word fills independently
    pg.fill(h - i * 20, 75, 75);

    // Temp add each word to myWord
    myWord = words[i] + " ";

    // Calculate width of word
    myWordWidth = pg.textWidth(myWord);

    // Update : Storing the largest wordWidth in the array to use it to prevent the pg to shrink
    // passed the longest word
    if (myWordWidth > wordWidthTemp) {
      wordWidthTemp = myWordWidth;
    }

    // Update : If you declare it beforehand, it adjust itself to any canvas size.
    if (xPos > pg.width - myWordWidth) {
      xPos = 20;
      yPos += myWordHeight;
    }

    // Update : same thing whith the height
    if (yPos > linesheigthTemp) {
      linesheigthTemp = yPos;
    }
    // Place word on canvas
    // x position is calculated on word width
    pg.text(myWord, xPos, yPos, myWordWidth, myWordHeight);

    // Calculate new x position
    xPos += myWordWidth;
  }

  /*Update Really brutal way of adjusting the sliders value*/
  if (pgwidth <= wordWidthTemp + 20) {
    PGwidthslider.value(wordWidthTemp + 20);
  }

  if (pgheight <= linesheigthTemp + myWordHeight) {
    PGheightslider.value(linesheigthTemp + myWordHeight);
  }

  image(pg, width / 2 - pg.width / 2, height / 2 - pg.height / 2);

  // Manipulate the hue value using
  // sin() to swing back and forth
  let inc = QUARTER_PI / 36;
  h = map(sin(a), -1, 1, 40, 320);
  a = a + inc;
}

function controls() {
  PGwidthslider = createSlider(width / 2, width, width, 1);
  PGwidthslider.position(25, height + 25);
  PGheightslider = createSlider(height / 2, height, height, 1);
  PGheightslider.position(25, height + 50);
}

function initValues() {
  pgwidth = PGwidthslider.value();
  pgheight = PGheightslider.value();
}
