package com.examly.springapp.controller;

import com.examly.springapp.model.*;
import com.examly.springapp.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
class OrderControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private OrderService orderService;

    private Order sampleOrder;
    private OrderItem item1;
    private Product product;

    @BeforeEach
    void setup() {
        product = new Product();
        product.setId(1L);
        product.setName("Apple");
        product.setPrice(2.5);
        product.setStockQuantity(10);
        product.setCategory("Fruits");

        item1 = new OrderItem();
        item1.setId(101L);
        item1.setProduct(product);
        item1.setOrder(null);
        item1.setQuantity(2);
        item1.setSubtotal(5.0);

        sampleOrder = new Order();
        sampleOrder.setId(77L);
        sampleOrder.setCustomerName("John Doe");
        sampleOrder.setCustomerEmail("john@example.com");
        sampleOrder.setOrderDate(LocalDateTime.now());
        sampleOrder.setStatus("PENDING");
        sampleOrder.setTotalAmount(5.0);
        sampleOrder.setOrderItems(Arrays.asList(item1));
    }

    @Test
    void testCreateOrder() throws Exception {
        Mockito.when(orderService.createOrder(any(Order.class))).thenReturn(sampleOrder);
        String json = "{" +
                "\"customerName\":\"John Doe\"," +
                "\"customerEmail\":\"john@example.com\"," +
                "\"orderItems\":[{" +
                "\"product\": {\"id\":1}," +
                "\"quantity\":2" +
                "}]" +
                "}";
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(77)))
                .andExpect(jsonPath("$.orderItems[0].quantity", is(2)))
                .andExpect(jsonPath("$.customerName", is("John Doe")));
    }

    @Test
    void testOrderWithInsufficientStock() throws Exception {
        Mockito.when(orderService.createOrder(any(Order.class)))
                .thenThrow(new RuntimeException("Ordered quantity exceeds available stock for product: Apple"));
        String json = "{" +
                "\"customerName\":\"John Doe\"," +
                "\"customerEmail\":\"john@example.com\"," +
                "\"orderItems\":[{" +
                "\"product\": {\"id\":1}," +
                "\"quantity\":22" +
                "}]" +
                "}";
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Ordered quantity exceeds available stock")));
    }

    @Test
    void testGetOrderByIdNotFound() throws Exception {
        Mockito.when(orderService.getOrderById(123L)).thenReturn(Optional.empty());
        mockMvc.perform(get("/api/orders/123"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Order not found")));
    }

    @Test
    void testGetOrderByIdFound() throws Exception {
        Mockito.when(orderService.getOrderById(77L)).thenReturn(Optional.of(sampleOrder));
        mockMvc.perform(get("/api/orders/77"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(77)))
                .andExpect(jsonPath("$.customerEmail", is("john@example.com")));
    }
}
