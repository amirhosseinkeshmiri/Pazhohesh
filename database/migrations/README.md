# Manual database migrations

This directory contains PostgreSQL SQL migrations. Every file must be reviewed and applied manually by the database administrator in numeric order. The application never applies migrations automatically.

`001_initial_schema.sql` initializes the current application schema in a fresh PostgreSQL 16 database. Review the target database and back it up when applicable before running any migration.

Application deployment must never run Prisma migrate, Prisma reset, or Prisma db push commands against production.
