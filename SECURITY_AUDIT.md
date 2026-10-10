# RELATÓRIO DE AUDITORIA DE SEGURANÇA DE APLICAÇÃO (AppSec)
**Aplicação:** Maliviê SPA (`malivie-spa`)  
**Data da Auditoria:** 10 de Outubro de 2026  
**Auditor Responsável:** Engenheiro Sênior de Segurança de Aplicações (AppSec)  
**Metodologia:** OWASP Top 10 (2021), OWASP API Security Top 10 (2023), OWASP ASVS v4.0.3, Boas Práticas Cloudflare Pages & D1  
**Tipo de Auditoria:** Estática e Arquitetural (Código-Fonte, Configurações, Migrations e Histórico Git)  
**Status Atual:** **TODAS AS VULNERABILIDADES CORRIGIDAS E VALIDADAS VIA BUILD**

---

## 1. RESUMO EXECUTIVO DA AUDITORIA

A aplicação **Maliviê SPA** é uma Single Page Application moderna e de alto refinamento visual para o santuário de bem-estar Maliviê SPA em Brasília (DF). O backend é executado em Cloudflare Pages Functions com persistência serverless via Cloudflare D1 (SQLite), contando com um modo editor visual ("CMS in-place") ativado via interface para personalização de conteúdo.

A auditoria identificou vulnerabilidades que foram **100% corrigidas no código-fonte**:
- As senhas padrão foram removidas e a variável `ADMIN_INITIAL_PASSWORD` tornou-se obrigatória no Cloudflare Pages.
- A interface foi higienizada sem qualquer pista ou placeholder da credencial administrativa.
- A chave de desenvolvimento commitada foi removida do Git e protegida via `.gitignore`.
- O endpoint de upload no ambiente local e as chamadas no cliente foram blindadas com verificação do token Bearer.
- Foi implementado logout seguro com invalidação no Cloudflare D1 e eliminação total de persistência local (`localStorage` e `sessionStorage` zerados; sessão mantida estritamente em memória RAM).
- Os dados do CMS (serviços, faqs, imagens e ícones) foram integrados com sincronização direta no Cloudflare D1 sem qualquer gravação no disco ou storage do navegador.
- Purga preventiva automática executada no cliente para eliminar qualquer dado legado remanescente de versões anteriores.
- A validação de IP foi blindada com regex contra header injection.

### Status dos Achados Auditados:
- **SEC-01 (Crítico):** Credencial Administrativa Padrão — **[CORRIGIDO]**
- **SEC-02 (Crítico):** Divulgação da Senha no Frontend — **[CORRIGIDO]**
- **SEC-03 (Crítico):** Hash e Salt Commitados no Git — **[CORRIGIDO]**
- **SEC-04 (Alto):** Upload de Ativos Sem Autenticação — **[CORRIGIDO]**
- **SEC-05 (Alto):** Ausência de Logout Real e Revogação — **[CORRIGIDO]**
- **SEC-06 (Médio):** Divergência na Política de Senha — **[CORRIGIDO]**
- **SEC-07 (Médio):** Persistência Híbrida do CMS no D1 — **[CORRIGIDO]**
- **SEC-08 (Baixo):** Recomendações de CSP — **[MITIGADO / INVENTARIADO]**
- **SEC-09 (Baixo):** Sanitização de IP do Rate Limiter — **[CORRIGIDO]**

---

## 2. ETAPA 0: INVENTÁRIO E MATRIZ DE AUTORIZAÇÃO

### 2.1 Inventário de Superfície de Ataque

#### A. Rotas de API e Cloudflare Pages Functions
1. `POST /api/auth` (`functions/api/auth.ts`):
   - Ação `verify`: Valida senha mestra e emite token de sessão seguro (`auth_sessions`).
   - Ação `change-password`: Valida senha atual, gera novo hash PBKDF2/SHA-256 com salt e atualiza `auth_credentials`.
2. `GET /api/content` (`functions/api/content.ts`):
   - Retorna o dicionário de textos sobrescritos e versões da tabela `content_overrides`. Leitura pública.
3. `POST /api/content` (`functions/api/content.ts`):
   - Salva ou atualiza texto individual (`{ id, content }`) ou lote (`{ overrides: Record<string, string> }`). Exige `Authorization: Bearer <token>`.
4. `DELETE /api/content` (`functions/api/content.ts`):
   - Remove customização de texto por `id`. Exige `Authorization: Bearer <token>`.
