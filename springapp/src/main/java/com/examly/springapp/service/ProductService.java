package com.examly.springapp.service;

import com.examly.springapp.model.Product;
import com.examly.springapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
  private final ProductRepository productRepository;

  @Autowired
  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  public List<Product> getAllProducts() {
    return productRepository.findAll();
  }

  public Optional<Product> getProductById(Long id) {
    return productRepository.findById(id);
  }

  public Product createProduct(Product product) {
    // Validation handled by bean validation
    return productRepository.save(product);
  }

  public List<Product> getProductsByCategory(String category) {
    return productRepository.findByCategory(category);
  }

  public void reduceStock(Long productId, int amount) {
    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new RuntimeException("Product not found"));
    if (product.getStockQuantity() < amount) {
      throw new RuntimeException("Insufficient stock for product: " + product.getName());
    }
    product.setStockQuantity(product.getStockQuantity() - amount);
    productRepository.save(product);
  }
}

