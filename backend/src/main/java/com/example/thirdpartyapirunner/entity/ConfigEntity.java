package com.example.thirdpartyapirunner.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "configs", uniqueConstraints = @UniqueConstraint(columnNames = "dataSourceName"))
public class ConfigEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dataSourceName;

    private LocalDateTime createdAt;

    @Lob
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode config;

}

