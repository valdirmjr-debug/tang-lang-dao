/* Tang Lang Dao: o louva-a-deus, os 12 Principios e a arvore */
(function () {
  document.documentElement.classList.add("js");
  var calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function trava(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function mix(a, b, t) { return a + (b - a) * t; }

  /* ---------- Menu e barra ---------- */
  var nav = $(".nav"), menu = $(".nav__menu"), heroi = $(".heroi"), zap = $(".zap");
  if (menu) menu.addEventListener("click", function () {
    var a = nav.classList.toggle("aberto");
    menu.setAttribute("aria-expanded", a);
    menu.textContent = a ? "Fechar" : "Menu";
  });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("aberto")) { menu.click(); menu.focus(); } });
  function rolou() {
    var lim = 40;
    nav.classList.toggle("solido", scrollY > lim);
    zap.classList.toggle("visivel", scrollY > (heroi ? heroi.offsetHeight * .7 : 120));
  }
  addEventListener("scroll", rolou, { passive: true }); addEventListener("resize", rolou); rolou();

  /* ---------- Aberto ou fechado, no horario de Sao Paulo ---------- */
  var T = [1020, 1260], M = [480, 660];
  var HOR = { 1: [T], 2: [M, T], 3: [M, T], 4: [M, T], 5: [T], 6: [M] };
  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  function hora(m) { var h = Math.floor(m / 60), r = m % 60; return h + "h" + (r ? (r < 10 ? "0" : "") + r : ""); }
  function agora() {
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { d: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), m: +p.hour * 60 + +p.minute };
  }
  function status() {
    var a = agora(), hoje = HOR[a.d] || [], txt = null, ab = false, i;
    for (i = 0; i < hoje.length; i++) if (a.m >= hoje[i][0] && a.m < hoje[i][1]) { txt = "Aberto agora, até as " + hora(hoje[i][1]); ab = true; }
    if (!txt) for (i = 0; i < hoje.length; i++) if (a.m < hoje[i][0]) { txt = "Abre hoje às " + hora(hoje[i][0]); break; }
    if (!txt) { var d = (a.d + 1) % 7; while (!HOR[d]) d = (d + 1) % 7; txt = "Abre " + (d === (a.d + 1) % 7 ? "amanhã" : DIAS[d]) + " às " + hora(HOR[d][0][0]); }
    $$("[data-status]").forEach(function (e) { e.textContent = txt; e.classList.toggle("aberto", ab); });
    $$(".grade tr").forEach(function (t) { Array.prototype.forEach.call(t.cells, function (cel, i) { cel.classList.toggle("hoje", i > 0 && i === a.d); }); });
  }
  status(); setInterval(status, 60000);

  /* ---------- Trajetoria: leva o foco para a mensagem ---------- */
  var cta = $("#cta-caminho");
  if (cta) $$(".caminho").forEach(function (b, _, todos) {
    b.addEventListener("click", function () {
      todos.forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      var f = b.dataset.foco;
      cta.href = "https://wa.me/5511951577456?text=" + encodeURIComponent("Olá! Vi o site do Instituto Tang Lang Dao e tenho interesse em treinar Kung Fu com foco em " + f + ".");
      cta.querySelector("span").textContent = "Conversar sobre " + f;
    });
  });

  /* ---------- O louva-a-deus ---------- */
  function ik(a, L1, L2, alvo, lado) {
    var dx = alvo.x - a.x, dy = alvo.y - a.y, d = Math.hypot(dx, dy) || 1, dc = trava(d, Math.abs(L1 - L2) + 2, L1 + L2 - 2);
    var base = Math.atan2(dy, dx), cosA = (L1 * L1 + dc * dc - L2 * L2) / (2 * L1 * dc), al = Math.acos(trava(cosA, -1, 1));
    var j = { x: a.x + Math.cos(base + lado * al) * L1, y: a.y + Math.sin(base + lado * al) * L1 };
    return { j: j, p: { x: a.x + dx / d * dc, y: a.y + dy / d * dc } };
  }
  function Mantis(cv, op) {
    var c = cv.getContext("2d"), W = 0, H = 0, D = 1, an = { x: 0, y: 0, s: 1 };
    var t = 0, hip = 0, hipV = 0, inc = 0, cab = -2.4, olho = { x: -260, y: -330 };
    var quad = {};
    var mao = { x: -148, y: -247, vx: 0, vy: 0 }, mao2 = { x: -138, y: -237, vx: 0, vy: 0 };
    var fila = [], passo = null, rastro = [], traco = [], cor = op.cor, parado = false;
    var HIPY = -150, N_L = 178, FEM = 122, TIB = 86, COX = 66;
    function tam() {
      D = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * D); cv.height = Math.round(H * D); an = op.ancora(W, H);
      if (parado) desenha();
    }
    new ResizeObserver(tam).observe(cv); tam();
    function ombro(hx, ang) {
      var bx = hx, by = HIPY, nx = bx + Math.cos(ang) * N_L, ny = by + Math.sin(ang) * N_L;
      return { b: { x: bx, y: by }, n: { x: nx, y: ny }, s: { x: mix(bx, nx, .76), y: mix(by, ny, .76) } };
    }
    function membro(a, b, w1, w2, cor2) {
      var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
      c.fillStyle = cor2; c.beginPath();
      c.moveTo(a.x + nx * w1, a.y + ny * w1);
      c.quadraticCurveTo((a.x + b.x) / 2 + nx * (w1 + w2) * .62, (a.y + b.y) / 2 + ny * (w1 + w2) * .62, b.x + nx * w2, b.y + ny * w2);
      c.lineTo(b.x - nx * w2, b.y - ny * w2);
      c.quadraticCurveTo((a.x + b.x) / 2 - nx * (w1 + w2) * .62, (a.y + b.y) / 2 - ny * (w1 + w2) * .62, a.x - nx * w1, a.y - ny * w1);
      c.closePath(); c.fill();
      c.beginPath(); c.arc(a.x, a.y, w1, 0, 7); c.fill();
      c.beginPath(); c.arc(b.x, b.y, w2, 0, 7); c.fill();
    }
    function espinhos(a, b, n, h, lado, cor2) {
      var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, nx = -uy * lado, ny = ux * lado, i;
      c.fillStyle = cor2;
      for (i = 0; i < n; i++) {
        var f = (i + 1) / (n + 1), px = a.x + dx * f, py = a.y + dy * f, g = 7 - i * .4, alt = h * (i % 2 ? .62 : 1);
        c.beginPath(); c.moveTo(px - ux * 4 + nx * g * .4, py - uy * 4 + ny * g * .4); c.lineTo(px + ux * 4 + nx * g * .4, py + uy * 4 + ny * g * .4); c.lineTo(px + ux * 5 + nx * (g + alt), py + uy * 5 + ny * (g + alt)); c.closePath(); c.fill();
      }
    }
    function perna(a, pe, L1, L2, lado, w, cor2) {
      var k = ik(a, L1, L2, pe, lado);
      membro(a, k.j, w, w * .55, cor2); membro(k.j, k.p, w * .55, w * .34, cor2); membro(k.p, { x: k.p.x + (pe.x < a.x ? -15 : 15), y: k.p.y + 1 }, w * .34, w * .2, cor2);
    }
    function pata(s, tgt, cor2, corE, lado) {
      var alvo = { x: tgt.x, y: tgt.y }, dir = Math.atan2(alvo.y - s.y, alvo.x - s.x);
      var ext = trava(Math.hypot(alvo.x - s.x, alvo.y - s.y) / 200, 0, 1);
      var repouso = 2.05, ang = mix(repouso, dir < 0 ? dir + Math.PI * 2 : dir, ext * ext * .75);
      var co = { x: s.x + Math.cos(ang) * COX, y: s.y + Math.sin(ang) * COX };
      var k = ik(co, FEM, TIB, alvo, lado);
      membro(s, co, 15, 10, cor2);
      espinhos(co, k.j, 6, 15, -lado, corE);
      membro(co, k.j, 10, 13, cor2);
      espinhos(k.j, k.p, 5, 10, -lado, corE);
      membro(k.j, k.p, 9, 3, cor2);
      var ux = k.p.x - k.j.x, uy = k.p.y - k.j.y, d = Math.hypot(ux, uy) || 1; ux /= d; uy /= d;
      c.strokeStyle = corE; c.lineWidth = 4; c.lineCap = "round"; c.beginPath(); c.moveTo(k.p.x, k.p.y); c.quadraticCurveTo(k.p.x + ux * 14, k.p.y + uy * 14, k.p.x + ux * 12 - uy * lado * 12, k.p.y + uy * 12 + ux * lado * 12); c.stroke();
      return { co: co, j: k.j, p: k.p };
    }
    function desenha() {
      an = op.ancora(W, H); c.setTransform(D, 0, 0, D, 0, 0); c.clearRect(0, 0, W, H);
      var s = an.s;
      if (op.galho !== false) {
        var gy = an.y + 2 * s, grad = c.createLinearGradient(0, gy, 0, gy + 14 * s);
        grad.addColorStop(0, cor.galho ? cor.galho[0] : "#2B2B2B"); grad.addColorStop(1, cor.galho ? cor.galho[1] : "#0E0E0E");
        c.fillStyle = grad; c.beginPath(); c.moveTo(0, gy); c.lineTo(W, gy); c.lineTo(W, gy + 9 * s); c.bezierCurveTo(W * .7, gy + 16 * s, W * .3, gy + 6 * s, 0, gy + 13 * s); c.closePath(); c.fill();
      }
      c.translate(an.x, an.y); c.scale(s, s);
      if (op.planta) op.planta(c, t);
      var res = Math.sin(t * 1.5), hx = hip;
      var ang = -2.0 + inc + res * .012, o = ombro(hx, ang);
      var B = { x: hx, y: HIPY + res * 1.2 };
      var escuro = cor.esc, base = cor.base, clara = cor.luz;

      /* pernas do lado de la */
      perna({ x: hx - 22, y: HIPY + 6 }, { x: -92, y: 4 }, 92, 104, 1, 5, escuro);
      perna({ x: hx + 26, y: HIPY + 10 }, { x: 150, y: 4 }, 130, 142, -1, 6, escuro);
      pata(o.s, { x: mao2.x, y: mao2.y }, escuro, cor.maisEsc, 1);

      /* rastro */
      rastro.forEach(function (r) {
        var a = trava(1 - r.i / r.v, 0, 1);
        c.globalAlpha = a * .3; c.strokeStyle = cor.rastro; c.lineCap = "round";
        c.lineWidth = 11; c.beginPath(); c.moveTo(r.co.x, r.co.y); c.lineTo(r.j.x, r.j.y); c.stroke();
        c.lineWidth = 8; c.beginPath(); c.moveTo(r.j.x, r.j.y); c.lineTo(r.p.x, r.p.y); c.stroke();
      });
      c.globalAlpha = 1;
      /* abdomen e asas */
      var cauda = { x: B.x + 262, y: B.y + 58 + res * 2 };
      var gb = c.createLinearGradient(B.x, B.y - 40, B.x, B.y + 70);
      gb.addColorStop(0, clara); gb.addColorStop(.55, base); gb.addColorStop(1, escuro);
      c.fillStyle = gb; c.beginPath(); c.moveTo(B.x - 8, B.y - 6);
      c.bezierCurveTo(B.x + 70, B.y - 44, B.x + 200, B.y - 26, cauda.x, cauda.y);
      c.bezierCurveTo(B.x + 214, B.y + 70, B.x + 86, B.y + 62, B.x - 8, B.y + 16); c.closePath(); c.fill();
      c.fillStyle = cor.asa; c.beginPath(); c.moveTo(B.x + 4, B.y - 14);
      c.bezierCurveTo(B.x + 86, B.y - 44, B.x + 214, B.y - 22, cauda.x + 26, cauda.y + 2);
      c.bezierCurveTo(B.x + 206, B.y + 28, B.x + 92, B.y + 16, B.x + 4, B.y - 14); c.closePath(); c.fill();
      c.strokeStyle = cor.veia; c.lineWidth = 1.6; c.lineCap = "round";
      [[.18, -6], [.34, -11], [.5, -9], [.66, -4], [.8, 3]].forEach(function (v) {
        var vx = B.x + 8 + v[0] * 250; c.beginPath(); c.moveTo(B.x + 10, B.y - 11); c.quadraticCurveTo(vx - 40, B.y - 24 + v[1], vx + 24, B.y + 6 + v[0] * 44); c.stroke();
      });

      /* pernas de ca */
      perna({ x: hx - 16, y: HIPY + 12 }, { x: -44, y: 4 }, 86, 104, 1, 6.5, clara);
      perna({ x: hx + 30, y: HIPY + 26 }, { x: 196, y: 4 }, 118, 138, -1, 6, base);

      /* pescoco */
      var gn = c.createLinearGradient(o.b.x - 20, o.b.y, o.n.x + 20, o.n.y);
      gn.addColorStop(0, base); gn.addColorStop(1, clara);
      membro(o.b, o.n, 24, 12, gn);
      var dn = { x: (o.b.x + o.n.x) / 2 + 9, y: (o.b.y + o.n.y) / 2 + 3 };
      c.strokeStyle = cor.brilho; c.lineWidth = 3.4; c.beginPath(); c.moveTo(o.b.x + 18, o.b.y - 8); c.quadraticCurveTo(dn.x + 10, dn.y, o.n.x + 10, o.n.y + 4); c.stroke();

      /* cabeca */
      c.save(); c.translate(o.n.x, o.n.y - 6); c.rotate(cab - Math.PI);
      var sw = Math.sin(t * 2.3) * 6, sw2 = Math.sin(t * 1.9 + 1) * 7;
      c.strokeStyle = cor.esc; c.lineWidth = 2.4;
      c.beginPath(); c.moveTo(-8, -12); c.bezierCurveTo(-48, -62, -70, -92 + sw, -128, -96 + sw); c.stroke();
      c.beginPath(); c.moveTo(-2, -16); c.bezierCurveTo(-30, -72, -46, -110 + sw2, -92, -128 + sw2); c.stroke();
      var gc = c.createLinearGradient(0, -28, 0, 28); gc.addColorStop(0, clara); gc.addColorStop(1, base);
      c.fillStyle = gc; c.beginPath(); c.moveTo(-38, 8); c.quadraticCurveTo(-14, -12, 8, -30); c.quadraticCurveTo(24, -20, 18, 2); c.quadraticCurveTo(22, 24, 6, 30); c.quadraticCurveTo(-14, 22, -38, 8); c.closePath(); c.fill();
      c.fillStyle = cor.maisEsc; c.beginPath(); c.moveTo(-38, 8); c.lineTo(-48, 15); c.lineTo(-30, 16); c.closePath(); c.fill();
      c.fillStyle = cor.olho; c.beginPath(); c.ellipse(6, -15, 11, 10, -.5, 0, 7); c.fill();
      c.fillStyle = cor.pupila; c.beginPath(); c.arc(3, -15, 3.6, 0, 7); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.arc(5, -18, 1.8, 0, 7); c.fill();
      c.restore();

      /* presa */
      if (op.presa && op.presa.viva) cigarra(c, op.presa, t);

      if (traco.length > 1) {
        c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = cor.traco || cor.rastro;
        for (var ti = 1; ti < traco.length; ti++) {
          var q = traco[ti], pq = traco[ti - 1];
          c.globalAlpha = trava(4 - q.i, 0, 1); c.lineWidth = 7 + 15 * (ti / traco.length);
          c.beginPath(); c.moveTo(pq.x, pq.y); c.lineTo(q.x, q.y); c.stroke();
        }
        c.globalAlpha = 1;
      }
      /* pata de ca */
      var gp = c.createLinearGradient(o.s.x - 120, o.s.y - 100, o.s.x + 40, o.s.y + 80);
      gp.addColorStop(0, clara); gp.addColorStop(1, base);
      var P = pata(o.s, { x: mao.x, y: mao.y }, gp, cor.maisEsc, 1);
      quad.Q = P; quad.s = o.s; quad.n = o.n;
      c.setTransform(1, 0, 0, 1, 0, 0);
    }
    function passoMola(m, alvo, k, dt) {
      var am = 2 * Math.sqrt(k);
      m.vx += (k * (alvo.x - m.x) - am * m.vx) * dt; m.vy += (k * (alvo.y - m.y) - am * m.vy) * dt;
      m.x += m.vx * dt; m.y += m.vy * dt;
    }
    var api = {
      local: function (px, py) { return { x: (px - an.x) / an.s, y: (py - an.y) / an.s }; },
      get ombro() { return quad.s || { x: -80, y: -280 }; },
      get mao() { return mao; },
      get ocupado() { return !!passo || fila.length > 0; },
      olhar: function (p) { olho = p; },
      golpe: function (pts, op2) { fila = pts.slice(); passo = null; traco = (op2 && op2.manter) ? traco : []; },
      apagar: function () { traco = []; rastro = []; },
      passo: function (dt) {
        t += dt;
        var s = quad.s || { x: -80, y: -280 }, alvo, k = 40, alvoHip = 0, n = quad.n || { x: -80, y: -320 };
        if (!passo && fila.length) { passo = fila.shift(); passo.r = passo.d; }
        if (passo) {
          passo.r -= dt;
          alvo = { x: s.x + passo.x, y: s.y + passo.y }; k = passo.k || 900; alvoHip = passo.h || 0;
          if (passo.r <= 0) { if (passo.fim) passo.fim(); passo = null; }
        } else alvo = { x: s.x - 112, y: s.y + 50 + Math.sin(t * 1.5) * 2 };
        var v0 = Math.hypot(mao.vx, mao.vy);
        passoMola(mao, alvo, k, dt);
        var a2 = passo ? { x: alvo.x + 26, y: alvo.y + 22 } : { x: s.x - 100, y: s.y + 60 };
        passoMola(mao2, a2, passo ? k * .55 : 34, dt);
        hipV += (120 * (alvoHip - hip) - 22 * hipV) * dt; hip += hipV * dt;
        var alvoAng = trava((olho.x - n.x) / 900, -.28, .28) + (passo ? -.04 : 0) + (passo && passo.i ? passo.i : 0);
        inc += (alvoAng * .6 - inc) * Math.min(1, dt * 5);
        var ac = Math.atan2(olho.y - n.y, olho.x - n.x); if (ac > 0) ac -= Math.PI * 2;
        ac = trava(ac, -Math.PI - .95, -Math.PI + .75); cab += (ac - cab) * Math.min(1, dt * 7);
        if (passo && passo.r2 && quad.Q) rastro.push({ co: { x: quad.Q.co.x, y: quad.Q.co.y }, j: { x: quad.Q.j.x, y: quad.Q.j.y }, p: { x: quad.Q.p.x, y: quad.Q.p.y }, i: 0, v: .5 });
        rastro.forEach(function (r) { r.i += dt; }); rastro = rastro.filter(function (r) { return r.i < r.v; });
        if (op.traco && passo && quad.Q) traco.push({ x: quad.Q.p.x, y: quad.Q.p.y, i: 0 });
        traco.forEach(function (q) { q.i += dt; }); traco = traco.filter(function (q) { return q.i < 4; });
        if (traco.length > 240) traco.shift();
      },
      desenha: desenha,
      imediato: function () { parado = true; for (var i = 0; i < 90; i++) api.passo(1 / 60); desenha(); }
    };
    return api;
  }

  /* A cigarra: corpo largo, olho saltado e asas longas e transparentes, vista de lado */
  function cigarra(c, pr, t) {
    var bate = Math.sin(t * 62) * .32;
    c.save(); c.translate(pr.x, pr.y); c.rotate(pr.a || 0); c.scale((pr.lado || 1) * 1.55, 1.55);
    function asa(ang, L, larg, cor2) {
      c.save(); c.translate(-2, -6); c.rotate(ang);
      c.fillStyle = cor2; c.strokeStyle = "#4B5A4C"; c.lineWidth = .9;
      c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(L * .3, -larg, L * .8, -larg * 1.05, L, -larg * .1); c.bezierCurveTo(L * .86, larg * .5, L * .3, larg * .5, 0, 0); c.closePath(); c.fill(); c.stroke();
      c.lineWidth = .6; c.beginPath();
      [.42, .62, .82].forEach(function (f) { c.moveTo(0, 0); c.quadraticCurveTo(L * f * .6, -larg * .72, L * f, -larg * (.75 - f * .5)); });
      c.moveTo(L * .34, -larg * .5); c.lineTo(L * .4, larg * .22); c.moveTo(L * .62, -larg * .62); c.lineTo(L * .66, larg * .2);
      c.stroke(); c.restore();
    }
    asa(-.5 - bate * .8, 44, 12, "rgba(226,238,226,.5)");
    c.fillStyle = "#2E3A2C"; c.beginPath(); c.moveTo(-8, -8); c.bezierCurveTo(12, -11, 28, -6, 36, 3); c.bezierCurveTo(26, 9, 8, 10, -8, 7); c.closePath(); c.fill();
    c.strokeStyle = "#7E8D5F"; c.lineWidth = 1; c.beginPath();
    [6, 13, 20, 27].forEach(function (x) { c.moveTo(x, -8 + x * .17); c.quadraticCurveTo(x + 2, 0, x, 8 - x * .1); });
    c.stroke();
    c.fillStyle = "#4C6340"; c.beginPath(); c.ellipse(-5, -1, 10, 9, 0, 0, 7); c.fill();
    c.fillStyle = "#3A4A34"; c.beginPath(); c.ellipse(-15, 0, 6.5, 7.5, 0, 0, 7); c.fill();
    c.fillStyle = "#C45A2A"; c.beginPath(); c.arc(-18, -5, 3.3, 0, 7); c.fill();
    c.fillStyle = "#F7EFD9"; c.beginPath(); c.arc(-19, -6, 1, 0, 7); c.fill();
    c.strokeStyle = "#2E3A2C"; c.lineWidth = 1.3; c.lineCap = "round"; c.beginPath(); c.moveTo(-10, 6); c.lineTo(-14, 12); c.moveTo(-4, 7); c.lineTo(-6, 13); c.moveTo(3, 7); c.lineTo(5, 13); c.stroke();
    asa(-.12 + bate, 54, 13, "rgba(236,244,234,.62)");
    c.restore();
  }

  /* A planta em que o louva-a-deus se apoia: desenhada nas medidas dele */
  var FOLHAS = [
    [-286, -30, 96, -2.75, 15, "#5F9A5C"], [-250, -18, 104, 2.92, 16, "#4B8650"], [-196, 8, 66, 2.6, 12, "#6FA66A"],
    [-128, 16, 46, 2.3, 9, "#4B8650"], [-30, 18, 42, 2.0, 8, "#5F9A5C"], [76, 18, 42, 1.2, 8, "#4B8650"],
    [182, 18, 58, .7, 10, "#6FA66A"], [262, 16, 128, -.5, 20, "#5F9A5C"], [318, 60, 138, .3, 21, "#4B8650"],
    [344, 112, 150, -.32, 22, "#6FA66A"], [384, 210, 150, .55, 22, "#5F9A5C"], [392, 170, 142, 2.95, 20, "#4B8650"]
  ];
  function bez(a, b, e, f, u) { var m = 1 - u; return m * m * m * a + 3 * m * m * u * b + 3 * m * u * u * e + u * u * u * f; }
  var CAULE = (function () {
    var p = [], u;
    for (u = 0; u <= 1; u += .05) p.push([bez(470, 438, 410, 250, u), bez(620, 280, 22, 13, u), lerpW(21, 15, u)]);
    p.push([-110, 13, 11]);
    for (u = .1; u <= 1; u += .1) p.push([bez(-110, -180, -240, -300, u), bez(13, 12, -6, -34, u), lerpW(11, 3, u)]);
    function lerpW(a, b, q) { return a + (b - a) * q; }
    return p;
  })();
  function planta(c, t) {
    c.lineCap = "round";
    FOLHAS.forEach(function (f, i) {
      var a = f[3] + Math.sin(t * .9 + i * 1.7) * .035, ex = f[0] + Math.cos(a) * f[2], ey = f[1] + Math.sin(a) * f[2], mx = (f[0] + ex) / 2, my = (f[1] + ey) / 2, nx = -Math.sin(a) * f[4], ny = Math.cos(a) * f[4];
      c.fillStyle = f[5]; c.beginPath(); c.moveTo(f[0], f[1]); c.quadraticCurveTo(mx + nx, my + ny, ex, ey); c.quadraticCurveTo(mx - nx, my - ny, f[0], f[1]); c.fill();
      c.strokeStyle = "rgba(226,240,204,.55)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(f[0], f[1]); c.lineTo(ex, ey); c.stroke();
    });
    for (var i = 1; i < CAULE.length; i++) { var a = CAULE[i - 1], b = CAULE[i]; c.strokeStyle = "#4F7A45"; c.lineWidth = (a[2] + b[2]) / 2; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
    for (i = 1; i < CAULE.length; i++) { a = CAULE[i - 1]; b = CAULE[i]; c.strokeStyle = "#8DB277"; c.lineWidth = Math.max(1, a[2] * .2); c.beginPath(); c.moveTo(a[0], a[1] - a[2] * .22); c.lineTo(b[0], b[1] - b[2] * .22); c.stroke(); }
    c.fillStyle = "#3D6337"; [[230, 13], [70, 13], [-70, 13]].forEach(function (n) { c.fillRect(n[0] - 2, n[1] - 8, 4, 16); });
  }

  /* O templo chinês ao fundo: o pagode é o mesmo traço do logo do instituto */
  var PAGODE = "M281 25L281 24.5L282.1 26L282.5 34L283.5 38L291 47.8L303 59.4L310 63.5L315 65.3L320 66.5L325 66.9L333 66.5L333.8 67L332.4 71L328.3 77L325 80.2L320 83.5L316.1 88L316 104L318 105.3L326 107.5L330 107.9L342 107.5L342.5 108L340.4 113L336 119.5L331 124.4L326 127.6L321.7 132L321.6 149L322 149.4L327 150L339 153.4L343 153.7L345 154.3L356 154.4L361 153.4L361.6 154L358.3 162L353.5 169L346 176.3L340.3 180L334.5 186L333.8 187L333.9 194L333.4 196L332 197.2L329.8 198L329.8 221L330.5 222L333 222.1L333.9 223L334 226.3L335 227.1L336 227L337.1 228L337.2 232L340.3 233L340 240.8L339 241.3L307 241.3L223 241.3L222.5 240L222.5 233L223 232.4L225 232.5L225.8 232L225.7 228L227 227L228.1 227L228.7 226L229 222.4L232 222.2L232.7 221L232.7 198L230 196.5L228.7 194L228.5 186L222 179.5L217 176.4L214.2 174L208.6 168L204.6 162L201.2 154L202 153.5L207 154.4L218 154.3L220 153.7L224 153.4L236 149.9L240 149.5L241 149L240.8 132L237 127.6L232 124.5L226.5 119L222.5 113L220.5 108L221 107.5L233 107.9L237 107.5L246 104.7L246.8 104L246.8 88L243 83.6L238 80.4L234.6 77L231.7 73L228.8 67L230 66.5L238 66.9L243 66.5L248 65.2L255 62.4L261 58.5L270 49.9L274.3 45L279.3 38L280.1 36ZM253 89.8L252 90L251.6 91L251.6 102L252 102.8L261 103.1L262.2 102L262 90.6L261 89.8ZM269 89.8L268 91L268 102L268.8 103L278 103.2L278.5 102L278.3 90ZM285 89.8L284.5 91L284.8 103L294 103.2L294.6 102L294.3 90ZM301 89.8L300.5 91L300.5 102L300.9 103L310 103.1L311 102.9L311.4 102L311.4 91L311 90ZM247 134.6L246.6 135L246.7 147L247 148L248 148.3L258.6 148L259.1 147L259.1 135L258 134.4ZM266 134.8L265.8 147L266.3 148L267 148.3L277.8 148L278.2 147L278.2 135L277 134.4L267 134.4ZM285 134.8L284.9 147L286 148.3L296 148.3L297 147.9L297.3 135L296 134.4L286 134.4ZM304 134.9L304 147L305 148.3L316 148L316.3 135L315 134.4L305 134.4ZM243 197.4L242.4 198L242.4 221L242.7 222L258 222.2L259.1 221L259 198L258 197.4ZM269 197.4L268.4 198L268.4 221L268.8 222L294 222.2L294.6 221L294.6 198L294 197.4ZM304 198L304 221L304.6 222L320 222.2L320.5 221L320.5 198L320 197.4L305 197.4Z";
  function FundoHeroi(cv) {
    var c = cv.getContext("2d"), W = 0, H = 0, D = 1, tela = document.createElement("canvas"), g = {};
    function crista(k, base, amp, sem, cor) {
      k.fillStyle = cor; k.beginPath(); k.moveTo(0, H);
      for (var x = 0; x <= W + 8; x += 8) k.lineTo(x, base + (Math.sin(x * .0052 + sem) * .55 + Math.sin(x * .013 + sem * 2.3) * .3 + Math.sin(x * .031 + sem * 4.1) * .15) * amp);
      k.lineTo(W, H); k.closePath(); k.fill();
    }
    function salao(k, x, y, l, a) {
      k.fillStyle = "#C2876B"; k.fillRect(x - l / 2, y - a, l, a);
      k.fillStyle = "#94624F"; for (var i = 1; i < 5; i++) k.fillRect(x - l / 2 + l * i / 5 - a * .03, y - a, a * .06, a);
      k.fillStyle = "#EFD9A8"; k.fillRect(x - l * .08, y - a * .68, l * .16, a * .68);
      var b = l * .62, tp = y - a - a * .72;
      k.fillStyle = "#68766F"; k.beginPath(); k.moveTo(x - b - l * .06, y - a * 1.1); k.quadraticCurveTo(x - b * .78, y - a * .92, x - b * .55, tp + a * .3); k.lineTo(x + b * .55, tp + a * .3); k.quadraticCurveTo(x + b * .78, y - a * .92, x + b + l * .06, y - a * 1.1); k.lineTo(x + b * .92, y - a * .86); k.lineTo(x - b * .92, y - a * .86); k.closePath(); k.fill();
      k.fillRect(x - b * .58, tp + a * .22, b * 1.16, a * .1);
    }
    function monta() {
      D = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight;
      cv.width = tela.width = Math.round(W * D); cv.height = tela.height = Math.round(H * D);
      var k = tela.getContext("2d"), estreito = W < 700; k.setTransform(D, 0, 0, D, 0, 0);
      var ceu = k.createLinearGradient(0, 0, 0, H); ceu.addColorStop(0, "#F8F1E3"); ceu.addColorStop(.55, "#F6E7D2"); ceu.addColorStop(1, "#EFE3CF");
      k.fillStyle = ceu; k.fillRect(0, 0, W, H);
      var px = W * (estreito ? .76 : .78), py = H * (estreito ? .58 : .69), e = H * (estreito ? .29 : .56) / 217;
      g = { px: px, py: py, e: e };
      k.fillStyle = "rgba(233,160,106,.5)"; k.beginPath(); k.arc(px, py - 118 * e, 92 * e, 0, 7); k.fill();
      crista(k, H * .5, H * .1, 1.3, "#DDDFD0");
      crista(k, H * .6, H * .07, 4.1, "#CDD6C4");
      /* colina do templo */
      k.fillStyle = "#BFCDB2"; k.beginPath(); k.moveTo(0, H);
      for (var x = 0; x <= W + 8; x += 8) { var d = (x - px) / (W * .3); k.lineTo(x, py + 4 + H * .1 * (1 - Math.exp(-d * d)) ); }
      k.lineTo(W, H); k.closePath(); k.fill();
      /* salões laterais */
      salao(k, px - 88 * e, py + 2, 74 * e, 19 * e); salao(k, px + 88 * e, py + 2, 74 * e, 19 * e);
      /* pagode */
      k.save(); k.translate(px - 281 * e, py - 241 * e); k.scale(e, e);
      k.fillStyle = "#F4DCA4"; k.fillRect(250, 88, 62, 16); k.fillRect(245, 133, 72, 16); k.fillRect(241, 196, 80, 27);
      var P = new Path2D(PAGODE); k.fillStyle = "#68766F"; k.fill(P, "evenodd");
      k.save(); k.clip(P, "evenodd");
      k.fillStyle = "#C2876B"; k.fillRect(190, 86, 180, 22); k.fillRect(190, 131, 180, 21); k.fillRect(190, 194, 180, 30);
      k.fillStyle = "#7F8D85"; k.fillRect(190, 30, 90, 46); k.fillRect(190, 108, 90, 20); k.fillRect(190, 152, 90, 34);
      k.strokeStyle = "rgba(50,62,58,.32)"; k.lineWidth = .6;
      for (var i = 0; i < 26; i++) { var q = 204 + i * 6; k.beginPath(); k.moveTo(281, 44); k.quadraticCurveTo(q, 60, q, 78); k.moveTo(281, 108); k.quadraticCurveTo(q, 112, q, 126); k.moveTo(281, 152); k.quadraticCurveTo(q, 164, q, 186); k.stroke(); }
      k.fillStyle = "#59645E"; k.fillRect(190, 226, 180, 18);
      k.restore(); k.restore();
      /* primeiro plano, onde fica o texto */
      crista(k, H * .84, H * .025, 7.7, "#DCE3CE");
    }
    function desenha(t) {
      c.setTransform(D, 0, 0, D, 0, 0); c.clearRect(0, 0, W, H); c.drawImage(tela, 0, 0, W, H);
      var e = g.e, bal = Math.sin(t * 1.3) * 1.3;
      c.save(); c.translate(g.px - 281 * e, g.py - 241 * e); c.scale(e, e);
      [[229, 81], [334, 81], [221, 128], [342, 128], [204, 182], [361, 182]].forEach(function (l) {
        c.strokeStyle = "#59645E"; c.lineWidth = .7; c.beginPath(); c.moveTo(l[0], l[1]); c.lineTo(l[0] + bal, l[1] + 7); c.stroke();
        c.fillStyle = "#D2744B"; c.beginPath(); c.ellipse(l[0] + bal, l[1] + 10, 2.8, 3.6, 0, 0, 7); c.fill();
      });
      c.restore();
      /* névoa passando diante do templo */
      [[.1, .64, .34, .05, 9], [.55, .57, .3, .035, -7], [.86, .72, .36, .05, 6]].forEach(function (n) {
        var nx = ((n[0] * W + t * n[4]) % (W * 1.3) + W * 1.3) % (W * 1.3) - W * .15, rx = n[2] * W, ry = n[3] * H;
        c.save(); c.translate(nx, n[1] * H); c.scale(rx, ry);
        var gr = c.createRadialGradient(0, 0, 0, 0, 0, 1); gr.addColorStop(0, "rgba(251,247,238,.8)"); gr.addColorStop(1, "rgba(251,247,238,0)");
        c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 1, 0, 7); c.fill(); c.restore();
      });
    }
    var atual = 0;
    monta();
    new ResizeObserver(function () { if (cv.clientWidth !== W || cv.clientHeight !== H) { monta(); desenha(atual); } }).observe(cv);
    return { desenha: function (t) { atual = t; desenha(t); } };
  }

  var COR = { base: "#13632B", esc: "#0C4520", maisEsc: "#072E15", luz: "#1F8A40", asa: "#0F5525", veia: "rgba(160,220,160,.35)", brilho: "rgba(190,240,170,.55)", olho: "#C9E265", pupila: "#121212", rastro: "#C95F00", traco: "#D2752F", galho: ["#8A7A5C", "#6A5C43"] };
  var visivel = new Map(), io = new IntersectionObserver(function (es) { es.forEach(function (e) { visivel.set(e.target, e.isIntersecting); }); }, { rootMargin: "60px" });

  /* Heroi: a cigarra */
  var cvH = $("#tela-heroi"), mH = null, presa = { x: -320, y: -300, vx: 0, vy: 0, viva: true, volta: 0, a: 0, lado: 1 }, espera = 2, ponteiro = null, ultimo = 0, fundoH = null;
  if (cvH) {
    fundoH = FundoHeroi($("#fundo-heroi"));
    mH = Mantis(cvH, {
      cor: COR, presa: presa, galho: false, planta: planta,
      ancora: function (w, h) {
        var base = $(".heroi__base"), topo = base ? base.offsetTop : h * .85;
        if (w < 700) return { x: w * .44, y: topo - 34, s: Math.min(w / 860, h / 1400) };
        return { x: w * .6, y: topo - 64, s: Math.min(h / 880, w / 1250) };
      }
    });
    io.observe(cvH); visivel.set(cvH, true);
    function bote(alvo, pegou) {
      var s = mH.ombro, dx = alvo.x - s.x, dy = alvo.y - s.y, d = Math.hypot(dx, dy) || 1, al = Math.min(d, 250);
      var x = dx / d * al, y = dy / d * al;
      mH.golpe([
        { x: -58, y: -4, d: .13, k: 260, h: 14 },
        { x: x, y: y, d: .15, k: 3600, h: -34, i: -.12, r2: true, fim: pegou },
        { x: x * .96, y: y * .96, d: .32, k: 900, h: -30 },
        { x: -112, y: 50, d: .4, k: 90, h: 0 }
      ]);
    }
    heroi.addEventListener("pointermove", function (e) { var r = cvH.getBoundingClientRect(); ponteiro = mH.local(e.clientX - r.left, e.clientY - r.top); ultimo = 3; });
    heroi.addEventListener("pointerdown", function (e) {
      if (e.target.closest("a,button")) return;
      heroi.classList.add("tocado");
      var r = cvH.getBoundingClientRect(), p = mH.local(e.clientX - r.left, e.clientY - r.top);
      ponteiro = p; ultimo = 3; mH.olhar(p); bote(p);
    });
    if (calmo) { mH.olhar({ x: -300, y: -320 }); mH.imediato(); fundoH.desenha(0); }
  }

  /* Os 12 Principios */
  var GOLPES = [
    [[-195, -24, .22], [-112, 42, .2], [-58, 12, .24]],
    [[-180, 42, .22], [-92, 96, .28]],
    [[-190, -44, .22], [-62, 116, .3]],
    [[-152, 74, .22], [-118, -126, .3]],
    [[-205, 2, .24], [-186, 14, .1], [-205, 2, .12], [-186, 14, .1]],
    [[-235, -10, .34, -48]],
    [[-118, -132, .24], [-176, 66, .16]],
    [[-245, -30, .16, -30], [-245, -30, .22, -30]],
    [[-176, -22, .24], [-146, 14, .24], [-176, -22, .22]],
    [[-174, 12, .2], [-140, -24, .2], [-116, 12, .2], [-150, 44, .2]],
    [[-96, 22, .3, -60]],
    [[-70, 40, .34, -68, -.2]]
  ];
  var cvG = $("#tela-golpes"), mG = null, autoG = 0, gAtual = -1, tocouG = false;
  function faz(i) {
    if (!mG) return;
    var seq = GOLPES[i].map(function (p) { return { x: p[0], y: p[1], d: p[2], k: 1500, h: p[3] || 0, i: p[4] || 0 }; });
    seq.push({ x: seq[seq.length - 1].x, y: seq[seq.length - 1].y, d: .35, k: 800, h: seq[seq.length - 1].h });
    seq.push({ x: -112, y: 50, d: .5, k: 60, h: 0 });
    mG.golpe(seq);
  }
  function seleciona(i, doUsuario) {
    gAtual = i;
    $$(".golpe").forEach(function (b) {
      var sim = +b.dataset.g === i; b.setAttribute("aria-pressed", sim);
      if (sim) $("#golpe-info").innerHTML = "<b>" + b.dataset.p + "</b> " + b.dataset.t + " <span>" + b.dataset.b + "</span>";
    });
    if (doUsuario) tocouG = true;
    faz(i); autoG = 3.4;
  }
  if (cvG) {
    mG = Mantis(cvG, {
      cor: COR,
      traco: true, ancora: function (w, h) { return { x: w * .6, y: h * .93, s: Math.min(w / 730, h / 500) }; }
    });
    mG.olhar({ x: -400, y: -300 });
    io.observe(cvG); visivel.set(cvG, false);
    $$(".golpe").forEach(function (b) { b.addEventListener("click", function () { seleciona(+b.dataset.g, true); if (calmo) { mG.imediato(); } }); });
    if (calmo) mG.imediato();
  }

  /* Tai Chi: uma forma lenta em quatro movimentos, feita por chaves e cinemática inversa */
  var FORMA = [
    /* t, quadril x, y, mão A x, y, mão B x, y, pé A x, altura, pé B x */
    [0, 0, -172, -44, -118, 44, -118, -20, 0, 20], [2, 0, -172, -44, -118, 44, -118, -20, 0, 20],
    [3.4, 14, -170, -44, -122, 44, -122, -40, 15, 20], [4.6, 0, -165, -44, -122, 44, -122, -62, 0, 20],
    [7, 0, -167, -42, -262, 42, -262, -62, 0, 20], [9.5, 0, -148, -46, -178, 46, -178, -62, 0, 20],
    [11.5, -26, -150, -78, -274, -8, -168, -62, 0, 20], [14, 0, -148, -8, -176, 6, -268, -62, 0, 20],
    [16.5, 26, -150, 8, -168, 78, -274, -62, 0, 20], [19, 0, -148, 6, -268, -6, -176, -62, 0, 20],
    [21.5, -26, -150, -78, -274, -8, -168, -62, 0, 20], [23.5, 18, -152, 30, -212, 72, -250, -62, 0, 20],
    [24.9, 30, -150, 22, -226, 90, -256, -86, 16, 20], [26.2, 10, -146, -40, -236, 112, -258, -108, 0, 20],
    [27.8, -32, -140, -130, -254, 122, -258, -108, 0, 20], [31, -32, -140, -130, -254, 122, -258, -108, 0, 20],
    [33, 0, -150, -60, -262, 60, -262, -62, 0, 20], [35, 0, -165, -44, -150, 44, -150, -62, 0, 20],
    [36.2, 12, -168, -44, -124, 44, -124, -40, 13, 20], [38, 0, -172, -44, -118, 44, -118, -20, 0, 20]
  ];
  var FORMA_DUR = 38;
  var FORMA_NOMES = [
    [0, "起势", "Qǐ shì, abertura"], [9.5, "云手", "Yún shǒu, mãos de nuvem"], [23, "单鞭", "Dān biān, chicote simples"], [31.5, "收势", "Shōu shì, fechamento"]
  ];
  function TaiChi(cv, legenda) {
    var c = cv.getContext("2d"), W = 0, H = 0, D = 1, rastroA = [], rastroB = [], nomeAtual = -1;
    function pose(t) {
      var i = 0; while (i + 2 < FORMA.length && FORMA[i + 1][0] <= t) i++;
      var a = FORMA[Math.max(0, i - 1)], b = FORMA[i], e = FORMA[i + 1], f = FORMA[Math.min(FORMA.length - 1, i + 2)], u = trava((t - b[0]) / (e[0] - b[0]), 0, 1), o = [];
      u = u * u * (3 - 2 * u);
      for (var k = 1; k < b.length; k++) { var m1 = (e[k] - a[k]) * .25, m2 = (f[k] - b[k]) * .25, u2 = u * u, u3 = u2 * u; o[k] = (2 * u3 - 3 * u2 + 1) * b[k] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * e[k] + (u3 - u2) * m2; }
      /* joelhos apenas levemente flexionados, como no Tai Chi */
      return { px: o[1], py: -172 + (o[2] + 172) * .45, a: { x: o[3], y: o[4] }, b: { x: o[5], y: o[6] }, fa: o[7], la: Math.max(0, o[8]), fb: o[9] };
    }
    function articula(o, alvo, L1, L2, ladoFora) {
      var u = ik(o, L1, L2, alvo, 1), v = ik(o, L1, L2, alvo, -1);
      return (u.j.x - v.j.x) * ladoFora > 0 ? u : v;
    }
    /* cotovelo sempre para baixo e para fora: os antebraços nunca se cruzam na subida */
    function cotovelo(o, alvo, L1, L2, lado) {
      var u = ik(o, L1, L2, alvo, 1), v = ik(o, L1, L2, alvo, -1);
      return u.j.y + u.j.x * lado * 1.4 > v.j.y + v.j.x * lado * 1.4 ? u : v;
    }
    function traco(a, b, w, cor) { c.strokeStyle = cor; c.lineWidth = w; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
    function membro2(o, k, w1, w2, cor, borda) {
      traco(o, k.j, w1 + 3, borda); traco(k.j, k.p, w2 + 3, borda);
      traco(o, k.j, w1, cor); traco(k.j, k.p, w2, cor);
    }
    function desenha(t) {
      c.setTransform(D, 0, 0, D, 0, 0); c.clearRect(0, 0, W, H);
      var s = Math.min(W / 480, H / 470), TINTA = "#2F3C35", ROUPA = "#FBF8F1", CALCA = "#46564D", PELE = "#E9C7A4";
      /* lua e taiji ao fundo */
      var cx = W / 2, cy = H * .47, R = Math.min(W, H) * .4;
      c.fillStyle = "#F2EEDF"; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill();
      c.save(); c.translate(cx, cy); c.rotate(t * .05); c.fillStyle = "#D3DCCB";
      c.beginPath(); c.arc(0, 0, R * .92, -Math.PI / 2, Math.PI / 2); c.arc(0, R * .46, R * .46, Math.PI / 2, -Math.PI / 2, true); c.arc(0, -R * .46, R * .46, Math.PI / 2, -Math.PI / 2); c.closePath(); c.fill();
      c.beginPath(); c.arc(0, -R * .46, R * .12, 0, 7); c.fill();
      c.fillStyle = "#F2EEDF"; c.beginPath(); c.arc(0, R * .46, R * .12, 0, 7); c.fill();
      c.restore();
      c.translate(W / 2, H * .9); c.scale(s, s);
      c.fillStyle = "rgba(47,60,53,.14)"; c.beginPath(); c.ellipse(0, 6, 180, 13, 0, 0, 7); c.fill();
      c.lineCap = "round"; c.lineJoin = "round";
      var p = pose(t), Q = { x: p.px, y: p.py }, tronco = p.px * .86, OE = { x: tronco - 32, y: p.py - 112 }, OD = { x: tronco + 32, y: p.py - 112 };
      /* rastro das mãos */
      [rastroA, rastroB].forEach(function (r) { for (var i = 1; i < r.length; i++) { c.strokeStyle = "rgba(210,117,47," + (i / r.length * .55).toFixed(3) + ")"; c.lineWidth = 1 + i / r.length * 5; c.beginPath(); c.moveTo(r[i - 1].x, r[i - 1].y); c.lineTo(r[i].x, r[i].y); c.stroke(); } });
      /* pernas */
      var PA = { x: p.fa, y: -7 - p.la }, PB = { x: p.fb, y: -7 };
      membro2({ x: Q.x - 15, y: Q.y }, articula({ x: Q.x - 15, y: Q.y }, PA, 84, 84, -1), 25, 18, CALCA, TINTA);
      membro2({ x: Q.x + 15, y: Q.y }, articula({ x: Q.x + 15, y: Q.y }, PB, 84, 84, 1), 25, 18, CALCA, TINTA);
      c.fillStyle = TINTA; c.beginPath(); c.ellipse(p.fa - 5, -4 - p.la, 18, 6, 0, 0, 7); c.ellipse(p.fb + 5, -4, 18, 6, 0, 0, 7); c.fill();
      /* casaco */
      c.fillStyle = ROUPA; c.strokeStyle = TINTA; c.lineWidth = 2;
      c.beginPath(); c.moveTo(OE.x - 2, OE.y - 2); c.quadraticCurveTo(tronco, OE.y - 9, OD.x + 2, OD.y - 2);
      c.quadraticCurveTo(Q.x + 34, Q.y - 58, Q.x + 26, Q.y - 14); c.lineTo(Q.x + 37, Q.y + 34); c.lineTo(Q.x - 37, Q.y + 34); c.lineTo(Q.x - 26, Q.y - 14); c.quadraticCurveTo(Q.x - 34, Q.y - 58, OE.x - 2, OE.y - 2); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(tronco - 9, OE.y - 5); c.lineTo(tronco + 4, OE.y + 26); c.lineTo(Q.x, Q.y - 18); c.moveTo(tronco + 9, OE.y - 5); c.lineTo(tronco + 4, OE.y + 26); c.lineWidth = 1.5; c.stroke();
      c.fillStyle = "#D2752F"; c.fillRect(Q.x - 27, Q.y - 20, 54, 10);
      c.strokeStyle = "#D2752F"; c.lineWidth = 4; c.beginPath(); c.moveTo(Q.x + 15, Q.y - 12); c.lineTo(Q.x + 22, Q.y + 26); c.stroke();
      /* pescoço e cabeça */
      var cab = { x: tronco, y: OE.y - 33 };
      traco({ x: tronco, y: OE.y - 6 }, { x: cab.x, y: cab.y + 12 }, 13, PELE);
      c.fillStyle = PELE; c.strokeStyle = TINTA; c.lineWidth = 2; c.beginPath(); c.ellipse(cab.x, cab.y, 20, 24, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = TINTA; c.beginPath(); c.arc(cab.x, cab.y - 3, 21, Math.PI * 1.03, Math.PI * 1.97); c.quadraticCurveTo(cab.x, cab.y - 14, cab.x - 21, cab.y - 2); c.fill();
      c.beginPath(); c.arc(cab.x, cab.y - 30, 7.5, 0, 7); c.fill();
      /* braços, com a manga larga */
      var ka = cotovelo(OE, p.a, 62, 60, -1), kb = cotovelo(OD, p.b, 62, 60, 1);
      [[OE, ka], [OD, kb]].forEach(function (b) { membro2(b[0], b[1], 21, 17, ROUPA, TINTA); c.fillStyle = PELE; c.strokeStyle = TINTA; c.lineWidth = 2; c.beginPath(); c.arc(b[1].p.x, b[1].p.y, 7.5, 0, 7); c.fill(); c.stroke(); });
      if (!calmo) { rastroA.push({ x: ka.p.x, y: ka.p.y }); rastroB.push({ x: kb.p.x, y: kb.p.y }); if (rastroA.length > 90) { rastroA.shift(); rastroB.shift(); } }
      var n = 0; while (n + 1 < FORMA_NOMES.length && FORMA_NOMES[n + 1][0] <= t) n++;
      if (n !== nomeAtual) { nomeAtual = n; legenda.innerHTML = '<span class="zh" lang="zh">' + FORMA_NOMES[n][1] + "</span> " + FORMA_NOMES[n][2]; }
    }
    var atual = 0;
    function tam() { D = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.round(W * D); cv.height = Math.round(H * D); desenha(atual); }
    new ResizeObserver(tam).observe(cv); tam();
    return { desenha: function (t) { if (t < atual) { rastroA = []; rastroB = []; } atual = t; desenha(t); } };
  }
  var cvT = $("#tela-taichi"), mT = null, tT = 0, tocaT = !calmo;
  if (cvT) {
    mT = TaiChi(cvT, $("#taichi-legenda"));
    io.observe(cvT); visivel.set(cvT, false);
    var bT = $("#taichi-pausa");
    if (calmo) { tT = 28; mT.desenha(tT); bT.textContent = "Reproduzir"; }
    bT.addEventListener("click", function () { tocaT = !tocaT; bT.textContent = tocaT ? "Pausar" : "Reproduzir"; if (tocaT && calmo) requestAnimationFrame(function laco2(ag) { if (!tocaT) return; tT = (tT + 1 / 60) % FORMA_DUR; mT.desenha(tT); requestAnimationFrame(laco2); }); });
  }

  /* Um louva-a-deus em cada capa */
  function boteEm(m, p) {
    var s = m.ombro, dx = p.x - s.x, dy = p.y - s.y, d = Math.hypot(dx, dy) || 1, al = Math.min(d, 250), x = dx / d * al, y = dy / d * al;
    m.golpe([{ x: -58, y: -4, d: .13, k: 260, h: 14 }, { x: x, y: y, d: .15, k: 3600, h: -34, i: -.12, r2: true }, { x: x * .96, y: y * .96, d: .32, k: 900, h: -30 }, { x: -112, y: 50, d: .4, k: 90, h: 0 }]);
  }
  var capas = $$(".capa__tela").map(function (cv) {
    var capa = cv.parentElement, m = Mantis(cv, { cor: COR, ancora: function (w, h) { var s = Math.min(h / 530, w / 820); return { x: w - 300 * s, y: h - 15 * s, s: s }; } });
    io.observe(cv); visivel.set(cv, true);
    capa.addEventListener("pointermove", function (e) { var r = cv.getBoundingClientRect(); m.olhar(m.local(e.clientX - r.left, e.clientY - r.top)); });
    capa.addEventListener("pointerdown", function (e) { if (e.target.closest("a,button")) return; var r = cv.getBoundingClientRect(), p = m.local(e.clientX - r.left, e.clientY - r.top); m.olhar(p); boteEm(m, p); });
    m.olhar({ x: -420, y: -300 });
    if (calmo) m.imediato();
    return { cv: cv, m: m, e: 1.5 };
  });

  /* Motor unico */
  if (!calmo && (mH || mG || mT || capas.length)) {
    var ant = performance.now();
    (function laco(ag) {
      var dt = Math.min(.033, (ag - ant) / 1000); ant = ag;
      if (mH && visivel.get(cvH)) {
        ultimo -= dt; espera -= dt;
        var alvoP;
        if (ponteiro && ultimo > 0) alvoP = { x: ponteiro.x + 8, y: ponteiro.y - 6 };
        else alvoP = { x: -300 + Math.sin(ag * .0007) * 150, y: -290 + Math.cos(ag * .0011) * 110 };
        if (presa.viva) {
          presa.vx += ((alvoP.x - presa.x) * 7 - presa.vx * 3.2 + (Math.random() - .5) * 900) * dt;
          presa.vy += ((alvoP.y - presa.y) * 7 - presa.vy * 3.2 + (Math.random() - .5) * 900) * dt;
          presa.x += presa.vx * dt; presa.y += presa.vy * dt; presa.a = trava(presa.vx * .0012, -.3, .3);
          if (presa.vx > 70) presa.lado = -1; else if (presa.vx < -70) presa.lado = 1;
          mH.olhar({ x: presa.x, y: presa.y });
          var s = mH.ombro;
          if (!mH.ocupado && espera <= 0 && Math.hypot(presa.x - s.x, presa.y - s.y) < 235) {
            var alvoB = { x: presa.x, y: presa.y };
            mH.golpe([
              { x: -58, y: -4, d: .15, k: 260, h: 14 },
              { x: alvoB.x - s.x, y: alvoB.y - s.y, d: .13, k: 3600, h: -34, i: -.12, r2: true, fim: function () { presa.viva = false; presa.volta = 2.6; } },
              { x: alvoB.x - s.x, y: alvoB.y - s.y, d: .34, k: 900, h: -30 },
              { x: -112, y: 50, d: .45, k: 90, h: 0 }
            ]);
            espera = 3.2;
          }
        } else {
          presa.volta -= dt;
          if (presa.volta <= 0) { presa.viva = true; presa.x = -640; presa.y = -420; presa.vx = presa.vy = 0; }
        }
        fundoH.desenha(ag / 1000);
        mH.passo(dt); mH.desenha();
      }
      if (mT && tocaT && visivel.get(cvT)) { tT = (tT + dt) % FORMA_DUR; mT.desenha(tT); }
      if (mG && visivel.get(cvG)) {
        if (!tocouG) { autoG -= dt; if (autoG <= 0) seleciona((gAtual + (autoG === -1 ? 0 : 1)) % 12, false); }
        mG.passo(dt); mG.desenha();
      }
      capas.forEach(function (k) { if (!visivel.get(k.cv)) return; k.e -= dt; if (k.e <= 0 && !k.m.ocupado) { k.e = 5 + Math.random() * 4; boteEm(k.m, { x: -300 - Math.random() * 90, y: -250 - Math.random() * 90 }); } k.m.passo(dt); k.m.desenha(); });
      requestAnimationFrame(laco);
    })(ant);
  }

  /* ---------- A arvore ---------- */
  var alvoA = $("#arvore");
  if (alvoA) {
    var NS = "http://www.w3.org/2000/svg", nos = {}, H2 = 58, W_ARV = 3140, H_ARV = 1420;
    var CORES = { pt: "#2A332E", fa: "#6E9F6B", sd: "#5F82B5", op: "#AD6410", fs: "#8D6AA0", se: "#A94E43", no: "#7E1F2E", ps: "#1A7F86", hk: "#1F6B36", "6h": "#BF4A14" };
    $$("#arvore-dados li").forEach(function (li) {
      var pz = li.textContent.split("|");
      li.textContent = pz[0].replace(/\//g, " ") + ", " + pz[1];
      nos[li.dataset.i] = {
        i: li.dataset.i, n: pz[0].split("/"), d: pz[1], x: +li.dataset.x, y: +li.dataset.y, w: +li.dataset.w, h: +li.dataset.h || H2, l: li.dataset.l || "",
        de: (li.dataset.de || "").split(" ").filter(Boolean).map(function (z) {
          var q = z.split(":");
          return { i: q[0], cor: q[1] || "pt", tr: q[2] === "d", via: q[3] ? q[3].split(";").map(function (v) { return v.split(",").map(Number); }) : null };
        }),
        fi: [], fios: []
      };
    });
    var ids = Object.keys(nos);
    ids.forEach(function (k) { nos[k].de.forEach(function (d) { nos[d.i].fi.push(k); }); });
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W_ARV + " " + H_ARV); svg.setAttribute("width", W_ARV); svg.setAttribute("height", H_ARV); svg.setAttribute("role", "group"); svg.setAttribute("aria-label", "Árvore genealógica; a lista completa de nomes está em texto nesta página");
    var defs = document.createElementNS(NS, "defs");
    Object.keys(CORES).forEach(function (c2) {
      var m = document.createElementNS(NS, "marker"), pa = document.createElementNS(NS, "path");
      m.setAttribute("id", "seta-" + c2); m.setAttribute("viewBox", "0 0 10 10"); m.setAttribute("refX", "9"); m.setAttribute("refY", "5"); m.setAttribute("markerWidth", "9"); m.setAttribute("markerHeight", "9"); m.setAttribute("markerUnits", "userSpaceOnUse"); m.setAttribute("orient", "auto");
      pa.setAttribute("d", "M0 0L10 5L0 10Z"); pa.setAttribute("fill", CORES[c2]); m.appendChild(pa); defs.appendChild(m);
    });
    svg.appendChild(defs);
    ids.forEach(function (k) {
      var n = nos[k];
      n.de.forEach(function (d) {
        var p = nos[d.i], f = document.createElementNS(NS, "path"), tr;
        if (d.via) tr = "M" + d.via.map(function (v) { return v[0] + " " + v[1]; }).join("L");
        else { var y1 = p.y + p.h / 2, y2 = n.y - n.h / 2, ym = (y1 + y2) / 2; tr = "M" + p.x + " " + y1 + "V" + ym + "H" + n.x + "V" + y2; }
        f.setAttribute("d", tr); f.setAttribute("class", "fio" + (d.tr ? " fio--treinou" : "")); f.style.stroke = CORES[d.cor]; f.setAttribute("marker-end", "url(#seta-" + d.cor + ")");
        f.dataset.a = d.i; f.dataset.b = k; svg.appendChild(f); n.fios.push(f); p.fios.push(f);
      });
    });
    ids.forEach(function (k) {
      var n = nos[k], g = document.createElementNS(NS, "g"), r = document.createElementNS(NS, "rect"), linhas = n.n.concat(["(" + n.d + ")"]), y0 = n.y - (linhas.length - 1) * 7.5 + 4;
      g.setAttribute("class", "no" + (n.l ? " l-" + n.l : "") + (k === "caio" ? " no--prof" : "")); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", n.n.join(" ") + ", " + n.d);
      r.setAttribute("x", n.x - n.w / 2); r.setAttribute("y", n.y - n.h / 2); r.setAttribute("width", n.w); r.setAttribute("height", n.h);
      g.appendChild(r);
      linhas.forEach(function (t, i) { var a = document.createElementNS(NS, "text"); a.setAttribute("x", n.x); a.setAttribute("y", y0 + i * 15); a.textContent = t; if (i === linhas.length - 1) a.setAttribute("class", "data"); g.appendChild(a); });
      svg.appendChild(g); n.g = g;
      function acao() { foca(k, true); $$(".filtro").forEach(function (x) { x.setAttribute("aria-pressed", "false"); }); }
      g.addEventListener("click", acao);
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); acao(); } });
    });
    function foca(k, desc) {
      ids.forEach(function (x) { nos[x].g.classList.remove("aceso"); nos[x].fios.forEach(function (f) { f.classList.remove("aceso"); }); });
      if (!k) { svg.classList.remove("foco"); return; }
      svg.classList.add("foco");
      var vistos = {};
      (function sobe(x) { if (vistos[x]) return; vistos[x] = 1; nos[x].g.classList.add("aceso"); nos[x].de.forEach(function (d) { nos[x].fios.forEach(function (f) { if (f.dataset.a === d.i && f.dataset.b === x) f.classList.add("aceso"); }); sobe(d.i); }); })(k);
      if (desc) { var abaixo = {}; (function desce(x) { if (abaixo[x]) return; abaixo[x] = 1; nos[x].g.classList.add("aceso"); nos[x].fi.forEach(function (y) { nos[x].fios.forEach(function (f) { if (f.dataset.a === x && f.dataset.b === y) f.classList.add("aceso"); }); desce(y); }); })(k); }
    }
    alvoA.appendChild(svg);
    $$(".filtro").forEach(function (b, _, t) { b.addEventListener("click", function () { t.forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); foca(b.dataset.alvo, false); }); });
  }

/* ---------- As 5 Petalas ---------- */
  $$(".valores li").forEach(function (li) {
    function liga(on) { var p = $('.petala[data-p="' + li.dataset.p + '"]'); if (p) { p.classList.toggle("ativa", on); $("#lotus").classList.toggle("foco", on); } }
    li.addEventListener("mouseenter", function () { liga(true); }); li.addEventListener("mouseleave", function () { liga(false); });
    li.addEventListener("focus", function () { liga(true); }); li.addEventListener("blur", function () { liga(false); });
  });
  
})();