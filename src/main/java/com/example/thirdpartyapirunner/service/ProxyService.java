package com.example.thirdpartyapirunner.service;

import com.example.thirdpartyapirunner.config.DataSourceConfigLoader;
import com.example.thirdpartyapirunner.dto.ProxyResult;
import com.example.thirdpartyapirunner.entity.ApiCallLog;
import com.example.thirdpartyapirunner.entity.ConfigEntity;
import com.example.thirdpartyapirunner.repository.ApiCallLogRepository;
import com.example.thirdpartyapirunner.repository.ConfigRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProxyService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final DataSourceConfigLoader configLoader;
    private final ApiCallLogRepository logRepository;
    private final ConfigRepository configRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProxyResult handleRequest(String dataSourceName, HttpServletRequest request, Map<String, String> allParams) {
        ApiCallLog log = new ApiCallLog();
        log.setUuid(UUID.randomUUID().toString());
        log.setTimestamp(LocalDateTime.now());
        log.setDataSourceName(dataSourceName);

        String tokenRequestBody = null;
        String tokenResponseBody = null;
        String tokenRequestHeaders = null;

        String mainRequestBody = null;
        String mainResponseBody = null;
        String mainRequestHeaders = null;

        ProxyResult result = new ProxyResult();

        try {
            ConfigEntity configEntity = configRepository.findByDataSourceName(dataSourceName)
                    .orElseThrow(() -> new RuntimeException("Config not found for: " + dataSourceName));

            JsonNode config = configEntity.getConfig();

            String url = config.get("url").asText();
            String method = config.get("method").asText().toUpperCase();

            HttpHeaders headers = new HttpHeaders();

            // Add custom headers from config
            if (config.has("headers")) {
                config.get("headers").fields().forEachRemaining(e -> headers.add(e.getKey(), e.getValue().asText()));
            }

            // Add default parameters from config
            if (config.has("defaultParams")) {
                config.get("defaultParams").fields().forEachRemaining(e -> {
                    allParams.putIfAbsent(e.getKey(), e.getValue().asText());
                });
            }

            // --- Authentication ---
            if (config.has("auth")) {
                JsonNode auth = config.get("auth");
                String type = auth.get("type").asText();

                if ("basic".equalsIgnoreCase(type)) {
                    String creds = auth.get("username").asText() + ":" + auth.get("password").asText();
                    String encoded = Base64.getEncoder().encodeToString(creds.getBytes());
                    headers.set("Authorization", "Basic " + encoded);
                } else if ("jwt".equalsIgnoreCase(type)) {
                    HttpHeaders authHeaders = new HttpHeaders();

                    if (auth.has("headers")) {
                        auth.get("headers").fields().forEachRemaining(e -> authHeaders.add(e.getKey(), e.getValue().asText()));
                    }

                    if (!authHeaders.containsKey(HttpHeaders.CONTENT_TYPE)) {
                        authHeaders.setContentType(MediaType.APPLICATION_JSON);
                    }

                    String tokenUrl = auth.get("tokenUrl").asText();
                    String tokenMethod = auth.has("method") ? auth.get("method").asText().toUpperCase() : "POST";

                    HttpEntity<String> authRequest;
                    if (auth.has("body")) {
                        tokenRequestBody = objectMapper.writeValueAsString(auth.get("body"));
                        authRequest = new HttpEntity<>(tokenRequestBody, authHeaders);
                    } else {
                        authRequest = new HttpEntity<>(authHeaders);
                    }

                    tokenRequestHeaders = authHeaders.toString();

                    ResponseEntity<String> tokenResponse = restTemplate.exchange(
                            tokenUrl,
                            HttpMethod.valueOf(tokenMethod),
                            authRequest,
                            String.class
                    );

                    tokenResponseBody = tokenResponse.getBody();

                    JsonNode tokenBody = objectMapper.readTree(tokenResponseBody);
                    String token = tokenBody.get(auth.get("tokenField").asText()).asText();
                    String prefix = auth.has("tokenPrefix") ? auth.get("tokenPrefix").asText() + " " : "";
                    headers.set("Authorization", prefix + token);
                }
            }

            // --- Prepare Main Request ---
            URI targetUri = UriComponentsBuilder
                    .fromHttpUrl(url)
                    .queryParams(new LinkedMultiValueMap<>(Map.ofEntries(allParams.entrySet().stream().map(
                            e -> Map.entry(e.getKey(), java.util.List.of(e.getValue()))
                    ).toArray(Map.Entry[]::new))))
                    .build(true)
                    .toUri();

            HttpEntity<String> entity;
            if (!method.equals("GET") && config.has("mainBody")) {
                mainRequestBody = objectMapper.writeValueAsString(config.get("mainBody"));
                entity = new HttpEntity<>(mainRequestBody, headers);
            } else {
                entity = new HttpEntity<>(null, headers);
            }

            mainRequestHeaders = headers.toString();
            ResponseEntity<String> response = restTemplate.exchange(targetUri, HttpMethod.valueOf(method), entity, String.class);
            mainResponseBody = response.getBody();

            // --- Logging ---
            log.setTokenRequestBody(tokenRequestBody);
            log.setTokenResponseBody(tokenResponseBody);
            log.setTokenRequestHeaders(tokenRequestHeaders);
            log.setTokenRequestParams(""); // JWT typically doesn’t have query params

            log.setMainRequestBody(mainRequestBody);
            log.setMainResponseBody(mainResponseBody);
            log.setMainRequestHeaders(mainRequestHeaders);
            log.setMainRequestParams(allParams.toString());

            log.setSuccess(true);
            logRepository.save(log);

            result.setMainResponseBody(mainResponseBody);
            result.setTokenResponseBody(tokenResponseBody);
            result.setSuccess(true);
            return result;

        } catch (Exception ex) {
            log.setSuccess(false);
            log.setTokenRequestBody(tokenRequestBody);
            log.setTokenResponseBody(tokenResponseBody);
            log.setTokenRequestHeaders(tokenRequestHeaders);
            log.setTokenRequestParams("");

            log.setMainRequestBody(mainRequestBody);
            log.setMainResponseBody("ERROR: " + ex.getMessage());
            log.setMainRequestHeaders(mainRequestHeaders);
            log.setMainRequestParams(allParams.toString());

            logRepository.save(log);

            result.setMainResponseBody(null);
            result.setTokenResponseBody(tokenResponseBody);
            result.setErrorMessage(ex.getMessage());
            result.setSuccess(false);
            return result;
        }
    }
}
