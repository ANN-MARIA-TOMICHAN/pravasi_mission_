const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",     // keep if you have legacy pages/
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./**/*.{js,ts,jsx,tsx,mdx}",           // broad fallback – safe for small projects
  ],
  
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {},
  
  },
  plugins: [],
};

export default config;
