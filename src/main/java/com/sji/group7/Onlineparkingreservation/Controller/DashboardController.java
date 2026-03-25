package com.sji.group7.Onlineparkingreservation.controller;

import com.sji.group7.Onlineparkingreservation.service.PricingService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class DashboardController {
    @Autowired
    private PricingService pricingService;

    @GetMapping("/Admin/Admin/{adminId}")
    public String adminDashboard(HttpSession session, Model model, @PathVariable Integer adminId) {
        int price = (int) pricingService.getHourlyRate();
        model.addAttribute("price", price);

        // The welcomeMessage is set in the session on login success
        // It can be accessed in Thymeleaf via session.welcomeMessage
        return "Admin/Admin"; // this corresponds to admin_dashboard.html template
    }
}
