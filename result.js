module.exports = {
  selectSuccess: (data) => {
    return {
      msg: "查询成功",
      code: 200,
      data: data,
    };
  },

  error() {
    return {
      msg: "系统异常",
      code: 500,
      data: null,
    };
  },

  updateSuccess() {
    return {
      msg: "更新成功",
      code: 200,
      data: null,
    };
  },
};
