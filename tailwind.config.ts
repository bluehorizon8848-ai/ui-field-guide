import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF9F6',
        surface: '#FFFFFF',
        ink: '#1A1917',
        ink2: '#4A4740',
        // #7A766D 在 #FAF9F6 上只有 4.3:1，AA 要求 4.5:1。
        // 这是「次要文字」色，涵盖 meta 标签、说明、时间戳等，
        // 仍需可读，所以压深一档。
        muted: '#6E6A61',
        line: '#E6E3DB',
        line2: '#F0EDE6',
        accent: {
          navigation: '#35618E',
          actions: '#B4581E',
          input: '#2C7355',
          containers: '#94701C',
          feedback: '#A8342C',
          data: '#2F6E75',
          interaction: '#5F6B33',
          general: '#3A3833',
          layout: '#584B8A',
        },
        tint: {
          navigation: '#EEF3F8',
          actions: '#FAF1EA',
          input: '#ECF5F0',
          containers: '#F8F2E4',
          feedback: '#FAEDEC',
          data: '#ECF3F4',
          interaction: '#F0F3E7',
          general: '#F2F0EB',
          layout: '#F2F0F7',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        serif: ['ui-serif', 'Georgia', '"Songti SC"', '"Times New Roman"', 'serif'],
        mono: [
          'ui-monospace',
          '"SF Mono"',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,25,23,0.04)',
        lift: '0 2px 6px rgba(26,25,23,0.06), 0 1px 2px rgba(26,25,23,0.04)',
        pop: '0 12px 32px -8px rgba(26,25,23,0.16), 0 2px 8px rgba(26,25,23,0.06)',
      },
      borderRadius: {
        card: '10px',
      },
      maxWidth: {
        content: '1080px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(-10px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'snack-in': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        indeterminate: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 160ms ease-out both',
        'rise-in': 'rise-in 200ms ease-out both',
        'slide-up': 'slide-up 240ms cubic-bezier(0.32, 0.72, 0, 1) both',
        'slide-down': 'slide-down 240ms cubic-bezier(0.32, 0.72, 0, 1) both',
        'toast-in': 'toast-in 200ms cubic-bezier(0.32, 0.72, 0, 1) both',
        'snack-in': 'snack-in 220ms cubic-bezier(0.32, 0.72, 0, 1) both',
        'sheet-up': 'sheet-up 260ms cubic-bezier(0.32, 0.72, 0, 1) both',
        'slide-in-left': 'slide-in-left 240ms cubic-bezier(0.32, 0.72, 0, 1) both',
        indeterminate: 'indeterminate 1.1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
