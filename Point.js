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
    drawToPoint(point) {
        // clear the canvas
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    }
}
