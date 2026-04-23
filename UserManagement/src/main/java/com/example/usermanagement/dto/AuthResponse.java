package com.example.usermanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Integer id;
    private String role;
    private String name;
    private String username;
    private String password;
    private String email;
    private String phone;
}