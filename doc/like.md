# Like API Spec

## Post Like Post

Endpoint : POST /api/post/{postId}/like

Request Header :

- Authorization : token

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Post like post success",
  "data": true
}
```

## Delete Like Post

Endpoint : DELETE /api/post/{postId}/like

Request Header :

- Authorization : token

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Delete like post success",
  "data": true
}
```

## Post Like Comment

Endpoint : POST /api/comment/{commentId}/like

Request Header :

- Authorization : token

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Post like comment success",
  "data": true
}
```

## Delete Like Comment

Endpoint : DELETE /api/comment/{commentId}/like

Request Header :

- Authorization : token

Response Body (Success):

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Delete like comment success",
  "data": true
}
```
