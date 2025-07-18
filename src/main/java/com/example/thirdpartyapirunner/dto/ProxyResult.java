package com.example.thirdpartyapirunner.dto;

import lombok.Data;

@Data
public class ProxyResult {
    private String mainResponseBody;
    private String tokenResponseBody;
    private boolean success;
    private String errorMessage;
}
