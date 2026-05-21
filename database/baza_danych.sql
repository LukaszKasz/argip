--
-- PostgreSQL database dump
--

\restrict kZrc4vKvwVawqmaRInNqNKzqV7uFWAlLdKCYSTNsRZWPKjqCptOHCxTYHbDTQwm

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.nuts DROP CONSTRAINT IF EXISTS nuts_id_zakresu_fkey;
DROP INDEX IF EXISTS public.ix_users_username;
DROP INDEX IF EXISTS public.ix_users_id;
DROP INDEX IF EXISTS public.ix_users_email;
DROP INDEX IF EXISTS public.ix_screw_lengths_id;
DROP INDEX IF EXISTS public.ix_ranges_id;
DROP INDEX IF EXISTS public.ix_nuts_id;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.screw_lengths DROP CONSTRAINT IF EXISTS screw_lengths_pkey;
ALTER TABLE IF EXISTS ONLY public.ranges DROP CONSTRAINT IF EXISTS ranges_pkey;
ALTER TABLE IF EXISTS ONLY public.nuts DROP CONSTRAINT IF EXISTS nuts_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.screw_lengths ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.ranges ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.nuts ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.screw_lengths_id_seq;
DROP TABLE IF EXISTS public.screw_lengths;
DROP SEQUENCE IF EXISTS public.ranges_id_seq;
DROP TABLE IF EXISTS public.ranges;
DROP SEQUENCE IF EXISTS public.nuts_id_seq;
DROP TABLE IF EXISTS public.nuts;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: nuts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nuts (
    id integer NOT NULL,
    id_zakresu integer NOT NULL,
    nazwa character varying(100) NOT NULL,
    srednica double precision NOT NULL,
    cena numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: nuts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nuts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nuts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nuts_id_seq OWNED BY public.nuts.id;


--
-- Name: ranges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ranges (
    id integer NOT NULL,
    nazwa character varying(100) NOT NULL,
    od double precision NOT NULL,
    "do" double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: ranges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ranges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ranges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ranges_id_seq OWNED BY public.ranges.id;


--
-- Name: screw_lengths; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.screw_lengths (
    id integer NOT NULL,
    srednica double precision NOT NULL,
    dlugosc double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: screw_lengths_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.screw_lengths_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: screw_lengths_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.screw_lengths_id_seq OWNED BY public.screw_lengths.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    hashed_password character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: nuts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nuts ALTER COLUMN id SET DEFAULT nextval('public.nuts_id_seq'::regclass);


--
-- Name: ranges id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ranges ALTER COLUMN id SET DEFAULT nextval('public.ranges_id_seq'::regclass);


--
-- Name: screw_lengths id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screw_lengths ALTER COLUMN id SET DEFAULT nextval('public.screw_lengths_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: nuts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.nuts (id, id_zakresu, nazwa, srednica, cena, created_at) FROM stdin;
\.


--
-- Data for Name: ranges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ranges (id, nazwa, od, "do", created_at) FROM stdin;
\.


--
-- Data for Name: screw_lengths; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.screw_lengths (id, srednica, dlugosc, created_at) FROM stdin;
1	10	20	2026-01-21 10:05:22.26776+00
2	10	25	2026-01-21 10:10:18.011286+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, hashed_password, created_at) FROM stdin;
1	lkasztelan	l.kasztelan@advox.pl	$2b$12$fvIhz5tb0Y35QUHKEzB.Z..X2iJ3EO29VvImAc0e3lvuYT8RB6uGW	2026-01-21 08:33:09.890911+00
2	newuser123	newuser123@example.com	$2b$12$aCoZPBB4xkfx4wbiNTfdJOMIIcYfYElccHqiKJ49bLAq/xlJLA1Pi	2026-02-26 11:12:05.531769+00
\.


--
-- Name: nuts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nuts_id_seq', 1, false);


--
-- Name: ranges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ranges_id_seq', 1, false);


--
-- Name: screw_lengths_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.screw_lengths_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: nuts nuts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nuts
    ADD CONSTRAINT nuts_pkey PRIMARY KEY (id);


--
-- Name: ranges ranges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ranges
    ADD CONSTRAINT ranges_pkey PRIMARY KEY (id);


--
-- Name: screw_lengths screw_lengths_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screw_lengths
    ADD CONSTRAINT screw_lengths_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_nuts_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_nuts_id ON public.nuts USING btree (id);


--
-- Name: ix_ranges_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_ranges_id ON public.ranges USING btree (id);


--
-- Name: ix_screw_lengths_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_screw_lengths_id ON public.screw_lengths USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: nuts nuts_id_zakresu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nuts
    ADD CONSTRAINT nuts_id_zakresu_fkey FOREIGN KEY (id_zakresu) REFERENCES public.ranges(id);


--
-- PostgreSQL database dump complete
--

\unrestrict kZrc4vKvwVawqmaRInNqNKzqV7uFWAlLdKCYSTNsRZWPKjqCptOHCxTYHbDTQwm

