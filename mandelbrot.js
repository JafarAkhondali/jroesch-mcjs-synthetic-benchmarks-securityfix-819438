/* adapted from http://js1k.com/2010-first/demo/29 */

/*var a = document.getElementById("c"), */ 
var k = ["rgb(", , ",", , ",", , ")"],
    d, g = d = 0,
    i, j, b, c;

//a.style.height = a.height = a.style.width = a.width = 600;
//a = a.getContext("2d");

var a = {
    fillStyle: function() {},
    fillRect: function() {}
}

n(-0.5, 0, 0);

function l(e, h, f, m) {
    for (b = -2 + e; b < 1; b += 0.2) for (c = -1.5 + h; c < 1.5; c += 0.2) {
            if (!b || !c) break;
            for (d = g = color = 0;
                (i = d * d) + (j = g * g) <= 4 && color <= 512; color++) {
                i = i - j + b;
                j = d * g * 2 + c;
                d = i;
                g = j
            }
            k[1] = color % 8 << 5;
            k[3] = (color >> 3) % 8 << 5;
            k[5] = (color >> 6) % 8 << 5;
            a.fillStyle = k.join("");
            a.fillRect((2 + b) * 200, (1.5 + c) * 200, 1, 1)
    }
    f < 40 ? l(e + 0.0050, h + 0.0050, f + 1, m) : m()
}

function n(e, h, f) {
    (function () {
        l(e, 0, 0, function () {
            f < 100 && n(e + 0.0050, h, f + 1)
        })
    })();
}

