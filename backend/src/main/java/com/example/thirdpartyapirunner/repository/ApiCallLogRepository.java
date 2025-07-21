package com.example.thirdpartyapirunner.repository;


import com.example.thirdpartyapirunner.entity.ApiCallLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface    ApiCallLogRepository extends JpaRepository<ApiCallLog, String> {
}
