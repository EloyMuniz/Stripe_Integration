### Integração de Pagamentos Stripe com Banco de Dados PostgreSQL

Este repositório contém código para integrar a plataforma de pagamento Stripe com um banco de dados PostgreSQL usando Node.js e Express.js. A integração permite processar pagamentos através do Stripe e armazenar informações do usuário e detalhes de pagamento em um banco de dados PostgreSQL.

# Funcionalidades

Integração com o Stripe: Utiliza a API do Stripe para lidar com o processamento de pagamentos, incluindo a criação e gerenciamento de intenções de pagamento e sessões de checkout.
Banco de Dados PostgreSQL: Armazena informações do usuário, incluindo email, senha e quantidades de crédito, em um banco de dados PostgreSQL usando o ORM Prisma.
Notificação por Email: Envia notificações por email aos usuários após o registro bem-sucedido, fornecendo credenciais de login e informações de crédito.
Hash de Senha: Protege as senhas dos usuários criptografando-as antes de armazená-las no banco de dados usando bcrypt.
Webhooks: Implementa webhooks do Stripe para lidar com eventos como intenções de pagamento bem-sucedidas e sessões de checkout concluídas.

# Instruções de Configuração

Clonar o Repositório: Clone este repositório para sua máquina local usando git clone.

Instalar Dependências: Execute yarn install para instalar todas as dependências necessárias.

Variáveis de Ambiente: Configure as variáveis de ambiente para as chaves da API do Stripe

Migração do Banco de Dados: Execute as migrações do banco de dados usando o Prisma CLI (npx prisma migrate dev) para criar as tabelas necessárias no banco de dados PostgreSQL.

# Dependências

Express: Framework web rápido, sem opiniões e minimalista para Node.js.
Stripe: Biblioteca oficial da API do Stripe para Node.js.
Nodemailer: Módulo para enviar emails com Node.js.
Prisma: Conjunto de ferramentas de banco de dados moderno para Node.js e TypeScript, usado para acesso ao banco de dados PostgreSQL.
Moment.js: Biblioteca para análise, validação, manipulação e formatação de datas e horários em JavaScript.
Bcrypt: Biblioteca para criptografar senhas antes de armazená-las no banco de dados.

Contribuições são bem-vindas! Sinta-se à vontade para enviar pull requests ou abrir issues para quaisquer melhorias ou correções de bugs.

Autor
Eloy Muniz

Agradecimentos
Este projeto foi inspirado pela documentação oficial do Stripe.

