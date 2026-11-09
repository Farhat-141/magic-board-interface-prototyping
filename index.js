var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
let color = "#000";
let brushthickness = 7;
let pos = { x: 0, y: 0 };
let shape = "free"; // "free", "line", "rect", "circle" or "triangle"
let startPos = null; // where the shape drag began
let snapshot = null; // canvas picture taken before the shape drag
document.querySelector(".color-btn div").style.backgroundColor = color;

function resize() {
  ctx.canvas.width = window.innerWidth - 20;
  ctx.canvas.height = window.innerHeight;
}

resize();

const erase = () => {
  setShape("free");
  ctx.globalCompositeOperation = "destination-out";
};

// choose freehand or one of the ready-made shapes
function setShape(name) {
  shape = name;
  ctx.globalCompositeOperation = "source-over"; // leave eraser mode
  canvas.style.cursor = name === "free" ? "" : "crosshair";
  document.querySelectorAll(".shape-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.shape === name);
  });
}

// shapes are drawn while dragging: restore the saved picture, then draw the shape on top
function startDrawing(e) {
  setPosition(e);
  if (shape === "free") return;
  startPos = { x: pos.x, y: pos.y };
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function stopDrawing() {
  startPos = null;
  snapshot = null;
}

function drawShape(e) {
  setPosition(e);
  var dx = pos.x - startPos.x;
  var dy = pos.y - startPos.y;
  if (e.shiftKey && shape !== "line") {
    // hold Shift for equal sides: square, circle, even triangle
    var size = Math.max(Math.abs(dx), Math.abs(dy));
    dx = dx < 0 ? -size : size;
    dy = dy < 0 ? -size : size;
  }
  var x = startPos.x;
  var y = startPos.y;

  ctx.putImageData(snapshot, 0, 0); // remove the previous preview
  ctx.beginPath();
  if (shape === "line") {
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
  } else if (shape === "rect") {
    ctx.rect(x, y, dx, dy);
  } else if (shape === "circle") {
    ctx.ellipse(x + dx / 2, y + dy / 2, Math.abs(dx) / 2, Math.abs(dy) / 2, 0, 0, Math.PI * 2);
  } else if (shape === "triangle") {
    ctx.moveTo(x + dx / 2, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.lineTo(x, y + dy);
    ctx.closePath();
  }
  ctx.lineWidth = brushthickness;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  if (document.getElementById("fill-shape").checked && shape !== "line") ctx.fill();
  ctx.stroke();
}

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
  if (shape !== "free") {
    if (e.buttons === 1 && startPos) drawShape(e);
    return;
  }
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
canvas.addEventListener("mousedown", startDrawing);
window.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseenter", setPosition);

document.getElementById("color-picker").addEventListener("input", colorPick);
brushSize();
setColor();
document.querySelectorAll(".shape-btn").forEach(function (b) {
  b.addEventListener("click", function () {
    setShape(b.dataset.shape);
  });
});