-- ============================================================
-- FOODSHALA DATABASE
-- ============================================================

DROP DATABASE IF EXISTS foodshala;

CREATE DATABASE foodshala
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE foodshala;


-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    image VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- FOODS
-- ============================================================

CREATE TABLE foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_food_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- CART
-- ============================================================

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_cart_item (user_id, food_id),

    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_cart_food
        FOREIGN KEY (food_id)
        REFERENCES foods(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- ADDRESSES
-- ============================================================

CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    label VARCHAR(50) DEFAULT 'Home',
    address TEXT NOT NULL,
    city VARCHAR(100),
    phone VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_address_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    delivery_address TEXT NOT NULL,
    phone VARCHAR(20),
    payment_method ENUM('cash_on_delivery', 'online') DEFAULT 'cash_on_delivery',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    order_status ENUM(
        'pending',
        'confirmed',
        'preparing',
        'out_for_delivery',
        'delivered',
        'cancelled'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- ORDER ITEMS
-- ============================================================

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_item_food
        FOREIGN KEY (food_id)
        REFERENCES foods(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_rating
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_review_food
        FOREIGN KEY (food_id)
        REFERENCES foods(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- FAVORITES
-- ============================================================

CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_favorite (user_id, food_id),

    CONSTRAINT fk_favorite_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_favorite_food
        FOREIGN KEY (food_id)
        REFERENCES foods(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- CATEGORIES DATA
-- ============================================================

INSERT INTO categories
(name, description, image)
VALUES
('Pizza', 'Delicious freshly prepared pizzas', 'pizza.jpg'),
('Burgers', 'Juicy and tasty burgers', 'burger.jpg'),
('Momo', 'Traditional Nepali dumplings', 'momo.jpg'),
('Noodles', 'Delicious noodles and chowmein', 'noodles.jpg'),
('Biryani', 'Aromatic and flavorful biryani', 'biryani.jpg'),
('Drinks', 'Refreshing cold and hot drinks', 'drinks.jpg'),
('Desserts', 'Sweet treats for every occasion', 'desserts.jpg'),
('Thakali', 'Traditional Nepali Thakali dishes', 'thakali.jpg');


-- ============================================================
-- FOOD DATA
-- ============================================================

INSERT INTO foods
(category_id, name, description, price, image, is_available)
VALUES

-- Pizza
(1, 'Margherita Pizza',
 'Classic pizza with tomato sauce, mozzarella cheese and fresh basil.',
 450.00, 'margherita-pizza.jpg', TRUE),

(1, 'Chicken Pizza',
 'Delicious pizza topped with grilled chicken and mozzarella cheese.',
 550.00, 'chicken-pizza.jpg', TRUE),

(1, 'Pepperoni Pizza',
 'Classic pepperoni pizza loaded with cheese.',
 600.00, 'pepperoni-pizza.jpg', TRUE),

(1, 'Veggie Pizza',
 'Fresh vegetables, cheese and tomato sauce.',
 500.00, 'veggie-pizza.jpg', TRUE),


-- Burgers
(2, 'Chicken Burger',
 'Crispy chicken patty with lettuce, tomato and special sauce.',
 300.00, 'chicken-burger.jpg', TRUE),

(2, 'Cheese Burger',
 'Juicy beef patty with melted cheese and fresh vegetables.',
 350.00, 'cheese-burger.jpg', TRUE),

(2, 'Veg Burger',
 'Crispy vegetable patty with fresh lettuce and special sauce.',
 250.00, 'veg-burger.jpg', TRUE),

(2, 'Double Chicken Burger',
 'Double chicken patties with cheese and special sauce.',
 450.00, 'double-chicken-burger.jpg', TRUE),


-- Momo
(3, 'Chicken Momo',
 'Steamed dumplings filled with delicious minced chicken.',
 180.00, 'chicken-momo.jpg', TRUE),

(3, 'Buff Momo',
 'Traditional steamed buff momo served with spicy chutney.',
 200.00, 'buff-momo.jpg', TRUE),

(3, 'Veg Momo',
 'Steamed dumplings filled with fresh vegetables.',
 150.00, 'veg-momo.jpg', TRUE),

(3, 'Fried Momo',
 'Crispy fried momo served with spicy tomato chutney.',
 220.00, 'fried-momo.jpg', TRUE),

(3, 'C-Momo',
 'Spicy chicken momo served in a creamy hot sauce.',
 280.00, 'c-momo.jpg', TRUE),


-- Noodles
(4, 'Chicken Chowmein',
 'Stir-fried noodles with chicken and fresh vegetables.',
 250.00, 'chicken-chowmein.jpg', TRUE),

(4, 'Veg Chowmein',
 'Stir-fried noodles with fresh seasonal vegetables.',
 200.00, 'veg-chowmein.jpg', TRUE),

(4, 'Buff Chowmein',
 'Flavorful chowmein with buff and fresh vegetables.',
 280.00, 'buff-chowmein.jpg', TRUE),

(4, 'Schezwan Noodles',
 'Spicy Schezwan noodles with vegetables and chicken.',
 300.00, 'schezwan-noodles.jpg', TRUE),


-- Biryani
(5, 'Chicken Biryani',
 'Aromatic basmati rice cooked with tender chicken and spices.',
 350.00, 'chicken-biryani.jpg', TRUE),

(5, 'Mutton Biryani',
 'Rich and flavorful biryani prepared with tender mutton.',
 450.00, 'mutton-biryani.jpg', TRUE),

(5, 'Veg Biryani',
 'Fragrant rice cooked with fresh vegetables and spices.',
 300.00, 'veg-biryani.jpg', TRUE),


-- Drinks
(6, 'Coca Cola',
 'Chilled Coca Cola soft drink.',
 100.00, 'coca-cola.jpg', TRUE),

(6, 'Fanta',
 'Refreshing orange flavored soft drink.',
 100.00, 'fanta.jpg', TRUE),

(6, 'Sprite',
 'Refreshing lemon-lime soft drink.',
 100.00, 'sprite.jpg', TRUE),

(6, 'Fresh Lemonade',
 'Freshly prepared lemon juice with a refreshing taste.',
 150.00, 'lemonade.jpg', TRUE),

(6, 'Mango Lassi',
 'Creamy and refreshing mango lassi.',
 180.00, 'mango-lassi.jpg', TRUE),


-- Desserts
(7, 'Chocolate Cake',
 'Rich chocolate cake topped with chocolate cream.',
 250.00, 'chocolate-cake.jpg', TRUE),

(7, 'Brownie',
 'Soft and delicious chocolate brownie.',
 180.00, 'brownie.jpg', TRUE),

(7, 'Ice Cream',
 'Creamy vanilla ice cream.',
 150.00, 'ice-cream.jpg', TRUE),

(7, 'Gulab Jamun',
 'Traditional Indian sweet served warm.',
 160.00, 'gulab-jamun.jpg', TRUE),


-- Thakali
(8, 'Chicken Thakali Set',
 'Traditional Nepali Thakali set with chicken, rice, dal and vegetables.',
 450.00, 'chicken-thakali.jpg', TRUE),

(8, 'Mutton Thakali Set',
 'Traditional Thakali meal served with tender mutton.',
 550.00, 'mutton-thakali.jpg', TRUE),

(8, 'Veg Thakali Set',
 'Traditional vegetarian Thakali meal.',
 350.00, 'veg-thakali.jpg', TRUE);


-- ============================================================
-- SAMPLE USERS
-- ============================================================

-- Password for these demo accounts will be replaced with
-- properly hashed passwords when authentication is implemented.

INSERT INTO users
(full_name, email, password, phone, address, role)
VALUES
(
    'FoodShala Admin',
    'admin@foodshala.com',
    '$2b$10$abcdefghijklmnopqrstuuV6Jw8lXn5zLQ0VhP3fYx7Jq',
    '9800000000',
    'Kathmandu, Nepal',
    'admin'
),
(
    'Demo Customer',
    'customer@foodshala.com',
    '$2b$10$abcdefghijklmnopqrstuuV6Jw8lXn5zLQ0VhP3fYx7Jq',
    '9811111111',
    'Kathmandu, Nepal',
    'customer'
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_food_category
ON foods(category_id);

CREATE INDEX idx_food_available
ON foods(is_available);

CREATE INDEX idx_orders_user
ON orders(user_id);

CREATE INDEX idx_orders_status
ON orders(order_status);

CREATE INDEX idx_orders_created
ON orders(created_at);

CREATE INDEX idx_reviews_food
ON reviews(food_id);

CREATE INDEX idx_cart_user
ON cart(user_id);


-- ============================================================
-- COMPLETE
-- ============================================================

SELECT 'FoodShala database created successfully!' AS message;