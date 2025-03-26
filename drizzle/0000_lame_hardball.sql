CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`parent_id` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`address` text,
	`tax_id` text,
	`notes` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text,
	`variant_id` text,
	`location_id` text NOT NULL,
	`quantity` real DEFAULT 0 NOT NULL,
	`min_quantity` real DEFAULT 0,
	`max_quantity` real,
	`last_stock_take` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `inventory_alerts` (
	`id` text PRIMARY KEY NOT NULL,
	`inventory_id` text NOT NULL,
	`type` text NOT NULL,
	`message` text NOT NULL,
	`is_resolved` integer DEFAULT false,
	`resolved_at` integer,
	`resolved_by_id` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `inventory_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`inventory_id` text NOT NULL,
	`type` text NOT NULL,
	`quantity` real NOT NULL,
	`previous_quantity` real NOT NULL,
	`new_quantity` real NOT NULL,
	`reference` text,
	`notes` text,
	`user_id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`address` text,
	`phone` text,
	`is_default` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`sale_id` text NOT NULL,
	`amount` real NOT NULL,
	`method` text NOT NULL,
	`status` text NOT NULL,
	`reference` text,
	`notes` text,
	`user_id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`sku` text,
	`barcode` text,
	`purchase_price` real,
	`selling_price` real,
	`attributes` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`sku` text,
	`barcode` text,
	`category_id` text,
	`purchase_price` real DEFAULT 0 NOT NULL,
	`selling_price` real DEFAULT 0 NOT NULL,
	`tax_rate` real DEFAULT 0,
	`is_active` integer DEFAULT true,
	`image_url` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `purchase_order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`purchase_order_id` text NOT NULL,
	`product_id` text,
	`variant_id` text,
	`name` text NOT NULL,
	`quantity` real NOT NULL,
	`received_quantity` real DEFAULT 0,
	`unit_price` real NOT NULL,
	`tax_rate` real DEFAULT 0,
	`tax_amount` real DEFAULT 0,
	`subtotal` real NOT NULL,
	`total` real NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `purchase_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`supplier_id` text NOT NULL,
	`order_number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`order_date` integer,
	`expected_delivery_date` integer,
	`subtotal` real DEFAULT 0 NOT NULL,
	`tax_amount` real DEFAULT 0 NOT NULL,
	`total` real DEFAULT 0 NOT NULL,
	`notes` text,
	`user_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sale_items` (
	`id` text PRIMARY KEY NOT NULL,
	`sale_id` text NOT NULL,
	`product_id` text,
	`variant_id` text,
	`name` text NOT NULL,
	`quantity` real NOT NULL,
	`unit_price` real NOT NULL,
	`tax_rate` real DEFAULT 0,
	`tax_amount` real DEFAULT 0,
	`discount_amount` real DEFAULT 0,
	`subtotal` real NOT NULL,
	`total` real NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`customer_id` text,
	`order_number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`subtotal` real DEFAULT 0 NOT NULL,
	`tax_amount` real DEFAULT 0 NOT NULL,
	`discount_amount` real DEFAULT 0 NOT NULL,
	`total` real DEFAULT 0 NOT NULL,
	`notes` text,
	`user_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact_name` text,
	`email` text,
	`phone` text,
	`address` text,
	`tax_id` text,
	`notes` text,
	`is_active` integer DEFAULT true,
	`created_at` integer,
	`updated_at` integer
);
