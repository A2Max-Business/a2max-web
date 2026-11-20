import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-[#F5F3EC] flex flex-col font-sans text-[#0B1220]">
      <Header variant="light" />

      <main className="flex-1 pt-8 pb-20 md:pt-12 md:pb-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 animate-pulse">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-48 bg-slate-200 rounded mb-8" />

          {/* Header Skeleton */}
          <div className="mx-auto max-w-4xl mb-12">
            <div className="h-6 w-28 bg-[#FF8A00]/20 rounded-full mb-4" />
            <div className="h-12 w-full max-w-2xl bg-slate-200 rounded-lg mb-4" />
            <div className="h-6 w-3/4 max-w-lg bg-slate-200/60 rounded mb-8" />

            {/* Author Skeleton */}
            <div className="flex items-center gap-3 pt-6 border-t border-[#0B1220]/10">
              <div className="h-10 w-10 bg-slate-200 rounded-full" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-24 bg-slate-200/60 rounded" />
              </div>
            </div>
          </div>

          {/* Cover Skeleton */}
          <div className="mx-auto max-w-4xl mb-12">
            <div className="aspect-[16/9] w-full bg-slate-200 rounded-2xl" />
          </div>

          {/* Reading Column Skeleton */}
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 md:p-16 shadow-sm space-y-4">
              <div className="h-4 w-full bg-slate-200/80 rounded" />
              <div className="h-4 w-11/12 bg-slate-200/80 rounded" />
              <div className="h-4 w-4/5 bg-slate-200/80 rounded" />
              <div className="h-8 w-1/2 bg-slate-200 rounded my-8" />
              <div className="h-4 w-full bg-slate-200/80 rounded" />
              <div className="h-4 w-5/6 bg-slate-200/80 rounded" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

