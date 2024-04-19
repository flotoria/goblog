
import Header from "@/components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return(
    <>
      <Header />
      <div className="p-3">
        { children }
      </div>
    </>
  )
}
