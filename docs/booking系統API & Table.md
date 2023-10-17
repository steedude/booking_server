## 前台 API

- 使用者可以登錄 email option

```http
POST /api/login
```

| Parameter  | Type     | Description  |
| :--------- | :------- | :----------- |
| `account`  | `string` | **Required** |
| `password` | `string` | **Required** |

```ts
{
    status: 200,
    message: 'success',
    data: {
        token: string,
        user: {
            account: string,
            team: string,
            name: string,
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

```ts
{
    status: 200,
    message: 'success',
    data: {
        token: string,
        user: {
            account: string,
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

```ts
{
    status: 200,
    message: 'success',
    data: {
        token: string,
        user: {
            account: string,
            team: string,
            name: string,
        }
    }
}
```

- 使用者登錄會知道自己是誰與組別

```http
GET /api/user
```

```ts
{
    status: 200,
    message: 'success',
    data: {
        token: string,
        user: {
            account: string,
            team: string,
            name: string,
        }
    }
}
```

- 使用者可以設定組別及暱稱

```http
POST /api/userSetting
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `team`    | `string` | Optional    |
| `name`    | `string` | Optional    |

```ts
{
    status: 200,
    message: 'success',
    data: {
        token: string,
        user: {
            account: string,
            team: string,
            name: string,
        }
    }
}
```

- 使用者可以取得所有會議室資訊

```http
GET /api/products
```

```ts
{
    status: 200,
    message: 'success',
    data: {
        products: [
            { product物件 },
            { product物件 },
        ]
    }
}
```

- 使用者可以看今日會議室預約狀態 (永遠回傳一天的資料)

```http
GET /api/reservations
```

| Parameter    | Type     | Description  |
| :----------- | :------- | :----------- |
| `start_time` | `string` | **Required** |

```ts
{
    status: 200,
    message: 'success',
    data: {
        reservations: [
            { reservation物件 },
            { reservation物件 },
        ]
    }
}
```

- 使用者可以查看自己歷史的預約狀態

```http
GET /api/reservations/history
```

| Parameter   | Type     | Description    |
| :---------- | :------- | :------------- |
| `page`      | `number` | **Default 1**  |
| `page_size` | `number` | **Default 30** |

```ts
{
    status: 200,
    message: 'success',
    data: {
        page: number,
        page_size: number,
        total_page: number,
        total_size: number,
        reservations: [
            { reservation物件 },
            { reservation物件 },
        ]
    }
}
```

- 使用者可以查看自己未來預約記錄

```http
GET /api/reservations/future
```

| Parameter   | Type     | Description    |
| :---------- | :------- | :------------- |
| `page`      | `number` | **Default 1**  |
| `page_size` | `number` | **Default 30** |

```ts
{
    status: 200,
    message: 'success',
    data: {
        page: number,
        page_size: number,
        total_page: number,
        total_size: number,
        reservations: [
            { reservation物件 },
            { reservation物件 },
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

```ts
{
    status: 200,
    message: 'success',
}
```

- 使用者可以取消會議室

```http
DELETE /api/reservation/:reservation_id
```

```ts
{
    status: 200,
    message: 'success',
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

```ts
{
    status: 200,
    message: 'success',
    data: {
        token: string,
        user: {
            account: string,
            team: string,
            name: string,
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

```ts
{
    status: 200,
    message: 'success',
    data: {
        token: string,
        user: {
            account: string,
            team: string,
            name: string,
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

```ts
{
    status: 200,
    message: 'success',
    data: {
        token: string,
        user: {
            account: string,
            team: string,
            name: string,
        }
    }
}
```

- 商戶可以設定組別及暱稱

```http
POST /api/admin/userSetting
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `team`    | `string` | Optional    |
| `name`    | `string` | Optional    |

```ts
{
    status: 200,
    message: 'success',
    data: {
        token: string,
        user: {
            account: string,
            team: string,
            name: string,
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

```ts
{
    status: 200,
    message: 'success',
}
```

- 商戶可以取得所有會議室資訊

```http
GET /api/admin/products
```

```ts
{
    status: 200,
    message: 'success',
    data: {
        products: [
            { product物件 },
            { product物件 },
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

```ts
{
    status: 200,
    message: 'success',
}
```

- 商戶可以上傳會議室圖片

```http
POST /api/admin/uploadImages (form-data)
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `images`  | `file[]` | **Required** |

```ts
{
    status: 200,
    message: 'success',
    data: {
        images: string[],
    }
}
```

- 商戶可以刪除會議室

```http
DELETE /api/admin/product/:product_id
```

```ts
{
    status: 200,
    message: 'success',
}
```

- 商戶可以查看目前被預約狀態 (回應全日預約狀態)

```http
GET /api/admin/reservations
```

| Parameter    | Type     | Description    |
| :----------- | :------- | :------------- |
| `start_time` | `string` | **Required**   |
| `end_time`   | `string` | **Required**   |
| `page`       | `number` | **Default 1**  |
| `page_size`  | `number` | **Default 30** |

```ts
{
    status: 200,
    message: 'success',
    data: {
        page: number,
        page_size: number,
        total_page: number,
        total_size: number,
        reservations: [
            { reservation物件 },
            { reservation物件 },
        ]
    }
}
```

- 商戶可以取消預約狀態

```http
DELETE /api/admin/reservation/:reservation_id
```

```ts
{
    status: 200,
    message: 'success',
}
```

- 商戶可以同意預約

```http
PUT /api/admin/reservation/:reservation_id
```

```ts
{
    status: 200,
    message: 'success',
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

```ts
{
    status: 200,
    message: 'success',
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
| `team_id`  | `string` |
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
| `start_time` | `string`  |
| `end_time`   | `string`  |
| `confirmed`  | `boolean` |
| `product_id` | `string`  |
| `user_id`    | `string`  |
| `admin_id`   | `string`  |
| `team_id`    | `string`  |
