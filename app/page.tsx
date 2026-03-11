import Link from "next/link";
import { supabase } from "@/lib/supabase";

type SubjectRow = {
    id: string;
    name: string;
    slug: string;
};

export default async function HomePage() {
    const { data: subjects, error } = await supabase
        .from("subjects")
        .select("id, name, slug")
        .order("name", { ascending: true });

    if (error) {
        return (
            <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Mon Online Library
                    </h1>
                    <p className="mt-4 text-red-600">
                        Failed to load subjects: {error.message}
                    </p>
                </div>
            </main>
        );
    }

    const safeSubjects: SubjectRow[] = subjects ?? [];

    return (
        <main className="min-h-screen bg-white text-gray-900">
            <section className="mx-auto flex max-w-4xl flex-col px-6 py-24">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Mon Online Library
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-gray-600">
                    A public digital library for books, learning resources, and
                    future Mon-language materials.
                </p>

                <form
                    action="/library"
                    method="get"
                    className="mt-10 rounded-2xl border border-gray-200 p-6 shadow-sm"
                >
                    <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
                        <input
                            name="q"
                            type="text"
                            placeholder="Search books..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-black"
                        />

                        <select
                            name="subject"
                            defaultValue=""
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                        >
                            <option value="">All subjects</option>
                            {safeSubjects.map((subject) => (
                                <option key={subject.id} value={subject.slug}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <div className="mt-8">
                    <Link
                        href="/library"
                        className="text-sm font-medium underline underline-offset-4"
                    >
                        View all books
                    </Link>
                </div>
            </section>
        </main>
    );
}
