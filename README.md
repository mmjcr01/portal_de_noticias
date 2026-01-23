# 📰 TechNews - Portal de Notícias

Um portal de notícias moderno e funcional desenvolvido com **Node.js** e **Express**, com autenticação segura, sistema completo de CRUD de artigos, categorias e usuários.

---

## 🎯 Sobre o Projeto

**TechNews** é um projeto full-stack que demonstra a aplicação de conceitos essenciais de desenvolvimento web, como:

- Autenticação e autorização de usuários
- Gerenciamento seguro de sessões
- Upload e manipulação de arquivos
- Padrões de segurança web (Helmet, CSP, rate limiting)
- Tratamento robusto de erros
- Arquitetura MVC bem estruturada

Este projeto foi desenvolvido do zero como ferramenta de aprendizado prático, cobrindo o ciclo completo de desenvolvimento de uma aplicação web.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **MySQL** - Banco de dados relacional
- **EJS** - Template engine
- **Bcrypt** - Hash seguro de senhas
- **Multer** - Upload de arquivos
- **Express-session** - Gerenciamento de sessões
- **Helmet** - Segurança HTTP
- **dotenv** - Variáveis de ambiente

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Responsividade e design moderno
- **JavaScript vanilla** - Interatividade sem dependências desnecessárias

---

## ✨ Funcionalidades Principais

### 👤 Autenticação & Autorização
- ✅ Cadastro de usuários com validação
- ✅ Login seguro com hash bcrypt
- ✅ Sistema de sessões
- ✅ Controle de acesso por perfil (Admin/Usuário)
- ✅ Logout

### 📰 Gerenciamento de Artigos
- ✅ Criar, editar e deletar artigos
- ✅ Upload automático de imagens de destaque
- ✅ Sistema de categorias
- ✅ Destaque e subdestaque de artigos
- ✅ Rastreamento de artigos mais lidos

### 🏷️ Categorias
- ✅ CRUD completo de categorias
- ✅ Filtro por tema
- ✅ Controle de ativação/desativação

### 👥 Gerenciamento de Usuários (Admin)
- ✅ Criar, editar e deletar usuários
- ✅ Controle de permissões
- ✅ Edição segura de senhas

### 🔍 Busca
- ✅ Busca de artigos por título/conteúdo
- ✅ Filtro por categoria
- ✅ Exibição de artigos mais lidos da semana

---

## 🛡️ Segurança

- **Validação de entrada** - Proteção contra injections
- **Hash de senhas** - Bcrypt com salt
- **Content Security Policy (CSP)** - Prevenção de XSS
- **Rate limiting** - Proteção contra força bruta em produção
- **Helmet** - Headers de segurança HTTP
- **Sessões seguras** - HttpOnly + Secure cookies
- **Variáveis de ambiente** - Dados sensíveis protegidos

---

## 📁 Estrutura do Projeto

```
portal_de_noticias/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── routes/           # Definição de rotas
│   │   ├── middleware/       # Autenticação e validação
│   │   └── database/         # Conexão MySQL
│   ├── public/
│   │   ├── css/             # Estilos
│   │   ├── js/              # Scripts frontend
│   │   └── assets/          # Imagens e ícones
│   ├── views/               # Templates EJS
│   ├── index.js             # Servidor Express
│   └── package.json
└── README.md
```

---

## 🚀 Como Instalar e Executar

### Pré-requisitos
- Node.js (v14+)
- MySQL (v5.7+)
- npm ou yarn

### Passo 1: Clonar o repositório
```bash
git clone https://github.com/seu-usuario/portal-de-noticias.git
cd portal_de_noticias/backend
```

### Passo 2: Instalar dependências
```bash
npm install
```

### Passo 3: Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=portal_noticias
SESSION_SECRET=sua_chave_secreta_aqui
NODE_ENV=development
```

### Passo 4: Criar banco de dados
Execute o script SQL para criar as tabelas necessárias.

### Passo 5: Iniciar o servidor
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

---

## 📖 Como Usar

### Para Visitantes
1. Acesse a página inicial para ver artigos
2. Clique em um artigo para ler o conteúdo completo
3. Use a busca para encontrar artigos específicos

### Para Usuários Cadastrados
1. Faça login com suas credenciais
2. Crie novos artigos via "Criar um artigo"
3. Seus artigos aparecerão no portal

### Para Administradores
1. Acesse as páginas de gerenciamento no menu "Configurações"
2. **Menu Usuários** - Gerenciar usuários do sistema
3. **Menu Artigos** - Editar/deletar artigos e destacá-los
4. **Menu Categorias** - Gerenciar categorias

---

## 🎓 O Que Aprendi Desenvolvendo Este Projeto

Este projeto foi uma jornada de aprendizado que me permitiu dominar:

- **Backend**: Estrutura MVC, middlewares, autenticação JWT/sessions
- **Banco de Dados**: Modelagem relacional, queries otimizadas
- **Segurança**: Hash de senhas, proteção contra XSS/CSRF, validação de entrada
- **Frontend**: Manipulação do DOM, requisições HTTP, tratamento de erros
- **DevOps**: Variáveis de ambiente, estrutura de produção
- **Git & Versionamento**: Boas práticas de commit e branches

---

## 📊 Funcionalidades Futuras

- [ ] Autenticação com Google/GitHub
- [ ] Sistema de comentários em artigos
- [ ] Curtidas e compartilhamento social
- [ ] Dashboard com gráficos de acesso
- [ ] Notificações por email
- [ ] API RESTful completa
- [ ] Testes automatizados

---

## 🤝 Contribuições

Este é um projeto pessoal de aprendizado. Feedbacks e sugestões são bem-vindos!

Sinta-se livre para:
- 📝 Abrir issues
- 🔄 Sugerir melhorias
- 📧 Entrar em contato

---

## 📞 Contato

- **LinkedIn**: [Michel Miranda](https://www.linkedin.com/in/michel-miranda-86b74936b/)
- **WhatsApp**: [Conversar](https://wa.me/5571987776711?text=Olá%2C%20vi%20seu%20projeto%20TechNews%20e%20gostaria%20de%20conversar.)
- **Email**: michel@example.com

---

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo LICENSE para detalhes.

---

**Desenvolvido com ❤️ durante minha jornada de aprendizado em desenvolvimento web.**

*Última atualização: Janeiro de 2026*
