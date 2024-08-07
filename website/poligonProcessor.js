// make sure the canvas is full screen and responsive
console.log("canvas width: ", CanvasWidth);

// canvas height should be at max the container height
console.log("container height: ", containerHeight);

// check if the screen width is less than 768px
if (screen.availWidth < 768) {
    var asideHeight = document.getElementsByTagName("aside")[0].offsetHeight;
    var CanvasHeight = screen.availHeight - asideHeight;
    var CanvasWidth = screen.availWidth;
    console.log("canvas height: ", CanvasHeight);
    console.log("canvas width: ", CanvasWidth);
} else {
    var asideWidth = document.getElementsByTagName("aside")[0].offsetWidth;
    var CanvasWidth = screen.availWidth - asideWidth;
    var containerHeight = document.getElementsByClassName("section")[0].offsetHeight;
    var CanvasHeight = containerHeight;
    console.log("canvas height: ", CanvasHeight);
    console.log("canvas width: ", CanvasWidth);
}

var o = window.document.getElementById("canvas");
o.innerHTML = "<canvas class='polygonCanvas' id='myCanvas' width='" + CanvasWidth + "' height='" + CanvasHeight + "'></canvas>";
// button to input a number beetwen 3-8 to generate a new geometric shape of that size
o.innerHTML+="<input class='polygonInput' type='number' id='inputNumber' min='3' max='8' placeholder='# of lines'>";
o.innerHTML+="<button class='polygonButton' id='generateShape'>Generate Polygon</button>";
// add a help button to highlight the middle of the lines
o.innerHTML+="<button class='helpButton' id='helpButton'>Help</button>";
// add a help text
o.innerHTML+="<p class='helpText' id='helpText' style='display:none;'><strong>Right click</strong> anywhere in the line to divide it in two <br><br> <strong>Left click</strong> and drag a point or middle of the line to move it</p>";

// Get the canvas element
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var shape = new GeometricShape(); // the shape that will be drawn
var clickCircleRadius = 15; // the radius of the circle that appears when a point is clicked

// draw a line in a random position
function drawRandomLine() {
    var xi = Math.random() * canvas.width;
    var yi = Math.random() * canvas.height;
    console.log("xi: ", xi, " yi: ", yi);
    pointi = new Point(xi, yi);
    // the length of the line is random at minimum 100px
    var length = Math.random() * 100 + 100;
    var angle = Math.random() * 2 * Math.PI;

    var xf = xi + length * Math.cos(angle);
    var yf = yi + length * Math.sin(angle);
    pointf = new Point(xf, yf);
    // making sure the whole line is inside the canvas
    var xLimit = canvas.width - clickCircleRadius;
    var yLimit = canvas.height - clickCircleRadius;
    while (pointi.get_x() < clickCircleRadius || pointi.get_x() > xLimit || pointi.get_y() < clickCircleRadius || pointi.get_y() > yLimit) {
        xi = Math.random() * canvas.width;
        yi = Math.random() * canvas.height;
        pointi = new Point(xi, yi);
    }
    while (pointf.get_x() < clickCircleRadius || pointf.get_x() > xLimit || pointf.get_y() < clickCircleRadius || pointf.get_y() > yLimit) {
        xf = Math.random() * canvas.width;
        yf = Math.random() * canvas.height;
        pointf = new Point(xf, yf);
    }
    pointi.connectToPoint(pointf);
    pointi.drawToPoint(pointf);
    pointf.connectToPoint(pointi);
    pointf.drawToPoint(pointi);
    shape.AddPoint(pointi);
    shape.AddPoint(pointf);
}

drawRandomLine();

canvas.addEventListener("contextmenu", function(e) {
    e.preventDefault(); // prevent the default right-click menu from opening
});

// move the start, middle or end of the line
canvas.addEventListener("mousedown", manageMouseClicksAndMoves);
    


