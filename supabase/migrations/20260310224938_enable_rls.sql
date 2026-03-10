alter table books enable row level security;
alter table authors enable row level security;
alter table subjects enable row level security;
alter table book_authors enable row level security;
alter table book_subjects enable row level security;

create policy "Public can read books"
on books
for select
using (is_published = true);

create policy "Public can read authors"
on authors
for select
using (true);

create policy "Public can read subjects"
on subjects
for select
using (true);

create policy "Public can read book_authors"
on book_authors
for select
using (true);

create policy "Public can read book_subjects"
on book_subjects
for select
using (true);
