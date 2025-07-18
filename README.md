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

## 📄 License

MIT License
