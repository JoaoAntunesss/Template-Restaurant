/* core.js — partilhado pelo site, pelo cardápio e pelo painel. Não precisa de ser alterado por restaurante. */
(function () {
  const R = window.REST;
  const DEMO = !(R.firebase && R.firebase.apiKey);

  // Os 14 alergénios da lista oficial da UE (os números são os que aparecem no cardápio)
  const ALERGENIOS = { 1: 'Glúten', 2: 'Crustáceos', 3: 'Ovos', 4: 'Peixe', 5: 'Amendoins', 6: 'Soja', 7: 'Leite', 8: 'Frutos de casca rija', 9: 'Aipo', 10: 'Mostarda', 11: 'Sésamo', 12: 'Sulfitos', 13: 'Tremoço', 14: 'Moluscos' };

  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const eur = v => { const n = Math.round((Number(v) || 0) * 100) / 100; return n.toLocaleString('pt-PT', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }) + ' €'; };
  const telInt = t => { let n = String(t || '').replace(/\D/g, ''); if (n.length === 9) n = R.indicativo + n; return n; };
  const telFmt = t => String(t || '').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');

  function aplicarTema() {
    const c = R.cores, s = document.documentElement.style;
    s.setProperty('--paper', c.fundo); s.setProperty('--ink', c.texto); s.setProperty('--accent', c.destaque); s.setProperty('--accent-dark', c.destaqueEscuro);
  }

  // Cardápio ordenado: [{ id, nome, pratos: [...] }]
  function organizar(cd) {
    cd = cd || {};
    const cats = Object.entries(cd.categorias || {}).map(([id, c]) => ({ id, ...c })).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    const pratos = Object.entries(cd.pratos || {}).map(([id, p]) => ({ id, ...p })).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    return cats.map(c => ({ ...c, pratos: pratos.filter(p => p.cat === c.id) }));
  }

  // =================================================================
  // Base de dados: Firebase a sério, ou uma imitação local (modo demo)
  // =================================================================
  const carregar = src => new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });
  let _db = null, _auth = null;
  async function iniciar(comAuth) {
    if (_db) return;
    if (!DEMO) {
      const b = 'https://www.gstatic.com/firebasejs/10.12.5/';
      await carregar(b + 'firebase-app-compat.js'); await carregar(b + 'firebase-database-compat.js');
      if (comAuth) await carregar(b + 'firebase-auth-compat.js');
      firebase.initializeApp(R.firebase); _db = firebase.database(); if (comAuth) _auth = firebase.auth();
      return;
    }
    _db = demoDB(); _auth = demoAuth();
  }

  function demoDB() {
    const KEY = 'demo-rest-' + R.id;
    let tree = null; try { tree = JSON.parse(localStorage.getItem(KEY)); } catch (e) { }
    if (!tree) tree = semente();
    const ouvintes = [], partes = p => (p || '').split('/').filter(Boolean);
    const ler = p => partes(p).reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), tree);
    function escrever(p, v) {
      const ks = partes(p); if (!ks.length) { tree = v || {}; return; }
      let o = tree; for (let i = 0; i < ks.length - 1; i++) { if (typeof o[ks[i]] !== 'object' || o[ks[i]] === null) o[ks[i]] = {}; o = o[ks[i]]; }
      const last = ks[ks.length - 1]; if (v === null || v === undefined) delete o[last]; else o[last] = JSON.parse(JSON.stringify(v));
    }
    const snap = p => { const v = ler(p); return { key: partes(p).pop(), val: () => (v === undefined ? null : JSON.parse(JSON.stringify(v))) }; };
    function guardar() { try { localStorage.setItem(KEY, JSON.stringify(tree)); } catch (e) { } ouvintes.forEach(l => l.cb(snap(l.p))); }
    // Outros separadores (ex.: painel aberto noutra janela) atualizam o cardápio na hora
    addEventListener('storage', e => { if (e.key !== KEY) return; try { tree = JSON.parse(e.newValue) || semente(); } catch (x) { } ouvintes.forEach(l => l.cb(snap(l.p))); });
    let n = 0; const chave = () => '-D' + Date.now().toString(36) + (n++).toString(36) + Math.random().toString(36).slice(2, 6);
    function ref(p = '') {
      return {
        key: partes(p).pop() || null,
        on(_, cb) { ouvintes.push({ p, cb }); setTimeout(() => cb(snap(p)), 0); },
        once() { return Promise.resolve(snap(p)); },
        set(v) { escrever(p, v); guardar(); return Promise.resolve(); },
        update(o) { Object.keys(o).forEach(k => escrever(p ? p + '/' + k : k, o[k])); guardar(); return Promise.resolve(); },
        remove() { escrever(p, null); guardar(); return Promise.resolve(); },
        push(v) { const r = ref((p ? p + '/' : '') + chave()); if (v !== undefined) r.set(v); return r; }
      };
    }
    return { ref, reset() { try { localStorage.removeItem(KEY); } catch (e) { } tree = semente(); guardar(); } };
  }
  function demoAuth() {
    let user = null; const cbs = [];
    const set = u => { user = u; cbs.forEach(c => c(u)); return Promise.resolve({ user: u }); };
    return { onAuthStateChanged(cb) { cbs.push(cb); setTimeout(() => cb(user), 0); }, signInWithEmailAndPassword: () => set({ uid: 'demo', email: 'demo@exemplo.pt' }), signInWithPopup: () => set({ uid: 'demo', email: 'demo@exemplo.pt' }), signOut: () => set(null) };
  }

  // Hora do servidor (Firebase) ou do próprio navegador (demonstração)
  const agora = () => (DEMO ? Date.now() : firebase.database.ServerValue.TIMESTAMP);
  // Código secreto de cada mesa (vai no QR). Quem não está na mesa não o sabe, por isso não consegue pedir para ela.
  const gerarCodigo = () => { const a = 'abcdefghijkmnpqrstuvwxyz23456789', r = new Uint8Array(10); crypto.getRandomValues(r); return Array.from(r, x => a[x % a.length]).join(''); };

  // Primeiro cardápio, a partir de restaurante.js (na demonstração já vem com mesas e alguns pedidos de exemplo)
  function semente() {
    const t = { cardapio: cardapioDeConfig(), admins: { demo: true }, mesas: {}, codigos: {}, contas: {} };
    t.cardapio.pedidos = true;
    for (let n = 1; n <= 8; n++) { const k = 'm' + String(n).padStart(2, '0'), c = 'demo' + n + 'mesa'; t.mesas[k] = { num: n, nome: 'Mesa ' + n, codigo: c }; t.codigos[c] = { mesa: k, nome: 'Mesa ' + n }; }
    const ids = Object.keys(t.cardapio.pratos), pid = nome => ids.find(i => t.cardapio.pratos[i].nome.startsWith(nome)) || ids[0];
    const item = (nome, q) => ({ [pid(nome)]: { q, n: t.cardapio.pratos[pid(nome)].nome } });
    const ha = min => Date.now() - min * 60000;
    t.contas.demo3mesa = { pedidos: {
      '-Dex1': { itens: { ...item('Pão', 1), ...item('Polvo à galega', 1), ...item('Vinho da casa', 1) }, criadoEm: ha(38), visto: true },
      '-Dex2': { itens: { ...item('Bacalhau à lagareiro', 2), ...item('Água', 2) }, nota: 'Um dos bacalhaus sem grelos, por favor.', criadoEm: ha(6) } } };
    t.contas.demo5mesa = { pedidos: { '-Dex3': { itens: { ...item('Francesinha', 2), ...item('Imperial', 2) }, criadoEm: ha(52), visto: true },
      '-Dex4': { itens: { ...item('Pastel de nata', 2), ...item('Café', 2) }, criadoEm: ha(14), visto: true } }, chamada: { tipo: 'conta', em: ha(2) } };
    return t;
  }
  function cardapioDeConfig() {
    const categorias = {}, pratos = {};
    (R.cardapioInicial || []).forEach((c, ci) => {
      const cid = 'c' + String(ci + 1).padStart(2, '0'); categorias[cid] = { nome: c.cat, ordem: ci };
      c.pratos.forEach((p, pi) => { pratos[cid + 'p' + String(pi + 1).padStart(2, '0')] = { cat: cid, ordem: pi, nome: p.nome, desc: p.desc || '', preco: p.preco, alerg: p.alerg || [], veg: !!p.veg, destaque: !!p.destaque, esgotado: false }; });
    });
    return { categorias, pratos, pratoDia: R.pratoDiaInicial || { ativo: false }, aviso: R.avisoInicial || '', aspeto: R.capa };
  }

  // Total de um pedido, sempre com os preços do cardápio (o cliente não consegue mudar preços)
  function totalPedido(p, cd) {
    return Object.entries((p && p.itens) || {}).reduce((s, [id, it]) => s + (Number(it.q) || 0) * precoDe(id, cd), 0);
  }
  function precoDe(id, cd) { cd = cd || {}; if (id === 'pratoDia') return Number((cd.pratoDia || {}).preco) || 0; const p = (cd.pratos || {})[id]; return p ? Number(p.preco) || 0 : 0; }

  window.APP = { R, DEMO, ALERGENIOS, esc, eur, telInt, telFmt, aplicarTema, organizar, iniciar, cardapioDeConfig, agora, gerarCodigo, totalPedido, precoDe, get db() { return _db; }, get auth() { return _auth; } };
})();
