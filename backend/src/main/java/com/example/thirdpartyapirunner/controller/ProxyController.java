package com.example.thirdpartyapirunner.controller;

import com.example.thirdpartyapirunner.dto.ProxyResult;
import com.example.thirdpartyapirunner.service.ProxyService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/proxy")
@RequiredArgsConstructor
public class ProxyController {

    private final ProxyService proxyService;

    @GetMapping("/{dataSourceName}")
    public ResponseEntity<String> proxy(
            @PathVariable String dataSourceName,
            HttpServletRequest request,
            @RequestParam Map<String, String> allParams
    ) {
        ProxyResult result = proxyService.handleRequest(dataSourceName, request, allParams);
        if (result.isSuccess()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(result.getMainResponseBody());
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed: " + result.getErrorMessage());
        }
    }

}