function manageMouseClicksAndMoves(e) {
    if (e.button == 0) {
        console.log("left click");
        // get every point closer than 10px to the mouse click
        var close_points = [];
        // Check if event is from a mouse or touch
        if (e.type === 'touchstart' || e.type === 'touchmove') {
            currentMouseX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
            currentMouseY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
        } else {
            currentMouseX = e.clientX - canvas.getBoundingClientRect().left;
            currentMouseY = e.clientY - canvas.getBoundingClientRect().top;
        }
        for (var i = 0; i < shape.points.length; i++) {
            var distancex = Math.abs(shape.points[i].get_x() - currentMouseX);
            var distancey = Math.abs(shape.points[i].get_y() - currentMouseY);
            // if the point is closer than 10px to the mouse click add it to the list
            if (distancex < clickCircleRadius && distancey < clickCircleRadius) {
                close_points.push(shape.points[i]);
                console.log("point clicked: ", shape.points[i], " at index ", i);
            }
            // check if the current click is in the middle of a line
            var isMiddle = false;
            if (i < shape.points.length - 1) {
                console.log("checking if points ", i, " and ", i + 1, " are in the middle of the line");
                var point1 = shape.points[i];
                var point2 = shape.points[i + 1];
                var midpointX = (point1.get_x() + point2.get_x()) / 2;
                var midpointY = (point1.get_y() + point2.get_y()) / 2;
                var deltaX = midpointX - currentMouseX;
                var deltaY = midpointY - currentMouseY;
                if (Math.abs(deltaX) < clickCircleRadius && Math.abs(deltaY) < clickCircleRadius){
                    isMiddle = true;
                }
            }
            // check if the last and first point are in the middle of the line
            if (i == shape.points.length - 1 && shape.points.length > 2 && close_points.length == 0) {
                console.log("checking if points ", i, " and ", 0, " are in the middle of the line");
                var point1 = shape.points[i];
                var point2 = shape.points[0];
                var midpointX = (point1.get_x() + point2.get_x()) / 2;
                var midpointY = (point1.get_y() + point2.get_y()) / 2;
                var deltaX = midpointX - currentMouseX;
                var deltaY = midpointY - currentMouseY;
                if (Math.abs(deltaX) < clickCircleRadius && Math.abs(deltaY) < clickCircleRadius){
                    isMiddle = true;
                    console.log("middle point is: ", midpointX, midpointY);
                }
            }
            if (isMiddle) {
                console.log("middle of the line");
                close_points.push(point1, point2);
            }
            console.log("close points: ", close_points);
            
        }
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
            console.log("point1: ", point1);
            console.log("point2: ", point2);
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
    }

    if (e.button == 2) {
        console.log("right click");
        // Check if event is from a mouse or touch
        if (e.type === 'touchstart' || e.type === 'touchmove') {
            currentMouseX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
            currentMouseY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
        } else {
            currentMouseX = e.clientX - canvas.getBoundingClientRect().left;
            currentMouseY = e.clientY - canvas.getBoundingClientRect().top;
        }
        var close_points = [];
        for (var i = 0; i < shape.points.length; i++) {
            // check if the current click is in the inside a line
            var isBetween = false;
            // checking if the current click is anywhere in the line
            if (i < shape.points.length - 1) {
                // check if the current click is in the inside a line
                var isBetween = false;
                // checking if the current click is anywhere in the line
                if (i < shape.points.length - 1) {
                    var point1 = shape.points[i];
                    var point2 = shape.points[i + 1];
                    // calculate the distance between the two points
                    var deltaX = point2.get_x() - point1.get_x();
                    var deltaY = point2.get_y() - point1.get_y();
                    // calculate the distance between the click and each point
                    var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
                    var distance1 = Math.sqrt(Math.pow(currentMouseX - point1.get_x(), 2) + Math.pow(currentMouseY - point1.get_y(), 2));
                    var distance2 = Math.sqrt(Math.pow(currentMouseX - point2.get_x(), 2) + Math.pow(currentMouseY - point2.get_y(), 2));
                    // check if the distance between the two points is approximately equal to the sum of the distances from the click to each point
                    if (distance1 + distance2 - distance < 0.1) {
                        isBetween = true;
                    }
                }
                // check if the last and first point are in the middle of the line
                if (i == shape.points.length - 1 && shape.points.length > 2) {
                    var point1 = shape.points[i];
                    var point2 = shape.points[0];
                    var deltaX = point2.get_x() - point1.get_x();
                    var deltaY = point2.get_y() - point1.get_y();
                    var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
                    var distance1 = Math.sqrt(Math.pow(currentMouseX - point1.get_x(), 2) + Math.pow(currentMouseY - point1.get_y(), 2));
                    var distance2 = Math.sqrt(Math.pow(currentMouseX - point2.get_x(), 2) + Math.pow(currentMouseY - point2.get_y(), 2));
                    // check if the distance between the two points is approximately equal to the sum of the distances from the click to each point
                    if (distance1 + distance2 - distance < 0.1) {
                        isBetween = true;
                    }
                }
            }
            // check if the last and first point are in the middle of the line
            if (i == shape.points.length - 1 && shape.points.length > 2) {
                var point1 = shape.points[i];
                var point2 = shape.points[0];
                var deltaX = point2.get_x() - point1.get_x();
                var deltaY = point2.get_y() - point1.get_y();
                var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
                var distance1 = Math.sqrt(Math.pow(currentMouseX - point1.get_x(), 2) + Math.pow(currentMouseY - point1.get_y(), 2));
                var distance2 = Math.sqrt(Math.pow(currentMouseX - point2.get_x(), 2) + Math.pow(currentMouseY - point2.get_y(), 2));
                if (distance1 + distance2 - distance < 0.1) {
                    isBetween = true;
                }
            }


            if (isBetween) {
                close_points.push(point1);
                close_points.push(point2);
            }
        }

        // if there are two points close to the mouse click divide the line in two
        while (close_points.length == 2) {
            var point1 = close_points.pop();
            var point2 = close_points.pop();
            // poit where the line will be divided
            var newPoint = new Point(currentMouseX, currentMouseY);

            // remove the connection between the two points
            
            console.log("point1 connected points: ", point1.getConectedPoints());
            point1.removeConectedPoint(point2);
            console.log("point1 connected points: ", point1.getConectedPoints());
            
            console.log("point2 connected points: ", point2.getConectedPoints());            
            point2.removeConectedPoint(point1);
            console.log("point2 connected points: ", point2.getConectedPoints());

            newPoint.connectToPoint(point1);
            newPoint.connectToPoint(point2);
            // add the new point in between the two points
            shape.AddPoint(newPoint, shape.points.indexOf(point1));

            console.log(shape.points);

            shape.Draw();
            
        }
    }
}

