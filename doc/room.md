# Room API Spec

## List Room with Full Hierarchy

Endpoint : GET /api/room/list

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list room with full hierarchy success",
  "data": {
    "id": 1,
    "name": "Universal Room",
    "slug": "universal-room",
    "parentId": null,
    "type": null,
    "category": "General",
    "children": [
      {
        "id": 4,
        "name": "Film Room",
        "slug": "film-room",
        "parentId": 1,
        "type": null,
        "category": "Entertainment",
        "children": [
          {
            "id": 5,
            "name": "Anime Room",
            "slug": "anime-room",
            "parentId": 4,
            "type": null,
            "category": "Film",
            "children": {
              "Region": [
                {
                  "id": 9,
                  "name": "Anime Indonesia Room",
                  "slug": "anime-indonesia-room",
                  "parentId": 5,
                  "category": "Film"
                },
                {
                  "id": 10,
                  "name": "Anime Arab Room",
                  "slug": "anime-arab-room",
                  "parentId": 5,
                  "category": "Film"
                }
              ],
              "Genre": [
                {
                  "id": 11,
                  "name": "Anime Action",
                  "slug": "anime-action",
                  "parentId": 5,
                  "category": "Film"
                },
                {
                  "id": 12,
                  "name": "Anime Fantasy",
                  "slug": "anime-fantasy",
                  "parentId": 5,
                  "category": "Film"
                },
                {
                  "id": 13,
                  "name": "Anime Isekai",
                  "slug": "anime-isekai",
                  "parentId": 5,
                  "category": "Film"
                }
              ],
              "Studio": [
                {
                  "id": 14,
                  "name": "Ghibli",
                  "slug": "ghibli",
                  "parentId": 5,
                  "category": "Film"
                },
                {
                  "id": 15,
                  "name": "Madhouse",
                  "slug": "madhouse",
                  "parentId": 5,
                  "category": "Film"
                }
              ],
              "Fandom": [
                {
                  "id": 16,
                  "name": "Naruto Room",
                  "slug": "naruto-room",
                  "parentId": 5,
                  "category": "Film"
                },
                {
                  "id": 17,
                  "name": "One Piece Room",
                  "slug": "one-piece-room",
                  "parentId": 5,
                  "category": "Film"
                }
              ]
            }
          },
          {
            "id": 6,
            "name": "K-Drama Room",
            "slug": "k-drama-room",
            "parentId": 4,
            "type": null,
            "category": "Film",
            "children": []
          },
          {
            "id": 7,
            "name": "Hollywood Room",
            "slug": "hollywood-room",
            "parentId": 4,
            "type": null,
            "category": "Film",
            "children": []
          },
          {
            "id": 8,
            "name": "Bollywood Room",
            "slug": "bollywood-room",
            "parentId": 4,
            "type": null,
            "category": "Film",
            "children": []
          }
        ]
      }
    ]
  }
}
```

## List POST by Room Slug

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
      "commentCount": 3,
      "likeCount": 5
    },
    {
      "id": 2,
      "slug": "post-kedua",
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

## List Room

Endpoint : GET /api/room (Admin Only)

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list room success",
  "data": [
    {
      "id": 1,
      "name": "Universal Room",
      "slug": "universal-room",
      "parent_id": null,
      "type": null,
      "category": "General"
    },
    {
      "id": 4,
      "name": "Film Room",
      "slug": "film-room",
      "parent_id": 1,
      "type": null,
      "category": "Entertainment"
    },
    {
      "id": 5,
      "name": "Anime Room",
      "slug": "anime-room",
      "parent_id": 4,
      "type": null,
      "category": "Film"
    },
    {
      "id": 9,
      "name": "Anime Indonesia Room",
      "slug": "anime-indonesia-room",
      "parent_id": 5,
      "type": "Region",
      "category": "Film"
    },
    {
      "id": 11,
      "name": "Anime Action",
      "slug": "anime-action",
      "parent_id": 5,
      "type": "Genre",
      "category": "Film"
    },
    {
      "id": 14,
      "name": "Ghibli",
      "slug": "ghibli",
      "parent_id": 5,
      "type": "Studio",
      "category": "Film"
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

## Create Room

Endpoint : POST /api/room (Admin Only)

Request Header :

- Authorization : token

Request Body :

```json
{
  "name": "Madhouse",
  "parentId": 5,
  "roomTypeId": 3,
  "categoryId": 4
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Create room success",
  "data": {
    "id": 15,
    "name": "Madhouse",
    "slug": "madhouse",
    "parentId": 5,
    "type": "Studio",
    "category": "Film"
  }
}
```

## Update Room

Endpoint : PUT /api/room/{room_id} (Admin Only)

Request Header :

- Authorization : token

Request Body :

```json
{
  "name": "Madhouse"
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Update room success",
  "data": {
    "id": 15,
    "name": "Madhouse",
    "slug": "madhouse",
    "parentId": 5,
    "type": "Studio",
    "category": "Film"
  }
}
```

## Delete Room

Endpoint : DELETE /api/room/{room_id} (Admin Only)

Request Header :

- Authorization : token

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Delete room success",
  "data": true
}
```
