# frontend/Dockerfile
FROM node:20-slim

WORKDIR /app

# Copia os arquivos de configuração de pacotes
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Roda o Vite aceitando conexões externas (--host)
CMD ["npm", "run", "dev", "--", "--host"]