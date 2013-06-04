/* adapted from http://js1k.com/2013-spring/demo/1549 */
var b = document.body;
//var c = document.getElementsByTagName('canvas')[0];
var c = { height: 200, width: 200 };
//var a = c.getContext('2d');
//document.body.clientWidth; // fix bug in webkit: http://qfox.nl/weblog/218

/* context mock */
var a = {
    beginPath: function() {},
    fillStyle: 0,
    a.arc: function(x, y, a, b c) {},
    a.fill: function() {}
};
		
l = 200;
k = 5;
c.height = l;
c.width = l;
h = 0;

function e(b) {
    return Math.floor(Math.random() * b) - 1
}

function f(b) {
    a.beginPath();
    a.fillStyle = b.f;
    a.arc(b.x, b.y, b.a, 0, 6);
    a.fill()
}

function g(b) {
    b.x < k && (b.x = k);
    b.y < k && (b.y = k);
    b.x > l - k && (b.x = l - k);
    b.y > l - k && (b.y = l - k)
}

z = [];
w = [];

for (var j = 0; 1 > j; j++) z.push({
        g: "L",
        a: 4 + e(4),
        x: l / 2,
        y: l / 2,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: "black"
    });

for (var m = 0; 10 > m; m++) w.push({
        g: "F",
        a: 4 + e(20),
        x: k + e(l),
        y: k + e(l),
        f: "#00FF00"
    });

var main = function () {
    a.fillStyle = "#DDFFFF";
    a.fillRect(0, 0, l, l);
    h++;
    for (var b = 0; b < w.length; b++) {
        f(w[b]);
        var d = w[b];
        d.x += 0.2 * e(3);
        d.y += 0.2 * e(3);
        g(d);
        2 >= w[b].a && w.splice(b, 1)
    }
    for (d = 0; d < z.length; d++) {
        b = z[d];
        b.x += b.b;
        b.y += b.c;
        b.b += b.d;
        b.c += b.e;
        b.d = 0.5 * e(3);
        b.e = 0.5 * e(3);
        0 == h % 8 && (b.b = 0, b.c = 0);
        g(b);
        f(z[d]);
        b = z[d];
        10 < b.a && 1600 > z.length && (b.a = 5, z.push({
                    g: "L",
                    a: 5,
                    x: b.x,
                    y: b.y,
                    b: -1 * b.b,
                    c: -1 * b.c,
                    d: -1 * b.d,
                    e: -1 * b.e,
                    f: "#222222"
                }));
        for (b = 0; b < w.length; b++)
            if (Math.sqrt((z[d].x - w[b].x) * (z[d].x - w[b].x) + (z[d].y - w[b].y) *
                    (z[d].y - w[b].y)) < z[d].a + w[b].a) {
                z[d].a += 0.05;
                w[b].a -= 0.05;
                break
            }
    }
};

var i = 0;
while(i < 100000) {}
