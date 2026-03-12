import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !book) {
    notFound();
  }

  const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";
  const pdfUrl = book.pdf_storage_key
    ? `${r2BaseUrl}/${book.pdf_storage_key}`
    : null;

console.log("slug:", slug);
console.log("pdf_storage_key:", book.pdf_storage_key);
console.log("r2 base:", process.env.NEXT_PUBLIC_R2_PUBLIC_URL);
console.log("pdfUrl:", pdfUrl);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{book.title}</h1>

      {pdfUrl ? (
        <>
          <iframe
            src={pdfUrl}
            title={book.title}
            className="h-[85vh] w-full rounded border"
          />
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block underline"
          >
            Open PDF in new tab
          </a>
        </>
      ) : (
        <p>No PDF available for this book yet.</p>
      )}
    </div>
  );
}
