'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WifiOff, ArrowLeft } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">You&apos;re Offline</h1>
        <p className="text-muted-foreground mb-8">
          Don&apos;t worry! You can still review vocabulary, access completed lessons,
          and check your progress.
        </p>
        <Link href="/dashboard">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="grid grid-cols-2 gap-3 mt-8">
          {[
            { href: '/vocabulary', label: 'Review Words' },
            { href: '/achievements', label: 'Achievements' },
            { href: '/analytics', label: 'Statistics' },
            { href: '/settings', label: 'Settings' },
          ].map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant="outline" fullWidth size="sm">
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
