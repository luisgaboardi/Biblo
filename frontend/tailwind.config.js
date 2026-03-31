/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Criamos o movimento discreto: leve aumento de tamanho + subida curta
        softEntrance: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        // Se quiser manter o nome "bounce" mas mudar o comportamento:
        quietBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-1px)' },
        }
      },
      animation: {
        shake: 'shake 0.2s ease-in-out 0s 2',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        modal: 'softEntrance 0.5s ease-out forwards',
        bounce: 'quietBounce 1s infinite',
      },
    },
  },
  plugins: [],
}