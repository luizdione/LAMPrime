# Widget LAMP Primer Designer (Básico)

Um mini‑projeto estático (HTML/CSS/JS) inspirado no layout do NEB LAMP (https://lamp.neb.com/#!/), pronto para ser embutido em um subdiretório da sua página HTML.

Este widget não realiza cálculos de primers (é apenas UI). Ele serve como base para acrescentar parâmetros e lógica posteriormente.

## Estrutura

- index.html — página principal do widget (sem dependências externas)
- styles.css — estilos leves e responsivos (dark theme)
- app.js — interação básica (abas, leitura de FASTA, mock de resultados)

## Como embutir na sua página

1. Copie a pasta `static/lamp_widget` para um subdiretório do seu site. Exemplo:
   - `seu-site/neb-lamp/` contendo `index.html`, `styles.css`, `app.js`.

2. Existem duas formas comuns de embutir:

   - Via `<iframe>` (recomendado por isolamento):

     ```html
     <iframe src="neb-lamp/index.html" style="width:100%;height:720px;border:none;border-radius:8px;overflow:hidden"></iframe>
     ```

   - Via inclusão direta (copiando o conteúdo do `index.html` para dentro da sua página) e ajustando os caminhos para `styles.css` e `app.js`.

## Fluxo de uso (UI)

- Aba Entrada: cole a sequência ou carregue um arquivo FASTA (headers ">" são ignorados). Clique em "Gerar primers" para simular resultados.
- Aba Parâmetros: ajuste Tm alvo, faixa de GC, inclusão de primers de loop e condições da reação. No momento, são apenas visuais.
- Aba Resultados: exibe cards com um conjunto de primers fictícios (mock) para demonstrar o layout.

## Próximos passos sugeridos

- Conectar com uma API local (por exemplo, rotas já existentes no repositório com Flask) para gerar resultados reais a partir do algoritmo (ver LAMP_Primer_Designer*.py).
- Adicionar validações (comprimento mínimo, alfabeto estrito ATGC, remoção de Ns).
- Permitir salvar CSV/JSON (os botões podem chamar funções parecidas com as de `templates/index.html`).
- Exibir Tm e penalidades vindas do servidor; incluir LF/LB quando disponíveis.

## Acessibilidade

- Navegação por abas com atributos ARIA.
- Foco visível em botões e inputs.

## Licença

Uso interno no projeto do autor. Ajuste conforme necessário.
