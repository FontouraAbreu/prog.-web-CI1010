class GeometricShape {
    points = [];
    /* Add a point in the specified index */
    AddPoint(point, index) {
        var hasIndex = index != null;

        if (!hasIndex) {
            this.points.splice(index, 0, point);
        }
        else {
            this.points.push(point);
        }
    }

    Draw(point) {
        var hasPoint = point != null;
        
        if (hasPoint) {
            var connected_points = point.getConectedPoints();
            for (let i = 0; i < connected_points.length; i++) {
                point.drawToPoint(connected_points[i]);
            }
        }
        else {
            for (let i = 0; i < this.points.length - 1; i++) {
                this.points[i].drawToPoint(this.points[i + 1]);
            }
        }
    }
}