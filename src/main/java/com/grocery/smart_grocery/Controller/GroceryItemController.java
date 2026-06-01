package com.grocery.smart_grocery.Controller;

import com.grocery.smart_grocery.Repository.GroceryItemRepository;
import com.grocery.smart_grocery.entity.GroceryItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.DeleteMapping;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class GroceryItemController {

    @Autowired
    private GroceryItemRepository groceryItemRepository;

    // ADD ITEM
    @PostMapping("/add")
    public GroceryItem addItem(@RequestBody GroceryItem item) {
        return groceryItemRepository.save(item);
    }

    // GET ITEMS BY CATEGORY
    @GetMapping("/category/{categoryId}")
    public List<GroceryItem> getItemsByCategory(
            @PathVariable Long categoryId
    ) {
        return groceryItemRepository.findByCategoryId(categoryId);
    }

    // EXPIRED ITEMS
    @GetMapping("/expired")
    public List<GroceryItem> getExpiredItems() {

        return groceryItemRepository
                .findByExpiryDateBefore(LocalDate.now());
    }

    // EXPIRING SOON
    @GetMapping("/expiring")
    public List<GroceryItem> getExpiringSoonItems() {

        LocalDate today = LocalDate.now();

        LocalDate next3Days = today.plusDays(3);

        return groceryItemRepository
                .findByExpiryDateBetween(today, next3Days);
    }

    // ALL ITEMS
    @GetMapping("/all")
    public List<GroceryItem> getAllItems() {
        return groceryItemRepository.findAll();
    }


    @DeleteMapping("/delete/{id}")
    public void deleteItem(@PathVariable Long id){
        groceryItemRepository.deleteById(id);
    }
};