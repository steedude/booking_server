# booking-backend

This is an api of the booking backend, the database uses MonogoDB.

## Features

- RESTful routing
- Models with proper relationships
- Controllers/Models etc with proper separation of concerns
- JWT Authentication
- RESTful errors

## Environment Variable

- MONGODB_URI

## Client Routes List:

<!-- ### User

| Method     | URI                               | Action                                                  |
|------------|-----------------------------------|---------------------------------------------------------|
| `POST`     | `api/login`                       | `controllers\userController@login`                      |
| `GET`      | `api/github`                      | `auth redirect`                                         |
| `GET`      | `api/github/callback`             | `controllers\userController@github`                     |
| `POST`     | `api/register`                    | `controllers\userController@register`                   |
| `POST`     | `api/logout`                      | `controllers\userController@logout`                     | -->

### Reservation

| Method | URI               | Action                                                     |
| ------ | ----------------- | ---------------------------------------------------------- |
| `POST` | `api/reservation` | `controllers/client/reservationController@postReservation` |

## Admin Routes List:

<!-- ### User

| Method     | URI                               | Action                                                  |
|------------|-----------------------------------|---------------------------------------------------------|
| `POST`     | `api/login`                       | `controllers\userController@login`                      |
| `GET`      | `api/github`                      | `auth redirect`                                         |
| `GET`      | `api/github/callback`             | `controllers\userController@github`                     |
| `POST`     | `api/register`                    | `controllers\userController@register`                   |
| `POST`     | `api/logout`                      | `controllers\userController@logout`                     | -->
