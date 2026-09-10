# Éluxo Modas — Frontend

Frontend da loja virtual Éluxo Modas, consumindo a API Django Ninja do
projeto `luxury_fashion`. React + TypeScript + Vite + Tailwind CSS.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (paleta cream/gold/ink + Playfair Display/Montserrat)
- React Router 6
- TanStack Query (cache, paginação, estados de loading/erro)
- Axios (client HTTP com refresh automático de token)

## Instalação

```bash
npm install
cp .env.example .env
# edite .env com a URL real da API
npm run dev
```

Acesse `http://localhost:5173`.

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API Django Ninja, sem barra final (ex.: `http://localhost:8000/api`) |
| `VITE_GOOGLE_CLIENT_ID` | Client ID do Google Identity Services, só necessário se for implementar o botão "Entrar com Google" na tela de login (o endpoint `/auth/google` já está integrado em `api/auth.ts`, falta só o widget do Google no front) |

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — type-check (`tsc -b`) + build de produção em `dist/`
- `npm run preview` — serve o build de produção localmente
- `npm run lint` — ESLint

## Estrutura

```
src/
├── api/          # 1 arquivo por domínio (auth, products, cart, orders...),
│                 # sempre espelhando os endpoints reais do Django Ninja
├── components/   # ui/ (genéricos), product/, category/, cart/, account/, layout/
├── contexts/     # AuthContext, CartContext (React Query), ToastContext
├── hooks/        # useAuth, useCart, useToast, useDebounce
├── layouts/      # MainLayout, AuthLayout, AccountLayout
├── lib/          # errors.ts, formatters.ts, productCache.ts, queryClient.ts
├── pages/        # 1 componente por rota
├── routes/       # AppRouter, ProtectedRoute
└── types/        # espelham 1:1 os schemas Pydantic/Ninja do backend
```

## Autenticação

Segue exatamente o mecanismo do backend:

- **Access token**: devolvido no corpo da resposta (`{"access": "..."}`),
  guardado só em memória (`api/tokenStore.ts`) — nunca em localStorage.
- **Refresh token**: cookie `httpOnly` (`eluxo_refresh_token`), enviado
  automaticamente pelo navegador via `withCredentials: true`. O
  interceptor do Axios (`api/client.ts`) tenta `POST /auth/refresh`
  automaticamente ao tomar 401, com fila para não disparar refresh em
  paralelo em várias requisições simultâneas.
- No load inicial da SPA (refresh de página), como o access token em
  memória se perde, o `AuthContext` chama `/auth/refresh` proativamente
  para restaurar a sessão a partir do cookie.

## Limitações reais da API (não são bugs do frontend)

Identificadas na análise do backend — documentadas também nos comentários
do código correspondente:

1. **Sem endpoint de avaliações/reviews.** O app `reviews` do backend
   existe mas não tem router registrado em `config/api.py`. As
   referências visuais mostram estrelas de avaliação, mas isso não é
   implementável sem inventar dados — por isso não aparece na UI.

2. **Carrinho e pedidos não trazem nome/imagem do produto.**
   `CartItemOut` e `OrderItemOut` só retornam a `variant` (tamanho, cor,
   gênero, preço, estoque) — sem `product_id`, nome ou imagem. Contornado
   com um cache local (`lib/productCache.ts`) alimentado quando o usuário
   navega pela vitrine/detalhe do produto, indexado por `variant_id`. Se
   o carrinho for aberto num dispositivo/navegador que nunca visitou a
   vitrine, o item aparece com um rótulo genérico "Produto" em vez de um
   nome inventado.

3. **Sem endpoint de contato.** Não existe router de "fale conosco" no
   backend. A página `/contato` monta um link `mailto:` com os dados
   preenchidos em vez de simular uma chamada de API inexistente.

4. **Checkout exige perfil completo.** `POST /orders` usa
   `ClientCompleteProfileAuth`: exige nome, sobrenome, CPF e ao menos um
   endereço cadastrados. Se faltar algo, a API responde 403 com a lista
   de campos pendentes — o checkout exibe essa mensagem via toast.

5. **Sem painel administrativo.** As referências visuais fornecidas
   mostram só a loja (storefront). CRUD de produtos/categorias/pedidos
   pelo admin não foi implementado — é um escopo à parte, não coberto
   pelos mockups.

## Qualidade

Validado antes da entrega:

```bash
npx tsc -b        # 0 erros
npx vite build    # build de produção ok
npx eslint .       # 0 erros (3 avisos esperados de fast-refresh em contexts)
```
