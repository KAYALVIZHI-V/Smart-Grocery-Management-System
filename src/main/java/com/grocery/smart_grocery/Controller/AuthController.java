package com.grocery.smart_grocery.Controller;

import com.grocery.smart_grocery.Repository.UserRepository;
import com.grocery.smart_grocery.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody User user) {

        Map<String, Object> res = new HashMap<>();

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            res.put("success", false);
            res.put("message", "Email already registered");
            return res;
        }

        User saved = userRepository.save(user);

        res.put("success", true);
        res.put("message", "Signup successful");
        res.put("user", saved);

        return res;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {

        Map<String, Object> res = new HashMap<>();

        Optional<User> user =
                userRepository.findByEmail(body.get("email"));

        if (user.isPresent()
                && user.get().getPassword()
                .equals(body.get("password"))) {

            res.put("success", true);
            res.put("user", user.get());

        } else {

            res.put("success", false);
            res.put("message", "Invalid email or password");
        }

        return res;
    }
}