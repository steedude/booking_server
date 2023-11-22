## 前台 API

- 使用者可以登錄 email option

```http
POST /api/login
```

| Parameter  | Type     | Description  |
| :--------- | :------- | :----------- |
| `account`  | `string` | **Required** |
| `password` | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "string",
    "user": {
      "account": "string",
      "team": "string",
      "name": "string",
      "image": "string"
    }
  }
}
```

- 使用者可以註冊 email option

```http
POST /api/register
```

| Parameter  | Type     | Description  |
| :--------- | :------- | :----------- |
| `account`  | `string` | **Required** |
| `password` | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "string",
    "user": {
      "account": "string",
      "team": "string",
      "name": "string",
      "image": "string"
    }
  }
}
```

- 使用者可以驗證google token並登入

```http
POST /api/googleAuth
```

| Parameter    | Type     | Description  |
| :----------- | :------- | :----------- |
| `credential` | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "string",
    "user": {
      "account": "string",
      "team": "string",
      "name": "string",
      "image": "string"
    }
  }
}
```

- 使用者登錄會知道自己是誰與組別

```http
GET /api/user
```

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "string",
    "user": {
      "account": "string",
      "team": "string",
      "name": "string",
      "image": "string"
    }
  }
}
```

- 使用者可以查詢組別

```http
GET /api/teams
```

```json
{
  "status": 200,
  "message": "success",
  "data": [
    {
      "_id": "64ed9a2995b9c78a1b2147fb",
      "name": "Vue"
    },
    {
      "_id": "6507f83d7d12cd44a5c3578f",
      "name": "Javascript"
    },
    {
      "_id": "650806b0d75b36c94e02fc44",
      "name": "React"
    }
  ]
}
```

- 使用者可以更改密碼

```http
POST /api/password
```

| Parameter  | Type     | Description  |
| :--------- | :------- | :----------- |
| `password` | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success"
}
```

- 使用者可以設定組別及暱稱

```http
POST /api/userSetting
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `team_id` | `string` | **Optional** |
| `name`    | `string` | **Optional** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "string",
    "user": {
      "account": "string",
      "team": "string",
      "name": "string",
      "image": "string"
    }
  }
}
```

- 使用者可以取得所有會議室資訊

```http
GET /api/products
```

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "products": [
      {
        "_id": "64f5965ad625440c41998522",
        "name": "會議室Z",
        "seats": 6,
        "image": [
          "1141f5ea3acc23a4d8c84737b66a2480",
          "df99c17ab9953cd375d4d7a7e39d2c13",
          "fake-image-1",
          "fake-image-2"
        ],
        "description": "會議室Z description",
        "projector": true,
        "television": false,
        "window": false,
        "is_confirmed": true
      }
    ]
  }
}
```

- 使用者可以看今日會議室預約狀態 (永遠回傳一天的資料)

```http
GET /api/reservations/day
```

| Parameter(Query) | Type     | Description  |
| :--------------- | :------- | :----------- |
| `start_time`     | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "reservations": [
      {
        "_id": "64f9678fda9b40361d6d0aea",
        "start_time": "2023-09-05T02:00:00.000Z",
        "end_time": "2023-09-05T04:00:00.000Z",
        "confirmed": false,
        "createdAt": "2023-09-07T06:02:55.185Z",
        "updatedAt": "2023-09-07T06:02:55.185Z",
        "product": {
          "_id": "64f5965ad625440c41998522",
          "name": "會議室Z"
        },
        "team": "Vue"
      }
    ]
  }
}
```

- 使用者可以查看自己歷史的預約狀態

```http
GET /api/reservations/history
```

| Parameter(Query) | Type     | Description    |
| :--------------- | :------- | :------------- |
| `page`           | `number` | **Default 1**  |
| `page_size`      | `number` | **Default 30** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "page": 2,
    "page_size": 2,
    "total_page": 1,
    "total_size": 2,
    "reservations": [
      {
        "_id": "64f9678fda9b40361d6d0aea",
        "start_time": "2023-09-05T02:00:00.000Z",
        "end_time": "2023-09-05T04:00:00.000Z",
        "confirmed": false,
        "product_id": {
          "_id": "64f5965ad625440c41998522",
          "name": "會議室Z"
        },
        "user_id": "64f6a2901ce52419f9436215",
        "createdAt": "2023-09-07T06:02:55.185Z",
        "updatedAt": "2023-09-07T06:02:55.185Z"
      }
    ]
  }
}
```

- 使用者可以查看自己未來預約記錄

```http
GET /api/reservations/future
```

