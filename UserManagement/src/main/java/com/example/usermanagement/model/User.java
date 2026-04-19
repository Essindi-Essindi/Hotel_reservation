package com.example.usermanagement.model;

import com.example.usermanagement.dto.UserDto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String role;

    public UserDto toDto() {
        return UserDto.builder()
                .id(this.id)
                .name(this.name)
                .role(this.role)
                .build();
    }

}
