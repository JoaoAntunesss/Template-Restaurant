/* =====================================================================
   restaurante.js — a ÚNICA coisa que muda de restaurante para restaurante.
   (Os pratos e os preços mudam-se depois no painel; aqui fica só o arranque.)
   Demonstração: "Brasa & Alecrim" é um restaurante fictício.
   ===================================================================== */
window.REST = {
  id: "brasa-alecrim",                 // identificador curto (sem espaços)
  nome: "Brasa & Alecrim",
  tipo: "Cozinha portuguesa · Grelhados",
  slogan: "Cozinha portuguesa feita sem pressa",
  descricao: "Peixe e carne na brasa, petiscos para partilhar e sobremesas da avó. Ingredientes da época, servidos à mesa como em casa.",

  logo: "img/logo.svg",                // logótipo (SVG ou PNG com fundo transparente fica melhor na capa)
  morada: ["Rua das Oliveiras, 12", "4500-000 Localidade Exemplo"],
  mapa: "https://maps.google.com/?q=Rua+das+Oliveiras+12",
  telefone: "910000000",
  indicativo: "351",
  email: "",
  redes: [{ nome: "Instagram", url: "https://www.instagram.com/" }, { nome: "Facebook", url: "https://www.facebook.com/" }],
  wifi: { rede: "BrasaAlecrim-Clientes", senha: "bemvindo2026" },   // aparece na contracapa do cardápio (deixe "" para esconder)
  horario: [["Segunda", "Fechado"], ["Terça a Sexta", "12:00–15:00 · 19:00–22:30"], ["Sábado", "12:00–15:30 · 19:00–23:00"], ["Domingo", "12:00–16:00"]],

  // Cores do site e do painel
  cores: { fundo: "#f6f0e6", texto: "#2b1d14", destaque: "#b5562b", destaqueEscuro: "#8c3f1d" },

  // Capa do cardápio (pode ser mudada no painel): "couro", "madeira", "ardosia" ou "linho"
  capa: { estilo: "couro", cor: "#5b3a24", gravacao: "dourado" },   // gravacao: "dourado", "prata" ou "relevo"

  // Botão "Pedir suporte" no painel. Ao entregar: "https://joaoantunesss.github.io/aw/#suporte?site=NOME-DO-SITE"
  suporteUrl: "https://joaoantunesss.github.io/aw/#suporte",

  creditos: { texto: "Site por João Antunes", email: "j.p.r.n.antunes@gmail.com" },

  // Firebase: deixe apiKey vazio para o MODO DEMONSTRAÇÃO (tudo fica só no navegador)
  firebase: { apiKey: "", authDomain: "", databaseURL: "", projectId: "", appId: "" },

  // Cardápio inicial (só é usado para preencher a base de dados da primeira vez / na demonstração)
  // alergenios: números da lista oficial da UE (ver ALERGENIOS em core.js)
  cardapioInicial: [
    { cat: "Entradas", pratos: [
      { nome: "Pão, azeitonas e manteiga de ervas", preco: 2.5, alerg: [1, 7] },
      { nome: "Queijo de Azeitão", desc: "Amanteigado, com tostas e doce de abóbora", preco: 8.5, alerg: [1, 7] },
      { nome: "Chouriço assado", desc: "Flamejado à mesa", preco: 6.5 },
      { nome: "Pataniscas de bacalhau", desc: "Com arroz de feijão", preco: 7.5, alerg: [1, 3, 4] },
      { nome: "Polvo à galega", desc: "Batata, colorau e azeite novo", preco: 11.5, alerg: [14], destaque: true }
    ]},
    { cat: "Sopas", pratos: [
      { nome: "Caldo verde", desc: "Com rodela de chouriço", preco: 3 },
      { nome: "Sopa da pedra", preco: 4.5, alerg: [9] }
    ]},
    { cat: "Peixe", pratos: [
      { nome: "Bacalhau à lagareiro", desc: "Batata a murro, grelos e muito alho", preco: 18.5, alerg: [4], destaque: true },
      { nome: "Polvo à lagareiro", desc: "Batata a murro e azeite de alho", preco: 19.5, alerg: [14] },
      { nome: "Dourada grelhada", desc: "Legumes salteados e batata cozida", preco: 15, alerg: [4] },
      { nome: "Arroz de marisco (2 pessoas)", desc: "Malandrinho, com coentros", preco: 34, alerg: [2, 4, 14] }
    ]},
    { cat: "Carne", pratos: [
      { nome: "Posta mirandesa", desc: "Na brasa, com batata frita caseira", preco: 17.5 },
      { nome: "Secretos de porco preto", desc: "Migas de espargos", preco: 15.5, alerg: [1] },
      { nome: "Cabrito assado no forno", desc: "Só ao domingo", preco: 19 },
      { nome: "Francesinha da casa", desc: "Molho de cerveja, ovo e batata frita", preco: 11.5, alerg: [1, 3, 7, 12] },
      { nome: "Bitoque", desc: "Bife da vazia, ovo, arroz e batata", preco: 11, alerg: [3] }
    ]},
    { cat: "Vegetariano", pratos: [
      { nome: "Risotto de cogumelos", desc: "Parmesão e salsa", preco: 13.5, alerg: [7, 9], veg: true },
      { nome: "Legumes na brasa", desc: "Com queijo de cabra e mel", preco: 12, alerg: [7], veg: true }
    ]},
    { cat: "Sobremesas", pratos: [
      { nome: "Pastel de nata", preco: 2, alerg: [1, 3, 7] },
      { nome: "Arroz doce da avó", preco: 4, alerg: [3, 7] },
      { nome: "Mousse de chocolate", preco: 4.5, alerg: [3, 7] },
      { nome: "Leite-creme queimado", preco: 4.5, alerg: [3, 7], destaque: true },
      { nome: "Salame de chocolate", preco: 4, alerg: [1, 3, 7] }
    ]},
    { cat: "Bebidas", pratos: [
      { nome: "Água 0,5 L", preco: 1.5 },
      { nome: "Refrigerantes", preco: 2.2 },
      { nome: "Imperial", preco: 2, alerg: [1] },
      { nome: "Vinho da casa (jarro 0,5 L)", desc: "Tinto ou branco", preco: 6.5, alerg: [12] },
      { nome: "Alvarinho (garrafa)", preco: 18, alerg: [12] },
      { nome: "Café", preco: 1 }
    ]}
  ],
  pratoDiaInicial: { ativo: true, nome: "Arroz de pato à moda antiga", desc: "Com chouriço e laranja", preco: 12.5 },
  avisoInicial: ""
};
