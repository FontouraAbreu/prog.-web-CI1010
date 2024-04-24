// make sure the canvas is full screen and responsive
var asideWidth = document.getElementsByTagName("aside")[0].offsetWidth;
var CanvasWidth=screen.availWidth-asideWidth;
var CanvasHeight=screen.availHeight;
var o=window.document.getElementById("canvas");
o.innerHTML="<canvas id='myCanvas' width='"+CanvasWidth+"' height='"+CanvasHeight+"'></canvas>";

// Get the canvas element
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var shape = new GeometricShape(); // the shape that will be drawn
var clickCircleRadius = 20; // the radius of the circle that appears when a point is clicked

// draw a line in a random position
function drawRandomLine() {
    var xi = Math.random() * canvas.width;
    var yi = Math.random() * canvas.height;
    pointi = new Point(xi, yi);
    // the length of the line is random at minimum 100px
    var length = Math.random() * 100 + 100;
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
    pointf.connectToPoint(pointi);
    shape.AddPoint(pointi);
    shape.AddPoint(pointf);
}

drawRandomLine();

canvas.addEventListener("contextmenu", function(e) {
    e.preventDefault(); // prevent the default right-click menu from opening
});

// move the start, middle or end of the line
canvas.addEventListener("mousedown", function(e) {
    // get every point closer than 10px to the mouse click
    var close_points = [];
    currentMouseX = e.clientX - canvas.getBoundingClientRect().left;
    currentMouseY = e.clientY - canvas.getBoundingClientRect().top;
    for (var i = 0; i < shape.points.length; i++) {
        var distancex = Math.abs(shape.points[i].get_x() - currentMouseX);
        var distancey = Math.abs(shape.points[i].get_y() - currentMouseY);
        // if the point is closer than 10px to the mouse click add it to the list
        if (distancex < clickCircleRadius && distancey < clickCircleRadius) {
            close_points.push(shape.points[i]);
        }
        // check if the current click is in the middle of a line
        var isMiddle = false;
        if (i < shape.points.length - 1) {
            var point1 = shape.points[i];
            var point2 = shape.points[i + 1];
            var midpointX = (point1.get_x() + point2.get_x()) / 2;
            var midpointY = (point1.get_y() + point2.get_y()) / 2;
            var deltaX = midpointX - currentMouseX;
            var deltaY = midpointY - currentMouseY;
            if (Math.abs(deltaX) < clickCircleRadius && Math.abs(deltaY) < clickCircleRadius){
                isMiddle = true;
                console.log("middle");
            }
        }
        if (isMiddle) {
            close_points.push(point1);
            close_points.push(point2);
        }


    }
    console.log(close_points);
    // console.log(close_points);
    // if there is a point close to the mouse click move it until the click is released
    while (close_points.length == 1) {
        var point = close_points.pop();
        var mouseMove = function(e) {
            movePoint(e, point);
        };
        var mouseUp = function(e) {
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mouseup", mouseUp);
        };
        canvas.addEventListener("mousemove", mouseMove);
        canvas.addEventListener("mouseup", mouseUp);
    }
    // check if the clicked point is in the middle of a line
    while (close_points.length == 2) {
        var point1 = close_points.pop();
        var point2 = close_points.pop();
        var mouseMove = function(e) {
            moveLine(e, point1, point2);
        };
        var mouseUp = function(e) {
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mouseup", mouseUp);
        };
        canvas.addEventListener("mousemove", mouseMove);
        canvas.addEventListener("mouseup", mouseUp);
    }
});

function movePoint(e, point) {
    point.set_x(e.clientX - canvas.getBoundingClientRect().left);
    point.set_y(e.clientY - canvas.getBoundingClientRect().top);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shape.Draw(point);
}

function moveLine(e, point1, point2) {
    var deltaX = e.clientX - canvas.getBoundingClientRect().left - (point1.get_x() + point2.get_x()) / 2;
    var deltaY = e.clientY - canvas.getBoundingClientRect().top - (point1.get_y() + point2.get_y()) / 2;
    point1.set_x(point1.get_x() + deltaX);
    point1.set_y(point1.get_y() + deltaY);
    point2.set_x(point2.get_x() + deltaX);
    point2.set_y(point2.get_y() + deltaY);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shape.Draw(point1);
}