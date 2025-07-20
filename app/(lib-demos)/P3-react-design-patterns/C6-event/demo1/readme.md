主要是为了实验
+ 关闭browser默认的tab -> focus行为
  + `tabIndex = {-1}`
+ 自定义一个component, 允许在其parent component中处理它的event来提升灵活性
+ 捕获simple keydown (e.g. enter) 和 composite keydown (e.g. cmd + enter, shift + enter)