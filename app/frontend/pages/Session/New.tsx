import SessionLayout  from "@/pages/Layout/SessionLayout"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"
import { useForm } from "@inertiajs/react"

export default function Session() {

  const { data, setData, post, processing } = useForm({
    username: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/session')
  }

  return (
    <>
      <SessionLayout>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    onChange={(e) => setData('username', e.target.value)}
                    value={data.username}
                    required
                    autoFocus
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    onChange={(e) => setData('password', e.target.value)}
                    value={data.password}
                    required
                  />
                </div>
                <Button type="submit" className="w-full cursor-pointer" disabled={processing}>
                  {processing ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </SessionLayout>
    </>
  )
}