// make sure the canvas is full screen and responsive
var asideWidth = document.getElementsByTagName("aside")[0].offsetWidth;
var CanvasWidth=screen.availWidth-asideWidth;
var CanvasHeight=screen.availHeight;
var o=window.document.getElementById("canvas");
o.innerHTML="<canvas id='myCanvas' width='"+CanvasWidth+"' height='"+CanvasHeight+"'></canvas>";

// Get the canvas element
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
points = [];

// draw a line in a random position
function drawRandomLine() {
    var xi = Math.random() * canvas.width;
    var yi = Math.random() * canvas.height;
    pointi = new Point(xi, yi);
    var length = 100 + Math.random() * Math.min(xi, yi, canvas.width - xi, canvas.height - yi);
    var angle = Math.random() * 2 * Math.PI;

    var xf = xi + length * Math.cos(angle);
    var yf = yi + length * Math.sin(angle);
    pointf = new Point(xf, yf);
    // making sure the whole line is inside the canvas
    if (xf > canvas.width) {
        xf = canvas.width;
        xi = xf - length * Math.cos(angle);
    }
    if (yf > canvas.height) {
        yf = canvas.height;
        yi = yf - length * Math.sin(angle);
    }
    if (xi < 0) {
        xi = 0;
        xf = xi + length * Math.cos(angle);
    }
    if (yi < 0) {
        yi = 0;
        yf = yi + length * Math.sin(angle);
    }
    pointi.connectToPoint(pointf);
    pointi.drawToPoint(pointf);
    points.push(pointi);
    points.push(pointf);
}

drawRandomLine();

canvas.addEventListener("contextmenu", function(e) {
    e.preventDefault(); // prevent the default right-click menu from opening
});

// move the start, middle or end of the line
canvas.addEventListener("mousedown", function(e) {
    
    // iterate through all points in the points array
    for (var i = 0; i < points.length; i++) {
        var x = e.clientX - canvas.getBoundingClientRect().left;
        var y = e.clientY - canvas.getBoundingClientRect().top;
        var point = points[i];
        // mouse distance to the start of the line
        var mouseDistanceToLinexi = Math.abs(x - point.x);
        var mouseDistanceToLineyi = Math.abs(y - point.y);
        // mouse distance to the end of the line
        var mouseDistanceToLinexf = Math.abs(x - point.x);
        var mouseDistanceToLineyf = Math.abs(y - point.y);
        // mouse distance to the middle of the line
        var mouseDistanceToLinexm = Math.abs(x - (point.x + point.x) / 2);
        var mouseDistanceToLineym = Math.abs(y - (point.y + point.y) / 2);

        // if the mouse is close to the start of the line
        if (mouseDistanceToLinexi < 10 && mouseDistanceToLineyi < 10) {
            // move the start of the line
            canvas.addEventListener("mousemove", function(e) {
            point.set_x(e.clientX - canvas.getBoundingClientRect().left);
            point.set_y(e.clientY - canvas.getBoundingClientRect().top);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // redraw all lines
            for (var j = 0; j < points.length; j++) {
                points[j].drawToPoint(points[j].getConectedPoints()[0]);
            }
            });
            canvas.addEventListener("mouseup", function() {
            canvas.removeEventListener("mousemove", moveStart);
            });
        }

    }
});

function moveStart(e) {
    point.set_x(e.clientX - canvas.getBoundingClientRect().left);
    point.set_y(e.clientY - canvas.getBoundingClientRect().top);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var j = 0; j < points.length; j++) {
        points[j].drawToPoint(points[j].getConectedPoints()[0]);
    }
}