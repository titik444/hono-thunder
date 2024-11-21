# Category API Spec

## List Room Category (Admin Only)

Endpoint : GET /api/room-category

Request Header :

- Authorization : token

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list room category success",
  "data": [
    {
      "id": 1,
      "name": "General"
    },
    {
      "id": 2,
      "name": "Entertainment"
    },
    {
      "id": 3,
      "name": "Education"
    },
    {
      "id": 4,
      "name": "Film"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalPages": 5,
    "totalItems": 50
  }
}
```

## Create Room Category (Admin Only)

Endpoint : POST /api/room-category

Request Header :

- Authorization : token

Request Body :

```json
{
  "name": "Film"
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Create room category success",
  "data": {
    "id": 4,
    "name": "Film"
  }
}
```
