# Auth API Spec

## Register User

Endpoint : POST /api/auth/register

Request Body :

```json
{
  "username": "john",
  "email": "john.doe@gmail.com",
  "password": "rahasia",
  "name": "John Doe"
}
```

Response Body (Success) :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Register user success",
  "data": {
    "id": 1,
    "username": "john",
    "email": "john.doe@gmail.com",
    "name": "John Doe",
    "profilePicture": null,
    "role": "User",
    "accessToken": "token",
    "refreshToken": "token"
  }
}
```

Response Body (Failed) :

```json
{
  "status": false,
  "statusCode": 422,
  "message": "Failed to register user",
  "errors": "Username must not blank, ..."
}
```

## Login User

Endpoint : POST /api/auth/login

Request Body :

```json
{
  "email": "john.doe@gmail.com",
  "password": "rahasia"
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Login user success",
  "data": {
    "id": 1,
    "username": "john",
    "email": "john.doe@gmail.com",
    "name": "John Doe",
    "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
    "role": "User",
    "accessToken": "token",
    "refreshToken": "token"
  }
}
```

## Logout User

Endpoint : DELETE /api/auth/logout

Request Header :

- Authorization : token

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Logout success",
  "data": true
}
```

## Check Token

Endpoint : GET /api/auth/check-token

Request Header :

- Authorization : token

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Check token success",
  "data": {
    "id": 1,
    "username": "john",
    "email": "john.doe@gmail.com",
    "name": "John Doe",
    "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
    "role": "User",
    "accessToken": "token",
    "refreshToken": "token"
  }
}
```
