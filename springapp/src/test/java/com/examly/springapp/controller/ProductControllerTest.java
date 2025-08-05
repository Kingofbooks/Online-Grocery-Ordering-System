package com.examly.springapp.controller;

import com.examly.springapp.model.Product;
import com.examly.springapp.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Arrays;
import java.util.Optional;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private ProductService productService;

    private Product product1;
    private Product product2;

    @BeforeEach
    void setup() {
        product1 = new Product();
        product1.setId(1L);
        product1.setName("Apple");
        product1.setCategory("Fruits");
        product1.setPrice(2.5);
        product1.setStockQuantity(10);

        product2 = new Product();
        product2.setId(2L);
        product2.setName("Milk");
        product2.setCategory("Dairy");
        product2.setPrice(1.5);
        product2.setStockQuantity(0);
    }

    @Test
    void testGetAllProducts() throws Exception {
        Mockito.when(productService.getAllProducts()).thenReturn(Arrays.asList(product1, product2));
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name", is("Apple")))
                .andExpect(jsonPath("$[1].stockQuantity", is(0)));
    }

    @Test
    void testCreateProduct() throws Exception {
        Product prod = new Product();
        prod.setName("Banana");
        prod.setCategory("Fruits");
        prod.setPrice(1.2);
        prod.setStockQuantity(15);

        Mockito.when(productService.createProduct(any(Product.class))).thenAnswer(i -> {
            Product p = i.getArgument(0);
            p.setId(23L);
            return p;
        });

        String prodJson = "{" +
                "\"name\":\"Banana\"," +
                "\"category\":\"Fruits\"," +
                "\"price\":1.2," +
                "\"stockQuantity\":15" +
                "}";
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(prodJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(23)))
                .andExpect(jsonPath("$.name", is("Banana")));
    }

    @Test
    void testGetProductsByCategory() throws Exception {
        Mockito.when(productService.getProductsByCategory(eq("Fruits"))).thenReturn(Arrays.asList(product1));
        mockMvc.perform(get("/api/products/category/Fruits"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category", is("Fruits")));
    }
}
