/* adapted from http://10k.aneventapart.com/Entry/Details/599 */
function Trail(a) {
    $.extend(this, {
            changeDirectionTimeout: 2e3,
            splitTimeout: 5e3,
            spawnPointTimeout: 1e3,
            spawnMiniPointTimeout: 100,
            spawnMiniPointInterval: 100,
            direction: Math.PI,
            targetDirection: Math.PI,
            rotationSpeed: .1,
            position: [0, 0],
            tick: 0,
            points: [],
            miniPoints: [],
            segments: [],
            evil: false,
            dead: false
        }, a);
    if (!this.targetDirection) this.targetDirection = this.direction;
    if (this.colorIndex === undefined) {
        while (this.colorIndex == game.colorIndex || this.colorIndex === undefined) this.colorIndex = 1 + Math.floor(Math.random() * (def.colors.length - 1))
    }
    if (plant.dead) this.colorIndex = 0;
    this.color = def.colors[this.colorIndex];
    this.spawnMiniPointInterval = 250
}

function Flower(a) {
    $.extend(this, {
            position: [0, 0],
            status: "growing",
            width: 0,
            maxWidth: 0,
            stepWidth: 2,
            tick: 0,
            interval: 25,
            texture: assets.flower(parseInt(Math.random() * 20))
        }, a);
    if (!this.maxWidth) this.maxWidth = this.texture.size * 5
}

function Branch(a) {
    $.extend(this, {
            status: "growing",
            segments: [],
            depth: 0,
            maximumDepth: 2,
            maximumLength: 10,
            maximumFlowerWidth: 0,
            tick: 0,
            interval: 30,
            lifespan: 2e3,
            position: [0, 0],
            angle: 0,
            segmentLength: 4,
            deviation: Math.PI / 3,
            color: "#480",
            mirroring: true,
            flowers: []
        }, a);
    if (this.mirroring)
        if (Math.random() > .5) this.angle -= Math.PI;
    this.initialLifespan = this.lifespan;
    this.angle += -this.deviation / 2 + Math.random() * this.deviation;
    this.segments.push($.clone(this.position))
}

function gradient() {
    var a = [];
    var b = arguments[arguments.length - 1];
    for (var c = 0; c < arguments.length - 2; c++) {
        a.push(arguments[c]);
        var d = arguments[c];
        var e = arguments[c + 1];
        for (var f = 1; f <= b; f++) {
            if (d instanceof Array) var g = [];
            else var g = {};
            for (var h in d) {
                if (d[h] > e[h]) g[h] = parseInt(d[h] - f * (d[h] - e[h]) / (b + 1));
                else g[h] = parseInt(d[h] + f * (e[h] - d[h]) / (b + 1))
            }
            a.push(g)
        }
    }
    a.push(arguments[arguments.length - 2]);
    return a;
    a.push(d);
    for (var f = 1; f <= b; f++) {
        if (d instanceof Array) var g = [];
        else var g = {};
        for (var h in d) {
            if (d[h] > e[h]) g[h] = parseInt(d[h] - f * (d[h] - e[h]) / (b + 1));
            else g[h] = parseInt(d[h] + f * (e[h] - d[h]) / (b + 1))
        }
        a.push(g)
    }
    a.push(e);
    return a
}

