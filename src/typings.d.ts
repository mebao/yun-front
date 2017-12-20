/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare var Pinyin: pinyinConfig;
interface GetFullChars{
    value: string;
}
interface pinyinConfig {
    getFullChars(getFullCharsConfig: GetFullChars): string;
    getCamelChars(getCamelCharsConfig: GetFullChars): string;
}
