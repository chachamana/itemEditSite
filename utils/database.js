// utils/database.js

const mongoose = require("mongoose");
const connectDB = async() => {
  //実行したい、データベースとの接続処理を記入
  try {
    await mongoose.connect("mongodb+srv://stelsematete:xW68WMWibXKeu32I@mern-app-cluster.gm1ddq1.mongodb.net/appDataBase?retryWrites=true&w=majority");
    console.log("Success:connected to MongoDB");
  } catch (err) {
    console.log("Failure:Unconnected to MOngoDB");
    throw new Error();
  }
};
module.exports = connectDB;
