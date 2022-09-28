/**
 * @exports
 * @param {string} parentModule
 * @param {string} moduleName
 */
export const ThrowIfAlreadyLoaded = (parentModule: any, moduleName: string) => {
  if (parentModule) {
    throw new Error(
      `${moduleName} has already been loaded. Import modules in the AppModule only.`
    );
  }
};
