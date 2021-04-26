module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minWidth: {
      250: '250px',
    },
    minHeight: {
      100: '100px',
    },
    extend: {
      height: {
        almost: 'calc(100vh - 80px)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
