import $ from "jquery"

let functionHavingTypeParameter = (a: string , b: number) : boolean => {

    console.log(a);
    console.log(b);

    return true;
}

let result = functionHavingTypeParameter("あ", 42);

class TypescriptClass {

    a: string;
    b: number;

    constructor(a: string, b: number) {
        this.a = a;
        this.b = b;
    }
}

let typescriptObject = new TypescriptClass("a",2, );

$(function () {

    let elem: JQuery = $("#sample");
    elem.html("これはTypescriptで操作しています");

    $(window).on("click", (e) => {
        console.log("typescript中にwindow要素にイベントを付与する");
    });
});