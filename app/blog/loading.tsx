import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#F5F3EC] flex flex-col font-sans text-[#0B1220]">
      <Header variant="light" />

      <main className="flex-1 pt-10 pb-20 md:pt-14 md:pb-28">
        <div className="mx-auto max-w-[1340px] px-6 md:px-12 animate-pulse">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-32 bg-slate-200 rounded mb-8" />

          {/* Header Skeleton */}
          <div className="h-6 w-44 bg-[#FF8A00]/20 rounded-full mb-4" />
          <div className="h-12 w-3/4 max-w-xl bg-slate-200 rounded-lg mb-4" />
          <div className="h-5 w-full max-w-lg bg-slate-200/60 rounded mb-14" />

          {/* Card Skeleton */}
          <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 md:p-14 shadow-sm">
            <div className="h-6 w-48 bg-[#FF8A00]/20 rounded-full mx-auto mb-6" />
            <div className="h-8 w-2/3 bg-slate-200 rounded mx-auto mb-4" />
            <div className="h-4 w-full bg-slate-100 rounded max-w-md mx-auto mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-36 bg-[#F5F3EC] rounded-xl border border-slate-200/60" />
              <div className="h-36 bg-[#F5F3EC] rounded-xl border border-slate-200/60" />
              <div className="h-36 bg-[#F5F3EC] rounded-xl border border-slate-200/60" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
