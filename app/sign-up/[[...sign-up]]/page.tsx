import { SignUp } from '@clerk/nextjs'
import { AuthShell } from '@/components/auth/auth-shell'

export default function SignUpPage() {
  return (
    <AuthShell className=' m-auto'>
      <h1 className='text-3xl font-bold mb-4'>Welcome to Scrum Poker</h1>
      <p className='text-muted-foreground mb-6'>
        Sign up to organize your Scrum planning quickly and efficiently. Start
        your next meeting right here!
      </p>
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
      <footer className='mt-6 text-center text-sm text-muted-foreground'>
        <p>
          Already have an account?{' '}
          <a href='/sign-in' className='text-primary'>
            Log in here{' '}
          </a>
        </p>
      </footer>
    </AuthShell>
  )
}
