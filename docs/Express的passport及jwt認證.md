# Express的Passport及JWT認證

## 前言

網路上對於 passport 的應用已有不少，本篇簡單講一下passport以及 token 驗證身份的流程。

Passport 是 express 上用以專門處理身份驗證的模組，原理是利用 middleware 的機制，將「身份驗證」獨立作為一個功能處理，舉凡第三方驗證如 Facebook、Google、Twitter 等都有實作模組。

以 express.js 為基礎，應用 passport-local 及 passport-jwt 實作 token-based 身份驗證機制

## 套件

這部分使用了以下套件：

- jsonwebtoken 為 jwt 套件
- bcrypt 為加密套件
- passport、passport-local、passport-jwt 為本次使用相關套件，後文會介紹

## 前置準備 User Model

假設簡化 User 的 model，內包含 id、賬號 (account)、加密後的密碼 (password)：

```
  const users = [
    {
      _id: 1,
      account: 'user01',
      // '1234' encrypted by bcrypt
      password: '$2b$10$Kmz54B8hEgDVy0uy3j6qucBLYFa3PFNHo6lU1rub4RPyD89qaMi'
    },
    {
      _id: 2,
      account: 'user02',
      // '5678' encrypted by bcrypt
      password: '$2b$10$DSsxhvpOi8nPwajJFCKTuT663yAtwMVLagYdTLWmAP.LGxPOEB2C'
    }
  ]
```

密碼預設以 bcrypt 加密為不可逆的 hash 演算法，可看出 '$2b$10$Km/z54B8hEgDVy0uy3j6qucBLYFa3PFNHo6l/U1rub4RPyD89qaMi' 為 '1234' 加密後的結果，產生方法如下：

```
  bcrypt.hash('1234', 10)
```

User model 提供兩個 methods：findById 與 findOne，利用 id 與 account 做成反查表反查 user 物件。

```
  try {

    // 利用 id 反查 user 物件
    user.findById(id);

    return done(undefined, user);
  } catch (err) {
    console.log(err);
    return done(err, false, null);
  }

  try {

    // 利用 account 反查 user 物件
    user.findOne({ account });

    return done(undefined, user);
  } catch (err) {
    console.log(err);
    return done(err, false, null);
  }
```

## passport 簡介

passport 將身分驗證獨立為「驗證策略」 Strategy，寫好的驗證策略會經由 passport.use 掛鉤於一全域物件，接著由 middleware passport.authenticate 指派使用的驗證策略，因此有關於身份驗證只需經過各自寫好的 passport 模組即可。

本文使用的 passport-local 與 passport-jwt，分別使用於帳號密碼登入以及 jwt 驗證上。

- passport-local: local驗證或註冊賬號/密碼, 並發送 token;

```
  passport.use(

    // 指定驗證策略名稱為'UserLogin', 這會對應路由的設定
    'UserLogin',

    // 這裡使用passport-local策略
    new LocalStrategy(
      { usernameField: 'account' },

      // 本地的驗證函示, 也就是User Model中的user.findOne({ account });
      (username, password, done) => {
        return verifyLocalFunc(User, username, password, done);
      }
    ),
  );
```

## Token 驗證機制

第一步要在登錄成功後, 用jsonwebtoken來發token給前台, 這裡使用了套件：

- jsonwebtoken: jwt產生 token;

```
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!),
```

另外token 驗證原則上和 passport-local 大同小異，因此可以依法炮製一個策略

- passport-jwt: 驗證 token 是否合法，並發送;

```
  passport.use(

    // 指定驗證策略名稱為'UserJwt', 這會對應路由的設定
    'UserJwt',

    // JWT的驗證
    new passportJwt.Strategy(
      JWT_STRATEGY_OPTIONS,
      // 這裡會抓取jwtToken中的id, 並透過user.findById(userId)反查user物件
      (jwtToken, done) => {
        return verifyJwtCB(User, jwtToken.id, done);
      }
    ),
  );
```

## 路由設定

最後，再搭配路由：

- login: 進行身份驗證獲取 token，驗證通過後會進入派發 token 的 middleware login。

- logout: 利用logout來舉例jwt驗證, 其他的請求可能也都需要, 這裡驗證是否帶有合法的 token，因為 passport 相容於 express，機制相當於在 routing 中插入驗證的 middleware，通過後執行下一個函示。

```

// 呼叫 passport.authenticate() 並指定驗證策略為 UserLogin, 這個使用passport-local策略
router.post('/login', passport.authenticate('UserLogin'), userController.loginSuccess);

// 呼叫 passport.authenticate() 並指定驗證策略為 UserJwt, 這個使用passport-jwt策略
router.post('/logout', passport.authenticate('UserJwt', { session: false }), userController.logout);

```

## 完成passport的登入登出的serialize設定

這裡的serializeUser是用來將user物件轉成id, deserializeUser是用來將id轉成user物件, 這樣就可以在req.user中取得user物件了.

```
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) done(undefined, user);
  } catch (err: unknown) {
    done(err);
  }
});
```

## 測試的方法

用postman去發登錄拿到token, 再去用token登出就可以測試整個流程.

經過以上的這些設定, 即可以完成登入/登出/jwt驗證.
