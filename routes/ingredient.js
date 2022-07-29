const express = require("express");
let router = express.Router();
// 获取连接实例
const connection = require("../db");
//获取返回结果封装工具
var result = require("../result");
//绝对路径
var path = require("path");
//文件上传所需
let formidable = require("formidable");

//上传食材图片，图片存放至static/imgs_ingredient目录下
router.post("/upload", function (req, res, next) {
  console.log("开始上传食材图片...");
  let form = new formidable.IncomingForm();
  form.encoding = "utf-8"; // 编码
  // 保留扩展名
  form.options.keepExtensions = true;
  //文件存储路径 最后要注意加 '/' 否则会被存在public下
  form.uploadDir = path.join(__dirname, "../static/imgs_ingredient/");
  // 解析 formData 数据
  form.parse(req, (err, fields, files) => {
    if (err) return next(err);
    // 返回路径和文件名
    let index = files.file.filepath.indexOf("static");
    let localPath = files.file.filepath.substr(
      index,
      files.file.filepath.length
    );
    var serverPath = ("http://121.37.102.50:3006/" + localPath).replaceAll(
      "\\",
      "/"
    );
    console.log("图片路径: " + serverPath);
    res.json({
      code: 200,
      msg: "食材图片上传成功",
      data: serverPath,
    });
    return;
  });
});

//添加新食材方法
router.post("/", function (req, res) {
  console.log("正在添加新食材,请求参数:", req.params, req.body);
  const params = req.body;
  const sql = "insert into ingre_table values(?, ?, ?, ?, ?, ?)";
  connection
    .query(sql, [
      params.ingreName,
      params.ingreId,
      params.ingreAdd,
      params.ingreAttr,
      params.ingrePut,
      params.ingrePrice,
    ])
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//删除食材方法
router.delete("/:id", function (req, res) {
  console.log("正在删除食材,请求参数:", req.params, req.body);
  const sql = "delete from ingre_table where ingreId = ?";
  const params = req.params;
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

//更新食材信息
router.put("/", function (req, res) {
  console.log("正在更新食材信息,请求参数:", req.params, req.body);
  const sql =
    "update ingre_table set ingreName = ?, ingreAdd = ?, ingreAttr = ?, ingrePut = ?, ingrePrice = ? where ingreId = ?";
  const params = req.body;
  console.log(params.ingrePut);
  connection
    .query(sql, [
      params.ingreName,
      params.ingreAdd,
      params.ingreAttr,
      params.ingrePut,
      params.ingrePrice,
      params.ingreId,
    ])
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//查询所有食材
router.get("/", function (req, res) {
  console.log("正在查询所有食材信息,请求参数:", req.params, req.body);
  const sql = "select * from ingre_table";
  connection
    .query(sql)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

//查询单个食材
router.get("/:id", function (req, res) {
  console.log("正在查询单个食材信息,请求参数:", req.params, req.body);
  const sql = "select * from ingre_table where ingreId = ?";
  const params = req.params;
  connection
    .query(sql, params.id)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

//模糊查询---客户端(keyword格式：条件1|条件2|条件3)
router.get("/searchlike/:keyword", function (req, res) {
  console.log("正在进行模糊查询,请求参数:", req.params, req.body);
  const sql = "select * from ingre_table where ingreName REGEXP ? ";
  const keyword = req.params.keyword;
  connection
    .query(sql, keyword)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
