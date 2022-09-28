// @see https://github.com/swimlane/ngx-charts/issues/1623#issuecomment-842474360
module.exports = {
  packages: {
    '@swimlane/ngx-charts': {
      entryPoints: {
        '.': { override: { main: undefined } },
      },
    },
  },
};
