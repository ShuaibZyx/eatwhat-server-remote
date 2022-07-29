module.exports = {
    port: 3006, // express 服务启动端口
    /* 数据库相关配置 */
    db: {
      connectionLimit: 100,
      host: 'localhost', // 主机名
      port: 3306,        // MySQL 默认端口为 3306
      user: 'zyx',          // 使用 root 用户登入 MySQL
      password: '2631667689Zyx...', // MySQL 密码，用你自己的
      database: 'mydb' // 使用数据库
    }
}