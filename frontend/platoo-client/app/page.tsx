import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-orange-600 sm:text-[5rem]">Platoo</h1>
        <p className="text-xl text-gray-700">Your favorite food ordering platform</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-50">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

