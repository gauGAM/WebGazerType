var ctx
var FPS = 20
var buts // all button rectangles
var cursor = [0,0]

class Rect {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.lineWidth = 3;
    // ctx.strokeStyle = "green";
    // ctx.stroke();
  }

  // check if point is in rectangle
  collides(p) {
    let px = p[0];
    let py = p[1];
    return (px >= this.x && px <= this.x + this.width
         && py >= this.y && py <= this.y + this.height);
  }
}

class Bar extends Rect {

}

class Button extends Rect {
  constructor(x, y, width, height, color, str) {
    super(x, y, width, height, color);
    this.str = str;
  }

  draw() {
    super.draw();

    // Draw letter too
    ctx.font = '150px Arial';
    ctx.textAlign="center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText(this.str,
                 this.x + this.width/2,
                 this.y + this.height/2);
  }
}

function init(){
  // Set canvas and rectangle dimensions
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext('2d');
  canvas.style.backgroundColor = "white";
  const rect = canvas.getBoundingClientRect();
  canvas.width = window.innerWidth - rect.left;
  canvas.height = window.innerHeight - rect.top;

  BUT_WIDTH = canvas.width * 0.4;
  BUT_HEIGHT = canvas.height * 0.5;
  BUT_SPACING_X = BUT_WIDTH * 1.3;
  BUT_SPACING_Y = canvas.height * 0.2;
  BUT_COLOR = "#3EB489";
  TOTAL_BUT_LENGTH = BUT_SPACING_X * 26;

  BAR_WIDTH = canvas.width * 0.2;
  BAR_HEIGHT = canvas.height;
  BAR_COLOR = "#E6E6FA";

  SCROLL_SPEED = 60;

  // First button positions
  x_shift = BAR_WIDTH;
  y_shift = BUT_HEIGHT * 0.2;

  alphabet = ["A","B","C","D","E","F","G","H",
              "I","J","K","L","M","N","O","P",
              "Q","R","S","T","U","V","W","X",
              "Y","Z"];

  buts = [];
  for(let i=0; i<26; i++){
    buts[i] = new Button(BUT_SPACING_X*i + x_shift,
                         BUT_SPACING_Y,
                         BUT_WIDTH,
                         BUT_HEIGHT,
                         BUT_COLOR,
                         alphabet[i]);
  }

  // Initialize selection
  SEL_COLOR = "rgba(255,255,0, 0.5)";
  selection = new Rect(0,0,0,0,SEL_COLOR);
  selection_timer = 0;
  selection_limit = Math.floor(FPS * 4/3);
  button_selection = null

  // Scroll bar positions
  scroll_bar_l = new Button(0,0,BAR_WIDTH,BAR_HEIGHT,BAR_COLOR, "<<");
  scroll_bar_r = new Button(canvas.width-BAR_WIDTH,0,BAR_WIDTH,BAR_HEIGHT,BAR_COLOR, ">>");

  // Run at 30fps
  window.setInterval(function(){
      loop();
  }, 1000 / FPS)
}

function drawBars() {
  scroll_bar_l.draw();
  scroll_bar_r.draw();
}

function drawButs() {
  for(i=0; i<buts.length; i++){
    buts[i].draw();
  }
}

function scroll(x) { // x>0 to scroll right, x<0 to scroll left
  for(i=0; i<buts.length; i++){
    buts[i].x += x;
    // buts[i].x %= TOTAL_BUT_LENGTH;
    if (buts[i].x > -10 * BUT_WIDTH + TOTAL_BUT_LENGTH) {
      buts[i].x -= TOTAL_BUT_LENGTH;
    }
    if (buts[i].x < -10 * BUT_WIDTH) {
      buts[i].x += TOTAL_BUT_LENGTH;
    }
  }
}

function getSelectedButton() {
  for(i=0; i<buts.length; i++){
    if (buts[i].collides(cursor))
      return buts[i];
  }
  return null;
}

// Return (x,y) mouse pos
function updateMousePos() {
  const rect = canvas.getBoundingClientRect();
  x = getX() - rect.left;
  y = getY() - rect.top;
  cursor = [x, y];
}

function clearCanvas() {
  // ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function loop(){
  clearCanvas();
  drawButs();
  drawBars();
  updateMousePos();
  if($("#output").text() != "BIG CHUNGUS") {
    $("#output").css("visibility", "visible");
  }
  if (scroll_bar_l.collides(cursor)) {
    selection_timer = 0;
    scroll(SCROLL_SPEED);
  }
  else if (scroll_bar_r.collides(cursor)) {
    selection_timer = 0;
    scroll(-SCROLL_SPEED);
  }
  else {
    button_selection = getSelectedButton();
    if (button_selection !== null) {
      selection_timer += 1;
      if (selection_timer >= selection_limit) {
        selection_timer = 0;
        document.getElementById("output").innerText += button_selection.str;
      }
    }
  }

  // Draw selection last
  if (button_selection !== null) {
    selection.width = BUT_WIDTH * (selection_timer/selection_limit);
    selection.height = BUT_HEIGHT * (selection_timer/selection_limit);
    selection.x = button_selection.x + button_selection.width/2 - selection.width/2;
    selection.y = button_selection.y + button_selection.height/2 - selection.height/2;
    selection.draw();
  }


}

window.onload = init();