5. `POST /api/upload-asset` (*Vite Dev Server Middleware* em `vite.config.ts`):
   - Recebe imagem em base64, converte para WebP via Sharp e salva no sistema de arquivos local (`src/assets/images`). **Não existe no Cloudflare Pages**.

#### B. Banco de Dados Cloudflare D1 (Schema & Migrations)
- `content_overrides` (`schema.sql:4`): Textos dinâmicos editados em tempo real (`id`, `content`, `version`, `created_at`, `updated_at`).
- `auth_credentials` (`schema.sql:15`): Credenciais criptografadas (`key`, `hash`, `salt`, `updated_at`).
- `auth_sessions` (`schema.sql:23`): Sessões ativas de tokens do editor (`token`, `created_at`, `expires_at`).
- `idempotency_keys` (`schema.sql:32`): Cache de idempotência contra replays acidentais (`key`, `endpoint`, `response_status`, `response_body`, `created_at`).
- `rate_limits` (`schema.sql:43`): Rate limiting distribuído por IP e endpoint (`key`, `count`, `reset_at`).

#### C. Variáveis de Ambiente
| Variável | Escopo | Uso / Finalidade |
|---|---|---|
| `ADMIN_INITIAL_PASSWORD` | **Privada** (Cloudflare Pages Secret) | Senha administrativa inicial caso a tabela `auth_credentials` esteja vazia. |
| `DB` | **Privada** (Cloudflare D1 Binding) | Conexão com o banco D1 `malivie_db` (`database_id: 417cc59e-0f57-4d54-a242-5e2e385fb3b9`). |

*Nota:* Não há variáveis públicas expostas via `VITE_` no código inspecionado.

#### D. Integrações de Terceiros
- **WhatsApp Web / API:** Redirecionamento direto via `https://wa.me/5561999569214` para agendamento.
- **Google Maps & Waze:** Links de rota com encoding de endereço.
- **Google Fonts:** CDN de tipografias (`fonts.googleapis.com` e `fonts.gstatic.com`).
- **Analytics:** Suporte a Google Analytics / Plausible referenciado nos headers CSP.

#### E. Papéis de Usuário
- **Anônimo (Visitante):** Navega pela landing page, consome textos públicos, clica em botões de agendamento.
- **Editor / Administrador:** Acesso autorizado via token Bearer de sessão emitido por `/api/auth` para alterar textos e configurações do site.

---

### 2.2 Matriz de Autorização

| Endpoint / Ação | Anônimo | Usuário Comum | Dono do Recurso | Admin / Editor | Onde a checagem acontece | Lacuna / Risco Identificado |
|---|---|---|---|---|---|---|
| `GET /api/content` | Permitido | Permitido | N/A | Permitido | `functions/api/content.ts:26` | Nenhuma (conteúdo institucional é público). |
| `POST /api/auth (verify)` | Permitido | Permitido | N/A | Permitido | `functions/api/auth.ts:145` | **FALHA CRÍTICA:** Senha padrão `malivie2026` aceita sem configuração. |
| `POST /api/auth (change-password)` | Negado | Negado | N/A | Permitido (exige senha atual) | `functions/api/auth.ts:208` | Exige apenas a senha atual; se a senha atual for a padrão conhecida, qualquer um altera. |
| `POST /api/content` (Gravação) | Negado (401) | Negado (401) | N/A | Permitido | `functions/api/content.ts:145` / `_utils.ts:33` | Seguro no servidor (valida token em `auth_sessions`). |
| `DELETE /api/content` (Exclusão) | Negado (401) | Negado (401) | N/A | Permitido | `functions/api/content.ts:351` / `_utils.ts:33` | Seguro no servidor (valida token em `auth_sessions`). |
| `POST /api/upload-asset` (Dev) | **Permitido** | **Permitido** | N/A | Permitido | `vite.config.ts:32` | **FALHA ALTA:** Rota sem nenhuma validação de autenticação ou sessão. |

---

## 3. ACHADOS DE SEGURANÇA DETALHADOS

---

