module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      1: '1px',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
      8: '8px',
    },
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
