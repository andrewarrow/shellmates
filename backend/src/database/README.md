# Database System

This directory contains the SQLite database implementation with a migration and seeding system.

## Structure

- `db.js` - Main database interface
- `migrations/` - Database schema migration files
- `seeds/` - Seed data files

## Migrations

Migrations are stored in the `migrations/` directory as JavaScript files. They are run in alphabetical order.

Each migration file should export an object with an `up` and `down` method:

```js
module.exports = {
  up: (db) => {
    // Code to apply the migration
  },
  down: (db) => {
    // Code to revert the migration
  }
};
```

Migrations are automatically run when the server starts up, but only those that haven't been applied yet.

## Seeds

Seeds are stored in the `seeds/` directory as JavaScript files. They are also run in alphabetical order.

Each seed file should export an object with a `run` method:

```js
module.exports = {
  run: (db) => {
    // Code to seed the database
  }
};
```

Seeds are also automatically run when the server starts up.

## CLI Commands

The following npm scripts are available:

- `npm run migrate` - Run all pending migrations
- `npm run seed` - Run all seed files
- `npm run reset-db` - Delete the database, run all migrations, and seeds

## EC2 Instances

The `ec2_instances` table represents EC2 instances with the following fields:

- `id` - Primary key
- `name` - Instance name
- `instance_id` - EC2 instance ID
- `instance_state` - Current state of the instance (e.g., running, stopped)
- `launch_time` - When the instance was launched
- `private_ip_address` - Private IP address
- `image_id` - AMI ID
- `host_id` - Host ID
- `user_id` - Foreign key to the users table
- `created_at` - When the record was created