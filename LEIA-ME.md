# Template — Site + cardápio digital em livro para restaurantes

Três páginas num só projeto Firebase por restaurante:

| Página | Para quem | O que faz |
|---|---|---|
| `index.html` | clientes | Site do restaurante: prato do dia, sugestões do chef, cardápio, horário, morada e reservas por telefone/WhatsApp |
| `menu.html` (ou `/menu`) | clientes, pelo QR da mesa | Cardápio em forma de livro: capa de couro, madeira, ardósia ou linho com o nome e o logótipo gravados; as páginas viram seguindo o dedo; abre em ecrã inteiro no telemóvel. Pelo QR da mesa, o cliente faz o pedido, vê o que a mesa já pediu e pode chamar o empregado ou pedir a conta |
| `admin.html` (ou `/admin`) | dono e equipa | Pedidos de cada mesa em tempo real (com aviso sonoro), pratos, preços, fotos, alergénios, esgotados, prato do dia, aviso, aspeto da capa, mesas e cartões QR para imprimir |

Não liga ao programa de faturação: a conta e a fatura continuam a ser feitas no sistema certificado do restaurante, como sempre.

## Ver a demonstração (sem Firebase)
Com `firebase.apiKey` vazio em `restaurante.js`, tudo corre em **modo demonstração** (restaurante fictício "Brasa & Alecrim", dados só no navegador):
```
cd public && python3 -m http.server 8000
```
- http://localhost:8000 → site
- http://localhost:8000/menu.html → cardápio (no computador abre em livro de duas páginas; no telemóvel uma página de cada vez)
- http://localhost:8000/admin.html → painel (carregue em "Entrar")

Com o painel e o cardápio abertos em dois separadores, o que muda no painel aparece logo no cardápio.

## Novo restaurante, passo a passo
1. Copie esta pasta com o nome do restaurante.
2. Edite `public/restaurante.js`: nome, tipo de cozinha, descrição, morada, telefone, redes, Wi-Fi, horário, cores, capa e o cardápio inicial (categorias e pratos).
3. Ponha o logótipo em `public/img/` e acerte `logo`.
   - **Melhor:** SVG ou PNG com fundo transparente. Assim o logótipo fica "gravado" a dourado, prata ou em relevo na capa.
   - Se o logótipo for uma foto (JPG) ou tiver fundo, ponha `logoNaCapa: "imagem"` para aparecer tal como é.