| Parameter(Query) | Type     | Description    |
| :--------------- | :------- | :------------- |
| `page`           | `number` | **Default 1**  |
| `page_size`      | `number` | **Default 30** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "page": 2,
    "page_size": 2,
    "total_page": 1,
    "total_size": 2,
    "reservations": [
      {
        "_id": "64f9678fda9b40361d6d0aea",
        "start_time": "2023-09-05T02:00:00.000Z",
        "end_time": "2023-09-05T04:00:00.000Z",
        "confirmed": false,
        "product_id": {
          "_id": "64f5965ad625440c41998522",
          "name": "會議室Z"
        },
        "user_id": "64f6a2901ce52419f9436215",
        "createdAt": "2023-09-07T06:02:55.185Z",
        "updatedAt": "2023-09-07T06:02:55.185Z"
      }
    ]
  }
}
```

- 使用者可以預約會議室

```http
POST /api/reservation
```

| Parameter    | Type     | Description  |
| :----------- | :------- | :----------- |
| `start_time` | `string` | **Required** |
| `end_time`   | `string` | **Required** |
| `product_id` | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success"
}
```

- 使用者可以取消會議室

```http
DELETE /api/reservation/:reservation_id
```

```json
{
  "status": 200,
  "message": "success"
}
```

## 後台 API

- 商戶可以登錄 email option

```http
POST /api/admin/login
```

| Parameter  | Type     | Description  |
| :--------- | :------- | :----------- |
| `account`  | `string` | **Required** |
| `password` | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "string",
    "user": {
      "account": "string",
      "team": "string",
      "name": "string"
    }
  }
}
```

- 商戶可以註冊 email option

```http
POST /api/admin/register
```

| Parameter  | Type     | Description  |
| :--------- | :------- | :----------- |
| `account`  | `string` | **Required** |
| `password` | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "string",
    "user": {
      "account": "string",
      "team": "string",
      "name": "string"
    }
  }
}
```

- 商戶可以驗證google token並登入

```http
POST /api/admin/googleAuth
```

| Parameter    | Type     | Description  |
| :----------- | :------- | :----------- |
| `credential` | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "string",
    "user": {
      "account": "string",
      "team": "string",
      "name": "string"
    }
  }
}
```

- 商戶可以設定組別及暱稱

```http
POST /api/admin/userSetting
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `team_id` | `string` | **Optional** |
| `name`    | `string` | **Optional** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "string",
    "user": {
      "account": "string",
      "team": "string",
      "name": "string"
    }
  }
}
```

- 商戶可以建立會議室

```http
POST /api/admin/product
```

| Parameter      | Type      | Description  |
| :------------- | :-------- | :----------- |
| `name`         | `string`  | **Required** |
| `seats`        | `number`  | **Required** |
| `image`        | `sting[]` | **Required** |
| `description`  | `boolean` | **Required** |
| `projector`    | `boolean` | **Required** |
| `television`   | `number`  | **Required** |
| `is_confirmed` | `boolean` | **Required** |
| `window`       | `boolean` | **Required** |

```json
{
  "status": 200,
  "message": "success"
}
```

- 商戶可以取得所有會議室資訊

```http
GET /api/admin/products
```

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "products": [
      {
        "_id": "64f5965ad625440c41998522",
        "name": "會議室Z",
        "seats": 6,
        "image": [
          "1141f5ea3acc23a4d8c84737b66a2480",
          "df99c17ab9953cd375d4d7a7e39d2c13",
          "fake-image-1",
          "fake-image-2"
        ],
        "description": "會議室Z description",
        "projector": true,
        "television": false,
        "window": false,
        "is_confirmed": true
      }
    ]
  }
}
```

- 商戶可以修改會議室

```http
PUT /api/admin/product/:product_id
```

| Parameter      | Type       | Description  |
| :------------- | :--------- | :----------- |
| `name`         | `string`   | **Required** |
| `seats`        | `number`   | **Required** |
| `image`        | `string[]` | **Required** |
| `description`  | `boolean`  | **Required** |
| `projector`    | `boolean`  | **Required** |
| `television`   | `number`   | **Required** |
| `is_confirmed` | `boolean`  | **Required** |
| `window`       | `boolean`  | **Required** |

```json
{
  "status": 200,
  "message": "success"
}
```

- 商戶可以上傳會議室圖片

```http
POST /api/admin/uploadImages (form-data)
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `images`  | `file[]` | **Required** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "images": ["string", "string"]
  }
}
```

- 商戶可以刪除會議室

```http
DELETE /api/admin/product/:product_id
```

```json
{
  "status": 200,
  "message": "success"
}
```

- 商戶可以查看目前被預約狀態 (回應全日預約狀態)

```http
GET /api/admin/reservations
```

