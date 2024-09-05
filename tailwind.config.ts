import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			'gradient-xy': 'gradient-xy 15s ease infinite',
  			'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'lightning': 'lightning 2s linear infinite',
  		},
  		keyframes: {
  			'gradient-xy': {
  				'0%, 100%': {
  					'background-size': '400% 400%',
  					'background-position': 'left top'
  				},
  				'50%': {
  					'background-size': '200% 200%',
  					'background-position': 'right bottom'
  				}
  			},
  			'lightning': {
  				'0%, 100%': {
  					opacity: '0'
  				},
  				'5%, 95%': {
  					opacity: '1'
  				}
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
