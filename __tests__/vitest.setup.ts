import { vi } from 'vitest'
import React from 'react'

// Ensure React is available globally when rendering TSX in tests
;(globalThis as any).React = React

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
}))

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({ theme: 'light', setTheme: vi.fn(), resolvedTheme: 'light', systemTheme: 'light' }),
}))

vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => null,
}))

vi.mock('@vercel/analytics/next', () => ({
  Analytics: () => null,
}))

vi.mock('next/script', () => ({
  default: ({ children }: { children?: React.ReactNode }) => children ?? null,
}))