4. Na [Consola Firebase](https://console.firebase.google.com): crie um projeto → **Realtime Database** (europe-west1) → **Authentication** (Email/Password e/ou Google) → **App Web**, e copie a configuração para `restaurante.js > firebase`.
5. Em Authentication crie a conta do dono. Copie o **UID** e, na Realtime Database, crie `admins / <UID> = true` (o próprio painel mostra o UID se a conta ainda não tiver acesso).
6. `firebase deploy --only hosting,database`
7. Na primeira entrada no painel, o cardápio de `restaurante.js` é copiado para a base de dados. A partir daí muda-se tudo no painel.
8. Painel → **Mesas e QR**: escolha quantas mesas quer, carregue em **Adicionar mesas** e imprima os cartões. Os QR **nunca precisam de ser reimpressos** quando o cardápio muda.

## Pedidos pela mesa (QR por mesa)
**Como explicar ao cliente:** cada mesa tem um QR com o seu número. O cliente aponta a câmara, vê o cardápio e faz o pedido ali mesmo; o pedido aparece logo no painel, na mesa certa, com um aviso sonoro. No fim, quando a conta é paga, carrega-se em **Conta paga · limpar mesa** e a mesa fica livre para os clientes seguintes.

- **Mesas:** em *Mesas e QR* criam-se quantas forem precisas (a numeração continua sozinha), muda-se o nome ("Esplanada 3") e imprimem-se os cartões. **Testar** abre o cardápio dessa mesa.
- **Painel → Pedidos:** cada mesa mostra se está livre, quantos pedidos tem, o total e se há pedidos por ver. Ao abrir a mesa vê-se cada pedido com a hora, as quantidades, as notas ("sem cebola") e o total. Há **Marcar como visto**, **Atendido** (quando chamam o empregado ou pedem a conta) e **Conta paga · limpar mesa** (pede confirmação).
- **No telemóvel do cliente:** o **+** junto a cada prato junta-o ao pedido; o botão da mesa (canto de cima) mostra o pedido, permite mudar quantidades, escrever uma nota e enviar. Em *Pedidos da mesa* vê o que já foi pedido e o total, e pode **Chamar o empregado** ou **Pedir a conta**.
- **Ligar/desligar:** *Aceitar pedidos pelo QR da mesa* no separador Pedidos. Desligado, o QR mostra só o cardápio.
- **Segurança:** cada mesa tem um código secreto no QR. Sem ele não se consegue pedir para essa mesa nem ver os pedidos dela. Os clientes só conseguem **criar** pedidos (não alteram nem apagam), só com pratos que existem no cardápio, e o total é sempre calculado com os preços do cardápio. Se alguém andar a fazer pedidos de fora (por exemplo com uma foto do QR), **Novo código** troca o código dessa mesa; o cartão antigo deixa de funcionar e imprime-se um novo.
- **Dados pessoais:** os pedidos não levam nome, telefone nem email do cliente, só os pratos e a nota. Ao limpar a mesa os pedidos são apagados.
- **Regras:** `database.rules.json` (publicar com `firebase deploy --only database`).

## Notas
- **Privacidade (RGPD):** `public/privacidade.html` é gerada a partir de `restaurante.js > rgpd` (responsável, NIF, email, morada). Preencha ao entregar. Como o site não recolhe dados pessoais dos visitantes (as reservas são por telefone/WhatsApp e os pedidos pela mesa só levam os pratos e a nota), não precisa de caixa de consentimento. Tem um aviso de cookies informativo (`public/aviso.js`, no site e no cardápio) que aparece uma vez e lembra a escolha. Se um dia juntar estatísticas ou outro serviço que use cookies, o aviso passa a ter de pedir consentimento a sério.
- **Letras no próprio site:** `public/fonts/` tem as fontes (Cormorant Garamond e Lato). Não há pedidos ao Google Fonts, por isso o endereço IP dos visitantes não é enviado a esse serviço. Se mudar de letra, ponha os ficheiros `.woff2` nessa pasta e acerte `fonts/fonts.css`.
- **Ecrã inteiro:** os navegadores só deixam entrar em ecrã inteiro depois de um toque. O cardápio pede-o no primeiro toque (ao abrir a capa) e tem um botão para isso. No iPhone o Safari não permite ecrã inteiro numa página; o cardápio já ocupa o ecrã todo e, se o cliente o adicionar ao ecrã principal, abre sem barras.
- **Fotos dos pratos:** são reduzidas no próprio telemóvel do dono (até 480 px) antes de gravar, para o cardápio abrir depressa. São opcionais: um cardápio clássico fica bonito só com texto.
- **Alergénios:** os 14 da lista oficial da UE, numerados. A legenda vai numa página no fim do cardápio.
- **Segurança:** o cardápio é público para leitura; só as contas em `admins` podem alterar (ver `database.rules.json`).
- **Bibliotecas incluídas em `public/vendor/`:** StPageFlip 2.0.7 (efeito de virar a página, MIT) e qrcode-generator 1.4.4 (códigos QR, MIT).

## Extras que se podem vender à parte
- Cardápio em inglês (e outras línguas), com botão para mudar.
- Reservas online com escolha de dia e hora (o sistema de marcações do template dos salões serve de base).
- Estatísticas: quantas vezes o cardápio foi aberto, por mesa e por hora.

## Suporte do cliente
Ao entregar, preenche `suporteUrl` em `public/restaurante.js` com `https://joaoantunesss.github.io/aw/#suporte?site=NOME-DO-SITE`. O painel passa a ter o botão "Pedir suporte" e o pedido chega ao teu painel de Gestão.
