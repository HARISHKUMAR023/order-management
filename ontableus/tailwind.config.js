/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: ['./App.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}','./ui/**/*.{js,jsx,ts,tsx}','./pages/**/*.{js,jsx,ts,tsx}','./app/(tabs)/*.{js,jsx,ts,tsx}'], 
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

