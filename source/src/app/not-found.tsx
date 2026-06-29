import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-page max-w-xl text-center">
        <p className="text-5xl font-extrabold tracking-tight text-brand-700">404</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Page not found</h1>
        <p className="lead mt-3">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Back to home</Link>
          <Link href="/products" className="btn-outline">Browse products</Link>
        </div>
      </div>
    </section>
  );
}
