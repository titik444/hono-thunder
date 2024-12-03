# Post API Spec

## List Post by Room Slug

Endpoint : GET /api/room/{slug}/post

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list post success",
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

## Create Post

Endpoint : POST /api/room/{slug}/post

Request Header :

- Authorization : token
- Content-Type: `multipart/form-data`

Request Body :

```json
{
  "content": "Post Pertama",
  "image": (file: gambar.jpg)
}
```

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Create post success",
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

Response Body (Error):

```json
{
  "status": false,
  "statusCode": 404,
  "message": "Room not found"
}
```

Response Body (Error):

```json
{
  "status": false,
  "statusCode": 404,
  "message": "Room not found"
}
```

Response Body (Error):

```json
{
  "status": false,
  "statusCode": 400,
  "message": "File is too big. Maximum file size is 10MB"
}
```

Response Body (Error):

```json
{
  "status": false,
  "statusCode": 400,
  "message": "File type not allowed. Only .jpg, .jpeg, .png, .webp are allowed"
}
```

## Update Post

Endpoint : PUT /api/post/{postId}

Request Header :

- Authorization : token
- Content-Type: `multipart/form-data`

Request Body :

- content: (string, required)
- image: (file, optional)

```json
{
  "content": "Post Pertama",
  "image": (file: gambar.jpg)
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Update post success",
  "data": {
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

## Delete Post

Endpoint : DELETE /api/post/{postId}

Request Header :

- Authorization : token

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Delete post success",
  "data": true
}
```
