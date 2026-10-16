# Escopo de validação
Executado: leitura do inventário ZIP, inspeção visual das 19 referências, inspeção estática dos contratos/componentes listados na auditoria, parse CSV com registros multilinha, extração das 45 linhas editoriais, validação de IDs/arestas/raízes e comparação SHA-256 dos 26 originais úteis. Metadados __MACOSX e diretórios vazios foram excluídos; o ZIP de código foi preservado integralmente.

Não executado: build da aplicação, integração a SMS, testes de UI/concorrência, renderização de PDF das novas views, deploy ou revisão factual das respostas AlsoAsked. Nenhum teste de produto foi marcado como aprovado.

O inventário e os checksums cobrem os arquivos internos do pacote, exceto o próprio manifesto SHA256SUMS.txt para evitar autorreferência. Os IDs de dados desta entrega são estáveis dentro da versão de cada dataset, não chaves de identidade global de qualquer export futuro.
