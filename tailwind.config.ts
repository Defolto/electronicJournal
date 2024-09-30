import type { Config } from 'tailwindcss'

const config: Config = {
   content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   theme: {
      colors: {
         firstBg: 'var(--first-bg-color)',
         secondBg: 'var(--second-bg-color)',
         red: 'var(--red-color)',
         blue: 'var(--blue-color)',
         white: 'var(--white-color)',
         green: 'var(--green-color)',
         gray: 'var(--gray-color)',
         black: 'var(--black-color)',
         yellow: 'var(--yellow-color)',
         transparent: 'transparent',
      },
      extend: {
         keyframes: {
            slideInLeft: {
               '0%': { transform: 'translateX(100%)' },
               '100%': { transform: 'translateX(0)' },
            },
            fadeIn: {
               '0%': { opacity: '0' },
               '100%': { opacity: '1' },
            },
            blink: {
               '0%': { opacity: '1' },
               '50%': { opacity: '0' },
               '100%': { opacity: '1' },
            },
            rotate: {
               '0%': { transform: 'rotate(0deg)' },
               '100%': { transform: 'rotate(360deg)' },
            },
         },
      },
   },
   plugins: [],
}
export default config
