-- Create pep_talks table for dynamic pep-talk content
CREATE TABLE public.pep_talks (
    id integer NOT NULL DEFAULT nextval('pep_talks_id_seq'::regclass),
    title character varying NOT NULL,
    content text NOT NULL,
    author character varying,
    status character varying DEFAULT 'draft'::character varying CHECK (status::text = ANY (ARRAY['draft'::character varying, 'published'::character varying, 'scheduled'::character varying]::text[])),
    scheduled_date timestamp without time zone,
    seo_title character varying,
    seo_description text,
    seo_keywords text[],
    image_url text,
    excerpt text,
    display_order integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pep_talks_pkey PRIMARY KEY (id)
);

-- Create sequence for pep_talks
CREATE SEQUENCE public.pep_talks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Set sequence ownership
ALTER SEQUENCE public.pep_talks_id_seq OWNED BY public.pep_talks.id;

-- Add RLS policies if needed
ALTER TABLE public.pep_talks ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published pep talks
CREATE POLICY "Allow public read access to published pep talks" ON public.pep_talks
    FOR SELECT USING (status = 'published');

-- Allow authenticated users to manage pep talks (for admin)
CREATE POLICY "Allow authenticated users to manage pep talks" ON public.pep_talks
    FOR ALL USING (auth.role() = 'authenticated');