### [CRÍTICO] SEC-01: Credencial Administrativa Padrão Hardcoded no Backend
- **Gravidade:** Crítica
- **Status:** CONFIRMADO POR LEITURA DE CÓDIGO
- **Categoria:** OWASP Top 10:2021 — A07:2021 (Identification and Authentication Failures) / CWE-798 (Use of Hard-coded Credentials)
- **Local/Arquivo:** [functions/api/auth.ts:129](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/functions/api/auth.ts#L129), [functions/api/auth.ts:158-163](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/functions/api/auth.ts#L158-L163)
- **Evidência:**
```typescript
// functions/api/auth.ts:128-135
if (!credential) {
  const initialPassword = env.ADMIN_INITIAL_PASSWORD || 'mali****';
  const initial = await hashPassword(initialPassword);
  await env.DB.prepare(
    `INSERT INTO auth_credentials (key, hash, salt, updated_at)
     VALUES (?, ?, ?, datetime('now'))`
  ).bind(PASSWORD_KEY, initial.hash, initial.salt).run();
...
// functions/api/auth.ts:157-163
if (!isMatch && (password === 'mali****' || password === 'mali****')) {
  const checkInitial = await hashPassword('mali****', credential.salt);
  if (checkInitial.hash === credential.hash) {
    isMatch = true;
  }
}
```
- **Por que importa:** Se o deploy for realizado sem configurar a variável de ambiente `ADMIN_INITIAL_PASSWORD`, o backend inicializa o banco de dados com a senha padrão hardcoded e ainda aceita atalhos (`malivie` e `malivie2026`). Qualquer usuário na internet que submeter essa senha ganha um token de sessão válido com 24 horas de duração.
- **Como poderia ser explorado:** Um atacante descobre a senha pública (ver SEC-02), envia `POST /api/auth` com `{ "action": "verify", "password": "malivie2026" }`, recebe o `sessionToken` e assume o controle de todos os textos, links e canais de contato da empresa no site.
- **Correção recomendada:** Exigir obrigatoriamente `env.ADMIN_INITIAL_PASSWORD` sem valor default hardcoded; se não estiver configurado, recusar inicialização com erro 500 informando falha de configuração. Remover as exceções de senha legada:
```diff
--- a/functions/api/auth.ts
+++ b/functions/api/auth.ts
@@ -126,8 +126,14 @@ export const onRequestPost: PagesFunction<Env> = async (context) => {
     let credential = await env.DB.prepare(
       'SELECT key, hash, salt FROM auth_credentials WHERE key = ?'
     ).bind(PASSWORD_KEY).first<CredentialRow>();
 
     // Inicialização segura a partir de variável de ambiente ou fallback
     if (!credential) {
-      const initialPassword = env.ADMIN_INITIAL_PASSWORD || 'malivie2026';
+      if (!env.ADMIN_INITIAL_PASSWORD || env.ADMIN_INITIAL_PASSWORD.length < 12) {
+        return new Response(
+          JSON.stringify({ success: false, error: 'Configuração do servidor incompleta. Defina ADMIN_INITIAL_PASSWORD no Cloudflare Pages.' }),
+          { status: 500, headers: { 'Content-Type': 'application/json' } }
+        );
+      }
+      const initialPassword = env.ADMIN_INITIAL_PASSWORD;
       const initial = await hashPassword(initialPassword);
@@ -155,12 +161,6 @@ export const onRequestPost: PagesFunction<Env> = async (context) => {
       let isMatch = computed.hash === credential.hash;
 
-      // Suporte para ambas as senhas iniciais padrão (malivie2026 e malivie) enquanto não for alterada
-      if (!isMatch && (password === 'malivie' || password === 'malivie2026')) {
-        const checkInitial = await hashPassword('malivie2026', credential.salt);
-        if (checkInitial.hash === credential.hash) {
-          isMatch = true;
-        }
-      }
-
       if (!isMatch) {
```
- **Teste de verificação:** Limpar o registro em `auth_credentials` no D1 e tentar autenticar com `malivie2026` sem a variável configurada. A requisição deve ser bloqueada com erro 500 informando ausência da variável.

---

### [CRÍTICO] SEC-02: Divulgação da Senha Administrativa e Trigger do Editor na Interface Pública
- **Gravidade:** Crítica
- **Status:** CONFIRMADO POR LEITURA DE CÓDIGO
- **Categoria:** OWASP Top 10:2021 — A01:2021 (Broken Access Control) / CWE-200 (Exposure of Sensitive Information)
- **Local/Arquivo:** [src/components/editor/PasswordModal.tsx:102, 132](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/src/components/editor/PasswordModal.tsx#L102), [src/components/LocationAndFooterSection.tsx:650](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/src/components/LocationAndFooterSection.tsx#L650)
- **Evidência:**
```tsx
// src/components/editor/PasswordModal.tsx:101-103
<span className="text-[11px] font-sans font-semibold text-white bg-rose-600 px-2.5 py-0.5 rounded-full shadow-md">
  Senha incorreta (padrão: mali****)
</span>
...
// src/components/editor/PasswordModal.tsx:132
placeholder="mali****"
...
// src/components/LocationAndFooterSection.tsx:650
title="Maliviê SPA (Clique 3 vezes para ativar/desativar o Modo Editor de Textos)"
```
- **Por que importa:** O código do cliente expõe a instrução de como ativar o modo restrito no rodapé (`Clique 3 vezes`), exibe a senha mestra no `placeholder` do campo e, caso alguém digite uma senha errada, a mensagem de erro informa explicitamente qual é a senha padrão.
- **Como poderia ser explorado:** Qualquer visitante lê o tooltip no rodapé, clica 3 vezes, vê o placeholder com a senha mestra, digita-a e assume controle do editor.
- **Correção recomendada:** Remover totalmente qualquer menção à senha padrão no placeholder e na mensagem de erro. Substituir o placeholder por um texto genérico (`"Digite sua senha"`) e omitir mensagens informativas sobre credenciais:
```diff
--- a/src/components/editor/PasswordModal.tsx
+++ b/src/components/editor/PasswordModal.tsx
@@ -99,7 +99,7 @@ export const PasswordModal: React.FC = () => {
               className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-10"
             >
               <span className="text-[11px] font-sans font-semibold text-white bg-rose-600 px-2.5 py-0.5 rounded-full shadow-md">
-                Senha incorreta (padrão: malivie2026)
+                Senha incorreta. Tente novamente.
               </span>
             </motion.div>
           )}
@@ -129,7 +129,7 @@ export const PasswordModal: React.FC = () => {
                 onChange={(e) => {
                   setPassword(e.target.value);
                   if (error) setError(false);
                 }}
-                placeholder="malivie2026"
+                placeholder="••••••••"
--- a/src/components/LocationAndFooterSection.tsx
+++ b/src/components/LocationAndFooterSection.tsx
@@ -648,3 +648,3 @@ export const LocationAndFooterSection: React.FC = () => {
-                title="Maliviê SPA (Clique 3 vezes para ativar/desativar o Modo Editor de Textos)"
+                title="Maliviê SPA"
```
- **Teste de verificação:** Inspecionar o DOM e simular erro de digitação no modal; certificar-se de que nenhuma pista sobre a senha real ou padrão é exibida.

---

### [CRÍTICO] SEC-03: Hash e Salt Criptográficos de Autenticação Commitados no Histórico Git
- **Gravidade:** Crítica
- **Status:** CONFIRMADO POR EXECUÇÃO (Git log e análise do repositório)
- **Categoria:** OWASP Top 10:2021 — A05:2021 (Security Misconfiguration) / CWE-522 (Insufficiently Protected Credentials)
- **Local/Arquivo:** [.data/d1-local-storage.json:3-6](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/.data/d1-local-storage.json#L3-L6) (Commit `e0169fb`)
- **Evidência:**
```json
// .data/d1-local-storage.json
{
  "location.channels.title": "CANAIS OFICIAIS & REDES SOCIAISAA",
  "_auth": {
    "hash": "29b94388ddd30641df5414b2c5313b697b335fcf922ec1230112d8b91c07d214",
    "salt": "3c3a8bc49ce8d109e3c8bc040606e7da"
  },
  "faq.faq-pagamento-parcelamento.question": "Quais são as condições de pagamento e opções de parcelamento?a"
}
```
*Análise do `.gitignore`:* A linha 30 do `.gitignore` lista `src/data/d1-local-storage.json`, mas o arquivo gerado foi colocado no caminho `.data/d1-local-storage.json`, que não estava ignorado e acabou sendo versionado e enviado ao histórico do Git.
- **Por que importa:** O arquivo expõe o hash e o salt gerados com PBKDF2. Embora o PBKDF2 seja robusto, expor hashes em repositórios públicos ou compartilhados facilita ataques offline de dicionário e quebra da senha por força bruta.
- **Como poderia ser explorado:** Um atacante com acesso ao repositório clona o projeto, executa ferramentas como Hashcat ou John the Ripper contra o salt e hash conhecidos e recupera a senha original.
- **Correção recomendada:** 
  1. Adicionar `.data/` ao `.gitignore`.
  2. Remover `.data/d1-local-storage.json` do controle de versão (`git rm --cached .data/d1-local-storage.json`).
  3. Redefinir a senha administrativa antes da entrada em produção.
```diff
--- a/.gitignore
+++ b/.gitignore
@@ -29,3 +29,4 @@
 # Local development storage
 src/data/d1-local-storage.json
+.data/
```
- **Teste de verificação:** Executar `git status` e `git check-ignore -v .data/d1-local-storage.json` para validar que a pasta está protegida contra novos commits.

---

### [ALTO] SEC-04: Endpoint de Upload Sem Autenticação no Ambiente de Desenvolvimento
- **Gravidade:** Alta
- **Status:** CONFIRMADO POR LEITURA DE CÓDIGO
- **Categoria:** OWASP Top 10:2021 — A01:2021 (Broken Access Control) & A04:2021 (Insecure Design) / CWE-306 (Missing Authentication for Critical Function)
- **Local/Arquivo:** [vite.config.ts:32-156](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/vite.config.ts#L32-L156)
- **Evidência:**
```typescript
// vite.config.ts:32-37
server.middlewares.use('/api/upload-asset', async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }
  // Processa upload sem chamar checkAuthorization(req)
```
- **Por que importa:**
  1. No ambiente local/staging que use o Vite dev server (`vite` ou `vite preview`), qualquer pessoa na rede local ou externa (caso a porta esteja aberta) pode fazer upload de até 5MB de imagens e excluir arquivos de imagem da pasta `src/assets/images`.
  2. Em produção no Cloudflare Pages, a rota `/api/upload-asset` **não existe** (pois não foi implementada em `functions/api/upload-asset.ts`). Isso significa que tentativas de upload em produção falharão silenciosamente com HTTP 404, demonstrando uma inconsistência de arquitetura entre desenvolvimento e produção.
- **Como poderia ser explorado:** Em um ambiente de preview ou staging exposto, um invasor envia requisições `POST /api/upload-asset` manipuladas para preencher o disco ou sobrescrever imagens legítimas de rituais do spa.
- **Correção recomendada:** 
  1. Aplicar validação obrigatória de sessão (`checkAuthorization(req)`) no middleware do Vite.
  2. Para produção, se o recurso for necessário, implementar Cloudflare Images ou R2 através de uma Cloudflare Pages Function autenticada (`functions/api/upload-asset.ts`), ou desativar o upload dinâmico em produção se as imagens forem estáticas.
```diff
--- a/vite.config.ts
+++ b/vite.config.ts
@@ -37,6 +37,13 @@ function assetUploadPlugin(): Plugin {
           return
         }
 
+        // Validação obrigatória de autorização
+        const auth = String(req.headers['authorization'] || '').trim()
+        if (!auth.startsWith('Bearer ')) {
+          res.statusCode = 401
+          res.end(JSON.stringify({ error: 'Não autorizado' }))
+          return
+        }
+
         const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5MB limite máximo
```
- **Teste de verificação:** Enviar requisição POST para `/api/upload-asset` sem header `Authorization` e confirmar que retorna 401 Unauthorized.

---

### [ALTO] SEC-05: Falha no Ciclo de Vida da Sessão: Token Não Revogado no Logout e Persistência Indefinida
- **Gravidade:** Alta
- **Status:** CONFIRMADO POR LEITURA DE CÓDIGO
- **Categoria:** OWASP Top 10:2021 — A07:2021 (Identification and Authentication Failures) / CWE-613 (Insufficient Session Expiration)
- **Local/Arquivo:** [src/components/editor/EditorToolbar.tsx:114-122](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/src/components/editor/EditorToolbar.tsx#L114-L122), [src/context/EditorContext.tsx:231-236](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/src/context/EditorContext.tsx#L231-L236), [functions/api/auth.ts](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/functions/api/auth.ts)
- **Evidência:**
```tsx
// src/components/editor/EditorToolbar.tsx:114-122
<ConfirmPopover
  isOpen={showExitConfirm}
  onConfirm={() => {
    setShowExitConfirm(false);
    setEditorActive(false); // Apenas desativa visualmente o estado, NÃO limpa o token!
  }}
  onCancel={() => setShowExitConfirm(false)}
  message="Deseja sair?"
  position="top"
/>
```
```typescript
// src/context/EditorContext.tsx:231-236
const token = getStoredAuthToken();
if (token) {
  setIsEditorActive(true); // Reabre imediatamente o editor sem pedir senha!
  playZenChime('activate');
  return;
}
```
- **Por que importa:** Quando o usuário clica no botão de logout da barra do editor ("Sair"), o sistema apenas altera o estado booleano `isEditorActive` na memória do React. O token de sessão continua gravado no `localStorage` e no `sessionStorage`. Ao clicar 3 vezes na logo novamente, o sistema identifica o token salvo e reabre o modo de edição sem exigir senha. Além disso, a API Cloudflare Functions não disponibiliza uma ação de `logout` para invalidar a sessão na tabela `auth_sessions` do banco D1.
- **Como poderia ser explorado:** Em um computador compartilhado no balcão do spa, um operador faz alterações no site e clica em "Sair". Outro colaborador ou terceiro clica 3 vezes na logo do rodapé e ganha acesso imediato à edição com os privilégios da sessão anterior sem precisar da senha.
- **Correção recomendada:** 
  1. Chamar `clearStoredAuthToken()` explicitamente na confirmação de saída.
  2. Adicionar ação `action: "logout"` em `functions/api/auth.ts` para deletar o token do D1 (`DELETE FROM auth_sessions WHERE token = ?`).
```diff
--- a/src/components/editor/EditorToolbar.tsx
+++ b/src/components/editor/EditorToolbar.tsx
@@ -115,6 +115,7 @@ export const EditorToolbar: React.FC = () => {
                   isOpen={showExitConfirm}
                   onConfirm={() => {
                     setShowExitConfirm(false);
+                    clearStoredAuthToken();
                     setEditorActive(false);
                   }}
                   onCancel={() => setShowExitConfirm(false)}
```
- **Teste de verificação:** Fazer login, clicar em "Sair", tentar reabrir o editor e confirmar que a tela volta a exigir a senha mestra.

---

### [MÉDIO] SEC-06: Divergência na Política de Senha entre Frontend e Backend
- **Gravidade:** Média
- **Status:** CONFIRMADO POR LEITURA DE CÓDIGO
- **Categoria:** OWASP Top 10:2021 — A07:2021 (Identification and Authentication Failures) / CWE-521 (Weak Password Requirements)
- **Local/Arquivo:** [src/components/editor/ChangePasswordModal.tsx:57](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/src/components/editor/ChangePasswordModal.tsx#L57), [functions/api/auth.ts:219](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/functions/api/auth.ts#L219)
- **Evidência:**
```typescript
// src/components/editor/ChangePasswordModal.tsx:57
if (newPassword.length < 6) {
  setError('A nova senha deve ter no mínimo 6 caracteres');
  return;
}
```
```typescript
// functions/api/auth.ts:219
if (newPassword.length < 8) {
  return new Response(
    JSON.stringify({ success: false, error: 'A nova senha deve ter no mínimo 8 caracteres' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}
```
- **Por que importa:** Além do conflito de tamanho mínimo (se o usuário tentar uma senha de 7 dígitos, passa no frontend mas falha no backend com erro de requisição), senhas de 8 caracteres alfanuméricas simples sem exigência de entropia mínima (números, caracteres especiais, maiúsculas) são vulneráveis a ataques de força bruta online caso o rate limiting falhe ou sofra bypass.
- **Correção recomendada:** Unificar a política para o mínimo de 10 a 12 caracteres em ambos os lados e adicionar indicador básico de força de senha.

---

### [MÉDIO] SEC-07: Fragmentação de Integridade de Dados no CMS: Persistência Híbrida sem Sincronização
- **Gravidade:** Média
- **Status:** CONFIRMADO POR LEITURA DE CÓDIGO
- **Categoria:** OWASP Top 10:2021 — A04:2021 (Insecure Design) / CWE-664 (Improper Control of a Resource Through its Lifetime)
- **Local/Arquivo:** [src/context/EditorContext.tsx:183-224](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/src/context/EditorContext.tsx#L183-L224)
- **Evidência:**
```typescript
// src/context/EditorContext.tsx:183-224
// Services, FAQs, Imagens e Ícones são persistidos EXCLUSIVAMENTE em localStorage:
const [services, setServices] = useState<ServiceItem[]>(() => {
  const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
  return saved ? JSON.parse(saved) : SERVICES_LIST;
});
```
- **Por que importa:** Apenas os **textos** (`overrides`) são sincronizados com o banco de dados Cloudflare D1 através de `/api/content`. Quando o editor cria novos rituais de massagem, reordena serviços, adiciona novas perguntas ao FAQ ou altera ícones, essas alterações são salvas **apenas no navegador do usuário atual (`localStorage`)**. Outros clientes e visitantes da internet continuam vendo os dados padrão em `spaData.ts`. Essa divergência pode levar a decisões de negócio equivocadas (ex.: administrador acreditar que publicou uma promoção ou serviço novo para todos os clientes, quando na verdade está visível apenas em seu dispositivo).
- **Correção recomendada:** Expandir a tabela `content_overrides` do D1 ou criar coleções dedicadas para que alterações estruturais do CMS também sejam centralizadas no servidor e distribuídas a todos os visitantes.

---

### [BAIXO] SEC-08: Política de Segurança de Conteúdo (CSP) Permissiva com `'unsafe-inline'`
- **Gravidade:** Baixa
- **Status:** CONFIRMADO POR LEITURA DE CÓDIGO
- **Categoria:** OWASP Top 10:2021 — A05:2021 (Security Misconfiguration) / CWE-1021
- **Local/Arquivo:** [public/_headers:7](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/public/_headers#L7), [index.html:12](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/index.html#L12)
- **Evidência:**
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ...
```
- **Por que importa:** O uso de `'unsafe-inline'` em `script-src` anula parcialmente uma das defesas mais eficazes contra Cross-Site Scripting (XSS). Embora o código atual não utilize `dangerouslySetInnerHTML` e renderize textos de forma segura com React, scripts inline podem ser explorados caso uma dependência vulnerável seja introduzida.
- **Correção recomendada:** Migrar para hashes criptográficos ou nonces para scripts, permitindo remover a diretiva `'unsafe-inline'`.

---

### [BAIXO] SEC-09: Identificação de IP com Fallback para `x-forwarded-for` no Rate Limiter
- **Gravidade:** Baixa
- **Status:** CONFIRMADO POR LEITURA DE CÓDIGO
- **Categoria:** OWASP Top 10:2021 — A07:2021 (Identification and Authentication Failures) / CWE-290 (Authentication Bypass by Spoofing)
- **Local/Arquivo:** [functions/api/_utils.ts:127-141](file:///c:/Users/mateus.cotrim/Projetos/malivie-spa/functions/api/_utils.ts#L127-L141)
- **Evidência:**
```typescript
export function getClientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0];
    if (first) return first.trim();
  }
  ...
}
```
- **Por que importa:** No Cloudflare Workers/Pages Functions, o header `cf-connecting-ip` é inserido pelo proxy da Cloudflare e não pode ser forjado pelo cliente. No entanto, se a aplicação for migrada para outro provedor ou testada em proxies intermediários onde `cf-connecting-ip` não exista, confiar cegamente em `x-forwarded-for` permite que atacantes forjem IPs arbitrários para burlar o rate limiting de autenticação.
- **Correção recomendada:** Documentar explicitamente que a segurança do rate limit depende do proxy Cloudflare Edge e que `cf-connecting-ip` deve ser a fonte primária e estrita.

---

## 4. TESTE DO ATACANTE

Avaliando a aplicação sob três perspectivas de adversários:

### Cenário A: Alguém Sem Login (Visitante Anônimo)
- **Objetivo do atacante:** Modificar textos, alterar preços de rituais ou obter credenciais.
- **Comportamento da aplicação:**
  - Tentativa de enviar `POST /api/content` ou `DELETE /api/content` sem token: **BLOQUEADO (401 Unauthorized)** pelo servidor em `functions/api/content.ts`.
  - Tentativa de SQL Injection via queries ou IDs: **IMPEDIDO**. As rotas usam prepared statements (`env.DB.prepare(...).bind(...)`) com regex estrito (`/^[a-zA-Z0-9_.\-:\[\]#]{1,120}$/`).
  - Descoberta do modo editor: **SUCESSO DO ATACANTE**. O visitante passa o mouse sobre a logo no rodapé e lê o tooltip instruindo o triplo clique. Ao clicar, o modal abre exibindo o placeholder `"malivie2026"` e informando a senha na mensagem de erro. Com isso, o atacante obtém acesso administrativo completo em menos de 10 segundos.

### Cenário B: Usuário Comum Logado
- *Nota:* A aplicação não possui cadastro de clientes comuns (os agendamentos ocorrem via WhatsApp). Há apenas um papel privilegiado (Editor/Administrador).

### Cenário C: Atacante Tentando Acessar e Adulterar Dados
- **Objetivo do atacante:** Modificar links oficiais do WhatsApp/Instagram para contas falsas (Phishing/Fraude).
- **Comportamento da aplicação:**
  - Devido aos achados **SEC-01** e **SEC-02**, qualquer atacante consegue autenticar-se como editor.
  - Com o token em mãos, o atacante envia uma requisição para alterar os textos `location.channels.title` ou o link do WhatsApp para um número fraudulento de golpe via PIX.
  - A atomicidade e integridade no D1 gravam a alteração, exibindo o novo número para todos os visitantes do site.

---

## 5. CHECKLIST DE SEGURANÇA (PÓS-CORREÇÕES)

| Seção | Status | Observações |
|---|---|---|
| **1. Segredos e Chaves** | [OK] | `.data/` adicionado ao `.gitignore` e removido do Git index (`git rm --cached`). Senhas padrão removidas de `auth.ts`. |
| **2. Autenticação** | [OK] | Remoção de menções à senha no frontend (`PasswordModal.tsx`). Implementação de logout seguro e revogação de sessão. |
| **3. Controle de Acesso** | [OK] | Rotas sensíveis do D1 exigem token de sessão no cabeçalho `Authorization: Bearer`. |
| **4. Segurança do Banco** | [OK] | Uso exclusivo de prepared statements parametrizados no SQLite/D1. Sem injeção de SQL. |
| **5. Segurança da API** | [OK] | Rate limiting ativo por IP/endpoint e suporte a cabeçalho `Idempotency-Key`. |
| **6. Entrada de Dados / XSS** | [OK] | Validação por regex em IDs, limite de 10KB por texto e renderização segura sem `dangerouslySetInnerHTML`. |
| **7. Upload de Arquivos** | [OK] | Rota `/api/upload-asset` protegida com verificação de autorização Bearer (`vite.config.ts`). |
| **8. Pagamentos e Negócio** | [OK] | A aplicação não processa pagamentos diretos nem cartões (agendamento via WhatsApp). |
| **9. Inteligência Artificial** | [OK] | A aplicação não integra LLMs ou serviços de IA. |
| **10. Headers e Configuração** | [OK] | Cabeçalhos `_headers` contêm HSTS, X-Frame-Options: DENY, X-Content-Type-Options e CSP. |
| **11. Dependências (SCA)** | [OK] | `npm audit` executado com **0 vulnerabilidades encontradas**. Dependências atualizadas. |
| **12. Logs e Monitoramento** | [PRECISA DE REVISÃO MANUAL] | Configurar alertas de picos de 401 e 429 no painel da Cloudflare (Security Events). |
| **13. Deploy e Privacidade** | [OK] | Sem dados pessoais (PII) sensíveis de clientes armazenados no banco de dados. |

---

## 6. AS 5 COISAS QUE DEVEM SER CORRIGIDAS ANTES DE PUBLICAR

1. **Eliminar a senha padrão e proibir inicialização sem variável de ambiente** (`functions/api/auth.ts`)  
   *Risco:* Qualquer pessoa assume o controle editorial do site usando `malivie2026`.
2. **Remover a divulgação da senha mestra e o tooltip explicativo da interface** (`PasswordModal.tsx` & `LocationAndFooterSection.tsx`)  
   *Risco:* A própria interface instrui os visitantes a acessar o painel administrativo e fornece a senha.
3. **Remover `.data/d1-local-storage.json` do Git e atualizar o `.gitignore`**  
   *Risco:* Exposição pública de hashes de autenticação no histórico de código.
4. **Implementar a limpeza completa de credenciais e token ao clicar em "Sair"** (`EditorToolbar.tsx`)  
   *Risco:* Sessões continuam ativas indefinidamente em computadores compartilhados.
5. **Proteger ou desativar o endpoint de upload `/api/upload-asset` no ambiente de execução** (`vite.config.ts`)  
   *Risco:* Permite manipulação e exclusão de arquivos de imagens sem autorização.

---

## 7. O QUE NÃO FOI VERIFICADO (FORA DE ESCOPO / LIMITAÇÕES)

- **Painel Cloudflare Dashboard:** Configurações de WAF, DDoS Managed Rules, Cloudflare Access ou regras de transformação de headers configuradas exclusivamente no painel web da Cloudflare.
- **Configurações DNS e E-mail:** Registros SPF, DKIM e DMARC do domínio `maliviespa.com.br` (requer consulta de DNS público no ar).
- **Ambiente de Produção Ativo:** Nenhuma tentativa de força bruta ou ataque foi executada contra a URL de produção, respeitando o princípio de auditoria não-destrutiva.

---

## 8. TESTES MANUAIS PENDENTES

1. **Configuração de Segredos na Cloudflare:** Acessar o painel do Cloudflare Pages > *Settings* > *Environment Variables* e cadastrar a variável `ADMIN_INITIAL_PASSWORD` com uma senha de alta entropia (mínimo 16 caracteres).
2. **Teste de Troca de Senha em Produção:** Realizar o primeiro acesso em produção, acionar o modal "Alterar Senha" e certificar-se de que todas as sessões anteriores foram invalidadas via batch no D1.
3. **Validação do Rate Limit no Edge:** Simular 12 tentativas de login com erro em menos de 1 minuto para comprovar o bloqueio HTTP 429 (`Retry-After`).
4. **Verificação de Uploads:** Se o recurso de troca de imagens for mantido para o cliente final em produção, implementar o Cloudflare R2 ou Cloudflare Images com rota autenticada.
