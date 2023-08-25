--
-- PostgreSQL database dump
--

-- Dumped from database version 14.9 (Homebrew)
-- Dumped by pg_dump version 14.9 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaigns (
    campaign_id integer NOT NULL,
    property_id integer,
    goal_amount numeric(20,2),
    current_amount numeric(20,2),
    start_date date,
    end_date date,
    status character varying(50)
);


--
-- Name: campaigns_campaign_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.campaigns_campaign_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: campaigns_campaign_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.campaigns_campaign_id_seq OWNED BY public.campaigns.campaign_id;


--
-- Name: contributions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contributions (
    contribution_id integer NOT NULL,
    campaign_id integer,
    investor_id integer,
    amount numeric(20,2),
    tokens_received integer,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: contributions_contribution_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contributions_contribution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contributions_contribution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contributions_contribution_id_seq OWNED BY public.contributions.contribution_id;


--
-- Name: fees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fees (
    fee_id integer NOT NULL,
    type character varying(50),
    percentage numeric(5,2),
    amount numeric(20,2),
    transaction_id integer,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: fees_fee_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fees_fee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: fees_fee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fees_fee_id_seq OWNED BY public.fees.fee_id;


--
-- Name: financial_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.financial_details (
    financial_id integer NOT NULL,
    acquirer_id integer,
    initial_deposit numeric(20,2),
    renovation_cost numeric(20,2),
    notary_fees numeric(20,2),
    loan_amount numeric(20,2),
    interest_cost numeric(20,2),
    loan_duration integer,
    total_paid numeric(20,2),
    total_remaining numeric(20,2)
);


--
-- Name: financial_details_financial_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.financial_details_financial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: financial_details_financial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.financial_details_financial_id_seq OWNED BY public.financial_details.financial_id;


--
-- Name: investor_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.investor_properties (
    investor_property_id integer NOT NULL,
    investor_id integer,
    property_id integer,
    amount_invested numeric(20,2),
    tokens_held integer
);


--
-- Name: investor_properties_investor_property_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.investor_properties_investor_property_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: investor_properties_investor_property_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.investor_properties_investor_property_id_seq OWNED BY public.investor_properties.investor_property_id;


--
-- Name: modulations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.modulations (
    modulation_id integer NOT NULL,
    acquirer_id integer,
    property_id integer,
    new_monthly_amount numeric(20,2),
    reason text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: modulations_modulation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.modulations_modulation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: modulations_modulation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.modulations_modulation_id_seq OWNED BY public.modulations.modulation_id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    acquirer_id integer,
    property_id integer,
    amount_paid numeric(20,2),
    payment_date date,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    remaining_amount numeric(20,2),
    modulated_amount numeric(20,2)
);


--
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.properties (
    property_id integer NOT NULL,
    seller_id integer,
    description text,
    localisation character varying(255),
    total_value numeric(20,2),
    charges_estimation numeric(20,2),
    energy_bill_estimation numeric(20,2),
    construction_year integer,
    room_count integer,
    bedroom_count integer,
    floor_number integer,
    area numeric(10,2),
    dpe character varying(50),
    ges character varying(50),
    campaign_end_date date,
    status character varying(50),
    current_investor_share numeric(5,2),
    current_acquirer_share numeric(5,2)
);


--
-- Name: properties_property_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.properties_property_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: properties_property_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.properties_property_id_seq OWNED BY public.properties.property_id;


--
-- Name: roi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roi (
    roi_id integer NOT NULL,
    investor_id integer,
    property_id integer,
    year integer,
    amount numeric(20,2),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: roi_roi_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roi_roi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roi_roi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roi_roi_id_seq OWNED BY public.roi.roi_id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tokens (
    token_id integer NOT NULL,
    property_id integer,
    owner_id integer,
    token_value numeric(20,2),
    token_symbol character varying(50),
    total_supply integer,
    token_contract_address character varying(255)
);


--
-- Name: tokens_token_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tokens_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tokens_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tokens_token_id_seq OWNED BY public.tokens.token_id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    sender_id integer,
    receiver_id integer,
    token_id integer,
    amount integer,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_transaction_id_seq OWNED BY public.transactions.transaction_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    wallet_address character varying(255),
    role character varying(50) NOT NULL,
    total_invested numeric(20,2),
    total_tokens integer,
    auth0_id character varying(255)
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: campaigns campaign_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns ALTER COLUMN campaign_id SET DEFAULT nextval('public.campaigns_campaign_id_seq'::regclass);


--
-- Name: contributions contribution_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contributions ALTER COLUMN contribution_id SET DEFAULT nextval('public.contributions_contribution_id_seq'::regclass);


--
-- Name: fees fee_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fees ALTER COLUMN fee_id SET DEFAULT nextval('public.fees_fee_id_seq'::regclass);


--
-- Name: financial_details financial_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.financial_details ALTER COLUMN financial_id SET DEFAULT nextval('public.financial_details_financial_id_seq'::regclass);


--
-- Name: investor_properties investor_property_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investor_properties ALTER COLUMN investor_property_id SET DEFAULT nextval('public.investor_properties_investor_property_id_seq'::regclass);


--
-- Name: modulations modulation_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modulations ALTER COLUMN modulation_id SET DEFAULT nextval('public.modulations_modulation_id_seq'::regclass);


--
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- Name: properties property_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties ALTER COLUMN property_id SET DEFAULT nextval('public.properties_property_id_seq'::regclass);


--
-- Name: roi roi_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roi ALTER COLUMN roi_id SET DEFAULT nextval('public.roi_roi_id_seq'::regclass);


--
-- Name: tokens token_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tokens ALTER COLUMN token_id SET DEFAULT nextval('public.tokens_token_id_seq'::regclass);


--
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (campaign_id);


--
-- Name: contributions contributions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_pkey PRIMARY KEY (contribution_id);


--
-- Name: fees fees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_pkey PRIMARY KEY (fee_id);


--
-- Name: financial_details financial_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.financial_details
    ADD CONSTRAINT financial_details_pkey PRIMARY KEY (financial_id);


--
-- Name: investor_properties investor_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investor_properties
    ADD CONSTRAINT investor_properties_pkey PRIMARY KEY (investor_property_id);


--
-- Name: modulations modulations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modulations
    ADD CONSTRAINT modulations_pkey PRIMARY KEY (modulation_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (property_id);


--
-- Name: roi roi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roi
    ADD CONSTRAINT roi_pkey PRIMARY KEY (roi_id);


--
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (token_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: campaigns campaigns_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(property_id);


--
-- Name: contributions contributions_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(campaign_id);


--
-- Name: contributions contributions_investor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_investor_id_fkey FOREIGN KEY (investor_id) REFERENCES public.users(user_id);


--
-- Name: fees fees_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id);


--
-- Name: financial_details financial_details_acquirer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.financial_details
    ADD CONSTRAINT financial_details_acquirer_id_fkey FOREIGN KEY (acquirer_id) REFERENCES public.users(user_id);


--
-- Name: investor_properties investor_properties_investor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investor_properties
    ADD CONSTRAINT investor_properties_investor_id_fkey FOREIGN KEY (investor_id) REFERENCES public.users(user_id);


--
-- Name: investor_properties investor_properties_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investor_properties
    ADD CONSTRAINT investor_properties_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(property_id);


--
-- Name: modulations modulations_acquirer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modulations
    ADD CONSTRAINT modulations_acquirer_id_fkey FOREIGN KEY (acquirer_id) REFERENCES public.users(user_id);


--
-- Name: modulations modulations_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modulations
    ADD CONSTRAINT modulations_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(property_id);


--
-- Name: payments payments_acquirer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_acquirer_id_fkey FOREIGN KEY (acquirer_id) REFERENCES public.users(user_id);


--
-- Name: payments payments_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(property_id);


--
-- Name: properties properties_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(user_id);


--
-- Name: roi roi_investor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roi
    ADD CONSTRAINT roi_investor_id_fkey FOREIGN KEY (investor_id) REFERENCES public.users(user_id);


--
-- Name: roi roi_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roi
    ADD CONSTRAINT roi_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(property_id);


--
-- Name: tokens tokens_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(user_id);


--
-- Name: tokens tokens_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(property_id);


--
-- Name: transactions transactions_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(user_id);


--
-- Name: transactions transactions_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(user_id);


--
-- Name: transactions transactions_token_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_token_id_fkey FOREIGN KEY (token_id) REFERENCES public.tokens(token_id);


--
-- PostgreSQL database dump complete
--

