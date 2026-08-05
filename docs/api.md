# API Documentation

---

## List

- [Product Service](#product-service)
  - [Products](#create-product)
  - [Categories](#create-category)
- [Search Service](#search-service)
  - [Search](#search-product)

---

## Product Service

### Create Product

```
POST /api/products
```

**Request Body**

```json
{
  "name": "iPhone 17",
  "description": "Latest Apple smartphone",
  "slug": "iphone-17",
  "price": 1200,
  "stock": 20,
  "categoryId": "cuid...."
}
```

**Response**

`201 Created`

```json
{
  "data": {
    "id": "cuid....",
    "name": "iPhone 17",
    "description": "Latest Apple smartphone",
    "slug": "iphone-17",
    "price": 1200,
    "stock": 20,
    "categoryId": "cuid....",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

---

### Update Product

```
PATCH /api/products/:id
```

**Request Body**

```json
{
  "description": "Latest Apple smartphone with 512GB storage"
}
```

**Response**

`200 Ok`

```json
{
  "data": {
    "id": "cuid....",
    "name": "iPhone 17",
    "description": "Latest Apple smartphone with 512GB storage",
    "slug": "iphone-17",
    "price": 1200,
    "stock": 20,
    "categoryId": 1,
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

---

### Delete Product

```
DELETE /api/products/:id
```

**Response**

`200 Ok`

```json
{
  "message": "Delete product successfully!"
}
```

---

### Get Product By Id

```
GET /api/products/:id
```

**Response**

`200 Ok`

```json
{
  "data": {
    "id": "cuid....",
    "name": "iPhone 17",
    "description": "Latest Apple smartphone",
    "slug": "iphone-17",
    "price": 1200,
    "stock": 20,
    "categoryId": "cuid....",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

---

### Get Products

> Direct from postgres without elasticsearch

```
GET /api/products
```

**Query Params**

| Param      | Type     | Validation                                                         |
| ---------- | -------- | ------------------------------------------------------------------ |
| `page`     | `number` | Optional default 1, min 1                                          |
| `limit`    | `number` | Optional default 10, min 1, max 50                                 |
| `search`   | `string` | Optional                                                           |
| `category` | `string` | Optional                                                           |
| `sortBy`   | `string` | Optional default `createdAt`, option: `name`, `price`, `createdAt` |
| `order`    | `string` | Optional default `desc`, option: `asc`, `desc`                     |

**Request Body**

```json
{
  "name": "iPhone 17",
  "description": "Latest Apple smartphone",
  "slug": "iphone-17",
  "price": 1200,
  "stock": 20,
  "categoryId": "cuid...."
}
```

**Response**

`200 Ok`

```json
{
  "data": [
    {
      "id": "cuid....",
      "name": "iPhone 17",
      "description": "Latest Apple smartphone",
      "slug": "iphone-17",
      "price": 1200,
      "stock": 20,
      "categoryId": "cuid....",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### Create Category

```
POST /api/categories
```

**Request Body**

```json
{
  "name": "Smartphone",
  "slug": "smartphone"
}
```

**Response**

`201 Created`

```json
{
  "data": {
    "id": "cuid....",
    "name": "Smartphone",
    "slug": "smartphone",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

---

### Update Product

```
PATCH /api/categories/:id
```

**Request Body**

```json
{
  "name": "Smartphone",
  "slug": "smartphone"
}
```

**Response**

`200 Ok`

```json
{
  "data": {
    "id": "cuid....",
    "name": "Smartphone",
    "slug": "smartphone",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

---

### Delete Product

```
DELETE /api/categories/:id
```

**Response**

`200 Ok`

```json
{
  "message": "Delete product successfully!"
}
```

---

### Get Category By Id

```
GET /api/categories/:id
```

**Response**

`200 Ok`

```json
{
  "data": {
    "id": "cuid....",
    "name": "Smartphone",
    "slug": "smartphone",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

---

### Get Categories

```
GET /api/categories
```

**Response**

`200 Ok`

```json
{
  "data": [
    {
      "id": "cuid....",
      "name": "Smartphone",
      "slug": "smartphone",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ]
}
```

---

## Search Service

### Search Product

> From elasticsearch

```
GET /api/products/search
```

**Query Params**

| Param      | Type      | Validation                                       |
| ---------- | --------- | ------------------------------------------------ |
| `q`        | `string`  | Optional                                         |
| `category` | `string`  | Optional                                         |
| `minPrice` | `number`  | Optional                                         |
| `maxPrice` | `number`  | Optional                                         |
| `inStock`  | `boolean` | Optional                                         |
| `sort`     | `string`  | Optional, option: `relevance`, `price`, `newest` |
| `order`    | `string`  | Optional, option: `asc`, `desc`                  |
| `page`     | `number`  | Optional default 1, min 1                        |
| `limit`    | `number`  | Optional default 20, min 1, max 50               |

**Example**

```
GET /api/products/search?page=1&limit=5&inStock=true&q=iphne
```

**Response**

```json
{
  "data": [
    {
      "id": "cuid....",
      "name": "iPhone 17",
      "slug": "iphone-17",
      "description": "Latest Apple smartphone",
      "price": 1200,
      "stock": 20,
      "category": {
        "id": "cuid....",
        "name": "Smartphone",
        "slug": "smartphone"
      },
      "highlight": {
        "name": ["<em>iPhone</em> 17"]
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "totalPages": 1
  },
  "facet": {
    "categories": [
      {
        "slug": "smartphone",
        "count": 2
      }
    ],
    "priceRanges": [
      {
        "key": "under_1m",
        "count": 0
      },
      {
        "key": "1m_5m",
        "count": 0
      },
      {
        "key": "5m_10m",
        "count": 0
      },
      {
        "key": "over_10m",
        "count": 2
      }
    ]
  }
}
```
