class Point extends Coordinate {
    constructor(x, y) {
        super(x, y);
    }
    conected_points = [];
    addConectedPoint(point) {
        this.conected_points.push(point);
    }
    removeConectedPoint(point) {
        this.conected_points = this.conected_points.filter(p => !p.equals(point));
    }
    getConectedPoints() {
        return this.conected_points;
    }
    clearConectedPoints() {
        this.conected_points = [];
    }
    isConected(point) {
        return this.conected_points.some(p => p.equals(point));
    }
    connectToPoint(point) {
        this.addConectedPoint(point);
        point.addConectedPoint(this);
    }
    // draw a line between this point and the specified point
    drawToPoint(point) {
        // draw a black dot in the center of the point
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI); // black dot
        ctx.fillStyle = "black";
        ctx.fill();

        // draw a red dot at the middle of the line
        ctx.beginPath();
        ctx.arc((this.x + point.x) / 2, (this.y + point.y) / 2, 3, 0, 2 * Math.PI); // red dot
        ctx.fillStyle = "red";
        ctx.fill();

        // draw the line
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(point.x, point.y);

        ctx.stroke();
    }
}
