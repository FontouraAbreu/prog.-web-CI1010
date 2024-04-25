class GeometricShape {
    points = [];
    /* Add a point in the specified index */
    AddPoint(point, index) {
        var hasIndex = index != null;

        if (!hasIndex) {
            this.points.push(point);
        }
        // add the point in the specified index and move the rest of the points
        else {
            this.points.splice(index, 0, point);
        }
    }

    /* Remove a point from the specified index */
    RemovePoint(index) {
        this.points.splice(index, 1);
    }

    Draw(point) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var hasPoint = point != null;
        
        if (hasPoint) {
            var connected_points = point.getConectedPoints();
            for (let i = 0; i < connected_points.length; i++) {
                point.drawToPoint(connected_points[i]);
            }
        }
        else {
            // for each point draw a line between the connected points
            for (let i = 0; i < this.points.length; i++) {
                var connected_points = this.points[i].getConectedPoints();
                for (let j = 0; j < connected_points.length; j++) {
                    this.points[i].drawToPoint(connected_points[j]);
                }
            }
        }
    }
}