| Parameter(Query) | Type       | Description    |
| :--------------- | :--------- | :------------- |
| `start_time`     | `string`   | **Required**   |
| `end_time`       | `string`   | **Required**   |
| `page`           | `number`   | **Default 1**  |
| `page_size`      | `number`   | **Default 30** |
| `seats`          | `number`   | **Optional**   |
| `product_id`     | `string[]` | **Optional**   |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "page": 1,
    "page_size": 2,
    "total_page": 2,
    "total_size": 2,
    "reservations": [
      {
        "_id": "64f9678fda9b40361d6d0aea",
        "start_time": "2023-09-05T02:00:00.000Z",
        "end_time": "2023-09-05T04:00:00.000Z",
        "confirmed": false,
        "createdAt": "2023-09-07T06:02:55.185Z",
        "updatedAt": "2023-09-07T06:02:55.185Z",
        "product": {
          "_id": "64f5965ad625440c41998522",
          "name": "會議室Z",
          "seats": 6,
          "image": [
            "1141f5ea3acc23a4d8c84737b66a2480",
            "df99c17ab9953cd375d4d7a7e39d2c13",
            "fake-image-1",
            "fake-image-2"
          ],
          "description": "會議室Z description",
          "projector": true,
          "television": false,
          "window": false,
          "is_confirmed": true
        },
        "user": {
          "account": "account-name",
          "name": "nickname"
        },
        "team": "Vue"
      }
    ]
  }
}
```

- 商戶可以取消預約狀態

```http
DELETE /api/admin/reservation/:reservation_id
```

```json
{
  "status": 200,
  "message": "success"
}
```

- 商戶可以同意預約

```http
PUT /api/admin/reservation/:reservation_id
```

```json
{
  "status": 200,
  "message": "success"
}
```

- 商戶可以看今日會議室預約狀態 (永遠回傳一天的資料)

```http
GET /api/admin/reservations/day
```

| Parameter(Query) | Type     | Description  |
| :--------------- | :------- | :----------- |
| `start_time`     | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "reservations": [
      {
        "_id": "64f9678fda9b40361d6d0aea",
        "start_time": "2023-09-05T02:00:00.000Z",
        "end_time": "2023-09-05T04:00:00.000Z",
        "confirmed": false,
        "createdAt": "2023-09-07T06:02:55.185Z",
        "updatedAt": "2023-09-07T06:02:55.185Z",
        "product": {
          "_id": "64f5965ad625440c41998522",
          "name": "會議室Z"
        },
        "team": "Vue"
      }
    ]
  }
}
```

- 商戶可以主動幫客戶預約系統 (自動確認)

```http
POST /api/admin/reservation
```

| Parameter    | Type     | Description  |
| :----------- | :------- | :----------- |
| `start_time` | `string` | **Required** |
| `end_time`   | `string` | **Required** |
| `product_id` | `string` | **Required** |
| `team_id`    | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success"
}
```

- Admin可以查詢組別

```http
GET /api/admin/teams
```

```json
{
  "status": 200,
  "message": "success",
  "data": [
    {
      "_id": "64ed9a2995b9c78a1b2147fb",
      "name": "Vue"
    },
    {
      "_id": "6507f83d7d12cd44a5c3578f",
      "name": "Javascript"
    },
    {
      "_id": "650806b0d75b36c94e02fc44",
      "name": "React"
    }
  ]
}
```

- Admin可以建立組別

```http
POST /api/admin/team
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `name`    | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success"
}
```

- Admin可以更新組別

```http
PUT /api/admin/team
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `name`    | `string` | **Required** |

```json
{
  "status": 200,
  "message": "success"
}
```

- Admin可以刪除組別

```http
DELETE /api/admin/team/:team_id
```

```json
{
  "status": 200,
  "message": "success"
}
```

## Status Codes

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |

# DB Table Info

### User

| Parameter  | Type     |
| :--------- | :------- |
| `id`       | `string` |
| `account`  | `string` |
| `password` | `string` |
| `team_id`  | `string` |
| `name`     | `string` |

### Admin

| Parameter  | Type     |
| :--------- | :------- |
| `id`       | `string` |
| `account`  | `string` |
| `password` | `string` |
| `name`     | `string` |

### Product

| Parameter      | Type       |
| :------------- | :--------- |
| `id`           | `string`   |
| `name`         | `string`   |
| `seats`        | `number`   |
| `image`        | `string[]` |
| `description`  | `boolean`  |
| `projector`    | `boolean`  |
| `television`   | `number`   |
| `is_confirmed` | `boolean`  |
| `window`       | `boolean`  |

### Team

| Parameter | Type     |
| :-------- | :------- |
| `id`      | `string` |
| `name`    | `string` |

### Reservation

| Parameter    | Type      |
| :----------- | :-------- |
| `id`         | `string`  |
| `start_time` | `Date`    |
| `end_time`   | `Date`    |
| `confirmed`  | `boolean` |
| `product_id` | `string`  |
| `user_id`    | `string`  |
| `admin_id`   | `string`  |
| `team_id`    | `string`  |
