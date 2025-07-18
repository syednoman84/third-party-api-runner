package com.example.thirdpartyapirunner.controller;

import com.example.thirdpartyapirunner.dto.ConfigResponseDto;
import com.example.thirdpartyapirunner.entity.ConfigEntity;
import com.example.thirdpartyapirunner.repository.ConfigRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/configs")
@RequiredArgsConstructor
public class ConfigController {

    private final ConfigRepository configRepository;

    // 1. Add new config (with duplicate check)
    @PostMapping("/add/{dataSourceName}")
    public ResponseEntity<?> saveConfig(
            @PathVariable String dataSourceName,
            @RequestBody JsonNode configJson
    ) {
        if (configRepository.existsByDataSourceName(dataSourceName)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Data source with name '" + dataSourceName + "' already exists.");
        }

        ConfigEntity config = new ConfigEntity();
        config.setDataSourceName(dataSourceName);
        config.setCreatedAt(LocalDateTime.now());
        config.setConfig(configJson);
        configRepository.save(config);

        return ResponseEntity.ok("Config saved for: " + dataSourceName);
    }

    // 2. Update existing config
    @PutMapping("/update/{dataSourceName}")
    public ResponseEntity<?> updateConfig(
            @PathVariable String dataSourceName,
            @RequestBody JsonNode updatedConfig
    ) {
        Optional<ConfigEntity> optionalConfig = configRepository.findByDataSourceName(dataSourceName);
        if (optionalConfig.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Config not found for: " + dataSourceName);
        }

        ConfigEntity config = optionalConfig.get();
        config.setConfig(updatedConfig);
        configRepository.save(config);

        return ResponseEntity.ok("Config updated for: " + dataSourceName);
    }

    // 3. Delete config
    @DeleteMapping("/delete/{dataSourceName}")
    public ResponseEntity<?> deleteConfig(@PathVariable String dataSourceName) {
        Optional<ConfigEntity> optionalConfig = configRepository.findByDataSourceName(dataSourceName);
        if (optionalConfig.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Config not found for: " + dataSourceName);
        }

        configRepository.delete(optionalConfig.get());
        return ResponseEntity.ok("Config deleted for: " + dataSourceName);
    }

    @GetMapping("/{dataSourceName}")
    public ResponseEntity<?> getConfigByName(@PathVariable String dataSourceName) {
        return configRepository.findByDataSourceName(dataSourceName)
                .<ResponseEntity<?>>map(config -> ResponseEntity.ok(
                        new ConfigResponseDto(
                                config.getDataSourceName(),
                                config.getConfig(),
                                config.getCreatedAt()
                        )
                ))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Config not found for: " + dataSourceName)));
    }






}
