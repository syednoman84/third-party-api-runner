# ✅ Project: Third-Party API Runner

This Spring Boot application dynamically routes API requests to different third-party services using a per-source JSON configuration stored in the **database**. It supports:

- 🔁 Dynamic request routing
- 🔐 Basic and JWT authentication
- 📦 Config storage via REST endpoint
- 📜 Full request/response logging
- 🧾 Web interface-ready structure

---

## 📁 Features

- Add and store JSON configs for third-party APIs via endpoint
- Use config by data source name (e.g., `/api/proxy/weather?q=London`)
- Authentication types supported:
    - `basic` (username/password)
    - `jwt` (fetch token, then use it)
- Logs all:
    - Headers
    - Request & response body
    - Params
    - Auth steps (token request/response separately)
- Query configs and logs easily via exposed endpoints

---

## 📦 API Endpoints

### 🔄 Proxy Request
```
GET /api/proxy/{dataSourceName}?param1=value
```
Routes to a third-party API based on config.

---

### ➕ Add Config
```
POST /api/add/configs/{dataSourceName}
Content-Type: application/json
```

**Body Example** (for Weather API):
```json
{
  "url": "https://api.weatherapi.com/v1/current.json",
  "method": "GET",
  "headers": {},
  "defaultParams": {
    "key": "your-weather-api-key",
    "aqi": "no"
  }
}
```

---

### 🆗 Get Config
```
GET /api/add/configs/{dataSourceName}
```

---

### ✏️ Update Config
```
PUT /api/add/configs/{dataSourceName}
```

---

### ❌ Delete Config
```
DELETE /api/add/configs/{dataSourceName}
```

## <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" alt="Postman" width="30" style="vertical-align: middle;" /> Postman Collection

- https://github.com/syednoman84/third-party-api-runner/blob/master/backend/third-part-api-runner.postman_collection.json

---

## 🧱 Config Table Schema

| Column           | Type      | Description                     |
|------------------|-----------|---------------------------------|
| `id`             | UUID      | Primary key                     |
| `dataSourceName` | String    | Identifier used in request path|
| `createdAt`      | Timestamp | Time of creation                |
| `config`         | `jsonb`   | Full JSON config for the API    |

---

## 📜 Example `curl` Command

```bash
curl -X POST http://localhost:8080/api/add/configs/weather \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.weatherapi.com/v1/current.json",
    "method": "GET",
    "headers": {},
    "defaultParams": {
      "key": "your-api-key",
      "aqi": "no"
    }
  }'
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven
- MySQL (or compatible DB)

---

### 🏗️ Build & Run

```bash
./mvnw clean install
./mvnw spring-boot:run
```

Make sure `application.yml` contains correct DB credentials.

---

## 📂 Project Structure

```
src/main/java
├── controller          # Exposes endpoints
├── service             # Core logic (proxy, config handling)
├── config              # Loader for config from DB
├── dto                 # DTOs for safe response
├── entity              # JPA entities
├── repository          # Spring Data JPA
```

---

## 🧪 Future Ideas

- Rate limiting per config
- Retry/backoff logic
- Web UI for managing configs
- OAuth2 support

---

## Screenshots

<img width="1414" height="608" alt="image" src="https://github.com/user-attachments/assets/e9bc0a99-9d1c-4c60-8f6b-0a790466fb57" />
<img width="1414" height="711" alt="image" src="https://github.com/user-attachments/assets/5f94682b-fda6-44f4-a3e9-1e02ab3460f8" />
<img width="1417" height="681" alt="image" src="https://github.com/user-attachments/assets/813e7dd3-e5a3-4b6f-b9e2-57b340b2240e" />
<img width="1400" height="760" alt="image" src="https://github.com/user-attachments/assets/edb43a7b-96eb-44b3-907d-58713b3f0100" />
<img width="1404" height="753" alt="image" src="https://github.com/user-attachments/assets/b62640f2-1d9c-4940-b371-744131634153" />
<img width="1410" height="760" alt="image" src="https://github.com/user-attachments/assets/7d12fee0-c736-483c-b377-be42bb6aa660" />
<img width="1400" height="494" alt="image" src="https://github.com/user-attachments/assets/1d41217d-dc62-4354-874b-00e1bf15f527" />







