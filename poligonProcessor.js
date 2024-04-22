// make sure the canvas is full screen and responsive
var asideWidth = document.getElementsByTagName("aside")[0].offsetWidth;
var CanvasWidth=screen.availWidth-asideWidth;
var CanvasHeight=screen.availHeight;
var o=window.document.getElementById("canvas");
o.innerHTML="<canvas id='myCanvas' width='"+CanvasWidth+"' height='"+CanvasHeight+"'></canvas>";

// Get the canvas element
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
let line = {xi: 0, yi: 0, xf: 0, yf: 0};
let lines = [];

// draw a line in a random position
function drawRandomLine() {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    // making sure the whole line is inside the canvas
    var length = 100 + Math.random() * Math.min(x, y, canvas.width - x, canvas.height - y);
    var angle = Math.random() * 2 * Math.PI;

    ctx.strokeStyle = "black"; // Define a cor da linha
    ctx.lineWidth = 1; // Define a largura da linha

    ctx.beginPath(); // Inicia um novo caminho
    ctx.moveTo(x, y); // Move o cursor para a posição (x, y)
    ctx.lineTo(x + length * Math.cos(angle), y + length * Math.sin(angle)); 
    ctx.stroke(); // Desenha a linha

    line.xi = x;
    line.yi = y;
    line.xf = x + length * Math.cos(angle);
    line.yf = y + length * Math.sin(angle);
    lines.push(line);
}

drawRandomLine();

canvas.addEventListener("contextmenu", function(e) {
    e.preventDefault(); // prevent the default right-click menu from opening
});

// move the start, middle or end of the line
canvas.addEventListener("mousedown", function(e) {
    var x = e.clientX - canvas.getBoundingClientRect().left;
    var y = e.clientY - canvas.getBoundingClientRect().top;
    
    // mouse distance to the start of the line
    mouseDistanceToLinexi = Math.abs(x - line.xi);
    mouseDistanceToLineyi = Math.abs(y - line.yi);
    // mouse distance to the end of the line
    mouseDistanceToLinexf = Math.abs(x - line.xf);
    mouseDistanceToLineyf = Math.abs(y - line.yf);
    // mouse distance to the middle of the line
    mouseDistanceToLinexm = Math.abs(x - (line.xi + line.xf) / 2);
    mouseDistanceToLineym = Math.abs(y - (line.yi + line.yf) / 2);

    // check if the click is close to the start of the line
    if (mouseDistanceToLinexi < 10 && mouseDistanceToLineyi < 10) {
        canvas.addEventListener("mousemove", moveLineStart);
        canvas.addEventListener("mouseup", function() {
            canvas.removeEventListener("mousemove", moveLineStart);
        });
    }
    
    // check if the click is close to the end of the line
    if (mouseDistanceToLinexf < 10 && mouseDistanceToLineyf < 10) {
        canvas.addEventListener("mousemove", moveLineEnd);
        canvas.addEventListener("mouseup", function() {
            canvas.removeEventListener("mousemove", moveLineEnd);
        });
    }
    
    // check if the click is close to the middle of the line, then move the whole line
    if (mouseDistanceToLinexm < 10 && mouseDistanceToLineym < 10) {
        canvas.addEventListener("mousemove", moveLine);
        canvas.addEventListener("mouseup", function() {
            canvas.removeEventListener("mousemove", moveLine);
        });
    }

    // check if the right-click happened. If so, break the line and make the two points of the line conect to the mouse position
    if (e.button == 2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(line.xi, line.yi);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(line.xf, line.yf);
        ctx.stroke();
        line.xf = x;
        line.yf = y;
        lines.push(line);
    }
});



// move the whole line
function moveLine(e) {
    var x = e.clientX - canvas.getBoundingClientRect().left;
    var y = e.clientY - canvas.getBoundingClientRect().top;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    // calculate the distance between the original starting and ending points
    // these distances will be used to update the starting and ending points 
    var dx = line.xf - line.xi;
    var dy = line.yf - line.yi;
    // update starting points
    line.xi = x - dx / 2;
    line.yi = y - dy / 2;
    // update ending points
    line.xf = x + dx / 2;
    line.yf = y + dy / 2;
    ctx.moveTo(line.xi, line.yi);
    ctx.lineTo(line.xf, line.yf);
    ctx.stroke();
}

function moveLineStart(e) {
    var x = e.clientX - canvas.getBoundingClientRect().left;
    var y = e.clientY - canvas.getBoundingClientRect().top;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(line.xf, line.yf);
    ctx.stroke();
    line.xi = x;
    line.yi = y;
}

function moveLineEnd(e) {
    var x = e.clientX - canvas.getBoundingClientRect().left;
    var y = e.clientY - canvas.getBoundingClientRect().top;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(line.xi, line.yi);
    ctx.lineTo(x, y);
    ctx.stroke();
    line.xf = x;
    line.yf = y;
}
