import { Head } from '@inertiajs/react'
import { useState } from 'react'

export default function InertiaExample({ name }: { name: string }) {

  return (
    <>
      <Head title="Farhan" />
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p>Welcome </p>
    </>
  )
}
