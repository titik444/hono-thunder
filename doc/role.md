# Role API Spec

## List Role (Admin Only)

Endpoint : GET /api/role

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

## Create Role (Admin Only)

Endpoint : POST /api/role

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
