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


## 🛠️ Instalação e Execução

O projeto está totalmente conteinerizado para facilitar o desenvolvimento e deploy.

### 1. Subir a Infraestrutura
No Linux, na raiz do projeto, execute o script `start.sh` para iniciar o banco de dados e os servidores de aplicação.

### 3. Acessar a Aplicação
* **Web App**: http://localhost:5173
* **API Portal**: http://localhost:8000/docs

---

## 📁 Estrutura do Repositório

* **backend/**: Core da aplicação, gerenciamento de usuários e lógica de gamificação.
* **frontend/**: Interface React, sistema de som/feedback e componentes de lições.
* **docker-compose.yml**: Configuração do ecossistema completo (App + DB).
