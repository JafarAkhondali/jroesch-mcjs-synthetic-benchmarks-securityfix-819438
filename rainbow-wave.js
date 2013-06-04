/* adapted from http://js1k.com/2010-first/demo/96 */
c = document.getElementById("c");
g = c.getContext("2d");
n = 10;
w = 500;
w2 = w / 2;
h = w;
c.width = w;
c.height = h;
s = w / n;
Z = s / 2;
t = 0;
l = 0;
L = 0;
o = 0;
M = Math;

function A(m, p, u) {
    m.addColorStop(p, u);
}

function N(m, x, y) {
    m.lineTo(x, y);
}
setInterval(function () {
    t -= 2;
    if (t <= -s) t = 0;
    u = g.createLinearGradient(0, 0, 0, h);
    ha = o * 180 / 3.1415;
    v = ",100%,50%)";
    H = "hsl(";
    A(u, 0, H + (ha % 360) + v);
    A(u, 0.5, H + ((ha + 120)) + v);
    A(u, 1, H + ((ha + 240) % 360) + v);
    g.fillStyle = u;
    g.fillRect(0, 0, w, h);
    S = 0;
    for (i = 0; i < 2 * n + 2; i++) {
        O = 0.001;
        l = M.sin(o) * s * 2;
        L = M.sin(o + O) * s * 2;
        o += O;
        P = (i + t / Z) / 10;
        D = (i + 1 + t / Z) / 10;
        E = i * Z + t;
        R = (i + 1) * Z + t;
        for (x = -n * 2; x < n * 2; x += 2) {
            g.fillStyle = "#FFF";
            g.beginPath();
            x1 = x + S;
            x2 = x + 1 + S;
            N(g, x1 * Z * P + w2 + l, E);
            N(g, x2 * Z * P + w2 + l, E);
            N(g, x2 * Z * D + w2 + L, R);
            N(g, x1 * Z * D + w2 + L, R);
            g.closePath();
            g.fill();
        }
        S ^= 1;
    }
    g.shadowBlur = 4;
    g.shadowColor = "#000";
    g.font = 'bold 50px sans-serif';
    tx = 'Hello js1k scene';
    tm = g.measureText(tx);
    T = tm.width;
    q = g.createLinearGradient(0, 0, T, 0);
    A(q, 0, "#FC0");
    A(q, 0.5, "#9F0");
    A(q, 1, "#09F");
    g.fillStyle = q;
    g.fillText(tx, w2 - T / 2, M.sin(o * 10) * 20 + h / 2);
    g.shadowColor = "transparent";
}, 33);
