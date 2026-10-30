# Template — Site + cardápio digital em livro para restaurantes

Três páginas num só projeto Firebase por restaurante:

| Página | Para quem | O que faz |
|---|---|---|
| `index.html` | clientes | Site do restaurante: prato do dia, sugestões do chef, cardápio, horário, morada e reservas por telefone/WhatsApp |
| `menu.html` (ou `/menu`) | clientes, pelo QR da mesa | Cardápio em forma de livro: capa de couro, madeira, ardósia ou linho com o nome e o logótipo gravados; as páginas viram seguindo o dedo; abre em ecrã inteiro no telemóvel |
| `admin.html` (ou `/admin`) | dono | Pratos, preços, fotos, alergénios, esgotados, prato do dia, aviso, aspeto da capa e cartões QR para imprimir |

Não liga a nenhum sistema da cozinha nem de faturação: é só o cardápio e o site.

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
8. Painel → **Códigos QR**: gere os cartões das mesas e imprima. O endereço é `https://<domínio>/menu`, por isso **os QR nunca precisam de ser reimpressos** quando o cardápio muda.

## Notas
- **Ecrã inteiro:** os navegadores só deixam entrar em ecrã inteiro depois de um toque. O cardápio pede-o no primeiro toque (ao abrir a capa) e tem um botão para isso. No iPhone o Safari não permite ecrã inteiro numa página; o cardápio já ocupa o ecrã todo e, se o cliente o adicionar ao ecrã principal, abre sem barras.
- **Fotos dos pratos:** são reduzidas no próprio telemóvel do dono (até 480 px) antes de gravar, para o cardápio abrir depressa. São opcionais: um cardápio clássico fica bonito só com texto.
- **Alergénios:** os 14 da lista oficial da UE, numerados. A legenda vai numa página no fim do cardápio.
- **Segurança:** o cardápio é público para leitura; só as contas em `admins` podem alterar (ver `database.rules.json`).
- **Bibliotecas incluídas em `public/vendor/`:** StPageFlip 2.0.7 (efeito de virar a página, MIT) e qrcode-generator 1.4.4 (códigos QR, MIT).

## Extras que se podem vender à parte
- Cardápio em inglês (e outras línguas), com botão para mudar.
- Reservas online com escolha de dia e hora (o sistema de marcações do template dos salões serve de base).
- Estatísticas: quantas vezes o cardápio foi aberto, por mesa e por hora.
