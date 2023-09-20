//utils/auth.js
//index.js内の機能を補助するファイル。

const jwt = require("jsonwebtoken");
const secret_key ="mern-market"; //index.jsでつかったものと同じに


//auth.jsもreqとresを受け取る。nextは、auth.jsで何らかの処理が完了し、
//次の処理へと進むことを知らせるもの
const auth = async(req,res,next)=>{

 //1 リクエストの種類の判別
 if(req.method==="GET"){
    return next();
}

//2 フロントエンドからトークンを受け取る処理


//const token  = await req.header.authorization.split("")[1];
const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhlbGxvQG1vbm90ZWluLmNvbSIsImlhdCI6MTY5NTE2ODY2MiwiZXhwIjoxNjk1MjUxNDYyfQ.V68F3xAimLqd5vcEfpivioWjDQ-9oV2Il9hOo0UG5M4" ;

//http headerにトークンなかった場合
if(!token){
    return res.status(400).json({message:"トークンがありません"})
}
//http headerにトークンのあった場合
try{
//トークンが正しいなら、解析されたトークン内のデータがdecodedに格納される
 const decoded =jwt.verify(token, secret_key);
 //トークンから解析したemailを、index.jsに渡す
req.body.email =decoded.email; //req.bodyのemailという項目に、ログインユーザーのemail(decoded.email)が収まる
 return next();
}
//トークンが有効でない場合の処理(不正なトークンとか、有効期限が切れている場合)
catch(err){

return res.status(400).json({message:"トークンが正しくないので、ログインしてください"})
}
}

module.exports =auth;