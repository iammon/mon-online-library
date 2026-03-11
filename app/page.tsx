import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            <section className="mx-auto flex max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Mon Online Library
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-gray-600">
                    A public digital library for books, learning resources, and
                    future Mon-language materials.
                </p>

                <div className="mt-8">
                    <Link
                        href="/library"
                        className="rounded-lg bg-black px-6 py-3 text-white transition hover:opacity-90"
                    >
                        Browse Library
                    </Link>
                </div>
            </section>
        </main>
    );
}