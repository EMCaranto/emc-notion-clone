'use client'

// React JS
import React from 'react'

// Next JS
import { useRouter } from 'next/navigation'

// Dependencies
import {
  LucideIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from 'convex/react'

// Components
import { Skeleton } from '@/components/ui/skeleton'

// Convex
import { Id } from '../../../../convex/_generated/dataModel'
import { api } from '../../../../convex/_generated/api'

// Libraries
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  id?: Id<'documents'>
  documentIcon?: string
  icon: LucideIcon
  label: string
  active?: boolean
  expanded?: boolean
  level?: number
  isSearch?: boolean
  onExpand?: () => void
  onClick: () => void
}

const SidebarItem = ({
  id,
  documentIcon,
  icon: Icon,
  label,
  active,
  expanded,
  level = 0,
  isSearch,
  onExpand,
  onClick,
}: SidebarItemProps) => {
  const create = useMutation(api.documents.create)
  const router = useRouter()

  const ChevronIcon = expanded ? ChevronDownIcon : ChevronRightIcon

  const onCreateHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation()

    if (!id) return

    const promise = create({ title: 'Untitled', parentDocument: id }).then(
      (documentId) => {
        if (!expanded) {
          onExpand?.()
        }
        // router.push(`/documents/${documentId}`)
      }
    )

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    })
  }

  const onExpandHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation()
    onExpand?.()
  }

  return (
    <div
      className={cn(
        'group flex min-h-10 w-full items-center py-1 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5',
        active && 'bg-primary/5 text-primary'
      )}
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : '12px',
      }}
      role="button"
      onClick={onClick}
    >
      {!!id && (
        <div
          className="mr-1 h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600"
          role="button"
          onClick={onExpandHandler}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="mr-2 shrink-0 text-lg">{documentIcon}</div>
      ) : (
        <Icon className="mr-2 h-4 shrink-0 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
          <span className="text-xs">CTRL + K</span>
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <div
            className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
            role="button"
            onClick={onCreateHandler}
          >
            <PlusIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

export default SidebarItem

// Skeleton
SidebarItem.Skeleton = function SidebarItemSkeleton({
  level,
}: {
  level?: number
}) {
  return (
    <div
      className="flex gap-x-2 py-1"
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : '12px' }}
    >
      <Skeleton className="h-4 w-4 " />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}
