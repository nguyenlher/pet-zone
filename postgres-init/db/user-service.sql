--
-- PostgreSQL database dump
--

\restrict 1k9sg5RtJCvkb0wePqfiqx113KEM4pcy7kcWdTBL6Co3lkQQXv1EXXa6tDf1c1L

-- Dumped from database version 16.13
-- Dumped by pg_dump version 17.6

-- Started on 2026-05-07 22:56:24

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16385)
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16390)
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16428)
-- Name: user_favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    pet_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_favorites OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16410)
-- Name: user_shipping_infos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_shipping_infos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    phone_number character varying(20),
    address text NOT NULL,
    district character varying(100),
    city character varying(100) NOT NULL,
    note text,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_shipping_infos OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16395)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    keycloak_id character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    avatar_url character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3457 (class 0 OID 16385)
-- Dependencies: 215
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
001_create_users	Nguyen LH	db/changelog/db.changelog-master.yaml	2026-05-04 05:17:03.016032	1	EXECUTED	9:2e23765dfebe90695589a818cd5ca154	sqlFile path=changes/001_create_users.sql		\N	5.0.1	\N	\N	7871820172
002_create_user_shipping_infos	Nguyen LH	db/changelog/db.changelog-master.yaml	2026-05-04 05:17:03.099827	2	EXECUTED	9:5aba90974336d2986f5a1dfc408a12dc	sqlFile path=changes/002_create_user_shipping_infos.sql		\N	5.0.1	\N	\N	7871820172
003_create_user_favorites	Nguyen LH	db/changelog/db.changelog-master.yaml	2026-05-04 05:17:03.209548	3	EXECUTED	9:41da0b788b0dda35989d891e6af38e9d	sqlFile path=changes/003_create_user_favorites.sql		\N	5.0.1	\N	\N	7871820172
001_create_users	user-service	db/changelog/db.changelog-master.yaml	2026-05-06 17:24:55.12779	4	EXECUTED	9:66346207fd4c020e5c77e9a666782b57	sqlFile path=changes/001_create_users.sql		\N	5.0.1	\N	\N	8088292811
002_create_user_shipping_infos	user-service	db/changelog/db.changelog-master.yaml	2026-05-06 17:24:55.159181	5	EXECUTED	9:5aba90974336d2986f5a1dfc408a12dc	sqlFile path=changes/002_create_user_shipping_infos.sql		\N	5.0.1	\N	\N	8088292811
003_create_user_favorites	user-service	db/changelog/db.changelog-master.yaml	2026-05-06 17:24:55.180533	6	EXECUTED	9:41da0b788b0dda35989d891e6af38e9d	sqlFile path=changes/003_create_user_favorites.sql		\N	5.0.1	\N	\N	8088292811
\.


--
-- TOC entry 3458 (class 0 OID 16390)
-- Dependencies: 216
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
\.


--
-- TOC entry 3461 (class 0 OID 16428)
-- Dependencies: 219
-- Data for Name: user_favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_favorites (id, user_id, pet_id, created_at) FROM stdin;
\.


--
-- TOC entry 3460 (class 0 OID 16410)
-- Dependencies: 218
-- Data for Name: user_shipping_infos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_shipping_infos (id, user_id, phone_number, address, district, city, note, is_default, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3459 (class 0 OID 16395)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, keycloak_id, email, first_name, last_name, avatar_url, is_active, created_at, updated_at) FROM stdin;
4f77af6f-3dd2-44d0-9843-59c312d13094	8d8a2c9f-b7a6-4d71-99ec-280b325f34ab	nguyenvana@gmail.com	Van A	Nguyen	\N	t	2026-05-04 07:50:30.036278+00	\N
c553b62e-3e1b-47fe-acb9-af2ccd2aa1bd	99b03a0e-fff3-4ab9-bb0f-804431ed4d6e	tranthib@gmail.com	Thi B	Tran	\N	t	2026-05-04 08:00:10.833202+00	\N
1d6c53b6-9c84-4f7c-bc37-ed1c447d1e12	6a1e8772-302d-42cc-ba22-f45c36096f77	levanc@gmail.com	Van C	Le	\N	t	2026-05-04 08:00:42.701867+00	\N
6ea62585-fddf-4a72-ba9b-ec81ce424955	82b423a8-6257-44e1-8461-acc2be304449	nguyenlher@gmail.com	Hoang Nguyen	Le	\N	t	2026-05-04 08:01:26.655744+00	\N
\.


--
-- TOC entry 3290 (class 2606 OID 16394)
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 16436)
-- Name: user_favorites unique_user_pet_favorite; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT unique_user_pet_favorite UNIQUE (user_id, pet_id);


--
-- TOC entry 3311 (class 2606 OID 16434)
-- Name: user_favorites user_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 3304 (class 2606 OID 16420)
-- Name: user_shipping_infos user_shipping_infos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_shipping_infos
    ADD CONSTRAINT user_shipping_infos_pkey PRIMARY KEY (id);


--
-- TOC entry 3296 (class 2606 OID 16409)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3298 (class 2606 OID 16407)
-- Name: users users_keycloak_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_keycloak_id_key UNIQUE (keycloak_id);


--
-- TOC entry 3300 (class 2606 OID 16405)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3305 (class 1259 OID 16444)
-- Name: idx_user_favorites_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_favorites_created_at ON public.user_favorites USING btree (created_at DESC);


--
-- TOC entry 3306 (class 1259 OID 16443)
-- Name: idx_user_favorites_pet_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_favorites_pet_id ON public.user_favorites USING btree (pet_id);


--
-- TOC entry 3307 (class 1259 OID 16442)
-- Name: idx_user_favorites_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_favorites_user_id ON public.user_favorites USING btree (user_id);


--
-- TOC entry 3301 (class 1259 OID 16427)
-- Name: idx_user_shipping_is_default; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_shipping_is_default ON public.user_shipping_infos USING btree (is_default);


--
-- TOC entry 3302 (class 1259 OID 16426)
-- Name: idx_user_shipping_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_shipping_user_id ON public.user_shipping_infos USING btree (user_id);


--
-- TOC entry 3291 (class 1259 OID 16452)
-- Name: idx_users_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_created_at ON public.users USING btree (created_at DESC);


--
-- TOC entry 3292 (class 1259 OID 16450)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 3293 (class 1259 OID 16451)
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_is_active ON public.users USING btree (is_active);


--
-- TOC entry 3294 (class 1259 OID 16449)
-- Name: idx_users_keycloak_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_keycloak_id ON public.users USING btree (keycloak_id);


--
-- TOC entry 3313 (class 2606 OID 16437)
-- Name: user_favorites fk_user_favorite_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT fk_user_favorite_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3312 (class 2606 OID 16421)
-- Name: user_shipping_infos fk_user_shipping_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_shipping_infos
    ADD CONSTRAINT fk_user_shipping_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-05-07 22:56:24

--
-- PostgreSQL database dump complete
--

\unrestrict 1k9sg5RtJCvkb0wePqfiqx113KEM4pcy7kcWdTBL6Co3lkQQXv1EXXa6tDf1c1L

