module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minWidth: {
      250: '250px',
      150: '150px',
    },
    minHeight: {
      100: '100px',
      80: '80px',
      50: '50px',
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
