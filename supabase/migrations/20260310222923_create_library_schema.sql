-- BOOKS TABLE
create table books (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  language text,
  publisher text,
  publication_year integer,
  page_count integer,
  license_name text,
  license_url text,
  attribution_text text,

  pdf_storage_key text not null,
  cover_storage_key text,
  thumbnail_storage_key text,

  is_featured boolean default false,
  is_published boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- AUTHORS TABLE
create table authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  bio text,

  created_at timestamptz default now()
);


-- SUBJECTS TABLE
create table subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text
);


-- BOOK AUTHORS (JOIN TABLE)
create table book_authors (
  book_id uuid references books(id) on delete cascade,
  author_id uuid references authors(id) on delete cascade,
  author_order integer default 1,

  primary key (book_id, author_id)
);


-- BOOK SUBJECTS (JOIN TABLE)
create table book_subjects (
  book_id uuid references books(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,

  primary key (book_id, subject_id)
);


-- INDEXES FOR PERFORMANCE
create index idx_books_slug on books(slug);
create index idx_authors_slug on authors(slug);
create index idx_subjects_slug on subjects(slug);
create index idx_book_authors_book on book_authors(book_id);
create index idx_book_authors_author on book_authors(author_id);
create index idx_book_subjects_book on book_subjects(book_id);
create index idx_book_subjects_subject on book_subjects(subject_id);