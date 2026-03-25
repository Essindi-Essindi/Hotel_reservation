package com.sji.group7.Onlineparkingreservation.controller.payment;

import com.sji.group7.Onlineparkingreservation.model.User;
import com.sji.group7.Onlineparkingreservation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class CheckoutViewController {
    @Autowired
    private UserService userService;

    @GetMapping("/checkout/{userId}")
    public String checkoutPage(@PathVariable Integer userId, Model model) {
        User user = userService.getUserById(userId);
        model.addAttribute("user", user);
        return "/stripe"; // Returns checkout.html from templates folder
    }
}
