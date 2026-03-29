--
-- PostgreSQL database dump
--

\restrict 1bSYTRsg7cyeT8BzGW6r3KyTOBq3hwnn5fBnDzZHkdqI0yuXsfbv1bnPqcveRny

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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
-- Name: admin_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.admin_users OWNER TO postgres;

--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO postgres;

--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.components (
    id integer NOT NULL,
    parent_id integer,
    name character varying(150) NOT NULL,
    stock integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.components OWNER TO postgres;

--
-- Name: components_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.components_id_seq OWNER TO postgres;

--
-- Name: components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.components_id_seq OWNED BY public.components.id;


--
-- Name: purchases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchases (
    id integer NOT NULL,
    bill_no character varying(50) NOT NULL,
    purchase_date date NOT NULL,
    component_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    vendor character varying(100),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.purchases OWNER TO postgres;

--
-- Name: purchases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchases_id_seq OWNER TO postgres;

--
-- Name: purchases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchases_id_seq OWNED BY public.purchases.id;


--
-- Name: request_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_items (
    id integer NOT NULL,
    request_id integer,
    component_id integer,
    quantity_requested integer NOT NULL,
    quantity_approved integer DEFAULT 0,
    status character varying(15) DEFAULT 'pending'::character varying
);


ALTER TABLE public.request_items OWNER TO postgres;

--
-- Name: request_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.request_items_id_seq OWNER TO postgres;

--
-- Name: request_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_items_id_seq OWNED BY public.request_items.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    ref_id character varying(20) NOT NULL,
    student_name character varying(100) NOT NULL,
    roll_no character varying(30) NOT NULL,
    mentor_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    department character varying(100),
    return_date date NOT NULL,
    letter_proof text,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requests_id_seq OWNER TO postgres;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- Name: return_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_items (
    id integer NOT NULL,
    return_id integer,
    request_item_id integer,
    condition character varying(15),
    remarks text
);


ALTER TABLE public.return_items OWNER TO postgres;

--
-- Name: return_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.return_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.return_items_id_seq OWNER TO postgres;

--
-- Name: return_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.return_items_id_seq OWNED BY public.return_items.id;


--
-- Name: returns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.returns (
    id integer NOT NULL,
    request_id integer,
    submitted_at timestamp without time zone DEFAULT now(),
    remarks text
);


ALTER TABLE public.returns OWNER TO postgres;

--
-- Name: returns_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.returns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.returns_id_seq OWNER TO postgres;

--
-- Name: returns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.returns_id_seq OWNED BY public.returns.id;


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: components id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components ALTER COLUMN id SET DEFAULT nextval('public.components_id_seq'::regclass);


--
-- Name: purchases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases ALTER COLUMN id SET DEFAULT nextval('public.purchases_id_seq'::regclass);


--
-- Name: request_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_items ALTER COLUMN id SET DEFAULT nextval('public.request_items_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- Name: return_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items ALTER COLUMN id SET DEFAULT nextval('public.return_items_id_seq'::regclass);


--
-- Name: returns id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns ALTER COLUMN id SET DEFAULT nextval('public.returns_id_seq'::regclass);


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_users (id, username, password, created_at) FROM stdin;
1	labadmin	$2b$10$.nzVPj9manCJ5inW7h.rpuvbXRipnd0Z0rRvtY95zOKStVLJSYmoW	2026-03-14 21:56:25.737624
\.


--
-- Data for Name: components; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.components (id, parent_id, name, stock, created_at) FROM stdin;
2	\N	Arduino	0	2026-03-14 19:20:26.788291
3	\N	Breadboard	0	2026-03-14 19:20:26.788291
4	\N	Wires	0	2026-03-14 19:20:26.788291
5	\N	Motors	0	2026-03-14 19:20:26.788291
6	\N	Sensors	0	2026-03-14 19:20:26.788291
7	\N	Displays	0	2026-03-14 19:20:26.788291
12	1	Raspberry Pi 4	3	2026-03-14 19:20:37.106509
13	1	Raspberry Pi 5	2	2026-03-14 19:20:37.106509
16	2	Arduino Nano	7	2026-03-14 19:20:37.106509
18	3	Half Size Breadboard	12	2026-03-14 19:20:37.106509
19	4	Jumper Wires Male-Male	100	2026-03-14 19:20:37.106509
20	4	Jumper Wires Male-Female	80	2026-03-14 19:20:37.106509
21	4	Jumper Wires Female-Female	60	2026-03-14 19:20:37.106509
22	5	DC Motor	20	2026-03-14 19:20:37.106509
23	5	Servo Motor	15	2026-03-14 19:20:37.106509
24	5	Stepper Motor	10	2026-03-14 19:20:37.106509
26	6	IR Sensor	15	2026-03-14 19:20:37.106509
27	6	Temperature Sensor DHT11	10	2026-03-14 19:20:37.106509
28	6	PIR Motion Sensor	8	2026-03-14 19:20:37.106509
29	7	LCD 16x2	10	2026-03-14 19:20:37.106509
30	7	OLED 0.96 inch	6	2026-03-14 19:20:37.106509
31	8	5V Adapter	10	2026-03-14 19:20:37.106509
34	2	Arduino Leonardo	3	2026-03-14 21:42:06.732728
1	\N	Raspberry Pi	10	2026-03-14 19:20:26.788291
8	\N	Power Supply	0	2026-03-14 19:20:26.788291
25	6	Ultrasonic Sensor HC-SR04	11	2026-03-14 19:20:37.106509
10	1	Raspberry Pi 2	4	2026-03-14 19:20:37.106509
15	2	Arduino Mega	5	2026-03-14 19:20:37.106509
11	1	Raspberry Pi 3	6	2026-03-14 19:20:37.106509
17	3	Full Size Breadboard	15	2026-03-14 19:20:37.106509
9	1	Raspberry Pi 1	5	2026-03-14 19:20:37.106509
14	2	Arduino Uno	5	2026-03-14 19:20:37.106509
\.


--
-- Data for Name: purchases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchases (id, bill_no, purchase_date, component_id, quantity, price, vendor, created_at) FROM stdin;
\.


--
-- Data for Name: request_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_items (id, request_id, component_id, quantity_requested, quantity_approved, status) FROM stdin;
1	1	8	2	2	approved
2	1	14	5	5	approved
3	2	8	2	0	pending
4	2	14	5	0	pending
5	3	9	2	0	pending
6	4	11	2	1	approved
7	5	10	1	1	approved
8	5	15	1	1	approved
9	5	17	1	1	approved
10	5	25	1	1	approved
11	6	9	1	0	declined
12	6	14	1	1	approved
13	7	11	2	1	approved
15	7	17	1	1	approved
14	7	14	1	1	approved
16	8	9	1	1	approved
17	8	14	1	1	approved
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (id, ref_id, student_name, roll_no, mentor_name, email, department, return_date, letter_proof, status, created_at) FROM stdin;
2	LAB-2026-0002	John Doe	CH.EN.U4CCE23041	Dr.Smith	ch.en.u4cce23041@ch.students.amrita.edu	CSE	2026-03-30	1773509633178-chatbot.pdf	declined	2026-03-14 23:03:53.244766
1	LAB-2026-0001	John Doe	CH.EN.U4CCE23041	Dr.Smith	ch.en.u4cce23041@ch.students.amrita.edu	CSE	2026-03-30	1773508771691-chatbot.pdf	returned	2026-03-14 22:49:31.767366
3	LAB-2026-0003	Sanjay	CH.EN.U4CCE23041	DEVI	ch.en.u4cce23041@ch.students.amrita.edu	CCE	2026-03-28	1773602135492-chatbot.pdf	pending	2026-03-16 00:45:35.538353
4	LAB-2026-0004	Sanjay	CH.EN.U4CCE23041	DEVI	ch.en.u4cce23041@ch.students.amrita.edu	CCE	2026-03-28	1773602455772-chatbot.pdf	returned	2026-03-16 00:50:55.820128
5	LAB-2026-0005	Pooja	CH.EN.U4CCE23031	DEVI	ch.en.u4cce23031@ch.students.amrita.edu	CCE	2026-03-28	1773604742006-chatbot.pdf	returned	2026-03-16 01:29:02.04826
6	LAB-2026-0006	Sanjai	CH.EN.U4CCE23039	Ganeshkumar	ch.en.u4cce23039@ch.students.amrita.edu	CCE	2026-03-28	1773630918623-chatbot.pdf	returned	2026-03-16 08:45:18.707085
7	LAB-2026-0007	Hemanth	CH.EN.U4CCE23013	DEVISOWJANYA	ch.en.u4cce23013@ch.students.amrita.edu	CCE	2026-03-28	1773640376034-chatbot.pdf	returned	2026-03-16 11:22:56.114076
8	LAB-2026-0008	P.Sanjay	CH.EN.U4CCE23042	DEVISOWJANYA	ch.en.u4cce23042@ch.students.amrita.edu	CCE	2026-03-28	1773643702270-chatbot.pdf	returned	2026-03-16 12:18:22.333463
\.


--
-- Data for Name: return_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_items (id, return_id, request_item_id, condition, remarks) FROM stdin;
1	1	1	returned	\N
2	1	2	damaged	3 wires were broken
3	2	6	returned	\N
4	3	7	returned	\N
5	3	8	returned	\N
6	3	9	returned	\N
7	3	10	damaged	lll
8	4	12	returned	\N
9	5	13	returned	\N
10	5	15	returned	\N
11	5	14	returned	\N
12	6	16	returned	\N
13	6	17	returned	\N
\.


--
-- Data for Name: returns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.returns (id, request_id, submitted_at, remarks) FROM stdin;
1	1	2026-03-14 23:23:45.836758	All components returned in good condition
2	4	2026-03-16 01:32:50.371179	\N
3	5	2026-03-16 01:33:39.777827	\N
4	6	2026-03-16 08:46:53.42954	\N
5	7	2026-03-16 11:24:13.898177	\N
6	8	2026-03-21 15:58:21.098834	\N
\.


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 1, true);


--
-- Name: components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.components_id_seq', 36, true);


--
-- Name: purchases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchases_id_seq', 1, false);


--
-- Name: request_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_items_id_seq', 17, true);


--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requests_id_seq', 8, true);


--
-- Name: return_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.return_items_id_seq', 13, true);


--
-- Name: returns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.returns_id_seq', 6, true);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_key UNIQUE (username);


--
-- Name: components components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_pkey PRIMARY KEY (id);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id);


--
-- Name: request_items request_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_items
    ADD CONSTRAINT request_items_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: requests requests_ref_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_ref_id_key UNIQUE (ref_id);


--
-- Name: return_items return_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_pkey PRIMARY KEY (id);


--
-- Name: returns returns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_pkey PRIMARY KEY (id);


--
-- Name: returns returns_request_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_request_id_key UNIQUE (request_id);


--
-- Name: components components_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.components(id) ON DELETE CASCADE;


--
-- Name: purchases purchases_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.components(id);


--
-- Name: request_items request_items_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_items
    ADD CONSTRAINT request_items_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.components(id);


--
-- Name: request_items request_items_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_items
    ADD CONSTRAINT request_items_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;


--
-- Name: return_items return_items_request_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_request_item_id_fkey FOREIGN KEY (request_item_id) REFERENCES public.request_items(id);


--
-- Name: return_items return_items_return_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.returns(id) ON DELETE CASCADE;


--
-- Name: returns returns_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.requests(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 1bSYTRsg7cyeT8BzGW6r3KyTOBq3hwnn5fBnDzZHkdqI0yuXsfbv1bnPqcveRny

