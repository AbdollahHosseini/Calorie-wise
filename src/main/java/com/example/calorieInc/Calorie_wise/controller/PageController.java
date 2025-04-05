package com.example.calorieInc.Calorie_wise.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";  // Spring will look for templates/login.html
    }

    @GetMapping("/register")
    public String showRegisterPage() {
        return "register";
    }
}