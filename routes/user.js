const express = require("express");

let router = express.Router();
// 获取连接实例
const connection = require("../db");
//获取返回结果封装工具
var result = require("../result");

//查询所有用户方法
router.get("/", function (req, res) {
  console.log("正在查询所有用户,请求参数为:", req.params, req.body);
  const sql = "select * from user_table";
  connection
    .query(sql)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

//查询单个用户的方法
router.get("/:id", function (req, res) {
  console.log("正在查询单个用户信息,请求参数为:", req.params, req.body);
  const params = req.params;
  const sql = "select * from user_table where userId = ?";
  connection
    .query(sql, params.id)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

//添加新用户方法
router.post("/", function (req, res) {
  console.log("正在添加新用户,请求参数为:", req.params, req.body);
  const params = req.body;
  const sql = "insert into user_table values(?, ?, ?, ?, ?, ?, ?)";
  connection
    .query(sql, [
      params.userId,
      params.userPwd,
      params.userName,
      params.userNumb,
      params.userLike,
      params.userAdd,
      params.userGend,
    ])
    .then((data) => {
      // 如果插入发生错误
      if (data.affectedRows !== 1) res.json(result.error());
      //否则插入数据成功
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//删除用户的方法
router.delete("/:id", function (req, res) {
  console.log("正在删除用户,请求参数为:", req.params, req.body);
  const params = req.params;
  const sql = "delete from user_table where userId = ?";
  connection
    .query(sql, params.id)
    .then((data) => {
      // 如果删除发生错误
      if (data.affectedRows !== 1) res.json(result.error());
      //否则删除数据成功
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//更新用户信息
router.put("/", function (req, res) {
  console.log("正在更新用户信息,请求参数为:", req.params, req.body);
  const params = req.body;
  const sql =
    "update user_table set userPwd = ?, userName = ?, userNumb = ?, userLike = ?, userAdd = ?, userGend = ? where userId = ?";
  connection
    .query(sql, [
      params.userPwd,
      params.userName,
      params.userNumb,
      params.userLike,
      params.userAdd,
      params.userGend,
      params.userId,
    ])
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//修改密码的方法---客户端
router.post("/password/:id", function (req, res) {
  console.log("正在修改用户密码,请求参数为:", req.params, req.body);
  const sql = "update user_table set userPwd = ? where userId = ?";
  const id = req.params.id;
  const password = req.body.password;
  connection
    .query(sql, [password, id])
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//登录接口---客户端
router.get("/login/:userNumb", function (req, res) {
  console.log("正在调用登录接口,请求参数为:", req.params, req.body);
  const sql = "select * from user_table where userNumb = ?";
  const userNumb = req.params.userNumb;
  connection
    .query(sql, userNumb)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

//通过电话号码查询密码--客户端忘记密码
router.get("/login/forgetpass/:number", function (req, res) {
  console.log("正在通过电话号码查询密码,请求参数为:", req.params, req.body);
  const sql = "select userPwd from user_table where userNumb = ?";
  const number = req.params.number;
  connection
    .query(sql, number)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

//用户注册方法---客户端
router.post("/register", function (req, res) {
  console.log("正在注册新用户,请求参数为:", req.params, req.body);
  const params = req.body;
  const sql =
    "insert into user_table (userId, userPwd, userNumb) values(?, ?, ?)";
  connection
    .query(sql, [params.userId, params.userPwd, params.userNumb])
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
