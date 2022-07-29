const express = require("express");
// 获取启动参数
const config = require("./config");

const app = express();
var path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "static")));

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//配置路由路径
app.use("/menu", require("./routes/menu"));
app.use("/user", require("./routes/user"));
app.use("/ingredient", require("./routes/ingredient"));
app.use("/admin", require("./routes/admin"));
app.use("/record", require("./routes/record"));

app.listen(config.port, () => {
  console.log(`express server listening ---> ${config.db.host}:${config.port}`);
  console.log(`数据库:${config.db.database}`)
  console.log("学习交流:QQ2631667689")
});
