const randomPositions = false;

function rgbToHex(rgb) {
    if (rgb.length !== 3) {
        throw new Error(
            "Input should be an array with three values for r, g, b."
        );
    }

    function toHex(value) {
        let hex = Number(value).toString(16);
        return hex.length < 2 ? "0" + hex : hex;
    }

    return "#" + toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]);
}

function Circle(cx, cy, radius, angle = 0, inX = 0, inY = 0) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.angle = angle;
    this.inX = inX;
    this.inY = inY;
}

function CirclePath() {
    this.circles = [];
    this.longestPath = [];
    this.minRadius = 50;
    this.maxRadius = 150;
    this.minDist = 20;
    this.num = 20;
    this.show = false;
    this.canAddMoreCircles = true;
    this.backtrackCount = 0;

    this.addCircle = () => {
        let maxAttempts = 10;
        let attempts = 0;
        let success = false;
        while (attempts < maxAttempts && this.circles.length > 0) {
            const c = this.circles.at(-1);
            const r = p5.random(p5.TWO_PI);
            const angle = p5.random(-r, r);
            const radius = p5.random(this.minRadius, this.maxRadius);
            let x = c.cx + Math.cos(angle) * (radius + c.radius);
            let y = c.cy + Math.sin(angle) * (radius + c.radius);
            let v = p5.createVector(x, y);
            x = c.cx + Math.cos(angle) * c.radius;
            y = c.cy + Math.sin(angle) * c.radius;
            const circle = new Circle(v.x, v.y, radius, angle, x, y);

            // Check if next circle can be placed from this position
            if (
                this.checkCircles(circle) &&
                !this.outOfBounds(circle) &&
                this.canPlaceNextCircle(circle)
            ) {
                this.circles.push(circle);
                success = true;
                // backtrackCount = 0
                break;
            }
            attempts++;
        }

        if (!success) {
            if (this.circles.length > this.longestPath.length) {
                this.longestPath = this.circles.slice();
            }
            this.circles.pop();
            this.backtrackCount++;
        }
        if (this.backtrackCount >= 20) {
            this.circles = this.longestPath;
            this.canAddMoreCircles = false;
        }
    };

    this.canPlaceNextCircle = (c) => {
        let maxAttempts = 20;
        let attempts = 0;

        while (attempts < maxAttempts) {
            var r = p5.random(p5.TWO_PI);
            var angle = p5.random(-r, r);
            var radius = p5.random(this.minRadius, this.maxRadius);
            var x = c.cx + Math.cos(angle) * (radius + c.radius);
            var y = c.cy + Math.sin(angle) * (radius + c.radius);

            const newC = new Circle(x, y, radius, angle, 0, 0);
            if (this.checkCircles(newC) && !this.outOfBounds(newC)) {
                return true;
            }
            attempts++;
        }

        return false;
    };
    this.checkCircles = (c) => {
        for (var i = 0; i < this.circles.length; i++) {
            const cc = this.circles[i];
            const offset = i === this.circles.length - 1 ? 0 : 1;
            if (
                p5.dist(c.cx, c.cy, cc.cx, cc.cy) <
                c.radius + cc.radius + offset * this.minDist
            ) {
                return false;
            }
        }
        return true;
    };

    this.outOfBounds = (c) => {
        return (
            c.cx - c.radius - this.minDist * 0.25 < 0 ||
            c.cx + c.radius + this.minDist * 0.25 > p5.width ||
            c.cy - c.radius + this.minDist * 0.25 < 0 ||
            c.cy + c.radius - this.minDist * 0.25 > p5.height
        );
    };

    this.getPoints = (_points) => {
        const definition = (p5.TWO_PI * 1) / this.minRadius;

        const points = _points.map((circle, index, circles) => {
            const pointsOnCircles = [];
            const c = circle;
            const nc = circles.at((index + 1) % circles.length);
            const angle_in = p5.atan2(c.cy - c.inY, c.cx - c.inX);
            const angle_out = p5.atan2(c.cy - nc.inY, c.cx - nc.inX);
            let ai = p5.map(angle_in, -p5.PI, p5.PI, 0, p5.TWO_PI);
            let ao = p5.map(angle_out, -p5.PI, p5.PI, 0, p5.TWO_PI);

            if (index % 2 === 0) {
                if (ao < ai) ao += p5.TWO_PI;
                for (let i = ai; i < ao; i += definition) {
                    const x = c.cx + Math.cos(i) * c.radius;
                    const y = c.cy + Math.sin(i) * c.radius;
                    pointsOnCircles.push(p5.createVector(x, y));
                }
            } else {
                if (ai < ao) ai += p5.TWO_PI;

                for (let i = ai; i > ao; i -= definition) {
                    const x = c.cx + Math.cos(i) * c.radius;
                    const y = c.cy + Math.sin(i) * c.radius;

                    pointsOnCircles.push(p5.createVector(x, y));
                }
            }

            return pointsOnCircles;
        });

        return points;
    };

    this.render = (pathColor) => {
        let previous;
        p5.noFill();
        // for (var i = 0; i < this.circles.length; i++) {
        //     const c = this.circles[i];
        //     p5.noFill();
        //     p5.stroke(238, 150);
        //     p5.strokeWeight(1);
        //     if (i > 0 && this.show) {
        //         p5.ellipse(c.cx, c.cy, c.radius * 2, c.radius * 2);
        //         previous = this.circles[i - 1];
        //         p5.line(previous.cx, previous.cy, c.cx, c.cy);
        //         p5.ellipse(c.cx, c.cy, 5, 5);
        //         p5.ellipse(c.inX, c.inY, 10, 10);
        //     }
        // }

        const points = this.getPoints(this.circles);
        p5.push();
        p5.stroke(pathColor);
        p5.strokeWeight(this.minDist*2);
        p5.strokeCap(p5.SQUARE)
        p5.beginShape();
        const circles = points.flat().map((point) => {
            p5.vertex(point.x, point.y);
            return;
        });
        p5.endShape();
        p5.pop();
    };
}

