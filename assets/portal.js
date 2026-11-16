/* Portal do Aluno: lista de alunos, hall da fama e o protótipo da área de aulas */
(function () {
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  var calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var FAIXAS = {
    10: ["Pré-Fase", "Sem faixa", ""], 9: ["Faixa Branca", "第九级 - 白丝带"], 8: ["Faixa Amarela", "第八级 - 黄丝带"], 7: ["Faixa Laranja", "第七级 - 橙丝带"],
    6: ["Faixa Verde", "第六级 - 绿丝带"], 5: ["Faixa Azul", "第五级 - 蓝丝带"], 4: ["Faixa Roxa", "第四级 - 紫丝带"], 3: ["Faixa Marrom", "第三级 - 棕丝带"],
    2: ["Faixa Vermelha", "第二级 - 红丝带"], 1: ["Faixa Preta", "第一级 - 黑丝带"]
  };
  function nomeGrau(g) { return g + (g === 10 ? "ª" : "º") + " grau, " + FAIXAS[g][0]; }

  /* ---------------- Lista de alunos ---------------- */
  var lista = $("#lista-alunos");
  if (lista && window.TLD_ALUNOS) {
    var D = window.TLD_ALUNOS, sit = "todos", mod = "todas", busca = "";
    var alunos = D.alunos.slice().sort(function (a, b) { return a.n.localeCompare(b.n, "pt-BR"); });
    $("#atualizado-alunos").textContent = "Lista atualizada em " + D.atualizado + ".";
    function faixa(g, rot) {
      var s = el("span", "tabuleta__faixa");
      var f = el("span", "faixa faixa--" + g); f.setAttribute("aria-hidden", "true"); s.appendChild(f);
      s.appendChild(el("span", null, rot + ": " + g + (g === 10 ? "ª" : "º") + " grau"));
      return s;
    }
    function semAcento(t) { return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
    function desenhaLista() {
      lista.textContent = "";
      var q = semAcento(busca.trim()), n = 0, i = 0;
      alunos.forEach(function (a) {
        if (sit === "ativos" && !a.a) return; if (sit === "inativos" && a.a) return;
        if (mod === "kf" && !a.kf) return; if (mod === "tc" && !a.tc) return;
        if (q && semAcento(a.n).indexOf(q) < 0) return;
        var li = el("li", "tabuleta" + (a.a ? "" : " tabuleta--inativo"));
        li.style.setProperty("--i", i++);
        li.appendChild(el("span", "tabuleta__nome", a.n));
        var g = el("span", "tabuleta__graus");
        if (a.kf) g.appendChild(faixa(a.kf, "Kung Fu"));
        if (a.tc) g.appendChild(faixa(a.tc, "Tai Chi"));
        li.appendChild(g);
        li.appendChild(el("span", "tabuleta__sit", a.a ? "Ativo" : "Inativo"));
        lista.appendChild(li); n++;
      });
      var ativos = alunos.filter(function (a) { return a.a; }).length;
      $("#contagem-alunos").textContent = n === alunos.length ? alunos.length + " alunos, " + ativos + " ativos" : n + (n === 1 ? " aluno encontrado" : " alunos encontrados");
      if (!n) lista.appendChild(el("li", "tabuletas__vazio", "Nenhum nome encontrado."));
    }
    $$("[data-sit]").forEach(function (b, _, t) { b.addEventListener("click", function () { t.forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); sit = b.dataset.sit; desenhaLista(); }); });
    $$("[data-mod]").forEach(function (b, _, t) { b.addEventListener("click", function () { t.forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); mod = b.dataset.mod; desenhaLista(); }); });
    $("#busca-aluno").addEventListener("input", function (e) { busca = e.target.value; desenhaLista(); });
    desenhaLista();
  }

  /* ---------------- Hall da fama ---------------- */
  var lAtletas = $("#atletas");
  if (lAtletas && window.TLD_HALL) {
    var HF = window.TLD_HALL;
    var atl = HF.atletas.slice().sort(function (a, b) { return b.ou - a.ou || b.pr - a.pr || b.br - a.br || (b.mu + b.es + b.na + b.in) - (a.mu + a.es + a.na + a.in); });
    var tot = { ou: 0, pr: 0, br: 0 }; atl.forEach(function (a) { tot.ou += a.ou; tot.pr += a.pr; tot.br += a.br; });
    var placar = $("#placar");
    [["ou", "Ouro"], ["pr", "Prata"], ["br", "Bronze"]].forEach(function (m) {
      var li = el("li", "placar__item placar__item--" + m[0]); li.appendChild(el("b", null, tot[m[0]])); li.appendChild(el("span", null, m[1])); placar.appendChild(li);
    });
    /* varal de medalhas: uma para cada medalha conquistada */
    var NS = "http://www.w3.org/2000/svg", varal = $("#varal"), meds = [];
    atl.forEach(function (a) { for (var i = 0; i < a.ou; i++) meds.push("ou"); for (i = 0; i < a.pr; i++) meds.push("pr"); for (i = 0; i < a.br; i++) meds.push("br"); });
    meds.sort(function (a, b) { return "oupbr".indexOf(a) - "oupbr".indexOf(b); });
    var corda = document.createElementNS(NS, "path"); corda.setAttribute("d", "M0 20Q600 92 1200 20"); corda.setAttribute("class", "varal__corda"); varal.appendChild(corda);
    var nM = meds.length;
    meds.forEach(function (m, i) {
      var x = 60 + (1080 * i) / Math.max(1, nM - 1), t = x / 1200, y = (1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 92 + t * t * 20;
      var g = document.createElementNS(NS, "g"); g.setAttribute("class", "medalha medalha--" + m); g.setAttribute("transform", "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")");
      g.style.setProperty("--d", (i * .13).toFixed(2) + "s");
      var fita = document.createElementNS(NS, "path"); fita.setAttribute("d", "M-7 0L-4 46H4L7 0Z"); fita.setAttribute("class", "medalha__fita");
      var disco = document.createElementNS(NS, "circle"); disco.setAttribute("cy", "60"); disco.setAttribute("r", "16"); disco.setAttribute("class", "medalha__disco");
      var aro = document.createElementNS(NS, "circle"); aro.setAttribute("cy", "60"); aro.setAttribute("r", "10"); aro.setAttribute("class", "medalha__aro");
      var bal = document.createElementNS(NS, "g"); bal.setAttribute("class", "medalha__balanca");
      bal.appendChild(fita); bal.appendChild(disco); bal.appendChild(aro); g.appendChild(bal); varal.appendChild(g);
    });
    /* atletas no tablado */
    atl.forEach(function (a, i) {
      var li = el("li", "atleta" + (i < 3 ? " atleta--podio" : ""));
      li.appendChild(el("span", "atleta__pos", i + 1 + "º"));
      li.appendChild(el("h3", "atleta__nome", a.n));
      var md = el("p", "atleta__medalhas");
      [["ou", "ouro"], ["pr", "prata"], ["br", "bronze"]].forEach(function (m) {
        if (!a[m[0]]) return; var s = el("span", "chip chip--" + m[0], a[m[0]] + " " + m[1] + (a[m[0]] > 1 ? "s" : "")); md.appendChild(s);
      });
      if (!md.childNodes.length) md.appendChild(el("span", "chip", "Participação"));
      li.appendChild(md);
      var comp = el("dl", "atleta__comp");
      [["mu", "Municipal"], ["es", "Estadual"], ["na", "Nacional"], ["in", "Internacional"]].forEach(function (c) { var d = el("div"); d.appendChild(el("dt", null, c[1])); d.appendChild(el("dd", null, a[c[0]])); comp.appendChild(d); });
      li.appendChild(el("p", "atleta__rot", "Competições*¹"));
      li.appendChild(comp);
      lAtletas.appendChild(li);
    });
    /* tabela de resultados */
    var fA = $("#f-atleta"), fL = $("#f-liga"), corpo = $("#tabela-resultados");
    var nomes = []; HF.eventos.forEach(function (e) { if (nomes.indexOf(e.n) < 0) nomes.push(e.n); });
    nomes.sort(function (a, b) { return a.localeCompare(b, "pt-BR"); }).forEach(function (n) { var o = el("option", null, n); o.value = n; fA.appendChild(o); });
    ["CIKOBAM", "LNKF", "LBKF"].forEach(function (n) { var o = el("option", null, n); o.value = n; fL.appendChild(o); });
    function tabela() {
      corpo.textContent = "";
      HF.eventos.forEach(function (e) {
        if (fA.value && e.n !== fA.value) return; if (fL.value && e.l !== fL.value) return;
        var tr = el("tr");
        [e.e, e.l, e.n, e.c].forEach(function (v) { tr.appendChild(el("td", null, v)); });
        var tdp = el("td"), cls = e.p === "Ouro" ? "ou" : e.p === "Prata" ? "pr" : e.p === "Bronze" ? "br" : "";
        tdp.appendChild(el("span", "chip" + (cls ? " chip--" + cls : ""), e.p)); tr.appendChild(tdp);
        corpo.appendChild(tr);
      });
    }
    fA.addEventListener("change", tabela); fL.addEventListener("change", tabela); tabela();
    if (calmo) document.documentElement.classList.add("calmo");
  }

  /* ---------------- Acesso às aulas (protótipo) ---------------- */
  var AREA = document.body.dataset.area;
  if (!AREA) return;
  /* PROTÓTIPO: os cadastros ficam salvos só neste navegador (localStorage). Para valer de verdade,
     login, senhas e o conteúdo das grades precisam ficar num servidor; veja PORTAL.md. */
  var CHAVE = "tld-cadastros", SESSAO = "tld-sessao", INATIVO_MS = 10 * 60 * 1000;
  function hash(txt) {
    if (window.crypto && crypto.subtle && window.TextEncoder) return crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); });
    var h = 5381; for (var i = 0; i < txt.length; i++) h = ((h << 5) + h + txt.charCodeAt(i)) | 0; return Promise.resolve("x" + (h >>> 0).toString(16));
  }
  function sal() { return Math.random().toString(36).slice(2, 10); }
  function ler() { try { return JSON.parse(localStorage.getItem(CHAVE)) || null; } catch (e) { return null; } }
  function grava(l) { try { localStorage.setItem(CHAVE, JSON.stringify(l)); return true; } catch (e) { return false; } }
  var EXEMPLOS = [
    { nome: "Professor (exemplo)", email: "professor@exemplo.com", login: "professor", senha: "tld2026", arte: "kf+tc", kf: 1, tc: 1, admin: true },
    { nome: "Aluno de Kung Fu (exemplo)", email: "aluno.kungfu@exemplo.com", login: "aluno.kungfu", senha: "kungfu", arte: "kf", kf: 6, tc: null },
    { nome: "Aluna de Tai Chi (exemplo)", email: "aluna.taichi@exemplo.com", login: "aluna.taichi", senha: "taichi", arte: "tc", kf: null, tc: 9 },
    { nome: "Aluno das duas (exemplo)", email: "aluno.ambos@exemplo.com", login: "aluno.ambos", senha: "ambos", arte: "kf+tc", kf: 8, tc: 10 }
  ];
  function cadastros() {
    var l = ler(); if (l) return Promise.resolve(l);
    return Promise.all(EXEMPLOS.map(function (u) { var s = sal(); return hash(s + u.senha).then(function (h) { var c = Object.assign({}, u, { sal: s, hash: h }); delete c.senha; return c; }); }))
      .then(function (l2) { grava(l2); return l2; });
  }
  function sessao() { try { var s = JSON.parse(sessionStorage.getItem(SESSAO)); if (s && Date.now() - s.ult < INATIVO_MS) return s; sessionStorage.removeItem(SESSAO); } catch (e) {} return null; }
  function salvaSessao(s) { try { sessionStorage.setItem(SESSAO, JSON.stringify(s)); } catch (e) {} }
  function sair(motivo) { try { sessionStorage.removeItem(SESSAO); } catch (e) {} location.href = "aulas.html" + (motivo ? "?saiu=" + motivo : ""); }

  /* 10 minutos sem atividade: desconecta */
  function vigia() {
    var s = sessao(); if (!s) { sair("expirou"); return null; }
    function mexeu() { var x = sessao(); if (!x) return sair("expirou"); x.ult = Date.now(); salvaSessao(x); }
    ["pointerdown", "keydown", "scroll", "touchstart"].forEach(function (ev) { addEventListener(ev, mexeu, { passive: true }); });
    setInterval(function () { if (!sessao()) sair("expirou"); }, 15000);
    var bS = $("#sair"); if (bS) bS.addEventListener("click", function () { sair(""); });
    return s;
  }

  if (AREA === "login") {
    var aviso = $("#aviso-login"), q = new URLSearchParams(location.search);
    if (q.get("saiu") === "expirou") aviso.textContent = "Sua sessão foi encerrada após 10 minutos sem atividade. Entre de novo.";
    if (sessao()) { aviso.textContent = "Você já está conectado."; }
    cadastros();
    $("#form-login").addEventListener("submit", function (e) {
      e.preventDefault();
      var login = $("#login").value.trim().toLowerCase(), senha = $("#senha").value;
      cadastros().then(function (l) {
        var u = l.filter(function (x) { return x.login.toLowerCase() === login; })[0];
        if (!u) { aviso.textContent = "Login ou senha não conferem."; return; }
        return hash(u.sal + senha).then(function (h) {
          if (h !== u.hash) { aviso.textContent = "Login ou senha não conferem."; $("#senha").select(); return; }
          salvaSessao({ login: u.login, ult: Date.now() });
          location.href = u.admin && $("#como-prof").checked ? "aulas-admin.html" : "aulas-modalidade.html";
        });
      });
    });
    $("#esqueci").addEventListener("click", function () {
      aviso.textContent = "Na versão final, o site envia um e-mail automático para o endereço cadastrado com um link para criar uma senha nova. Neste protótipo, peça ao professor para redefinir sua senha.";
    });
    return;
  }

  var S = vigia(); if (!S) return;
  cadastros().then(function (l) {
    var U = l.filter(function (x) { return x.login === S.login; })[0];
    if (!U) return sair("");
    $$("[data-nome-aluno]").forEach(function (e) { e.textContent = U.nome; });

    if (AREA === "modalidade") {
      [["kf", "Kung Fu"], ["tc", "Tai Chi"]].forEach(function (m) {
        var b = $("#mod-" + m[0]), pratica = !!U[m[0]];
        if (pratica) { b.href = "aulas-grade.html?m=" + m[0]; $(".mod__grau", b).textContent = "Sua graduação: " + nomeGrau(U[m[0]]); }
        else { b.removeAttribute("href"); b.setAttribute("aria-disabled", "true"); b.classList.add("mod--off"); $(".mod__grau", b).textContent = "Você não está matriculado nesta modalidade."; }
      });
      if (U.admin) { var pa = $("#link-admin"); if (pa) pa.hidden = false; }
    }

    if (AREA === "grade") {
      var m = new URLSearchParams(location.search).get("m");
      if (m !== "kf" && m !== "tc") m = U.kf ? "kf" : "tc";
      if (!U[m]) { location.href = "aulas-modalidade.html"; return; }
      var meu = U[m], topo = m === "kf" ? 9 : 10, GR = (window.TLD_GRADE || {})[m] || {};
      $("#t-modalidade").textContent = m === "kf" ? "Kung Fu" : "Tai Chi";
      var cascata = $("#cascata"), atual = null;
      for (var g = topo; g >= 1; g--) {
        (function (g) {
          var li = el("li", "grau"), pode = g >= meu, b = el("button", "grau__btn");
          b.type = "button";
          var f = el("span", "faixa faixa--" + g); f.setAttribute("aria-hidden", "true"); b.appendChild(f);
          b.appendChild(el("span", "grau__nome", nomeGrau(g)));
          if (FAIXAS[g][1] && g !== 10) { var z = el("span", "zh grau__zh", FAIXAS[g][1]); z.lang = "zh"; b.appendChild(z); }
          if (!pode) { b.disabled = true; b.appendChild(el("span", "grau__tranca", "Bloqueado")); }
          else b.addEventListener("click", function () { abre(g, true); });
          li.appendChild(b); cascata.appendChild(li);
        })(g);
      }
      var tela = $("#grade-tela"), vazio = $("#grade-vazia"), titulo = $("#grade-titulo"), ant = $("#grade-ant"), prox = $("#grade-prox"), folha = $("#folha");
      function abre(g, rola) {
        atual = g;
        $$(".grau__btn", cascata).forEach(function (b, i) { b.setAttribute("aria-current", topo - i === g ? "true" : "false"); });
        titulo.textContent = nomeGrau(g) + (FAIXAS[g][1] && g !== 10 ? " (" + FAIXAS[g][1] + ")" : "");
        ant.hidden = g === topo;
        prox.hidden = !(g - 1 >= 1 && g - 1 >= meu);
        folha.hidden = false;
        if (!calmo) { folha.classList.remove("vira"); void folha.offsetWidth; folha.classList.add("vira"); }
        desenhaGrade(GR[g]);
        if (rola) folha.scrollIntoView({ behavior: calmo ? "auto" : "smooth", block: "start" });
      }
      ant.addEventListener("click", function () { if (atual < topo) abre(atual + 1, true); });
      prox.addEventListener("click", function () { if (atual - 1 >= meu) abre(atual - 1, true); });
      /* a grade é desenhada como imagem (canvas), para não poder ser selecionada nem copiada */
      function desenhaGrade(dado) {
        var info = $("#grade-info");
        if (!dado) { tela.hidden = true; vazio.hidden = false; info.textContent = ""; return; }
        tela.hidden = false; vazio.hidden = true;
        info.textContent = (dado.tempo ? "Tempo de treino: " + dado.tempo + ". " : "") + dado.itens.length + " técnicas (" + dado.itens.filter(function (i) { return i[4] === "o"; }).length + " do currículo obrigatório).";
        var W = Math.min(tela.parentElement.clientWidth, 980), Dp = Math.min(devicePixelRatio || 1, 2), c = tela.getContext("2d");
        var estreito = W < 560, fs = estreito ? 13 : 15, lh = fs * 1.35, pad = 12;
        var cols = estreito ? [0, .36, 1] : [0, .3, .84, 1], cab = estreito ? ["Bloco", "Técnica"] : ["Bloco de técnica", "Técnica", "Grade"];
        var fonte = function (p) { return (p || "") + " " + fs + "px 'Albert Sans', 'Noto Serif SC', sans-serif"; };
        c.font = fonte();
        function quebra(txt, larg) { var out = [], linha = ""; String(txt).split(/(\s+)/).forEach(function (p) { var t = linha + p; if (c.measureText(t).width > larg && linha.trim()) { out.push(linha.trim()); linha = p.trimStart(); } else linha = t; }); if (linha.trim()) out.push(linha.trim()); return out.length ? out : [""]; }
        var linhas = dado.itens.map(function (it) {
          var cel = [[it[0], it[1] ? "(" + it[1] + ")" : ""], [it[2], it[3] ? "(" + it[3] + ")" : ""]];
          if (!estreito) cel.push([it[4] === "o" ? "Obrigatório" : "Eletivo"]);
          var qs = cel.map(function (cc, k) { var larg = (cols[k + 1] - cols[k]) * W - pad * 2, r = []; cc.forEach(function (t) { if (t) r = r.concat(quebra(t, larg)); }); return r; });
          return { qs: qs, h: Math.max.apply(null, qs.map(function (q) { return q.length; })) * lh + pad * 1.4, tipo: it[4] };
        });
        var H = 46 + linhas.reduce(function (s, l) { return s + l.h; }, 0) + 8;
        tela.width = Math.round(W * Dp); tela.height = Math.round(H * Dp); tela.style.width = W + "px"; tela.style.height = H + "px";
        c.setTransform(Dp, 0, 0, Dp, 0, 0); c.fillStyle = "#FBF8F1"; c.fillRect(0, 0, W, H);
        c.fillStyle = "#2F6B46"; c.fillRect(0, 0, W, 40); c.fillStyle = "#FBF8F1"; c.font = fonte("700"); c.textBaseline = "middle";
        cab.forEach(function (t, k) { c.fillText(t, cols[k] * W + pad, 20); });
        var y = 46; c.textBaseline = "top";
        linhas.forEach(function (l, i) {
          c.fillStyle = l.tipo === "o" ? (i % 2 ? "#F4EEE2" : "#FBF8F1") : (i % 2 ? "#EAF0E4" : "#F1F5EC"); c.fillRect(0, y - 4, W, l.h);
          l.qs.forEach(function (q, k) { q.forEach(function (t, j) { c.fillStyle = j === 0 && k < 2 ? "#2A332E" : "#5B5F58"; c.font = fonte(j === 0 && k < 2 ? "600" : ""); c.fillText(t, cols[k] * W + pad, y + 4 + j * lh); }); });
          y += l.h; c.fillStyle = "#CFC6B2"; c.fillRect(0, y - 5, W, 1);
        });
        /* marca d'água com o nome do aluno */
        c.save(); c.globalAlpha = .07; c.fillStyle = "#2A332E"; c.font = "700 " + (estreito ? 18 : 24) + "px 'Albert Sans', sans-serif"; c.translate(W / 2, H / 2); c.rotate(-.5);
        for (var yy = -H; yy < H; yy += 120) for (var xx = -W; xx < W; xx += 420) c.fillText(U.nome + " · Tang Lang Dao", xx, yy);
        c.restore();
        tela.setAttribute("aria-label", "Grade de " + nomeGrau(atual) + ", " + dado.itens.length + " técnicas.");
      }
      addEventListener("resize", function () { if (atual) desenhaGrade(GR[atual]); });
      /* bloqueios contra cópia (não impedem foto da tela) */
      var area = $(".aula");
      ["copy", "cut", "contextmenu", "dragstart", "selectstart"].forEach(function (ev) { area.addEventListener(ev, function (e) { e.preventDefault(); }); });
      addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && /^[cpsua]$/i.test(e.key)) e.preventDefault(); });
      abre(meu, false);
    }

    if (AREA === "admin") {
      if (!U.admin) { location.href = "aulas-modalidade.html"; return; }
      var corpo = $("#tabela-cad"), form = $("#form-cad"), msg = $("#msg-cad"), editando = null;
      function linhaGrau(g, mx) { return g ? g + (g === 10 ? "ª" : "º") + " grau" : "—"; }
      function tabelaCad() {
        var l2 = ler() || []; corpo.textContent = "";
        l2.forEach(function (c2, i) {
          var tr = el("tr");
          [c2.nome, c2.email, c2.login, c2.arte === "kf" ? "Kung Fu" : c2.arte === "tc" ? "Tai Chi" : "Kung Fu e Tai Chi", linhaGrau(c2.kf), linhaGrau(c2.tc)].forEach(function (v) { tr.appendChild(el("td", null, v)); });
          var td = el("td", "acoes"), be = el("button", "filtro", "Editar"), bx = el("button", "filtro filtro--perigo", "Excluir");
          be.type = bx.type = "button";
          be.addEventListener("click", function () { preenche(c2); });
          bx.addEventListener("click", function () {
            if (c2.login === U.login) { msg.textContent = "Você não pode excluir o próprio cadastro enquanto está conectado."; return; }
            if (!confirm("Excluir o cadastro de " + c2.nome + "?")) return;
            var l3 = (ler() || []).filter(function (x) { return x.login !== c2.login; }); grava(l3); tabelaCad(); msg.textContent = "Cadastro de " + c2.nome + " excluído.";
          });
          td.appendChild(be); td.appendChild(bx); tr.appendChild(td); corpo.appendChild(tr);
        });
      }
      function preenche(c2) {
        editando = c2 ? c2.login : null;
        form.nome.value = c2 ? c2.nome : ""; form.email.value = c2 ? c2.email : ""; form.login.value = c2 ? c2.login : ""; form.senha.value = "";
        form.arte.value = c2 ? c2.arte : "kf"; form.kf.value = c2 && c2.kf ? c2.kf : ""; form.tc.value = c2 && c2.tc ? c2.tc : "";
        form.admin.checked = !!(c2 && c2.admin);
        form.senha.required = !c2; $("#t-form-cad").textContent = c2 ? "Editar cadastro de " + c2.nome : "Novo cadastro";
        $("#cancelar-cad").hidden = !c2; ajustaGraus(); form.nome.focus();
      }
      function ajustaGraus() { var a = form.arte.value; form.kf.disabled = a === "tc"; form.tc.disabled = a === "kf"; if (a === "tc") form.kf.value = ""; if (a === "kf") form.tc.value = ""; }
      form.arte.addEventListener("change", ajustaGraus);
      $("#cancelar-cad").addEventListener("click", function () { preenche(null); msg.textContent = ""; });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var l2 = ler() || [], login = form.login.value.trim().toLowerCase();
        if (l2.some(function (x) { return x.login === login && x.login !== editando; })) { msg.textContent = "Já existe um cadastro com o login " + login + "."; return; }
        var arte = form.arte.value, kf = arte === "tc" ? null : +form.kf.value || null, tc = arte === "kf" ? null : +form.tc.value || null;
        if ((arte !== "tc" && !kf) || (arte !== "kf" && !tc)) { msg.textContent = "Informe a graduação de cada modalidade praticada."; return; }
        var base = editando ? l2.filter(function (x) { return x.login === editando; })[0] : {};
        var novo = Object.assign({}, base, { nome: form.nome.value.trim(), email: form.email.value.trim(), login: login, arte: arte, kf: kf, tc: tc, admin: form.admin.checked });
        var pronto = form.senha.value ? (function () { novo.sal = sal(); return hash(novo.sal + form.senha.value).then(function (h) { novo.hash = h; }); })() : Promise.resolve();
        pronto.then(function () {
          if (editando) l2 = l2.map(function (x) { return x.login === editando ? novo : x; }); else l2.push(novo);
          grava(l2);
          if (editando === U.login && login !== U.login) { S.login = login; salvaSessao(S); }
          msg.textContent = (editando ? "Cadastro atualizado: " : "Cadastro criado: ") + novo.nome + ".";
          preenche(null); tabelaCad();
        });
      });
      $("#restaurar").addEventListener("click", function () {
        if (!confirm("Apagar todos os cadastros deste navegador e voltar aos exemplos?")) return;
        try { localStorage.removeItem(CHAVE); } catch (e2) {}
        cadastros().then(function () { sair(""); });
      });
      preenche(null); tabelaCad();
    }
  });
})();
