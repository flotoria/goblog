
import Header from "@/components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return(
    <>
      <Header/>
      <div className="p-3 bg-slate-100 min-h-dvh">
        { children }
      </div>
    </>
  )
}
