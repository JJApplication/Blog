// 生产环境下禁用console
if (!import.meta.env.DEV) {
  console.log = function () {}
  console.warn = function () {}
  console.error = function () {}
  console.info = function () {}
}
