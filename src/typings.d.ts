declare module '*.json';
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// `tsconfig.json`の `"allowJs": true` および `"noImplicitAny": false` が必須。
// `ng build`が失敗する場合は `angular.json` の `"buildOptimizer": false`も指定する。
declare module '@ckeditor/ckeditor5-build-classic' {
  const ClassicEditorBuild: any;

  export = ClassicEditorBuild;
}
declare module '@fizz.js/ckeditor5' {
  const ClassicEditorBuild: any;

  export = ClassicEditorBuild;
}
