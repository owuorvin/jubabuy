CREATE TABLE `agents` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`avatar` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agents_email_unique` ON `agents` (`email`);--> statement-breakpoint
CREATE TABLE `cars` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`price` integer NOT NULL,
	`year` integer NOT NULL,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`mileage` integer NOT NULL,
	`fuel` text NOT NULL,
	`transmission` text NOT NULL,
	`condition` text NOT NULL,
	`color` text,
	`engine_size` text,
	`description` text,
	`features` text,
	`status` text DEFAULT 'active' NOT NULL,
	`featured` integer DEFAULT false,
	`views` integer DEFAULT 0,
	`agent_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cars_slug_unique` ON `cars` (`slug`);--> statement-breakpoint
CREATE INDEX `make_idx` ON `cars` (`make`);--> statement-breakpoint
CREATE INDEX `model_idx` ON `cars` (`model`);--> statement-breakpoint
CREATE INDEX `car_price_idx` ON `cars` (`price`);--> statement-breakpoint
CREATE INDEX `year_idx` ON `cars` (`year`);--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE INDEX `user_idx` ON `favorites` (`user_id`);--> statement-breakpoint
CREATE INDEX `fav_entity_idx` ON `favorites` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`alt` text,
	`is_main` integer DEFAULT false,
	`order` integer DEFAULT 0,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE INDEX `entity_idx` ON `images` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`message` text,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `land` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`price` integer NOT NULL,
	`location` text NOT NULL,
	`area` integer NOT NULL,
	`unit` text NOT NULL,
	`zoning` text NOT NULL,
	`description` text,
	`features` text,
	`status` text DEFAULT 'active' NOT NULL,
	`featured` integer DEFAULT false,
	`views` integer DEFAULT 0,
	`agent_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `land_slug_unique` ON `land` (`slug`);--> statement-breakpoint
CREATE INDEX `land_location_idx` ON `land` (`location`);--> statement-breakpoint
CREATE INDEX `land_price_idx` ON `land` (`price`);--> statement-breakpoint
CREATE TABLE `properties` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`price` integer NOT NULL,
	`location` text NOT NULL,
	`category` text NOT NULL,
	`property_type` text,
	`bedrooms` integer,
	`bathrooms` integer,
	`area` integer,
	`furnished` integer DEFAULT false,
	`description` text,
	`features` text,
	`amenities` text,
	`status` text DEFAULT 'active' NOT NULL,
	`featured` integer DEFAULT false,
	`views` integer DEFAULT 0,
	`agent_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `properties_slug_unique` ON `properties` (`slug`);--> statement-breakpoint
CREATE INDEX `location_idx` ON `properties` (`location`);--> statement-breakpoint
CREATE INDEX `price_idx` ON `properties` (`price`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `properties` (`category`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `properties` (`status`);