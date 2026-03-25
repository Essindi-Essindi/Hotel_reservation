package com.sji.group7.Onlineparkingreservation.controller.payment;

import com.sji.group7.Onlineparkingreservation.model.User;
import com.sji.group7.Onlineparkingreservation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PaymentRedirectController {
    @Autowired
    private UserService userService;

    @GetMapping("/payment-success/{userId}")
    public String paymentSuccess(@PathVariable Integer userId, Model model) {
        User user = userService.getUserById(userId);
        model.addAttribute("user", user);
        return "payment-success";
    }

    @GetMapping("/payment-cancel/{userId}")
    public String paymentCancel(@PathVariable Integer userId ,Model model) {
        User user = userService.getUserById(userId);
        model.addAttribute("user", user);
        return "payment-cancel";
    }

    @GetMapping("/pay-redirect/{userId}")
    public String paymentRedirect(@PathVariable Integer userId, Model model) {
        User user = userService.getUserById(userId);
        model.addAttribute("user", user);
        return "User/reservation";
    }
}

