# Applied Research Support

A Persian RTL application for collecting researcher proposals and company research needs, with a protected administration area and Excel exports.

## Production setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure:

   - `DATABASE_URL`: PostgreSQL connection string
   - `ADMIN_USERNAME`: administrator username
   - `ADMIN_PASSWORD`: strong administrator password
   - `ADMIN_SESSION_SECRET`: cryptographically random value of at least 32 characters

3. For a fresh database, create the PostgreSQL database, review `database/migrations/001_initial_schema.sql`, and execute that SQL manually using your chosen database administration method. Database migrations are always manual and must be applied in numeric order.

4. Configure `DATABASE_URL`, then generate the Prisma client:

   ```bash
   npx prisma generate
   ```

   Do not use automatic Prisma migration, reset, or schema-push commands. SQL migrations are stored in `database/migrations/` and must be reviewed and executed manually by the database administrator.

5. Build and start the application:

   ```bash
   npm run build
   npm start
   ```

6. Ensure PostgreSQL is reachable from the application server and `public/uploads/` is writable and stored on persistent filesystem storage.

## Upload storage

Uploaded files are stored locally under `public/uploads/` and must survive application restarts and deployments. Deploy this application to a VPS or persistent Node.js server. A serverless platform with an ephemeral filesystem is not an appropriate primary deployment target for this storage architecture.

Uploads may reach 50 MB. If Nginx or another reverse proxy is used, configure its maximum request body size to allow at least 50 MB plus multipart overhead.

## Deployment checklist

- Use a Node.js version compatible with Next.js 16 and the project dependencies.
- Provide a reachable PostgreSQL database.
- Configure `DATABASE_URL`, `ADMIN_USERNAME`, and a strong `ADMIN_PASSWORD`.
- Set `ADMIN_SESSION_SECRET` to a random value of at least 32 characters.
- Enable HTTPS so production session cookies are transmitted securely.
- Provide a writable, persistent `public/uploads/` directory.
- Generate the Prisma client.
- Review and manually apply any SQL migrations in `database/migrations/`.
- Complete a successful production build.
- Configure the reverse proxy request-size limit for 50 MB uploads plus multipart overhead.
