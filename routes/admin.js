const express = require("express");

let router = express.Router();
// 获取连接实例
const connection = require("../db");
//获取返回结果封装工具
var result = require("../result");

//查询所有管理员
router.get("/", function (req, res) {
  console.log("正在获取所有管理员信息,请求参数:", req.params, req.body);
  const sql =
    "select adminAcco, adminId, adminName, adminNumb, ingredientAuth, menuAuth, power, userAuth from admin_table where adminId != 'unique'";
  connection
    .query(sql)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .then((err) => {
      res.send(err);
    });
});

//查询单个管理员
router.get("/:id", function (req, res) {
  console.log("正在查询管理员信息,请求参数:", req.params, req.body);
  const sql =
    "select adminAcco, adminId, adminName, adminNumb, ingredientAuth, menuAuth, power, userAuth from admin_table where adminId = ?";
  const adminId = req.params.id;
  connection
    .query(sql, adminId)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

//添加新管理员
router.post("/", function (req, res) {
  console.log("正在添加普通管理员,请求参数:", req.params, req.body);
  const params = req.body;
  const sql = "insert into admin_table values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
  connection
    .query(sql, [
      params.adminId,
      params.adminNumb,
      params.adminName,
      params.power,
      params.adminPass,
      params.adminAcco,
      params.menuAuth,
      params.ingredientAuth,
      params.userAuth,
    ])
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//删除管理员的方法
router.delete("/:id", function (req, res) {
  console.log("正在删除管理员,请求参数:", req.params, req.body);
  const params = req.params;
  const sql = "delete from admin_table where adminId = ?";
  connection
    .query(sql, params.id)
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//更新管理员信息
router.put("/", function (req, res) {
  console.log("正在更新管理员信息,请求参数:", req.params, req.body);
  const params = req.body;
  const sql =
    "update admin_table set adminNumb = ?, adminName = ?, adminAcco = ?, menuAuth = ?, ingredientAuth = ?, userAuth = ? where adminId = ?";
  connection
    .query(sql, [
      params.adminNumb,
      params.adminName,
      params.adminAcco,
      params.menuAuth,
      params.ingredientAuth,
      params.userAuth,
      params.adminId,
    ])
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//重置密码的方法---管理员(密码:123456)
router.post("/password/:id", function (req, res) {
  console.log("正在重置管理员密码,请求参数:", req.params, req.body);
  const sql = "update admin_table set adminPass = ? where adminId = ?";
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

//管理员登录接口
router.get("/login/:adminAcco", function (req, res) {
  console.log("正在调用管理员登录接口,请求参数", req.params, req.body);
  const sql = "select * from admin_table where adminAcco = ?";
  const adminAcco = req.params.adminAcco;
  connection
    .query(sql, adminAcco)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
