-- Supabase Postgres schema for the Skill-TERN API.
-- The backend stores the full API document plus indexed relational columns.
create table if not exists public.skilltern_users (
  document_id text primary key,
  email text not null unique,
  username text not null unique,
  role text not null check (role in ('student', 'recruiter')),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skilltern_skills (
  document_id text primary key,
  name text not null unique,
  category text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skilltern_swaps (
  document_id text primary key,
  sender_id text not null references public.skilltern_users(document_id) on delete cascade,
  receiver_id text not null references public.skilltern_users(document_id) on delete cascade,
  skill_offered_id text not null references public.skilltern_skills(document_id),
  skill_wanted_id text not null references public.skilltern_skills(document_id),
  status text not null check (status in ('pending', 'accepted', 'rejected', 'completed')),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skilltern_messages (
  document_id text primary key,
  sender_id text not null references public.skilltern_users(document_id) on delete cascade,
  receiver_id text not null references public.skilltern_users(document_id) on delete cascade,
  read boolean not null default false,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skilltern_transactions (
  document_id text primary key,
  user_id text not null references public.skilltern_users(document_id) on delete cascade,
  related_user_id text references public.skilltern_users(document_id) on delete set null,
  type text,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skilltern_internships (
  document_id text primary key,
  posted_by_id text references public.skilltern_users(document_id) on delete set null,
  status text not null check (status in ('open', 'closed')),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skilltern_applications (
  document_id text primary key,
  internship_id text not null references public.skilltern_internships(document_id) on delete cascade,
  applicant_id text not null references public.skilltern_users(document_id) on delete cascade,
  status text not null check (status in ('applied', 'reviewing', 'shortlisted', 'rejected', 'accepted')),
  profile_fit_score integer not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (internship_id, applicant_id)
);

create index if not exists skilltern_users_role_idx on public.skilltern_users(role);
create index if not exists skilltern_skills_category_idx on public.skilltern_skills(category);
create index if not exists skilltern_swaps_sender_idx on public.skilltern_swaps(sender_id, status);
create index if not exists skilltern_swaps_receiver_idx on public.skilltern_swaps(receiver_id, status);
create index if not exists skilltern_messages_thread_idx on public.skilltern_messages(sender_id, receiver_id, created_at);
create index if not exists skilltern_applications_internship_idx on public.skilltern_applications(internship_id, status);
create index if not exists skilltern_applications_applicant_idx on public.skilltern_applications(applicant_id, created_at desc);
create index if not exists skilltern_users_data_gin on public.skilltern_users using gin (data jsonb_path_ops);
create index if not exists skilltern_internships_data_gin on public.skilltern_internships using gin (data jsonb_path_ops);

-- The Express API performs authorization. The Supabase secret key stays on the server;
-- browser roles have no direct access to application records.
alter table public.skilltern_users enable row level security;
alter table public.skilltern_skills enable row level security;
alter table public.skilltern_swaps enable row level security;
alter table public.skilltern_messages enable row level security;
alter table public.skilltern_transactions enable row level security;
alter table public.skilltern_internships enable row level security;
alter table public.skilltern_applications enable row level security;

revoke all on public.skilltern_users, public.skilltern_skills, public.skilltern_swaps,
  public.skilltern_messages, public.skilltern_transactions, public.skilltern_internships,
  public.skilltern_applications from anon, authenticated;
grant select, insert, update, delete on public.skilltern_users, public.skilltern_skills,
  public.skilltern_swaps, public.skilltern_messages, public.skilltern_transactions,
  public.skilltern_internships, public.skilltern_applications to service_role;
