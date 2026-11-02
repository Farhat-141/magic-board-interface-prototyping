var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
let color = "#000";
let brushthickness = 7;
let pos = { x: 0, y: 0 };
document.querySelector(".color-btn div").style.backgroundColor = color;

function resize() {
  ctx.canvas.width = window.innerWidth - 20;
  ctx.canvas.height = window.innerHeight;
}

resize();

const erase = () => (ctx.globalCompositeOperation = "destination-out");

function sizeList() {
  document.querySelector(".size-list").classList.toggle("show-list");
}

function brushSize() {
  var brushSet = document.getElementsByClassName("size");
  Array.prototype.forEach.call(brushSet, function (element) {
    element.addEventListener("click", function () {
      brushthickness = element.getAttribute("style").substr(11, 2);
    });
  });
}

function setActiveColor() {
  document.querySelector(".color-btn div").style.backgroundColor = color;
  ctx.strokeStyle = color;
  ctx.globalCompositeOperation = "source-over";
}

function setColor() {
  var palette = document.getElementsByClassName("color");
  Array.prototype.forEach.call(palette, function (element) {
    element.addEventListener("click", function () {
      color = element.getAttribute("style").split("--set-color:")[1];
      setActiveColor();
    });
  });
}

function colorPick() {
  color = document.getElementById("color-picker").value;
  setActiveColor();
}


function setPosition(e) {
  var rect = canvas.getBoundingClientRect();
  pos.x = e.clientX - rect.left;
  pos.y = e.clientY - rect.top;
}

function draw(e) {
  if (e.buttons !== 1) return; 

  ctx.beginPath(); 
  ctx.lineWidth = brushthickness; 
  ctx.lineCap = "round"; 
  ctx.strokeStyle = color; 
  ctx.moveTo(pos.x, pos.y); 
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); 
  ctx.closePath();
  ctx.stroke(); 
}



function onSave() {
  const link = document.createElement("a");
  link.download = "sketch.png";
  link.href = canvas.toDataURL();
  link.click();
}

window.addEventListener("resize", resize);

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", setPosition);
canvas.addEventListener("mouseenter", setPosition);

document.getElementById("color-picker").addEventListener("input", colorPick);
brushSize();
setColor();