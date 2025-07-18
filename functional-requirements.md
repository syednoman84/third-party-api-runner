
# Functional Requirements for Third-Party API Integration Platform

---

## 1. Configuration Management

- **Add New Config**
    - Accepts a JSON configuration via API to register a new third-party data source.
    - Config includes:
        - `url`, `method`, `headers`, `defaultParams`
        - Optional `auth` block (either `basic` or `jwt`)
    - Prevents duplicate entries by `dataSourceName`.

- **Update Config**
    - Updates an existing configuration by `dataSourceName`.

- **Delete Config**
    - Deletes a configuration by `dataSourceName`.

- **Get Config by Name**
    - Retrieves a single config by `dataSourceName`.

- **List All Configs**
    - Returns a list of all stored configurations.

---

## 2. Dynamic Proxy Execution

- **Route Request to Third-Party API**
    - Endpoint: `GET /api/proxy/{dataSourceName}`
    - Uses the stored config to:
        - Prepare headers, query/body parameters
        - Optionally call an authentication endpoint to obtain and attach a JWT token
        - Execute the main request to the target API
        - Return the response back to the caller
    - Supports both `GET` and `POST` methods (as specified in config)

---

## 3. Authentication Support

- **Basic Authentication**
    - Uses `username` and `password` to generate Basic Auth headers.

- **JWT Authentication**
    - Makes a separate HTTP request to a `tokenUrl` to obtain a token.
    - Supports passing headers and JSON body to the token endpoint.
    - Extracts token from the response field (e.g., `token`, `access_token`).
    - Attaches token with optional prefix (e.g., `Bearer`).

---

## 4. Request and Response Logging

- For every API call (including token requests), log the following:
    - `dataSourceName`
    - `timestamp`
    - **Token Request (if applicable):**
        - `tokenRequestBody`, `tokenRequestHeaders`, `tokenResponseBody`
    - **Main Request:**
        - `mainRequestBody`, `mainRequestHeaders`, `mainRequestParams`, `mainResponseBody`
    - `success` flag

- Stored in a table named `api_call_log`.

---

## 5. Database-Backed Config Store

- Configurations are persisted in a `configs` table with:
    - `id`, `dataSourceName`, `config` (as JSON), `createdAt`

---

## 6. Additional Features

- **Error Handling**
    - If a config is missing or a call fails (e.g., timeout, 401, etc.), return a meaningful error message with status code.
    - Log errors to `api_call_log`.

- **Formatted Output**
    - Main response is returned with pretty JSON formatting.
