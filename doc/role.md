# Role API Spec

## List Role

Endpoint : GET /api/role (Admin Only)

Request Header :

- Authorization : token

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list role success",
  "data": [
    {
      "id": 1,
      "name": "Admin"
    },
    {
      "id": 2,
      "name": "User"
    }
  ]
}
```

## Create Role

Endpoint : POST /api/role (Admin Only)

Request Header :

- Authorization : token

Request Body :

```json
{
  "name": "Admin"
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Create role success",
  "data": {
    "id": 1,
    "name": "Admin"
  }
}
```
