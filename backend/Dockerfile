FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia o requirements da raiz da pasta backend/
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o conteúdo de backend/ para /app
COPY . .

# Informa ao Python que o código fonte está na pasta src
ENV PYTHONPATH=/app/src

EXPOSE 8000

# Alteramos para 'src.main:app' porque o main está dentro da pasta src
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]