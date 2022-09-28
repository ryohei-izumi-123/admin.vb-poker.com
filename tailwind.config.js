module.exports = {
  // mode: 'jit',
  prefix: 'tw-',
  purge: {
    enabled: true,
    options: {
      whitelist: ['text-green-500', 'text-green-400', 'text-green-400'],
    },
    content: [
      './src/app/pages/*/*/*.{html,ts}',
      './src/app/pages/*/*.{html,ts}',
      './src/app/shared/components/*/*.{html,ts}',
      './src/app/*.{html,ts}',
    ],
  },
  darkMode: 'media',
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
  },
  corePlugins: {
    preflight: true,
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
