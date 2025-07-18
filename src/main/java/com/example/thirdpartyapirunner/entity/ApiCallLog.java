package com.example.thirdpartyapirunner.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ApiCallLog {

    @Id
    private String uuid;

    private String dataSourceName;

    @Lob
    private String tokenRequestHeaders;

    @Lob
    private String tokenRequestParams;

    @Lob
    private String mainRequestHeaders;

    @Lob
    private String mainRequestParams;

    @Lob
    private String tokenRequestBody;

    @Lob
    private String mainRequestBody;

    @Lob
    private String mainResponseBody;

    @Lob
    private String tokenResponseBody;

    private boolean success;

    private LocalDateTime timestamp;
}
