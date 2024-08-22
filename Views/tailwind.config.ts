import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-inset': 'inset 8px 0px 8px 0px rgba(0, 0, 0, 0.25)',
        'custom-offset': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        'white-offset': '0px 0px 8px 8px rgba(255, 255, 255, 0.15)'
      },
    },
  },
  plugins: [],
};
export default config;
