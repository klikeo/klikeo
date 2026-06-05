import Navbar from "@/src/components/Navbar"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Navbar /> */}
      <main>{children}</main>
    </>
  )
}
