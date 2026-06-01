package com.grocery.smart_grocery.Repository;

import com.grocery.smart_grocery.entity.GroceryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface GroceryItemRepository
        extends JpaRepository<GroceryItem, Long> {

    List<GroceryItem> findByCategoryId(Long categoryId);

    List<GroceryItem> findByExpiryDateBefore(LocalDate date);

    List<GroceryItem> findByExpiryDateBetween(
            LocalDate start,
            LocalDate end
    );
}