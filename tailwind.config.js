const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/app/**/*.{ts,tsx}',
        './src/components/**/*.{ts,tsx}',
        './src/pages/**/*.{ts,tsx}'
    ],
    plugins: [
        require('@tailwindcss/typography'),
        plugin(({matchUtilities, theme}) => {
            matchUtilities(
                {'animate-delay': value => ({'animation-delay': value})},
                {values: theme('transitionDelay')}
            );
        }),
        plugin(({matchUtilities, theme}) => {
            matchUtilities(
                {'animate-duration': value => ({'animation-duration': value})},
                {values: theme('transitionDuration')}
            );
        })
    ],
    theme: {
        extend: {
            animation: {
                'enter-right': 'enter-right 0.6s cubic-bezier(.6,.12,.38,.99) forwards',
                'enter-left': 'enter-left 0.6s cubic-bezier(.6,.12,.38,.99) forwards',
                fadeIn: 'fadeIn 0.6s cubic-bezier(.6,.12,.38,.99) forwards',
                fadeInUp: 'fadeInUp 0.6s cubic-bezier(.6,.12,.38,.99) forwards',
                'menu-open': 'menu-open 0.4s cubic-bezier(.6,.12,.38,.99) forwards',
                'menu-closed': 'menu-closed 0.2s cubic-bezier(.6,.12,.38,.99) forwards',
                'menu-open-overlay': 'menu-open-overlay 0.4s cubic-bezier(.6,.12,.38,.99) forwards',
                'menu-closed-overlay':
                    'menu-closed-overlay 0.2s cubic-bezier(.6,.12,.38,.99) forwards'
            },
            fontFamily: {
                sans: ['var(--font-body)'],
                serif: ['var(--font-title)']
            },
            keyframes: {
                'enter-right': {
                    '0%': {opacity: '0', transform: 'translateX(100%)'},
                    '100%': {opacity: '1', transform: 'translateX(0)'}
                },
                'enter-left': {
                    '0%': {opacity: '0', transform: 'translateX(-100%)'},
                    '100%': {opacity: '1', transform: 'translateX(0)'}
                },
                fadeIn: {
                    '0%': {opacity: '0'},
                    '100%': {opacity: '1'}
                },
                fadeInUp: {
                    '0%': {opacity: '0', transform: 'translateY(10px)'},
                    '100%': {opacity: '1', transform: 'translateY(0)'}
                },
                'menu-open': {
                    '0%': {opacity: '0', height: '0'},
                    '100%': {opacity: '1', height: '100vh'}
                },
                'menu-closed': {
                    '0%': {opacity: '0.8', height: '100vh'},
                    '100%': {opacity: '0', height: '0'}
                },
                'menu-open-overlay': {
                    '0%': {opacity: '0', height: '0'},
                    '100%': {opacity: '0.8', height: '100vh'}
                },
                'menu-closed-overlay': {
                    '0%': {opacity: '0.8', height: '100vh'},
                    '100%': {opacity: '0', height: '0'}
                }
            },
            screens: {
                '-sm': {max: '639px'}
            },
            colors: {
                'custom-dark-gray': '#1C1C1C',
                'custom-light-gray': '#1e1e1e',
              },
        }
    }
};
