# Bookmark API Spec

## List Bookmark

Endpoint : GET /api/bookmark

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list bookmark success",
  "data": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "username": "bob",
        "email": "john.doe@gmail.com",
        "name": "Bob Brown",
        "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
        "role": "User"
      },
      "room": {
        "id": 15,
        "name": "Madhouse",
        "slug": "madhouse",
        "parentId": 5,
        "type": "Studio",
        "category": "Film"
      },
      "content": "Post Pertama",
      "commentCount": 3,
      "likeCount": 5
    },
    {
      "id": 2,
      "user": {
        "id": 1,
        "username": "bob",
        "email": "john.doe@gmail.com",
        "name": "Bob Brown",
        "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
        "role": "User"
      },
      "room": {
        "id": 15,
        "name": "Madhouse",
        "slug": "madhouse",
        "parentId": 5,
        "type": "Studio",
        "category": "Film"
      },
      "content": "Post Kedua",
      "image": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
      "commentCount": 3,
      "likeCount": 5
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

## Create Bookmark

Endpoint : POST /api/bookmark/{postId}

Request Header :

- Authorization : token

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Create bookmark success",
  "data": {
    "id": 1,
    "slug": "post-pertama",
    "user": {
      "id": 1,
      "username": "bob",
      "email": "john.doe@gmail.com",
      "name": "Bob Brown",
      "profilePicture": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
      "role": "User"
    },
    "room": {
      "id": 15,
      "name": "Madhouse",
      "slug": "madhouse",
      "parentId": 5,
      "type": "Studio",
      "category": "Film"
    },
    "content": "Post Pertama",
    "image": "https://titik.my.id/images/2024/11/11/1731324664026.jpg",
    "commentCount": 0,
    "likeCount": 0
  }
}
```

## Delete Bookmark

Endpoint : DELETE /api/bookmark/{postId}

Request Header :

- Authorization : token

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Delete bookmark success",
  "data": true
}
```
