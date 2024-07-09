'use client'

import { event } from '@/lib/gtag'

export const sendGAEvent = (action: string, category: string, label: string, value?: number) => {
  if (process.env.NODE_ENV !== 'development') {
    event({ action, category, label, value })
  }
}