// components/ThemeDebug.tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function ThemeDebug() {
  const { theme, resolvedTheme, systemTheme } = useTheme()

  useEffect(() => {
    console.log('Theme Debug:', {
      theme,
      resolvedTheme,
      systemTheme,
      htmlClass: document.documentElement.className
    })
  }, [theme, resolvedTheme, systemTheme])

  return null
}