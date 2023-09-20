//index.js

const express = require("express");
const app = express();
const cors =require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //POSTリクエストで投稿されたデータを解析するためのコード2行
const jwt = require("jsonwebtoken"); //トークンを使うため
const auth = require("./utils/auth"); //追加
const connectDB = require("./utils/database");
const { ItemModel, UserModel } = require("./utils/schemaModels");
//const { connect } = require("http2");

// **ITEM functions**　(アイテムに関する機能)
//Create Item (アイテムを作成する) CRUD操作でいうと、C(create),HTMLメソッドではPOST

app.post("/item/create", auth, async (req, res) => {
  try {
    await connectDB(); //mongoDBへの接続コード
    await ItemModel.create(req.body); //Model使って、mongoDBにアイテムを追加。 ()内、DBに保存したいデータ=req.bodyを加える
    return res.status(200).json({ message: "アイテム作成成功" });
  } catch (err) {
    return res.status(400).json({ message: "アイテム作成失敗" });
  }
});

//Read All Items (すべてのアイテムデータを読み取る)
app.get("/", async (req, res) => {
  try {
    await connectDB();
    const allItems = await ItemModel.find(); //mongoDBからの読み取りは、ItemModelに格納されたfind()を使う
    return res.status(200).json({ message: "全アイテム読み取り成功", allItems: allItems });
  } catch (err) {
    return res.status(400).json({ message: "全アイテムの読み取りは失敗" });
  }
});

//Read Single Item(1つだけアイテムデータを読み取る)
app.get("/item/:id", async (req, res) => {
  try {
    await connectDB();
    console.log(req.params.id); //入力したurlのID部分が、req内のparams.idにはいってる
    const singleItem = await ItemModel.findById(req.params.id); //findById は、idを見つけるため(_idに)しか使えない
    return res.status(200).json({ message: "アイテム読み取り成功(single)", singleItem: singleItem });
  } catch (err) {
    return res.status(400).json({ message: "アイテム読み取り失敗(single)" });
  }
});

//Update Item (アイテムを修正putする)
app.put("/item/update/:id", auth, async (req, res) => {
  try {
    await connectDB();

    //singleItem.email(アイテムのemail) が一致している人だけ、アイテムの修正ができる
    const singleItem = await ItemModel.findById(req.params.id); //編集をする前に、該当するアイテムデータをfindById()で取得する。
    if (singleItem.email === req.body.email) {
      await ItemModel.updateOne({ _id: req.params.id }, req.body); // ItemModelに格納されたupdateOneつかって修正
      return res.status(200).json({ message: "アイテム編集成功" });
    } else {
      throw new Error();
    }
  } catch (error) {
    return res.status(400).json({ message: "アイテム編集失敗" });
  }
});

//Delete Item (アイテムを削除する)
app.delete("/item/delete/:id", auth, async (req, res) => {
  try {
    await connectDB();
    const singleItem = await ItemModel.findById(req.params.id); //編集をする前に、該当するアイテムデータをfindById()で取得する。

    //singleItem.email(アイテムのemail) が一致している人だけ、アイテムの削除ができる
    if (singleItem.email === req.body.email) {
      await ItemModel.deleteOne({ _id: req.params.id });
      return res.status(200).json({ message: "アイテム削除成功" });
    } else {
      throw new Error();
    }
  } catch (err) {
    return res.status(400).json({ message: "アイテム削除失敗" });
  }
});

//  **USER functions **
//Register User (ユーザーの登録機能)
app.post("/user/register", async (req, res) => {
  try {
    await connectDB();
    await UserModel.create(req.body);
    return res.status(200).json({ message: "ユーザー登録成功" });
  } catch (err) {
    return res.status(400).json({ message: "ユーザー登録失敗" });
  }
});

//Login User (ユーザーのログイン機能)
const secret_key = "mern-market"; //トークンとセットで使う、シークレットキー

app.post("/user/login", async (req, res) => {
  try {
    await connectDB();
    const savedUserData = await UserModel.findOne({ email: req.body.email }); //finｄOneは、なにを目安にデータを探すのか指定する必要あり

    //ユーザーデータが存在する時の場合の処理
    if (savedUserData) {
      if (req.body.password === savedUserData.password) {
        //パスワードが正しいときの処理　savedUserDataには、passwordも入ってるので、入力したパスと一致か？を比較

        const payload = {
          //トークンに含ませたいデータ(ペイロード)を決める。今回ペイロードにメアドのデータを入れる
          email: req.body.email,
        };
        const token = jwt.sign(payload, secret_key, { expiresIn: "23h" }); //トークンを発行するコードを追加
        console.log(token);
        return res.status(200).json({ message: "ログイン成功" });
      } else {
        //パスワードが間違ってるときの処理
        return res.status(400).json({ message: "ログイン失敗:パスワードが間違っています" });
      }
    }
  } catch (err) {
    return res.status(400).json({ message: "ログイン成功" });
  }
});



//connecting to port
const port =process.env.PORT || 5000;

app.listen(port ,() => {
  console.log(`Listening on localhost port ${port}`);
});
