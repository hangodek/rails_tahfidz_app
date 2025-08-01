import { Button } from "@/components/ui/button"

export default function Dashboard({user} : { user: any}) {
  return (
    <>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome {user.username} </p>
      <Button>Click me</Button>
    </>
  )
}