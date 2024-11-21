# Room Type API Spec

## List Room Type (Admin Only)

Endpoint : GET /api/room-type

Request Header :

- Authorization : token

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list room type success",
  "data": [
    {
      "id": 1,
      "name": "Region"
    },
    {
      "id": 2,
      "name": "Genre"
    },
    {
      "id": 3,
      "name": "Studio"
    },
    {
      "id": 4,
      "name": "Fandom"
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

## Create Room Type (Admin Only)

Endpoint : POST /api/room-type

Request Header :

- Authorization : token

Request Body :

```json
{
  "name": "Genre"
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Create room type success",
  "data": {
    "id": 2,
    "name": "Genre"
  }
}
```
