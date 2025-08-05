package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Size(max = 100)
  @Column(nullable = false, length = 100)
  private String name;

  @Size(max = 500)
  @Column(length = 500)
  private String description;

  @NotNull
  @Positive
  @Column(nullable = false)
  private Double price;

  @NotNull
  @Min(0)
  @Column(nullable = false)
  private Integer stockQuantity;

  @NotNull
  @Column(nullable = false)
  private String category;

  private String imageUrl;

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name != null ? name.trim() : null; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public Double getPrice() { return price; }
  public void setPrice(Double price) { this.price = price; }

  public Integer getStockQuantity() { return stockQuantity; }
  public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

  public String getCategory() { return category != null ? category.trim() : null; }
  public void setCategory(String category) { this.category = category; }

  public String getImageUrl() { return imageUrl; }
  public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}

