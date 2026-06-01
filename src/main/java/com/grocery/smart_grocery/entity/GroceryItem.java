package com.grocery.smart_grocery.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "grocery_items")
public class GroceryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private int quantity;

    private LocalDate expiryDate;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}