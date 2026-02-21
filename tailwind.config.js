/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		// Breakpoints customizados para melhor responsividade
		screens: {
			'xs': '480px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',  // Breakpoint principal: menu desktop aparece aqui
			'sidebar': '1315px',  // Breakpoint para sidebars e imagem do navbar
			'xl': '1280px',
			'2xl': '1536px',
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
			},
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Cores do sistema de design OitoPorOito
				gold: {
					DEFAULT: 'hsl(var(--gold))',
					light: 'hsl(var(--gold-light))',
					lighter: 'hsl(var(--gold-lighter))',
				},
				surface: {
					primary: 'hsl(var(--surface-primary))',
					secondary: 'hsl(var(--surface-secondary))',
					tertiary: 'hsl(var(--surface-tertiary))',
					card: 'hsl(var(--surface-card))',
				},
				// Cores semânticas (shadcn compatible)
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				// Badges de títulos
				badge: {
					gm: 'hsl(var(--badge-gm))',
					im: 'hsl(var(--badge-im))',
					fm: 'hsl(var(--badge-fm))',
					nm: 'hsl(var(--badge-nm))',
					cm: 'hsl(var(--badge-cm))',
				},
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				md: 'var(--radius-md)',
				sm: 'var(--radius-sm)',
				xl: 'var(--radius-xl)',
				'2xl': 'var(--radius-2xl)',
			},
			boxShadow: {
				'card': 'var(--shadow-md)',
				'card-lg': 'var(--shadow-lg)',
				'card-xl': 'var(--shadow-xl)',
			},
			maxWidth: {
				'content': 'var(--max-width-content)',
				'narrow': 'var(--max-width-narrow)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				'slide-up': {
					from: { opacity: '0', transform: 'translateY(30px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both',
				'slide-up': 'slide-up 0.7s cubic-bezier(0.4,0,0.2,1) both',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
