'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ここからQuillのクラスの拡張
 * デフォルトで設定されているLinkクラスを拡張する
 */
var CustomLink = function (_Link) {
    _inherits(CustomLink, _Link);

    function CustomLink() {
        _classCallCheck(this, CustomLink);

        return _possibleConstructorReturn(this, (CustomLink.__proto__ || Object.getPrototypeOf(CustomLink)).apply(this, arguments));
    }

    _createClass(CustomLink, null, [{
        key: 'create',

        /**
         * スーパークラスのLinkクラスのstatic createをオーバーライド
         * @param value
         */
        value: function create(value) {
            // 現在Aタグに設定中のURL
            console.log("aタグ href ===>", value);
            var node = _get(CustomLink.__proto__ || Object.getPrototypeOf(CustomLink), 'create', this).call(this, value);
            value = Link.sanitize(value);
            node.setAttribute('href', value);
            // URLが特定の条件の場合は target="_blank" を削除する

            // URL /(スラッシュ)から始まるもの
            if (value.search(/^\//) !== -1) {
                node.removeAttribute('target');
            } else if (value.indexOf("fukuoka-leapup.jp") !== -1) {
                node.removeAttribute('target');
            } else if (value.indexOf("fukuoka-leapup.com") !== -1) {
                node.removeAttribute('target');
            } else {
                node.setAttribute("target", "_blank");
            }
            return node;
        }
    }]);

    return CustomLink;
}(Link);
/** ここまでLinkクラスの拡張 **/
