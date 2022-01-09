Object.defineProperty(exports, "__esModule", { value: true });
const tsconfigPathsHook = require("@nestjs/cli/lib/compiler/hooks/tsconfig-paths.hook");
const tsPaths = require("tsconfig-paths");
function afterDeclarations(_, config) {
  return tsconfigPathsHook.tsconfigPathsBeforeHookFactory(config.getCompilerOptions());
}
const originalCreateMatchPath = tsPaths.createMatchPath;
tsPaths.createMatchPath = function (absoluteBaseUrl, paths, mainFields, addMatchAll) {
  const matcher = originalCreateMatchPath(absoluteBaseUrl, paths, mainFields, addMatchAll);
  return (requestedModule, readJson, fileExists, extensions) => {
    if (extensions[0] === ".ts" && extensions[1] === ".js")
      return matcher(requestedModule, readJson, fileExists, [...extensions, ".tsx"]);

    return matcher(requestedModule, readJson, fileExists, extensions);
  };
};
exports.afterDeclarations = afterDeclarations;
