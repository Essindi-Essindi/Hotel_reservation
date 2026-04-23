package com.example.usermanagement.service;

import com.example.usermanagement.dto.AuthResponse;
import com.example.usermanagement.dto.LoginRequest;
import com.example.usermanagement.dto.RegisterRequest;
import com.example.usermanagement.model.Role;
import com.example.usermanagement.model.User;
import com.example.usermanagement.repository.UserRepository;
import com.example.usermanagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already in use!");
    }

    User user = User.builder()
            .name(request.getName())
            .username(request.getUsername())
            .email(request.getEmail())
            .phone(request.getPhone())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.GUEST)  // enum value
            .build();

    userRepository.save(user);

    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    return new AuthResponse(token, user.getRole().name(), user.getEmail());
}

public AuthResponse registerAdmin(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already in use!");
    }

    User user = User.builder()
            .name(request.getName())
            .username(request.getUsername())
            .email(request.getEmail())
            .phone(request.getPhone())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.ADMIN)  
            .build();

    userRepository.save(user);

    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    return new AuthResponse(token, user.getRole().name(), user.getEmail());
}

public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found!"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid password!");
    }

    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    return new AuthResponse(token, user.getRole().name(), user.getEmail());
}
}