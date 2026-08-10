-- ============================================================
-- KLIKEO — Schema completo de Supabase
-- Reconstruido a partir de los repositorios del backend
-- Correr completo en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ---------- PROFILES ----------
-- Un registro por usuario de auth.users, con nombre y rol de la app.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role text not null default 'owner' check (role in ('admin', 'owner')),
  created_at timestamptz not null default now()
);

-- Se crea sola cuando alguien se registra (auth.signUp con options.data.name)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), 'owner');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- NEGOCIOS ----------
create table public.negocios (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  description text,
  category text not null,
  address text,
  city text not null,
  phone text,
  whatsapp_number text not null,
  whatsapp_phone_id text unique,
  whatsapp_access_token text,
  logo_url text,
  banner_url text,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  training_data text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_negocios_owner on public.negocios(owner_id);
create index idx_negocios_city on public.negocios(city);
create index idx_negocios_category on public.negocios(category);
create index idx_negocios_active on public.negocios(is_active);

-- ---------- CATEGORÍAS DE PRODUCTOS (por negocio) ----------
create table public.producto_categorias (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  name text not null,
  is_active boolean not null default true,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_categorias_negocio on public.producto_categorias(negocio_id);

-- ---------- PRODUCTOS ----------
create table public.productos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  name text not null,
  description text,
  category text not null,
  price numeric(12,2) not null,
  stock integer not null default 0,
  image_url text,
  image_public_id text,
  ingredients jsonb not null default '[]'::jsonb,
  additions jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_productos_negocio on public.productos(negocio_id);
create index idx_productos_active on public.productos(is_active, is_deleted);

-- ---------- CHAT SESSIONS + MENSAJES (WhatsApp) ----------
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  cliente_phone text not null,
  estado text not null default 'active' check (estado in ('active', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_chatsessions_negocio on public.chat_sessions(negocio_id);
create index idx_chatsessions_phone on public.chat_sessions(negocio_id, cliente_phone);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index idx_chatmessages_session on public.chat_messages(chat_session_id, created_at);

-- ---------- RESEÑAS ----------
create table public.resenas (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comentario text,
  pedido_verificado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, negocio_id)
);

create index idx_resenas_negocio on public.resenas(negocio_id);

-- Vista usada por ResenaRepository.getRatingResumen()
create view public.negocio_rating_resumen as
select
  negocio_id,
  round(avg(rating)::numeric, 1) as promedio,
  count(*) as total_resenas
from public.resenas
group by negocio_id;

-- ============================================================
-- ROW LEVEL SECURITY
-- El backend usa service_role (SUPABASE_SERVICE_ROLE_KEY) y se
-- salta RLS a propósito. Estas policies protegen los pocos casos
-- donde el FRONTEND habla directo con Supabase (login/registro y
-- lectura del propio perfil).
-- ============================================================

alter table public.profiles enable row level security;
alter table public.negocios enable row level security;
alter table public.productos enable row level security;
alter table public.producto_categorias enable row level security;
alter table public.resenas enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Cada usuario puede ver y editar su propio perfil
create policy "Ver mi propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Editar mi propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Negocios activos son públicos para lectura (landing/directorio)
create policy "Negocios activos son públicos"
  on public.negocios for select
  using (is_active = true or owner_id = auth.uid());

-- Productos/categorías activos son públicos para lectura
create policy "Productos activos son públicos"
  on public.productos for select
  using (is_active = true and is_deleted = false);

create policy "Categorías activas son públicas"
  on public.producto_categorias for select
  using (is_active = true and is_deleted = false);

-- Reseñas: lectura pública, cada usuario logueado crea/edita la suya
create policy "Reseñas son públicas"
  on public.resenas for select
  using (true);

create policy "Usuarios crean su propia reseña"
  on public.resenas for insert
  with check (auth.uid() = user_id);

create policy "Usuarios editan su propia reseña"
  on public.resenas for update
  using (auth.uid() = user_id);

-- Chats: sin policies de lectura pública — solo el backend
-- (service_role) los toca. Quedan bloqueados para el frontend directo.