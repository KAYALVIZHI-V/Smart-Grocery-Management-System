package com.grocery.smart_grocery.Repository;

import com.grocery.smart_grocery.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}