/*
  # Seed Data for ElBaker E-commerce Platform
  
  This migration adds initial data including:
  - Default admin user
  - Product categories
  - Sample products
  - Gallery images
*/

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, first_name, last_name, role) VALUES
('admin@elbaker.com', '$2b$10$rOzJqQZJqQZJqQZJqQZJqOzJqQZJqQZJqQZJqQZJqQZJqQZJqQZJq', 'Admin', 'User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
('Cakes', 'cakes', 'Delicious handcrafted cakes for all occasions', 1, true),
('Cupcakes', 'cupcakes', 'Individual treats perfect for any celebration', 2, true),
('Pastries', 'pastries', 'Flaky, buttery pastries made fresh daily', 3, true),
('Cookies', 'cookies', 'Classic cookies baked to perfection', 4, true),
('Breads', 'breads', 'Artisan breads and daily fresh loaves', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for product insertion
DO $$
DECLARE
    cakes_id UUID;
    cupcakes_id UUID;
    pastries_id UUID;
    cookies_id UUID;
    breads_id UUID;
BEGIN
    SELECT id INTO cakes_id FROM categories WHERE slug = 'cakes';
    SELECT id INTO cupcakes_id FROM categories WHERE slug = 'cupcakes';
    SELECT id INTO pastries_id FROM categories WHERE slug = 'pastries';
    SELECT id INTO cookies_id FROM categories WHERE slug = 'cookies';
    SELECT id INTO breads_id FROM categories WHERE slug = 'breads';

    -- Insert sample products
    INSERT INTO products (name, slug, description, short_description, category_id, base_price, sku, status, is_featured, ingredients, allergens, dietary_info) VALUES
    ('Classic Vanilla Bean Cake', 'classic-vanilla-bean', 'Creamy vanilla bean frosting, layered with fresh berries', 'Classic vanilla cake with fresh berries', cakes_id, 45.00, 'CAKE-VAN-001', 'active', true, ARRAY['Premium vanilla beans', 'Fresh cream', 'Organic flour', 'Farm-fresh eggs', 'Mixed berries'], ARRAY['Eggs', 'Dairy', 'Gluten'], ARRAY['Vegetarian']),
    ('Decadent Chocolate Fudge Cake', 'decadent-chocolate-fudge', 'Rich chocolate cake with ganache filling', 'Rich chocolate cake with ganache', cakes_id, 50.00, 'CAKE-CHO-001', 'active', true, ARRAY['Belgian dark chocolate', 'Cocoa powder', 'Heavy cream', 'Butter', 'Organic flour'], ARRAY['Eggs', 'Dairy', 'Gluten'], ARRAY['Vegetarian']),
    ('Red Velvet Dream Cake', 'red-velvet-dream', 'Classic red velvet with cream cheese frosting', 'Classic red velvet cake', cakes_id, 48.00, 'CAKE-RED-001', 'active', false, ARRAY['Buttermilk', 'Cream cheese', 'Red food coloring', 'Cocoa powder', 'Vanilla extract'], ARRAY['Eggs', 'Dairy', 'Gluten'], ARRAY['Vegetarian']),
    ('Assorted Dozen Cupcakes', 'assorted-dozen-cupcakes', 'Mix of daily flavors including vanilla, chocolate, and seasonal specials', 'Assorted cupcakes dozen', cupcakes_id, 30.00, 'CUP-ASS-012', 'active', true, ARRAY['Assorted premium ingredients', 'Buttercream frosting', 'Seasonal decorations'], ARRAY['Eggs', 'Dairy', 'Gluten'], ARRAY['Vegetarian']),
    ('Single Gourmet Cupcake', 'single-cupcake', 'Choose from our daily selection of gourmet cupcakes', 'Single gourmet cupcake', cupcakes_id, 5.00, 'CUP-SIN-001', 'active', false, ARRAY['Premium flour', 'Fresh butter', 'Vanilla extract', 'Buttercream frosting'], ARRAY['Eggs', 'Dairy', 'Gluten'], ARRAY['Vegetarian']),
    ('Butter Croissant', 'butter-croissant', 'Flaky and golden, made with premium European butter', 'Premium butter croissant', pastries_id, 3.50, 'PAS-CRO-001', 'active', true, ARRAY['European butter', 'French flour', 'Fresh yeast', 'Sea salt'], ARRAY['Gluten', 'Dairy'], ARRAY['Vegetarian']),
    ('Pain au Chocolat', 'pain-au-chocolat', 'Buttery croissant with premium dark chocolate', 'Chocolate croissant', pastries_id, 4.00, 'PAS-PAI-001', 'active', false, ARRAY['European butter', 'Belgian dark chocolate', 'French flour', 'Fresh yeast'], ARRAY['Gluten', 'Dairy'], ARRAY['Vegetarian']),
    ('Chocolate Chip Cookies', 'chocolate-chip-cookie', 'Classic recipe with Belgian chocolate chips', 'Classic chocolate chip cookies', cookies_id, 2.50, 'COO-CHO-001', 'active', true, ARRAY['Belgian chocolate chips', 'Brown sugar', 'Vanilla extract', 'Sea salt'], ARRAY['Eggs', 'Dairy', 'Gluten'], ARRAY['Vegetarian']),
    ('Oatmeal Raisin Cookies', 'oatmeal-raisin-cookie', 'Hearty oats with plump raisins and warm spices', 'Oatmeal raisin cookies', cookies_id, 2.75, 'COO-OAT-001', 'active', false, ARRAY['Rolled oats', 'Plump raisins', 'Cinnamon', 'Brown sugar', 'Vanilla'], ARRAY['Eggs', 'Dairy', 'Gluten'], ARRAY['Vegetarian']),
    ('Artisan Sourdough Bread', 'artisan-sourdough', 'Traditional sourdough with crispy crust and tangy flavor', 'Traditional sourdough bread', breads_id, 6.00, 'BRE-SOU-001', 'active', true, ARRAY['Sourdough starter', 'Organic flour', 'Sea salt', 'Filtered water'], ARRAY['Gluten'], ARRAY['Vegan']),
    ('Multigrain Loaf', 'multigrain-loaf', 'Healthy blend of seeds and grains, soft texture', 'Healthy multigrain bread', breads_id, 5.50, 'BRE-MUL-001', 'active', false, ARRAY['Whole wheat flour', 'Sunflower seeds', 'Pumpkin seeds', 'Flax seeds', 'Honey'], ARRAY['Gluten'], ARRAY['Vegetarian'])
    ON CONFLICT (slug) DO NOTHING;

END $$;

-- Insert product sizes for cakes
DO $$
DECLARE
    product_record RECORD;
BEGIN
    FOR product_record IN SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'cakes')
    LOOP
        INSERT INTO product_sizes (product_id, size_name, price_adjustment, display_order) VALUES
        (product_record.id, '6-inch', -30.00, 1),
        (product_record.id, '8-inch', -15.00, 2),
        (product_record.id, '10-inch', 0.00, 3),
        (product_record.id, '12-inch', 25.00, 4)
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;

-- Insert inventory records for all products
INSERT INTO inventory (product_id, quantity, low_stock_threshold, cost_per_unit)
SELECT id, 50, 10, base_price * 0.4 FROM products
ON CONFLICT DO NOTHING;

-- Insert sample gallery images
INSERT INTO gallery_images (title, description, image_url, category, is_featured, display_order) VALUES
('Elegant Wedding Cake', 'Three-tier wedding cake with floral decorations', '/images/wedding-cakes/wedding-cake-1.jpg', 'wedding', true, 1),
('Birthday Celebration Cake', 'Colorful birthday cake with custom decorations', '/images/birthday-cakes/birthday-cake-1.jpg', 'birthday', true, 2),
('Chocolate Chip Cookies', 'Fresh baked chocolate chip cookies', '/images/cookies/chocolate-chip-cookies.jpg', 'slices-cookies', true, 3),
('Graduation Cake', 'Custom graduation cake with cap decoration', '/images/graduation/graduation-cake-1.jpg', 'graduation', true, 4),
('Wedding Cake Masterpiece', 'Luxury wedding cake with gold accents', '/images/wedding-cakes/wedding-cake-2.jpg', 'wedding', false, 5),
('Kids Birthday Cake', 'Fun and colorful kids birthday cake', '/images/birthday-cakes/birthday-cake-2.jpg', 'birthday', false, 6),
('Assorted Cookie Platter', 'Beautiful assortment of cookies and slices', '/images/cookies/cookie-platter.jpg', 'slices-cookies', false, 7),
('Medical Graduation Cake', 'Professional graduation cake for medical students', '/images/graduation/graduation-cake-2.jpg', 'graduation', false, 8)
ON CONFLICT DO NOTHING;