// if the button is clicked draw a new random shape
document.getElementById("generateShape").addEventListener("click", drawRandomShape);

// if the help button is clicked show the help text
document.getElementById("helpButton").addEventListener("click", showHelp);

function showHelp() {
    var helpText = document.getElementById("helpText");
    if (helpText.style.display == "none") {
        helpText.style.display = "block";
    }
    else {
        helpText.style.display = "none";
    }
}
function movePoint(e, point) {
    point.set_x(e.clientX - canvas.getBoundingClientRect().left);
    point.set_y(e.clientY - canvas.getBoundingClientRect().top);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shape.Draw();
}

function moveLine(e, point1, point2) {
    var deltaX = e.clientX - canvas.getBoundingClientRect().left - (point1.get_x() + point2.get_x()) / 2;
    var deltaY = e.clientY - canvas.getBoundingClientRect().top - (point1.get_y() + point2.get_y()) / 2;
    point1.set_x(point1.get_x() + deltaX);
    point1.set_y(point1.get_y() + deltaY);

    point2.set_x(point2.get_x() + deltaX);
    point2.set_y(point2.get_y() + deltaY);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shape.Draw();
}

function drawRandomShape() {
    var numberOfPoints = document.getElementById("inputNumber").value;
    // check if the number of points is a number and is between 3 and 8
    if (isNaN(numberOfPoints) || numberOfPoints < 3 || numberOfPoints > 8) {
        alert("Please enter a number between 3 and 8");
        return;
    }
    // clear the points
    shape.points = [];

    // generate the number of points specified by the user
    for (let i = 0; i < numberOfPoints; i++) {
        var xi = Math.random() * canvas.width;
        var yi = Math.random() * canvas.height;
        
        // if its too close to the border generate a new point
        while (xi < clickCircleRadius || xi > canvas.width - clickCircleRadius || yi < clickCircleRadius || yi > canvas.height - clickCircleRadius) {
            xi = Math.random() * canvas.width;
            yi = Math.random() * canvas.height;
        }

        // if a point is too close to another point generate a new one
        for (let j = 0; j < shape.points.length; j++) {
            var xj = shape.points[j].get_x();
            var yj = shape.points[j].get_y();
            var distance = Math.sqrt(Math.pow(xi - xj, 2) + Math.pow(yi - yj, 2));
            // if the distance is less than 3 times the radius of the circle generate a new point
            while (distance < clickCircleRadius*3) {
                xi = Math.random() * canvas.width;
                yi = Math.random() * canvas.height;
                distance = Math.sqrt(Math.pow(xi - xj, 2) + Math.pow(yi - yj, 2));
            }
        }
        point = new Point(xi, yi);
        shape.AddPoint(point);
    }

    // change the order of the point to avoid crossing lines
    shape.points = shape.points.sort((a, b) => a.get_x() - b.get_x());
    
    // connect the points in a circle
    for (let i = 0; i < shape.points.length - 1; i++) {
        shape.points[i].connectToPoint(shape.points[i + 1]);
    }
    shape.points[shape.points.length - 1].connectToPoint(shape.points[0]);
    console.log(shape.points);
    shape.Draw();
}