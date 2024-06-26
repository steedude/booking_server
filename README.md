# booking-server

## 專案描述

會議室預約系統後端專案，使用mongoDB，包含客戶端和管理端的api。

## 客戶端api

### client_product

| Method | URI            | Action                                             |
| ------ | -------------- | -------------------------------------------------- |
| `GET`  | `api/products` | `controllers/client/productController@getProducts` |

### client_reservation

| Method   | URI                               | Action                                                            |
| -------- | --------------------------------- | ----------------------------------------------------------------- |
| `POST`   | `api/reservation`                 | `controllers/client/reservationController@postReservation`        |
| `DELETE` | `api/reservation/:reservation_id` | `controllers/client/reservationController@deleteReservation`      |
| `GET`    | `api/reservation/day`             | `controllers/commonController@getDayReservations`                 |
| `GET`    | `api/reservations/history`        | `controllers/client/reservationController@getHistoryReservations` |
| `GET`    | `api/reservations/future`         | `controllers/client/reservationController@getFutureReservations`  |

## 管理端api

## admin_reservation

| Method   | URI                                     | Action                                                      |
| -------- | --------------------------------------- | ----------------------------------------------------------- |
| `GET`    | `api/admin/reservations`                | `controllers/admin/reservationController@getReservations`   |
| `POST`   | `api/admin/reservation`                 | `controllers/admin/reservationController@postReservation`   |
| `PUT`    | `api/admin/reservation/:reservation_id` | `controllers/admin/reservationController@agreeReservation`  |
| `DELETE` | `api/admin/reservation/:reservation_id` | `controllers/admin/reservationController@deleteReservation` |
| `GET`    | `api/admin/reservation/day`             | `controllers/commonController@getDayReservations`           |

## 本地端測試

```bash
docker compose -f docker-compose-local.yml up -d
```

```bash
pnpm run dev
```

## 伺服器上部署

伺服器放在racknerd，透過github自動部署，部署在
[reservation.api.t65k2.com](https://reservation.api.t65k2.com/)

## 套件

- [express](https://expressjs.com/) 是基於 Node.js 所開發的前後端網頁框架，特性為快速極簡，主要運作是在處理 HTTP 請求的函數，處理每個中介函式，再傳給下一個中間軟體的函式
- [body-parser](https://github.com/expressjs/body-parser) 是 express 經常使用的中介軟體，用於解析請求的資料(body)，本專案使用 <code>extended: false</code> 採用 querystring 進行解析
- [cors](https://github.com/expressjs/cors) express 官方自己出了一個套件 cors 方便大家在 Node.js 上設定 CORS
- [express-session](https://github.com/expressjs/session) 在 server 端，使用 session store 去做儲存資料
  - secret: 用來簽名存放在 cookie 的 sessionID
  - name: 存放在 cookie 的 key，如果不寫的話預設是 connect.sid
  - saveUninitialized: 如果設定是 true，會把`還沒修改過的` session 就存進 session store
  - resave: 如果設定為 true，則在一個 request 中，無論 session 有沒有被修改過，都會強制保存原本的session 在 session store，反之則會定期去清理 session
- [dotenv](https://github.com/motdotla/dotenv) 從 .env 文件中自動載入環境變數到 `process.env`
- [passport](https://www.passportjs.org/) 處理驗證的 middleware
- [mongoose](https://mongoosejs.com/docs/) 是一個 ODM 套件，採用 schema-based 讓我們能用較簡單的方式來操作 MongoDB

## 資料夾結構

- Schema 統一放置在 `models` 資料夾中
- API 邏輯分別放在 `controllers/client` 和 `controllers/admin` 中實作
- API route 分別放在 `routes/client` 和 `routes/admin` 中依照 Schema 分類各自開立檔案，並由同層 `index.ts` 統一設置
- 本地端開發指令先輸入`docker-compose -f docker-compose-local.yml up`再輸入`pnpm run dev`
