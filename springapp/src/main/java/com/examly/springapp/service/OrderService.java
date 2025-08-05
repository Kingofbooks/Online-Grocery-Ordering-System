package com.examly.springapp.service;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OrderService {

  private final OrderRepository orderRepository;
  private final ProductRepository productRepository;

  @Autowired
  public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  @Transactional
  public Order createOrder(Order order) {
    if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
      throw new RuntimeException("Order must contain at least one item");
    }

    double total = 0.0;

    for (OrderItem item : order.getOrderItems()) {
      Product product = productRepository.findById(item.getProduct().getId())
          .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getId()));

      if (item.getQuantity() <= 0) {
        throw new RuntimeException("Quantity must be positive for product: " + product.getName());
      }

      if (item.getQuantity() > product.getStockQuantity()) {
        throw new RuntimeException("Ordered quantity exceeds available stock for product: " + product.getName());
      }

      // Decrease stock
      product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
      productRepository.save(product);

      // Set calculated subtotal
      item.setSubtotal(product.getPrice() * item.getQuantity());

      // Link to order
      item.setOrder(order);

      // Add to total
      total += item.getSubtotal();
    }

    order.setTotalAmount(total);
    order.setOrderDate(LocalDateTime.now());
    order.setStatus("CONFIRMED");

    return orderRepository.save(order);
  }

  public Optional<Order> getOrderById(Long id) {
    return orderRepository.findById(id);
  }
}

