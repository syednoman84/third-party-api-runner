package com.example.thirdpartyapirunner.repository;

import com.example.thirdpartyapirunner.entity.ConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConfigRepository extends JpaRepository<ConfigEntity, Long> {
    Optional<ConfigEntity> findByDataSourceName(String dataSourceName);
    boolean existsByDataSourceName(String dataSourceName);

}
