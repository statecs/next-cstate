'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { pageview } from '@/lib/gtag'

export function Analytics() {
  const pathname = usePathname()
  const [searchParams, setSearchParams] = useState('')

  useEffect(() => {
    setSearchParams(window.location.search)
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      const url = pathname + searchParams
      pageview(url)
    }
  }, [pathname, searchParams])

  return null
}