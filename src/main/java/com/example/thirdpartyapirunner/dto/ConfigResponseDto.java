package com.example.thirdpartyapirunner.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ConfigResponseDto {
    private String dataSourceName;
    private JsonNode config;
    private LocalDateTime createdAt;
}

