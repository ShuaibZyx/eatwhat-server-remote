const mysql = require("mysql");

const config = require("./config").db; // 获取数据库配置信息

var pool = mysql.createPool(config); // mysql.createPool 方法创建连接连接池

exports.query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      connection.query(sql, params, (err, result) => {
        //释放连接
        connection.release();
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  });
};
