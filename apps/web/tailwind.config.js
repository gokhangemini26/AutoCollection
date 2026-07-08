/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ink: '#0C0B09',
                carbon: '#161411',
                seam: '#2A2723',
                ivory: '#EDE7DA',
                taupe: '#9C927F',
                champagne: '#C3A46E',
            },
            fontFamily: {
                display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
                sans: ['Manrope', 'system-ui', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'monospace'],
            },
            letterSpacing: {
                luxe: '0.35em',
            },
        },
    },
    plugins: [],
}
