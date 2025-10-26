-- run this script to update the 'status' column in the 'orders' table

UPDATE orders SET status = 'PENDING' WHERE status NOT IN ('PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED');

ALTER TABLE orders
    MODIFY COLUMN status ENUM('PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED');


