# User API Spec

## GET User

Endpoint : GET /api/user/profile/{username}

Response Body (Success) :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get user success",
  "data": {
    "id": 1,
    "username": "john",
    "email": "john.doe@gmail.com",
    "name": "John Doe",
    "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
    "role": "User"
  }
}
```

Response Body (Failed) :

```json
{
  "status": false,
  "statusCode": 404,
  "message": "Failed to get user",
  "errors": "User not found"
}
```

## List User

Endpoint : GET /api/user (Admin Only)

Request Header :

- Authorization : token

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list user success",
  "data": [
    {
      "id": 1,
      "username": "john",
      "email": "john.doe@gmail.com",
      "name": "John Doe",
      "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
      "role": "User"
    },
    {
      "id": 2,
      "username": "alice",
      "email": "alice.smith@gmail.com",
      "name": "Alice Smith",
      "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
      "role": "User"
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

## Update User

Endpoint : PATCH /api/user/profile/{username}

Request Header :

- Authorization : token
- Content-Type: `multipart/form-data`

Request Body :

- username: (string, optional)
- password: (string, optional)
- name: (string, optional)
- profile_picture: (file, optional)

```json
{
  "name": "Bob Brown",
  "password": "rahasia123",
  "profile_picture": (file: avatar.jpg)
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Update user success",
  "data": {
    "id": 1,
    "username": "bob",
    "email": "john.doe@gmail.com",
    "name": "Bob Brown",
    "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
    "role": "User"
  }
}
```

## Delete User

Endpoint : DELETE /api/user/{userId} (Admin Only)

Request Header :

- Authorization : token

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Delete user success",
  "data": true
}
```
