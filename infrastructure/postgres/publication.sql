CREATE PUBLICATION product_publication
FOR TABLE
    public.products,
    public.categories;

-- REPLICA IDENTITY FULL
ALTER TABLE public.categories
REPLICA IDENTITY FULL;

ALTER TABLE public.products
REPLICA IDENTITY FULL;