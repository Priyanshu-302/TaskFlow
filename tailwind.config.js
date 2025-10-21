// tailwind.config.js
module.exports = {
  content: [
    "./dist/**/*.{html,js}", // Adjust this to match your project's file structure
    // e.g., if you're using React with .jsx files in a public directory, it might be:
    // "./public/**/*.html",
    // "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
