class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get_x() {
        return this.x;
    }
    get_y() {
        return this.y;
    }
    set_x(x) {
        this.x = x;
    }
    set_y(y) {
        this.y = y;
    }
    equals(coordinate) {
        return this.x === coordinate.x && this.y === coordinate.y;
    }    
}