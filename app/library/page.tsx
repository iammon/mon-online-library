import Link from "next/link";
import { supabase } from "@/lib/supabase";

type SearchParams = Promise<{
    q?: string;
    subject?: string;
}>;

type BookRow = {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    publication_year: number | null;
    language: string | null;
};

type SubjectRow = {
    id: string;
    name: string;
    slug: string;
};

type BookSubjectRow = {
    book_id: string;
    subject_id: string;
};

const subjectCoverMap: Record<string, string> = {
    math: "/subject_covers/math.png",
    "computer-science": "/subject_covers/computer-science.png",
    science: "/subject_covers/science.png",
    business: "/subject_covers/business.png",
    humanities: "/subject_covers/humanities.png",
    nursing: "/subject_covers/nursing.png",
    "social-science": "/subject_covers/social-science.png",
    "college-success": "/subject_covers/college-success.png",
};

export default async function LibraryPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;
    const queryText = params.q?.trim() ?? "";
    const subjectSlug = params.subject?.trim() ?? "";

    const [
        { data: subjects, error: subjectsError },
        { data: books, error: booksError },
        { data: bookSubjects, error: bookSubjectsError },
    ] = await Promise.all([
        supabase.from("subjects").select("id, name, slug").order("name"),
        supabase
            .from("books")
            .select("id, slug, title, description, publication_year, language")
            .eq("is_published", true)
            .order("title", { ascending: true }),
        supabase.from("book_subjects").select("book_id, subject_id"),
    ]);

    if (subjectsError || booksError || bookSubjectsError) {
        return (
            <div>
                <h1 className="text-3xl font-bold">Library</h1>
                <p className="mt-4 text-red-600">Failed to load library data.</p>
            </div>
        );
    }

    const safeSubjects: SubjectRow[] = subjects ?? [];
    const safeBooks: BookRow[] = books ?? [];
    const safeBookSubjects: BookSubjectRow[] = bookSubjects ?? [];

    const bookToSubject = new Map<string, string>();

    safeBookSubjects.forEach((row) => {
        const subject = safeSubjects.find((s) => s.id === row.subject_id);
        if (subject) {
            bookToSubject.set(row.book_id, subject.slug);
        }
    });

    const selectedSubject =
        safeSubjects.find((subject) => subject.slug === subjectSlug) ?? null;

    let filteredBooks = safeBooks;

    if (selectedSubject) {
        const allowedBookIds = new Set(
            safeBookSubjects
                .filter((row) => row.subject_id === selectedSubject.id)
                .map((row) => row.book_id),
        );

        filteredBooks = filteredBooks.filter((book) =>
            allowedBookIds.has(book.id),
        );
    }

    if (queryText !== "") {
        const loweredQuery = queryText.toLowerCase();

        filteredBooks = filteredBooks.filter((book) => {
            const titleMatch = book.title.toLowerCase().includes(loweredQuery);
            const descriptionMatch = (book.description ?? "")
                .toLowerCase()
                .includes(loweredQuery);

            return titleMatch || descriptionMatch;
        });
    }

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl font-bold sm:text-4xl">Library</h1>
                <p className="mt-3 text-gray-600">
                    {selectedSubject && queryText
                        ? `Showing results for "${queryText}" in ${selectedSubject.name}.`
                        : selectedSubject
                          ? `Showing books in ${selectedSubject.name}.`
                          : queryText
                            ? `Showing results for "${queryText}".`
                            : "Browse all published books."}
                </p>
            </div>

            <form
                action="/library"
                method="get"
                className="mb-10 rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
                <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
                    <input
                        name="q"
                        type="text"
                        defaultValue={queryText}
                        placeholder="Search books..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-black"
                    />

                    <select
                        name="subject"
                        defaultValue={subjectSlug}
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

            {filteredBooks.length === 0 ? (
                <p className="text-gray-600">No books found.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredBooks.map((book) => (
                        <article
                            key={book.id}
                            className="flex gap-4 rounded-xl border border-gray-200 p-5 shadow-sm"
                        >
                            <div className="flex w-24 flex-shrink-0 items-center justify-center">
                                <img
                                    src={
                                        subjectCoverMap[
                                            bookToSubject.get(book.id) ?? ""
                                        ] ?? "/book.png"
                                    }
                                    alt="Book cover"
                                    className="w-full aspect-[2/3] object-cover rounded-md border"
                                />
                            </div>

                            <div className="flex flex-col">
                                <h2 className="text-xl font-semibold">
                                    {book.title}
                                </h2>

                                <div className="mt-2 text-sm text-gray-500">
                                    {book.publication_year ?? "Year unknown"}
                                    {book.language ? ` • ${book.language}` : ""}
                                </div>

                                <p className="mt-3 text-sm text-gray-600">
                                    {book.description ??
                                        "No description available."}
                                </p>

                                <Link
                                    href={`/library/${book.slug}`}
                                    className="mt-3 text-sm font-medium text-black underline underline-offset-4"
                                >
                                    View book
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}