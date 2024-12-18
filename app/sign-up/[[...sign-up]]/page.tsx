import { SignUp } from '@clerk/nextjs'
import { AuthShell } from '@/components/auth/auth-shell'

export default function SignUpPage() {
  return (
    <AuthShell className=' m-auto'>
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto w-full',
            card: 'bg-background shadow-none border rounded-xl mx-auto',
            headerTitle: 'text-2xl font-bold',
            headerSubtitle: 'text-muted-foreground',
            socialButtonsBlockButton:
              'bg-white hover:bg-gray-50 text-black border',
            formButtonPrimary: 'bg-primary hover:bg-primary/90',
            footerAction: 'text-muted-foreground',
            formFieldLabel: 'text-foreground',
            formFieldInput: 'bg-background border',
            dividerLine: 'bg-border',
            dividerText: 'text-muted-foreground',
          },
        }}
      />
    </AuthShell>
  )
}
