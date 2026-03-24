# Biblo | Gamified Scripture Learning Platform

**Biblo** é uma plataforma de aprendizado bíblico inspirada na metodologia de micro-aprendizado e gamificação do Duolingo. O sistema transforma o estudo das escrituras em uma experiência interativa, progressiva e social, utilizando algoritmos de repetição espaçada para maximizar a retenção do conhecimento.

O projeto combina uma interface de usuário vibrante com uma lógica de backend robusta para gerenciar trilhas de aprendizado, conquistas e proficiência em diferentes livros e temas bíblicos.

---

## 🏗️ Arquitetura e Tecnologias

A solução utiliza uma stack moderna e escalável, orquestrada via **Docker Compose**:

* **Frontend (React + Vite)**: Interface ultra-responsiva focada em UX mobile-first. Utiliza Tailwind CSS para componentes de UI gamificados (barras de progresso, modais de conquista e feedbacks visuais).
* **Backend (FastAPI)**: Engine que processa a lógica de lições, validação de respostas e gerenciamento de XP (experiência).
* **Gamification Logic**: Sistema de algoritmos que calcula a "curva de esquecimento" do usuário para sugerir revisões personalizadas.
* **Database (PostgreSQL)**: Armazenamento de trilhas de usuários, streaks (ofensivas), histórico de erros e progresso por capítulo.

---

## 🚀 Funcionalidades Principais

* **Trilhas de Aprendizado**: Lições curtas e interativas divididas por livros (Gênesis, Salmos, etc.) ou temas (Sabedoria, Parábolas).
* **Sistema de Ofensivas (Streaks)**: Incentivo à consistência diária com contadores visuais e retenção de usuários.
* **Feedback Imediato**: Correção em tempo real de exercícios de completar, tradução e múltipla escolha.
* **Algoritmo de Revisão**: Identifica versículos ou conceitos onde o usuário tem maior dificuldade e os reintroduz de forma estratégica.
* **Conquistas e Ranking**: Tabelas de classificação (Ligas) e medalhas por marcos alcançados.

---

## 📖 Metodologia de Conteúdo

O conteúdo é estruturado para garantir que o usuário não apenas memorize, mas compreenda o contexto:
* **Nível 1 (Básico)**: Identificação de personagens e cronologia.
* **Nível 2 (Intermediário)**: Memorização de versículos-chave e vocabulário original (Grego/Hebraico básico).
* **Nível 3 (Avançado)**: Interpretação contextual e conexões teológicas.

---

## 🛠️ Instalação e Execução

O projeto está totalmente conteinerizado para facilitar o desenvolvimento e deploy.

### 1. Subir a Infraestrutura
Na raiz do projeto, execute o comando de subida do docker-compose para iniciar o banco de dados e os servidores de aplicação.

### 2. Inicializar o Conteúdo
É necessário rodar o script de seed para popular o banco de dados com as lições iniciais, trilhas e o dicionário de termos.

### 3. Acessar a Aplicação
* **Web App**: http://localhost:5173
* **API Portal**: http://localhost:8000/docs

---

## 📁 Estrutura do Repositório

* **backend/**: Core da aplicação, gerenciamento de usuários e lógica de gamificação.
* **frontend/**: Interface React, sistema de som/feedback e componentes de lições.
* **content/**: Arquivos JSON/YAML que definem a estrutura das árvores de aprendizado.
* **docker-compose.yml**: Configuração do ecossistema completo (App + DB).
