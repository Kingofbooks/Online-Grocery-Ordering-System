package com.examly.springapp.controller;

import com.examly.springapp.model.Product;
import com.examly.springapp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
  private final ProductService productService;

  @Autowired
  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping
  public ResponseEntity<List<Product>> getAllProducts() {
    return ResponseEntity.ok(productService.getAllProducts());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Product> getProductById(@PathVariable Long id) {
    Product product = productService.getProductById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    return ResponseEntity.ok(product);
  }

  @PostMapping
  public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
    Product created = productService.createProduct(product);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @GetMapping("/category/{category}")
  public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
    List<Product> products = productService.getProductsByCategory(category);
    return ResponseEntity.ok(products);
  }

  // Optional: Keep if you want to return a JSON message object instead of plain string error
  static class ErrorResponse {
    private String message;

    public ErrorResponse(String message) { this.message = message; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
  }
}

