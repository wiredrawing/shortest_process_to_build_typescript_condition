
/**
 * ここからQuillのクラスの拡張
 * デフォルトで設定されているLinkクラスを拡張する
 */
class CustomLink extends Link {
    /**
     * スーパークラスのLinkクラスのstatic createをオーバーライド
     * @param value
     */
    static create(value) {
        // 現在Aタグに設定中のURL
        console.log("aタグ href ===>", value);
        let node = super.create(value);
        value = Link.sanitize(value);
        node.setAttribute('href', value);
        // URLが特定の条件の場合は target="_blank" を削除する

        // URL /(スラッシュ)から始まるもの
        if ( value.search(/^\//) !== -1) {
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
}
/** ここまでLinkクラスの拡張 **/