# Speed Typing Test

Этот проект представляет собой приложение для тестирования скорости набора текста, построенное с использованием React, TypeScript, Vite для фронтенда и FastAPI для бэкенда. Проект использует PostgreSQL в качестве базы данных и Docker для контейнеризации.

## Установка и запуск

### Требования

- Docker
- Docker Compose

### Шаги для запуска

1. Клонируйте репозиторий:
```bash
git clone https://github.com/vbncursed/speed-typing-test.git

cd speed-typing-test
```


2. Запустите Docker Compose:
```bash
docker-compose up --build
```


3. Откройте браузер и перейдите по адресу:

   	- Фронтенд: [http://localhost:3000](http://localhost:3000)
   	- Бэкенд: [http://localhost:8000](http://localhost:8000)

### Структура проекта

- `backend/` - директория с кодом бэкенда на FastAPI
- `speed-typing-test/` - директория с кодом фронтенда на React и TypeScript
- `docker-compose.yml` - файл конфигурации Docker Compose
- `backend/Dockerfile` - Dockerfile для бэкенда
- `speed-typing-test/Dockerfile` - Dockerfile для фронтенда

### Примеры API

- Тестовый эндпоинт для проверки базы данных:
```bash
GET /test-db
```


Ответ:
```json
{
  "result": {
		"?column?": 1
  }
}
```


### Лицензия

Этот проект лицензирован под лицензией MIT. Подробности см. в файле [LICENSE](LICENSE).