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

//上传菜谱图片，图片存放至static/imgs_menu目录下
router.post("/upload", function (req, res, next) {
  console.log("开始上传菜谱图片...");
  let form = new formidable.IncomingForm();
  form.encoding = "utf-8"; // 编码
  // 保留扩展名
  form.options.keepExtensions = true;
  //文件存储路径 
  form.uploadDir = path.join(__dirname, "../static/imgs_menu/");
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
      msg: "菜谱图片上传成功",
      data: serverPath, 
    });
    return;
  });
});

//获取所有菜谱的方法
router.get("/", function (req, res) {
  console.log("正在获取所有菜谱信息,请求参数", req.params, req.body);
  const sql = "select * from menu_table";
  connection
    .query(sql)
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

//查询单个菜谱方法
router.get("/:id", function (req, res) {
  console.log("正在获取单个菜谱信息,请求参数", req.params, req.body);
  const sql = "select * from menu_table where menuId = ?";
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

//添加一个菜谱
router.post("/", function (req, res) {
  console.log("正在添加新菜谱,请求参数", req.params, req.body);
  const sql = "insert into menu_table values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const params = req.body;
  connection
    .query(sql, [
      params.menuName,
      params.menuId,
      params.menuEle,
      params.menuTaste,
      params.menuCuis,
      params.menuBrief,
      params.menuLevel,
      params.menuPut,
      params.menuPrice,
    ])
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//删除菜谱方法
router.delete("/:id", function (req, res) {
  console.log("正在删除菜谱,请求参数", req.params, req.body);
  const sql = "delete from menu_table where menuId = ?";
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

//更新菜谱的方法
router.put("/", function (req, res) {
  console.log("正在更新菜谱信息,请求参数", req.params, req.body);
  const sql =
    "update menu_table set menuName = ?, menuEle = ?, menuTaste = ?, menuCuis = ?, menuBrief = ?, menuLevel = ?, menuPut = ?, menuPrice = ? where menuId = ?";
  const params = req.body;
  connection
    .query(sql, [
      params.menuName,
      params.menuEle,
      params.menuTaste,
      params.menuCuis,
      params.menuBrief,
      params.menuLevel,
      params.menuPut,
      params.menuPrice,
      params.menuId,
    ])
    .then((data) => {
      if (data.affectedRows !== 1) res.json(result.error());
      else res.json(result.updateSuccess());
    })
    .catch((err) => {
      res.send(err);
    });
});

//模糊查询---客户端(keyword格式：条件1|条件2|条件3)
router.get("/searchlike/:keyword", function (req, res) {
  console.log("正在进行模糊查询,请求参数", req.params, req.body);
  const sql =
    "select * from menu_table where concat(menuName, menuEle, menuTaste, menuCuis) REGEXP ? ";
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

//根据菜谱id查询多个菜谱以及历史记录---客户端
router.post("/user/menuinfo", function (req, res) {
  console.log(
    "正在根据菜谱Id查询多个菜谱信息,请求参数为:",
    req.params,
    req.body
  );
  const sql =
    "select * from menu_table, record where menu_table.menuId in (?) and menu_table.menuId = record.menuId";
  const ids = req.body.menuIdsArr;
  connection
    .query(sql, [ids])
    .then((data) => {
      res.json(result.selectSuccess(data));
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
