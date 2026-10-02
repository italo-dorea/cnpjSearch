# CNPJSearch

Consulte dados cadastrais de empresas brasileiras pelo CNPJ: situação, endereço, atividades,
Simples/MEI, regime tributário e quadro de sócios, com relatório em PDF.

Os dados vêm da [BrasilAPI](https://brasilapi.com.br/api/cnpj/v1/00000000000191) (base pública da
Receita Federal), consultada **direto do navegador**: não há servidor próprio.

Existe também uma versão desktop para Windows (Electron + FastAPI) com as mesmas funcionalidades,
disponível para baixar na própria página.

## Funcionalidades

- Consulta por CNPJ com máscara e validação dos dígitos verificadores antes de chamar a API.
- Cabeçalho com os dados gerais e abas por categoria (Dados Gerais, Situação Cadastral, Endereço
  e Contato, Atividades, Simples e MEI, Regime Tributário, Sócios e JSON completo). Todos os
  campos retornados são exibidos, mesmo vazios ("Não informado").
- Relatório em PDF (A4, com timbrado, data e hora de emissão e numeração de páginas), gerado no
  navegador com jsPDF.
- Mensagens de erro claras (CNPJ inválido, não encontrado, limite de consultas, tempo esgotado) e
  tela de recuperação se algo quebrar ao renderizar.
- Cache de 5 minutos em memória, para não repetir consultas à API.
- Apoio voluntário ao desenvolvedor via Pix (QR Code e "copia e cola"), sem contrapartida.
- Responsivo: no celular some o que não é dado da empresa (ilustração, download do app para
  Windows, QR Code e dica de apoio).
- Download do app para Windows na página inicial.

## Desenvolvimento

Requer Node 20+.

```bash
cd ClientApp
npm install
npm run dev       # http://localhost:5173
npm run build     # saída em ClientApp/dist (arquivos estáticos)
npm run preview   # serve o build de produção
npm run lint
```

O `dist/` pode ser publicado em qualquer hospedagem de arquivos estáticos. A política de segurança
de conteúdo (CSP) fica no `index.html`; no build ela é endurecida automaticamente (ver
`vite.config.ts`) e só permite conexões à própria origem e a `brasilapi.com.br`.

## Configuração (`ClientApp/src/config.ts`)

- **Download do app para Windows** (`DOWNLOAD`): o instalador (134 MB) passa do limite de 100 MB do
  GitHub, então fica no Google Drive com compartilhamento "qualquer pessoa com o link". Ao trocar o
  arquivo no Drive, atualize `version`, `size` e `sha256`.
- **Apoio** (`SUPPORT_PIX_CODE`): Pix "copia e cola" estático e sem valor, com chave aleatória. O
  app valida o formato e o CRC; se houver erro de digitação, o botão não aparece.
  `SUPPORT_URL` (opcional) adiciona um link de pagamento alternativo; `SUPPORT_FIXED_AMOUNT` só
  deve ser preenchido se o Pix/link tiver valor fixo.

## Limites da fonte de dados

A BrasilAPI é um serviço gratuito e voluntário, sem SLA nem limites documentados, e repassa os
dados do [Minha Receita](https://docs.minhareceita.org). Os dados podem estar desatualizados ou
incompletos, e o relatório não substitui o Cartão CNPJ nem certidões oficiais.

## Estrutura

```
ClientApp/
  src/
    components/   AppBar, Footer (fixo), FieldGrid, DownloadApp, SupportDialog, SupportHint,
                  CoffeeSteam (SVG animado), ErrorBoundary
    pages/        Home, InfoCnpj
    services/     cnpj.tsx (BrasilAPI)
    utils/        cnpjValidation, format, empresaSections, report (PDF), pix, supportHint
    hooks/        useSupportHint
    theme.ts      tema (preto #0B0F1A e azul #036DC5) e tokens.ts
```
