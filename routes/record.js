const express = require("express");

let router = express.Router();
// 获取连接实例
const connection = require("../db");
//获取返回结果封装工具
var result = require("../result");

//查询单个用户的菜谱历史记录
router.get("/:userId", function (req, res) {
  console.log("正在查询单个用户菜谱历史记录,请求参数:", req.params, req.body);
  const sql = "select * from record where userId = ?";
  const userId = req.params.userId;
  connection
    .query(sql, userId)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

//添加菜谱历史记录
router.post("/", function (req, res) {
  console.log("正在添加菜谱历史记录", req.params, req.body);
  const sql = "insert into record values(?, ?, ?, ?)";
  const params = req.body;
  connection
    .query(sql, [
      params.recordId,
      params.userId,
      params.menuId,
      params.createTime,
    ])
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .then((err) => {
      res.send(err);
    });
});

//删除单个菜谱历史记录
router.delete("/:recordId", function (req, res) {
  console.log("正在删除单个菜谱历史记录,请求参数:", req.params, req.body);
  const sql = "delete from record where recordId = ?";
  const recordId = req.params.recordId;
  connection
    .query(sql, recordId)
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//删除单个用户所有菜谱历史记录
router.delete("/user/:userId", function (req, res) {
  console.log(
    "正在删除某个用户所有菜谱历史记录,请求参数:",
    req.params,
    req.body
  );
  const sql = "delete from record where userId = ?";
  const userId = req.params.userId;
  connection
    .query(sql, userId)
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//更新某个菜谱历史记录
router.put("/:recordId", function (req, res) {
  console.log("正在更新菜谱历史记录,请求参数:", req.params, req.body);
  const sql = "update record set count = count + 1 where recordId = ?";
  const recordId = req.params.recordId;
  connection
    .query(sql, recordId)
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
