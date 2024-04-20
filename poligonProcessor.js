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
}

drawRandomLine();


// move the start, middle or end of the line
canvas.addEventListener("mousedown", function(e) {
    var x = e.clientX - canvas.getBoundingClientRect().left;
    var y = e.clientY - canvas.getBoundingClientRect().top;

    // check if the click is close to the start of the line
    if (Math.abs(x - line.xi) < 10 && Math.abs(y - line.yi) < 10) {
        canvas.addEventListener("mousemove", moveLineStart);
        canvas.addEventListener("mouseup", function() {
            canvas.removeEventListener("mousemove", moveLineStart);
        });
    // check if the click is close to the end of the line
    } else if (Math.abs(x - line.xf) < 10 && Math.abs(y - line.yf) < 10) {
        canvas.addEventListener("mousemove", moveLineEnd);
        canvas.addEventListener("mouseup", function() {
            canvas.removeEventListener("mousemove", moveLineEnd);
        });
    }
});

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
