# Comment API Spec

## List Comment by PostId

Endpoint : GET /api/post/{postId}/comment

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list comment success",
  "data": [
    {
      "id": 1,
      "postId": 101,
      "user": {
        "id": 1,
        "username": "bob",
        "email": "john.doe@gmail.com",
        "name": "Bob Brown",
        "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
        "role": "User"
      },
      "parentId": 1,
      "content": "Pertama",
      "likeCount": 10,
      "replies": [
        {
          "id": 2,
          "postId": 101,
          "user": {
            "id": 1,
            "username": "bob",
            "email": "john.doe@gmail.com",
            "name": "Bob Brown",
            "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
            "role": "User"
          },
          "parentId": 1,
          "content": "Kedua",
          "likeCount": 5
        }
      ]
    },
    {
      "id": 4,
      "postId": 101,
      "user": {
        "id": 1,
        "username": "bob",
        "email": "john.doe@gmail.com",
        "name": "Bob Brown",
        "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
        "role": "User"
      },
      "parentId": 4,
      "content": "Ketiga",
      "likeCount": 3,
      "replies": []
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

## Create Comment

Endpoint : POST /api/post/{postId}/comment

Request Header :

- Authorization : token

Request Body :

```json
{
  "content": "Comment Kedua",
  "parentId": 1
}
```

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Create comment success",
  "data": {
    "id": 2,
    "postId": 101,
    "user": {
      "id": 1,
      "username": "bob",
      "email": "john.doe@gmail.com",
      "name": "Bob Brown",
      "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
      "role": "User"
    },
    "parentId": 1,
    "content": "Comment Kedua",
    "likeCount": 10,
    "replyToUser": "alice"
  }
}
```

Response Body (Failed):

```json
{
  "status": false,
  "statusCode": 404,
  "message": "Post not found"
}
```

## Update Comment

Endpoint : PUT /api/comment/{commentId}

Request Header :

- Authorization : token

Request Body :

```json
{
  "content": "Comment Kedua Update"
}
```

Response Body :

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Update comment success",
  "data": {
    "id": 2,
    "postId": 101,
    "user": {
      "id": 1,
      "username": "bob",
      "email": "john.doe@gmail.com",
      "name": "Bob Brown",
      "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
      "role": "User"
    },
    "parentId": 1,
    "content": "Comment Kedua Update",
    "likeCount": 10,
    "replyToUser": {
      "id": 2,
      "username": "alice",
      "email": "alice.smith@gmail.com",
      "name": "Alice Smith",
      "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
      "role": "User"
    }
  }
}
```

## Delete Comment

Endpoint : DELETE /api/comment/{commentId}

Request Header :

- Authorization : token

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Delete comment success",
  "data": true
}
```
