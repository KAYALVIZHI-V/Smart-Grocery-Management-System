package com.grocery.smart_grocery.Controller;

import com.grocery.smart_grocery.Repository.GroceryItemRepository;
import com.grocery.smart_grocery.entity.GroceryItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private GroceryItemRepository groceryItemRepository;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {

        Map<String, Object> stats = new HashMap<>();

        List<GroceryItem> allItems =
                groceryItemRepository.findAll();

        List<GroceryItem> expiredItems =
                groceryItemRepository.findByExpiryDateBefore(
                        LocalDate.now()
                );

        List<GroceryItem> expiringSoon =
                groceryItemRepository.findByExpiryDateBetween(
                        LocalDate.now(),
                        LocalDate.now().plusDays(3)
                );

        stats.put("totalItems", allItems.size());

        stats.put("expiredItems", expiredItems.size());

        stats.put("expiringSoon", expiringSoon.size());

        return stats;
    }
}