



/**
 * テストクラス
 */
class TestClass {

  constructor () {
    console.log("これはコンストラクタ");
  }

  aMethod() {
    console.log("aMethod");
  }
}


let testClass = new TestClass();

testClass.aMethod();


(() => {
  alert("アロー関数");
})();
