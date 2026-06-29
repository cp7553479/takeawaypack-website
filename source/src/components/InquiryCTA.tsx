import Link from "next/link";

export default function InquiryCTA() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="overflow-hidden rounded-2xl bg-brand-700 px-6 py-12 text-white sm:px-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to get a quotation?
              </h2>
              <p className="mt-2 text-brand-50">
                Send your specifications, target quantity, and destination so pricing, MOQ, and
                timing can be confirmed against the exact request.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn bg-white text-brand-700 hover:bg-brand-50">
                Request Inquiry
              </Link>
              <Link
                href="/products"
                className="btn border border-brand-400 text-white hover:bg-brand-600"
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
