package com.example.thirdpartyapirunner.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class DataSourceConfigLoader {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public JsonNode loadConfig(String dataSourceName) throws IOException {
        ClassPathResource resource = new ClassPathResource("config/" + dataSourceName + ".json");
        return objectMapper.readTree(resource.getInputStream());
    }
}

