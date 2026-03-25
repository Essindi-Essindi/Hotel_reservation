package com.sji.group7.Onlineparkingreservation.controller;

import com.sji.group7.Onlineparkingreservation.dtos.UserDto;
import com.sji.group7.Onlineparkingreservation.model.User;
import com.sji.group7.Onlineparkingreservation.service.PricingService;
import com.sji.group7.Onlineparkingreservation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PricingService pricingService;

    @GetMapping("/")
    public String landingPage(){
        return "index";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/logout")
    public String logout(){
        return "login";
    }

    @GetMapping("/signup")
    public String signUpForm(Model model) {
        model.addAttribute("user", new User());
        return "signup";
    }

    @GetMapping("/Terms-and-policy")
    public String termsAndPolicy(Model model) {
        model.addAttribute("user", new User());
        return "Terms-and-policy";
    }

    @PostMapping("/signup")
    public String registerUser(@ModelAttribute("user") User user, Model model) {
        if (userService.userExists(user.getEmail())) {
            model.addAttribute("error", "Email already exists.");
            return "signup";
        }

        userService.registerUser(user);
        return "redirect:/login";
    }

    @GetMapping("/reservation/{userId}")
    public String reservation(@PathVariable int userId,  Model model) {
        User user = userService.getUserById(userId);
        UserDto userDto = user.toDto();

        double price = pricingService.getHourlyRate();

        model.addAttribute("user", userDto);
        model.addAttribute("price", price);
        return "User/reservation";
    }

    @GetMapping("/history/{userId}")
    public String historyPage(@PathVariable int userId, Model model) {
        User user = userService.getUserById(userId);
        UserDto userDto = user.toDto();
        model.addAttribute("user", userDto);
        return "User/history";
    }
}
