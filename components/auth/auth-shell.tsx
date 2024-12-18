import { cn } from '@/lib/utils'

interface AuthShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function AuthShell({ children, className, ...props }: AuthShellProps) {
  return (
    <div
      className={cn(
        'container flex min-h-screen w-full flex-col items-center justify-center gap-6 pb-8 pt-6 md:py-10 ',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