function CirclePathSystem() {
    this.paths = [];
    this.longestPath = undefined;
    this.allDone = false;
    this.colors = [];

    this.initialize = (x, y, num = 1) => {
        this.paths = new Array(num).fill(0).map((_, i, arr) => {
            const path = new CirclePath();
            const randomOrMouseX = randomPositions
                ? Math.floor(Math.random() * width)
                : x;
            const randomOrMouseY = randomPositions
                ? Math.floor(Math.random() * height)
                : y;
            const _x = p5.constrain(
                randomOrMouseX,
                path.minRadius,
                p5.width - path.minRadius
            );
            const _y = p5.constrain(
                randomOrMouseY,
                path.minRadius,
                p5.height - path.minRadius
            );
            path.circles.push(
                new Circle(
                    _x,
                    _y,
                    path.minRadius,
                    0,
                    (i / arr.length) * p5.PI * num
                )
            );
            this.colors.push([
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
            ]);
            return path;
        });
        this.colors = this.colors.map((rgb) => rgbToHex(rgb));
    };
    this.isComplete = () => {
        return this.paths.every((path) => !path.canAddMoreCircles);
    };
    this.getLongestPath = () => {
        return this.paths.reduce(
            (p, c, i, a) => (a[p].circles.length > c.circles.length ? p : i),
            0
        );
    };

    this.run = () => {
        if (!this.allDone) {
            this.paths.forEach((path) => {
                if (path.circles.length < path.num && path.canAddMoreCircles) {
                    path.addCircle();
                }
            });

            if (this.isComplete()) {
                this.allDone = true;
                this.longestPath = this.paths[this.getLongestPath()];
            }
        }
    };

    this.show = (renderAll = true) => {
        if (this.allDone) {
            if (renderAll) {
                this.paths.forEach((path, i) => path.render(this.colors[i]));
            } else {
                this.longestPath.render("#000");
            }
        } else {
            p5.push();
            p5.noStroke();
            p5.fill(0);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(
                "Computer is computing ...\n🤖",
                p5.width / 2,
                p5.height / 2
            );
            p5.pop();
        }
    };
}
