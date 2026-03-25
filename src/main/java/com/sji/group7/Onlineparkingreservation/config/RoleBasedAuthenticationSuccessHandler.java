package com.sji.group7.Onlineparkingreservation.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;

@Component
public class RoleBasedAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String redirectURL = "/login";

        int userId = getUserIdFromAuthentication(authentication);

        for (GrantedAuthority authority : authorities) {
            if (authority.getAuthority().equals("ADMIN")) {
                redirectURL = "/Admin/Admin" + "/" + userId;
                break;
            } else if (authority.getAuthority().equals("USER")) {
                redirectURL = "/reservation" + "/" + userId;
                break;
            }
        }

        response.sendRedirect(redirectURL);
    }

    private Integer getUserIdFromAuthentication(Authentication authentication) {
        if (authentication.getPrincipal() instanceof CustomUserDetails customDetails) {
            return customDetails.getUserId();  // Clean access to the ID
        }
        throw new IllegalStateException("Unsupported principal type");
    }
}