function Vector(a) {
    this.coords = a
}
Vector.prototype.length = function () {
    return Math.sqrt(this.coords[0] * this.coords[0] + this.coords[1] * this.coords[1])
};
Vector.prototype.normalize = function () {
    var a = this.length();
    return new Vector(this.coords[0] / a, this.coords[1] / a)
};
Vector.prototype.dotProduct = function (a) {
    return this.coords[0] * a.coords[0] + this.coords[1] * a.coords[1]
};
Vector.prototype.subtract = function (a) {
    return new Vector([this.coords[0] - a[0], this.coords[1] - a[1]])
};
Vector.prototype.angleFrom = function (a) {
    return Math.acos(this.dotProduct(a) / (this.length() * a.length()))
};
Vector.prototype.distanceFrom = function (a) {
    return (new Vector(this.coords[0] - a.coords[0], this.coords[1] - a.coords[1])).length()
};
Vector.prototype.clockAngle = function (a) {
    var b = new Vector([1, 0]);
    if (a) {
        var c = this.subtract(a)
    } else {
        var c = this
    }
    var d = c.angleFrom(b);
    if (c.coords[1] >= 0) {
        return d
    } else {
        return Math.PI + (Math.PI - d)
    }
};
$.clone = function (a) {
    function b() {}
    b.prototype = a;
    var c = new b;
    c.constructor = b;
    return c
};
$.last = function (a) {
    return a[a.length - 1]
};
Number.prototype.toInt = function () {
    return this | 0
};
Math.distance = function (a, b, c, d) {
    var e = a - c;
    var f = b - d;
    return Math.sqrt(e * e + f * f)
};
Math.pointInRect = function (a, b) {
    if (a[0] < b[0] || a[0] > b[0] + b[2] || a[1] < b[1] || a[1] > b[1] + b[3]) return false;
    else return true
};
var events = {
    listeners: {},
    bind: function (a, b, c, d) {
        if (c === undefined) c = {};
        if (d === undefined) d = this;
        if (this.listeners[a] === undefined) this.listeners[a] = [];
        this.listeners[a].push({
                callback: b,
                args: c,
                context: d
            })
    },
    trigger: function (a, b) {
        if (b === undefined) b = {};
        if (this.listeners[a] !== undefined) {
            for (var c = 0; c < this.listeners[a].length; c++) {
                var d = this.listeners[a][c];
                d.callback.call(d.context, $.extend({}, b, d.args))
            }
        }
    }
};
var implant = {
    events: function (a) {
        a.listeners = {}, a.listen = function (a, b, c, d, e) {
            a.bind(b, c, d, this)
        };
        a.bind = function (a, b, c, d) {
            if (c === undefined) c = {};
            if (d === undefined) d = this;
            if (this.listeners[a] === undefined) this.listeners[a] = [];
            this.listeners[a].push({
                    callback: b,
                    args: c,
                    context: d
                })
        }, a.trigger = function (a, b) {
            if (b === undefined) b = {};
            if (this.listeners[a] !== undefined) {
                for (var c = 0; c < this.listeners[a].length; c++) {
                    var d = this.listeners[a][c];
                    d.callback.call(d.context, $.extend({}, b, d.args))
                }
            }
        }
    }
};
rgba = function (a, b, c, d) {
    if (a instanceof Array) {
        if (a.length == 3) {
            if (b === undefined) b = 1;
            return "rgba(" + a[0].toInt() + "," + a[1].toInt() + "," + a[2].toInt() + "," + b + ")"
        } else return "rgba(" + a[0].toInt() + "," + a[1].toInt() + "," + a[2].toInt() + "," + a[3] + ")"
    } else return "rgba(" + a.toInt() + "," + b.toInt() + "," + c.toInt() + "," + d + ")"
};
rgbaMix = function (a, b, c, d) {
    if (d === undefined) d = 1;
    return rgba(a[0] + (b[0] - a[0]) * c, a[1] + (b[1] - a[1]) * c, a[2] + (b[2] - a[2]) * c, d)
};
CleanArray = function (a, b) {
    for (var c = 0; c < a.length; c++) {
        if (a[c] == b) {
            a.splice(c, 1);
            c--
        }
    }
    return a
};
audio = {
    _channels: [],
    _samples: {},
    _getFreeChannel: function () {
        for (var a in this._channels) {
            if (!this._channels[a].playing) return this._channels[a]
        }
        return false
    },
    load: function (a) {
        if ($.browser.msie) return false;
        this._samples[a] = document.createElement("audio");
        var b = this._samples[a];
        b.addEventListener("ended", function () {
            if (this.playing && this.loop) {
                this.play()
            } else this.playing = false
        }, false);
        b.addEventListener("canplay", function () {
            this.playable = true;
            audio._samples[this.path] = {
                src: this.src
            };
            $(this).remove()
        }, false);
        b.autobuffer = true;
        b.preload = "auto";
        b.src = a;
        b.load()
    },
    play: function (a, b) {
        if ($.browser.msie) return false;
        if (!this._samples[a].playable) {
            return false
        }
        var c = this._getFreeChannel();
        this._samples[a];
        if (c !== false) {
            c.src = this._samples[a].src;
            c.playing = true;
            c.loop = b;
            c.play()
        }
    }
};
if (!$.browser.msie) {
    for (var i = 0; i < 16; i++) {
        var channel = document.createElement("audio");
        channel.addEventListener("ended", function () {
            if (this.playing && this.rrLoop) {
                this.play()
            } else this.playing = false
        }, false);
        audio._channels[i] = channel
    }
}
audio.load("sfx/minipoint3.mp3");
audio.load("sfx/point.mp3");
def = {
    maxOxygene: 2e3,
    oxygeneDecay: .75,
    pointRadius: 10,
    miniPointRadius: 2,
    mouthRadius: 5,
    justEatenLifespan: 500,
    branchLifespan: 1e3,
    trailLifespan: 3e3,
    pointPopRadius: 40,
    pointScore: 15,
    colors: [gradient([255, 255, 255], [0, 0, 0], 5), gradient([255, 200, 200], [255, 0, 0], [20, 0, 0], 2), gradient([200, 255, 255], [0, 255, 255], [0, 30, 30], 2), gradient([200, 255, 150], [100, 200, 0], [0, 20, 0], 2), gradient([255, 200, 150], [220, 160, 0], [30, 20, 0], 2), gradient([255, 150, 150], [200, 150, 150], [60, 30, 30], 2)],
    flowersShapes: ["010131010", "0010000200124210020000100", "0010002320134310232000100", "0030000100314130010000300", "1000103030004000303010001", "2000201310034300131020002", "400004002200026620026620002200400004"],
    flowersColors: [
        [
            [255, 255, 255],
            [0, 0, 0]
        ],
        [
            [0, 200, 255],
            [255, 255, 0]
        ],
        [
            [255, 0, 0],
            [255, 255, 0]
        ],
        [
            [200, 0, 100],
            [255, 255, 0]
        ],
        [
            [200, 200, 0],
            [100, 0, 0]
        ]
    ]
};
assets = {
    flower: function (a) {
        var b = [];
        var c = 16;
        var d = function (a) {
            if (!b[a]) {
                b[a] = document.createElement("canvas");
                if (d.colorIndex === false) var e = parseInt(1 + Math.random() * (def.flowersColors.length - 1));
                else e = d.colorIndex;
                var f = def.flowersColors[e];
                var g = parseInt(Math.random() * def.flowersShapes.length);
                var h = def.flowersShapes[g];
                var i = b[a].size = Math.sqrt(h.length);
                b[a].width = i * c;
                b[a].height = i * c;
                var j = gradient(f[0], f[1], i - 2);
                var k = b[a].getContext("2d");
                for (var l = 0; l < h.length; l++) {
                    if (h[l] != "0") {
                        var m = l % i;
                        var n = Math.floor(l / i);
                        k.fillStyle = rgba(j[h[l] - 1], 1);
                        k.fillRect(m * c, n * c, c, c)
                    }
                }
            }
            return b[a]
        };
        d.colorIndex = false;
        d.setColorIndex = function (a) {
            this.colorIndex = a;
            b = []
        };
        return d
    }(window)
};
Branch.prototype.render = function (a) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    for (var b = 0; b < this.segments.length; b++) {
        ctx.lineTo(this.segments[b][0], this.segments[b][1])
    }
    ctx.stroke();
    for (var b = 0; b < this.flowers.length; b++) {
        this.flowers[b].render(a)
    }
};
Branch.prototype.step = function (a) {
    this.lifespan -= a;
    if (this.segments.length < this.maximumLength) {
        this.status = "growing"
    } else {
        if (this.status != "idle") {
            if (this.depth < this.maximumDepth) {
                for (var b = 0; b < 2; b++) {
                    plant.branches.push(new Branch({
                                position: $.last(this.segments),
                                angle: this.angle - Math.PI / 4 + b * (Math.PI / 2),
                                depth: this.depth + 1,
                                maximumDepth: this.maximumDepth,
                                color: this.color,
                                interval: this.interval,
                                segmentLength: this.segmentLength,
                                maximumLength: this.maximumLength,
                                deviation: Math.PI / 2,
                                mirroring: false,
                                mount: this.mount,
                                lifespan: this.lifespan,
                                maximumFlowerWidth: this.maximumFlowerWidth
                            }))
                }
            }
            this.flowers.push(new Flower({
                        branch: this,
                        position: $.last(this.segments),
                        maxWidth: this.maximumFlowerWidth
                    }))
        }
        this.status = "idle";
        for (var b = 0; b < this.flowers.length; b++) {
            this.flowers[b].step(a)
        }
    }
    switch (this.status) {
    case "growing":
        this.tick += a;
        if (this.tick > this.interval) {
            var c = $.last(this.segments);
            this.segments.push([c[0] + Math.cos(this.angle) * this.segmentLength + Math.sin(this.angle) * this.segments.length / 3, c[1] + Math.sin(this.angle) * this.segmentLength + Math.cos(this.angle) * this.segments.length / 3]);
            this.tick = this.tick - this.interval
        }
        break
    }
};
Flower.prototype.step = function (a) {
    if (this.maxWidth > this.width) {
        this.status = "growing"
    } else {
        if (this.status != "idle") {}
        this.status = "idle"
    }
    switch (this.status) {
    case "growing":
        this.tick += a;
        if (this.tick > this.interval) {
            this.width += this.stepWidth;
            this.tick = this.tick - this.interval
        }
        break
    }
};
Flower.prototype.render = function (a) {
    ctx.drawImage(this.texture, this.position[0] - this.width / 2, this.position[1] - this.width / 2, this.width, this.width)
};
var plant = {
    spawnInterval: 1e3,
    spawnTick: 0,
    tick: 0,
    oxygene: def.maxOxygene,
    justEatenLifespan: 0,
    status: "idle",
    points: [],
    segments: [],
    branches: [],
    clouds: [],
    spawnBranch: function (a) {
        if (this.points.length < 2) return 0;
        var b = this.points[this.points.length - 1];
        var c = this.points[this.points.length - 2];
        var d = new Vector([c[0] - b[0], c[1] - b[1]]);
        setTimeout(function () {
            plant.branches.push(new Branch($.extend({
                            position: $.clone(b),
                            mount: b,
                            angle: d.clockAngle() + Math.PI / 2
                        }, a)))
        }, 50)
    },
    step: function (a) {
        if (!this.dead) {
            this.oxygene -= a * def.oxygeneDecay;
            if (this.oxygene > def.maxOxygene) this.oxygene = def.maxOxygene;
            if (this.oxygene <= 0) {
                this.dead = true;
                this.oxygene = 5e3;
                game.speed = .5;
                game.changeColor(0);
                assets.flower.setColorIndex(0);
                new Tooltip("<i>Rule #34</i>: Everything dies. No exceptions.", 1e4, "rule");
                $startButton.fadeIn(1e3)
            }
        }
        this.tick += a;
        if (this.tick >= game.options.plantInterval) {
            if (cursor.lastPosition[0] != cursor.position[0] || cursor.lastPosition[1] != cursor.position[1]) {
                plant.points.push([cursor.position[0], cursor.position[1], this.oxygene]);
                this.tick = 0
            }
        }
        this.justEatenLifespan -= a;
        for (var b = 0; b < this.points.length; b++) {
            this.points[b][2] -= a;
            if (this.points[b][2] <= 0) this.points[b] = null
        }
        CleanArray(this.points, null);
        var c = [view.position[0], view.position[1], domScreen.width, domScreen.height];
        for (var b = 0; b < this.branches.length; b++) {
            this.branches[b].step(a);
            if (this.branches[b].lifespan <= 0) this.branches[b] = null
        }
        CleanArray(this.branches, null);
        if (this.dead) {
            this.spawnTick += a;
            if (this.spawnTick >= this.spawnInterval) {
                this.spawnBranch({
                        color: "#aaa",
                        maximumDepth: 3,
                        interval: 50
                    });
                this.spawnTick = 0
            }
        }
    },
    render: function (a) {
        if (this.points.length) {
            var b = plant.justEatenLifespan > 0 ? plant.justEatenLifespan / def.justEatenLifespan : 0;
            for (var c = 1; c < this.points.length; c++) {
                ctx.beginPath();
                var d = this.points[c];
                ctx.globalAlpha = d[2] / def.branchLifespan;
                if (b > 0) {
                    ctx.strokeStyle = rgbaMix(game.color[0], game.color[4], 1 - b)
                } else {
                    ctx.strokeStyle = rgba(game.color[4])
                }
                ctx.lineWidth = ctx.globalAlpha * .5 * 10;
                ctx.moveTo(this.points[c - 1][0], this.points[c - 1][1]);
                ctx.lineTo(d[0] + Math.random() * 2, d[1] + Math.random() * 2);
                ctx.stroke()
            }
        }
        ctx.lineWidth = 1;
        for (var c = 0; c < this.branches.length; c++) {
            ctx.globalAlpha = this.branches[c].lifespan / this.branches[c].initialLifespan;
            this.branches[c].render(a)
        }
        ctx.globalAlpha = 1;
        cursor.render(a)
    }
};
Trail.prototype.step = function (a) {
    if (this.lifespan > 0) {
        this.lifespan -= a;
        if (this.lifespan <= 0) {
            this.dead = true
        }
    }
    for (var b = 0; b < this.segments.length; b++) {
        this.segments[b].lifespan -= a;
        if (this.segments[b].lifespan <= 0) this.segments[b] = null
    }
    CleanArray(this.segments, null);
    for (var b = 0; b < this.points.length; b++) {
        this.points[b].lifespan -= a;
        if (this.points[b].lifespan <= 0) {
            this.points[b] = null;
            continue
        }
        this.points[b][1] -= .1;
        if (this.points[b].collected) {
            if (++this.points[b][2] > def.pointPopRadius) {
                this.points[b] = null;
                continue
            }
        } else {
            if ((this.points[b][2] += .25) > 10) this.points[b][2] = 10
        } if (!plant.dead) {
            if (Math.distance(this.points[b][0], this.points[b][1], cursor.position[0], cursor.position[1]) < def.pointRadius + def.mouthRadius) {
                this.points[b].cursorOver = true;
                cursor.point = this.points[b]
            } else {
                this.points[b].cursorOver = false
            }
        }
    }
    CleanArray(this.points, null);
    for (var b = 0; b < this.miniPoints.length; b++) {
        this.miniPoints[b].lifespan -= a;
        if (this.miniPoints[b].lifespan <= 0) {
            this.miniPoints[b] = null;
            continue
        }
        if (++this.miniPoints[b][2] > def.miniPointRadius) this.miniPoints[b][2] = def.miniPointRadius;
        if (!plant.dead) {
            if (Math.distance(cursor.position[0], cursor.position[1], this.miniPoints[b][0], this.miniPoints[b][1]) <= def.miniPointRadius + def.mouthRadius) {
                plant.justEatenLifespan = def.justEatenLifespan;
                score.add(1);
                plant.spawnBranch({
                        lifespan: 1e3,
                        segmentLength: 3,
                        interval: 20,
                        maximumLength: 10,
                        maximumFlowerWidth: 20,
                        maximumDepth: 1,
                        color: rgba(game.color[3])
                    });
                this.miniPoints[b] = null;
                plant.oxygene += 400;
                audio.play("sfx/minipoint3.mp3");
                game.changeColor(this.colorIndex)
            }
        }
    }
    CleanArray(this.miniPoints, null);
    if (this.dead) return 0;
    if (Math.distance(this.position[0], this.position[1], cursor.position[0], cursor.position[1]) > 200) {
        return 0
    }
    this.tick += a;
    if (this.tick >= game.options.trailInterval) {
        var c = [this.position[0], this.position[1]];
        c.lifespan = def.trailLifespan;
        this.segments.push(c);
        this.tick = 0
    }
    this.changeDirectionTimeout -= a;
    if (this.changeDirectionTimeout <= 0) {
        this.changeDirection();
        this.rotationSpeed = Math.random() / 10;
        this.changeDirectionTimeout = 3e3
    }
    this.splitTimeout -= a;
    if (this.splitTimeout <= 0) {
        this.split()
    }
    if (!plant.dead) {
        this.spawnPointTimeout -= a;
        if (this.spawnPointTimeout <= 0) {
            this.thisspawnPointTimeout = 500;
            this.spawnPoint();
            this.spawnPointTimeout = parseInt(250 + Math.random() * 2e3)
        }
        this.spawnMiniPointTimeout -= a;
        if (this.spawnMiniPointTimeout <= 0) {
            this.spawnMiniPoint();
            this.spawnMiniPointTimeout = this.spawnMiniPointInterval
        }
    }
    if (this.direction > this.targetDirection) this.direction -= this.rotationSpeed * game.speed;
    else this.direction += this.rotationSpeed * game.speed;
    this.position[0] += Math.cos(this.direction) * (a / 10) * game.speed * 1.25;
    this.position[1] += Math.sin(this.direction) * (a / 10) * game.speed * 1.25
};
Trail.prototype.changeDirection = function () {
    this.targetDirection = Math.random() * Math.PI * 2
}, Trail.prototype.render = function (a) {
    ctx.strokeStyle = rgba(this.color[4]);
    if (this.segments.length) {
        for (var b = 1; b < this.segments.length; b++) {
            ctx.beginPath();
            ctx.globalAlpha = this.segments[b].lifespan / def.trailLifespan;
            ctx.moveTo(this.segments[b - 1][0], this.segments[b - 1][1]);
            ctx.lineTo(this.segments[b][0], this.segments[b][1]);
            ctx.stroke()
        }
    }
    ctx.globalAlpha = 1;
    for (var b = 0; b < this.miniPoints.length; b++) {
        ctx.fillStyle = rgba(this.color[3], this.miniPoints[b].lifespan / def.trailLifespan);
        ctx.beginPath();
        ctx.arc(this.miniPoints[b][0], this.miniPoints[b][1], this.miniPoints[b][2], 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill()
    }
    for (var b = 0; b < this.points.length; b++) {
        if (!this.points[b].collected) {
            ctx.beginPath();
            ctx.arc(-2 + this.points[b][0] + Math.random() * 4, -2 + this.points[b][1] + Math.random() * 4, this.points[b][2] / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = rgba(this.points[b].cursorOver ? this.color[2] : this.color[5], .25 * this.points[b].lifespan / def.trailLifespan);
            ctx.fillStyle = rgba(this.color[1], .5 * this.points[b].lifespan / def.trailLifespan);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.points[b][0], this.points[b][1], this.points[b][2], 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = rgba(this.points[b].cursorOver ? this.color[2] : this.color[5], .25 * this.points[b].lifespan / def.trailLifespan);
            ctx.fillStyle = this.points[b].cursorOver ? rgba(this.color[0], this.points[b].lifespan / def.trailLifespan) : rgba(this.color[1], .25 * this.points[b].lifespan / def.trailLifespan);
            ctx.strokeStyle = rgba(this.color[2], this.points[b].lifespan / def.trailLifespan);
            ctx.fill();
            ctx.stroke()
        } else {
            ctx.beginPath();
            ctx.arc(this.points[b][0], this.points[b][1], this.points[b][2], 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.strokeStyle = rgba(this.color[1], 1 - this.points[b][2] / def.pointPopRadius);
            ctx.stroke()
        }
    }
};
Trail.prototype.spawnPoint = function () {
    var a = [-32 + this.position[0] + Math.random() * 64, -32 + this.position[1] + Math.random() * 64, 0];
    a.lifespan = def.trailLifespan;
    this.points.push(a);
    if (game.delta < 5e3) {
        var b = new Tooltip("click", 4e3);
        threader.run(function (b) {
            b.tooltip.$.css({
                    left: -(view.position[0] - b.point[0]),
                    top: -(view.position[1] - b.point[1])
                });
            b.tooltip.$.fadeOut(a.lifespan)
        }, {
            tooltip: b,
            point: a
        }, a.lifespan, function (a) {})
    }
};
Trail.prototype.spawnMiniPoint = function () {
    var a = [this.position[0], this.position[1], 0];
    a.lifespan = def.trailLifespan;
    this.miniPoints.push(a)
};
Trail.prototype.split = function () {
    this.dead = true;
    trails.push(new Trail({
                position: $.clone(this.position),
                direction: this.direction,
                targetDirection: this.direction + Math.random() * Math.PI,
                colorIndex: game.colorIndex,
                rotationSpeed: .05,
                lifespan: 3e3
            }));
    var a = new Trail({
            position: $.clone(this.position),
            direction: this.direction,
            targetDirection: this.direction + Math.random() * Math.PI,
            rotationSpeed: .05
        });
    trails.push(a)
};
events.bind("mousedown", function () {
    if (cursor.point) {
        score.add(def.pointScore * game.speed);
        cursor.point.collected = true;
        plant.oxygene += 500;
        plant.spawnBranch({
                lifespan: 1e3,
                segmentLength: 4,
                interval: 10,
                maximumLength: 10,
                maximumFlowerWidth: 0,
                maximumDepth: 3,
                color: rgba(game.color[2])
            });
        audio.play("sfx/point.mp3")
    }
});
events.bind("game/start", function () {
    if (game.first && !plant.dead) {
        var a = new Tooltip("follow", 15e3);
        threader.run(function (a) {
            a.tooltip.$.css({
                    left: -(view.position[0] - $.last(trails).position[0]),
                    top: -(view.position[1] - $.last(trails).position[1])
                })
        }, {
            tooltip: a
        }, 15e3, function (a) {});
        var b = new Tooltip("<i>Rule #1</i>: Never follow the same path.", 4e3, "rule");
        setTimeout(function () {
            if (plant.dead) return false;
            var a = new Tooltip("<i>Rule #2</i>: Bubbles contains oxygene.", 4e3, "rule")
        }, 5e3);
        setTimeout(function () {
            if (plant.dead) return false;
            var a = new Tooltip("<i>Rule #3</i>: Eating eggs is essential.", 4e3, "rule");
            game.first = false
        }, 1e4)
    }
});
var domScreen = document.getElementById("screen");
domScreen.height = window.innerHeight;
domScreen.width = window.innerWidth;
var ctx = domScreen.getContext("2d");
var $domScreen = $(domScreen);
var $startButton = $("<div>Reincarnate</div>").attr("id", "start-button").appendTo("body");
$startButton.css({
        left: domScreen.width / 2 - $startButton.width() / 2,
        top: domScreen.height / 2 - $startButton.height() / 2 - 48
    }).click(function () {
        game.start();
        $(this).hide()
    });
var threader = {
    threads: [],
    step: function (a) {
        for (var b = 0; b < this.threads.length; b++) {
            this.threads[b].tick += a;
            this.threads[b].func.apply(this.threads[b], [this.threads[b].args]);
            if (this.threads[b].tick > this.threads[b].duration) {
                if (this.threads[b].finish) this.threads[b].finish.apply(this.threads[b], [this.threads[b].args]);
                this.threads[b] = null
            }
        }
        CleanArray(this.threads, null)
    },
    run: function (a, b, c, d) {
        this.threads.push({
                func: a,
                args: b,
                duration: c,
                finish: d,
                tick: 0
            })
    }
};
var Tooltip = function (a, b, c) {
    if (c === undefined) c = "";
    this.$ = $("<div></div>");
    this.$.addClass("tooltip");
    this.$.appendTo($("body"));
    this.$.html(a);
    this.$.addClass(c);
    this.$.fadeOut(b);
    this.$.css({
            left: $domScreen.width() / 2 - this.$.width() / 2,
            top: $domScreen.height() / 2 - this.$.height() / 2
        })
};
var score = function () {
    var a = {
        $nums: [],
        $score: {},
        value: 0,
        target: 0,
        color: "#000",
        add: function (a) {
            this.target += a
        },
        reset: function () {
            this.$score.html("");
            this.value = 0;
            this.target = 0;
            this.$nums = []
        },
        step: function (a) {
            if (this.value < this.target) this.value++;
            var b = this.value.toString();
            if (!plant.dead) game.speed = 1 + this.value / 1e3;
            if (b.length > this.$nums.length) {
                this.$nums.unshift($num = $("<div></div>").addClass("num").css({
                            width: 0,
                            opacity: 0,
                            "font-size": 10 + b.length * 4
                        }).prependTo(this.$score));
                $num.animate({
                        opacity: 1,
                        width: 32
                    }, 250)
            }
            this.$score.css({
                    left: $domScreen.width() / 2 - this.$score.width() / 2
                });
            for (var c = 0; c < b.length; c++) {
                this.$nums[c].html(b[c])
            }
            if (plant.oxygene > 0 && !plant.dead) this.$oxygene.css({
                    width: plant.oxygene / def.maxOxygene * 100 + "%"
                })
        }
    };
    a.$score = $("<div></div>").css({
            top: $domScreen.height() / 5
        }).attr("id", "score").appendTo($("body"));
    var b = $("<div></div>").appendTo($("body"));
    b.attr("id", "oxygene-wrapper").css({
            left: $domScreen.width() / 2 - b.width() / 2,
            top: $domScreen.height() - $domScreen.height() / 5
        });
    a.$oxygene = $("<div></div>").html("oxygene").attr("id", "oxygene").appendTo(b);
    a.reset();
    return a
}();
var trails = [];
var modes = {
    "default": {
        interval: 10,
        trailInterval: 50,
        plantInterval: 25
    }
};
var view = {
    position: [0, 0],
    angle: 0,
    width: domScreen.width,
    height: domScreen.height
};
var cursor = {
    position: [0, 0],
    lastPosition: [0, 0],
    frame: 0,
    interval: 50,
    timer: 0,
    render: function (a) {
        var b = def.mouthRadius;
        var c = def.mouthRadius;
        if (plant.justEatenLifespan > 0) {
            var d = plant.justEatenLifespan / def.justEatenLifespan;
            ctx.fillStyle = ctx.strokeStyle = rgbaMix(game.color[0], game.color[4], 1 - d);
            b += d * 5;
            c += d * 10
        } else {
            ctx.strokeStyle = rgba(game.color[2]);
            ctx.fillStyle = rgba(game.color[2])
        }
        ctx.beginPath();
        ctx.arc(this.position[0], this.position[1], b - 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.position[0], this.position[1], c, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke()
    }
};
var game = {
    speed: 1.2,
    colorIndex: 0,
    first: true,
    color: def.colors[0],
    options: {},
    delta: 0,
    tick: new Date,
    lastTick: new Date,
    start: function (a) {
        $(".tooltip").remove();
        if (a === undefined) a = "default";
        this.options = $.extend({}, modes["default"], modes[a]);
        game.changeColor(2);
        view.position = [0, 0];
        cursor.position = [100, 0];
        plant.dead = false;
        plant.segments = [];
        plant.points = [];
        trails = [];
        trails.push(new Trail({
                    colorIndex: game.colorIndex
                }));
        assets.flower.setColorIndex(false);
        events.trigger("game/start");
        plant.oxygene = def.maxOxygene;
        this.timer = setInterval(function () {
            game.step()
        }, this.options.interval);
        this.delta = 0;
        this.tick = new Date;
        this.lastTick = new Date;
        score.reset()
    },
    stop: function () {
        clearInterval(this.timer)
    },
    changeColor: function (a) {
        if (a != this.colorIndex) {
            this.lastColor = this.color;
            this.lastColorIndex = this.colorIndex;
            this.bgTransition = 0;
            console.log("colorChange", this.lastColorIndex, a)
        }
        this.colorIndex = a;
        this.color = def.colors[a]
    },
    step: function () {
        this.tick = new Date;
        delta = this.tick - this.lastTick;
        this.delta += delta;
        if (plant.dead) game.speed -= delta / 5e3;
        if (game.speed < .5) game.speed = .5;
        cursor.point = null;
        cursor.position[0] += Math.cos(view.angle) * (delta / 10) * game.speed;
        cursor.position[1] += Math.sin(view.angle) * (delta / 10) * game.speed;
        view.position = [cursor.position[0] - view.width / 2, cursor.position[1] - view.height / 2];
        for (var a = 0; a < trails.length; a++) {
            trails[a].step(delta);
            if (trails[a].dead && trails[a].segments.length == 0) {
                trails[a] = null
            }
        }
        CleanArray(trails, null);
        plant.step(delta);
        score.step();
        threader.step(delta);
        ctx.globalAlpha = 1;
        game.bgTransition += delta / 2e3;
        if (game.bgTransition > 1) game.bgTransition = 1;
        ctx.save();
        ctx.fillStyle = rgbaMix(game.lastColor[6], game.color[6], game.bgTransition);
        ctx.fillRect(0, 0, domScreen.width, domScreen.height);
        ctx.translate(-view.position[0], -view.position[1]);
        for (var a = 0; a < trails.length; a++) {
            trails[a].render(delta)
        }
        plant.render(delta);
        ctx.restore();
        this.lastTick = this.tick
    }
};
$(domScreen).mousemove(function (a) {
    var b = new Vector([a.pageX - domScreen.offsetLeft, a.pageY]);
    view.angle = b.clockAngle([domScreen.width / 2, domScreen.height / 2])
}).mousedown(function (a) {
    events.trigger("mousedown", {
            x: a.pageX,
            y: a.pageY
        })
})
