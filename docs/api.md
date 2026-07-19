# API Documentation

## Product Service

### Create Product

POST /products

Request

```json
{
  "name": "iPhone 17",
  "description": "Latest Apple smartphone",
  "price": 1200,
  "stock": 20,
  "categoryId": 1
}
```

Response

```json
{
  "id": 1,
  "name": "iPhone 17"
}
```

---

### Update Product

PUT /products/:id

---

### Delete Product

DELETE /products/:id

---

### Get Products

GET /products?page=1&limit=10

---

## Search Service

### Search Product

GET /search?q=iphone

Example

GET /search?q=iphone&page=1&limit=10

Response

```json
{
  "items": [
    {
      "id": 1,
      "name": "iPhone 17",
      "score": 2.34
    }
  ]
}
```

---

### Filter

GET /search?category=phone

---

### Sort

GET /search?sort=price:asc

---

### Price Range

GET /search?minPrice=100&maxPrice=1000

---

### Combined

GET /search?q=iphone&category=phone&sort=price:desc&page=1