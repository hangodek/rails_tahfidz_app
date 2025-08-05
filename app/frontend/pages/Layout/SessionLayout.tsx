import React from "react";

export default function SessionLayout({children} : {children: React.ReactNode}) {
  return (
    <>
      <main className="flex items-center justify-center min-h-screen min-w-screen">
        { children }
      </main>
    </>
  )
}