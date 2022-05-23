import $ from "jquery"

$(function () {

  class TestClass {


    constructor(a: string, b: number) {
      console.log(a);
      console.log(b);
    }
  }


  // let a = new TestClass(4, "あ");

  let a = new TestClass("あ", 34);


  console.log($);

  let elem: JQuery = $("<h1>").html("H1タグを作成");

  console.log(elem);

  console.log($("div"));
  $("div").eq(0).append(elem);

})

