package com.example.gateway.config;

import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;

@Component
public class JwtGatewayFilter implements  Ordered {

    @Override
    public int getOrder() {
        // Must be lowered (higher priority) than the security filter chain
        // Spring Security WebFilter sits at order -100 by default
        return -200;
    }
}
