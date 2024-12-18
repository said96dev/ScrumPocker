'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormInput } from '@/utils/contactShema'
import { MessageCircle, Bug, Lightbulb, Send } from 'lucide-react'
import Image from 'next/image'
import contact from '@/assets/contact.svg'
export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      type: 'feedback',
      message: '',
    },
  })

  async function onSubmit(data: ContactFormInput) {
    setIsSubmitting(true)
    try {
      // Here you would typically send the data to your backend
      console.log(data)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setSubmitted(true)
    } catch (error) {
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className=' mx-auto  container max-w-2xl py-8'>
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body text-center'>
            <h2 className='card-title justify-center text-2xl mb-4'>
              Thank You! 🎉
            </h2>
            <p className='text-base-content/70'>
              Your message has been received. We appreciate your feedback and
              will get back to you soon if needed.
            </p>
            <div className='card-actions justify-center mt-6'>
              <button
                className='btn btn-primary'
                onClick={() => {
                  setSubmitted(false)
                  form.reset()
                }}
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main>
      <div className=' mx-auto px-4 sm:px-8 flex  justify-center py-6 items-center'>
        <div className='card bg-base-100 shadow-xl '>
          <div className='card-body'>
            <h2 className='card-title'>Contact Us</h2>
            <p className='text-base-content/70'>
              Have feedback, found a bug, or want to suggest a new feature?
              We&apos;d love to hear from you!
            </p>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6 mt-6'
            >
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>Your Name</span>
                </label>
                <input
                  type='text'
                  placeholder='John Doe'
                  className='input input-bordered w-full'
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <label className='label'>
                    <span className='label-text-alt text-error'>
                      {form.formState.errors.name.message}
                    </span>
                  </label>
                )}
              </div>

              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>Email Address</span>
                </label>
                <input
                  type='email'
                  placeholder='john@example.com'
                  className='input input-bordered w-full'
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <label className='label'>
                    <span className='label-text-alt text-error'>
                      {form.formState.errors.email.message}
                    </span>
                  </label>
                )}
              </div>

              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>Message Type</span>
                </label>
                <select
                  className='select select-bordered w-full'
                  {...form.register('type')}
                >
                  <option value='feedback'>General Feedback</option>
                  <option value='bug'>Report a Bug</option>
                  <option value='feature'>Feature Request</option>
                </select>
              </div>

              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>Your Message</span>
                </label>
                <textarea
                  className='textarea textarea-bordered h-32'
                  placeholder="Tell us what's on your mind..."
                  {...form.register('message')}
                />
                {form.formState.errors.message && (
                  <label className='label'>
                    <span className='label-text-alt text-error'>
                      {form.formState.errors.message.message}
                    </span>
                  </label>
                )}
              </div>

              <button
                type='submit'
                className={`btn btn-primary w-full ${
                  isSubmitting ? 'loading' : ''
                }`}
                disabled={isSubmitting}
              >
                {!isSubmitting && <Send className='w-4 h-4 mr-2' />}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
