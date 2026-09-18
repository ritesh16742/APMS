# APMS Production Deployment — GitHub + Neon + Vercel

This guide is designed so production does not depend on a laptop, localhost, XAMPP, MySQL, or local files.

## 1. Push the project to GitHub

Create a GitHub repository and push the complete project. **Do not commit `.env`**. The included `.gitignore` excludes it.

```bash
git init
git add .
git commit -m "Initial APMS release"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY
 git push -u origin main
```

## 2. Create the cloud database

Use a managed PostgreSQL provider such as Neon. Create a PostgreSQL database and copy its connection string. Keep the connection string private.

The application does not use MySQL, XAMPP or a local database in production.

## 3. Deploy the web application

Create a Vercel project and import the GitHub repository. Vercel detects Next.js automatically.

Set these environment variables in the Vercel project settings for **Production**:

```text
DATABASE_URL=<your managed PostgreSQL connection string>
AUTH_SECRET=<long random secret>
NEXT_PUBLIC_APP_NAME=APMS
```

No application source file needs to be edited when the database or public deployment URL changes.

## 4. Initialize the new production database

After the database is created, run the schema once against the production database. The easiest safe method is from a machine that has Node.js and the repository, using the production `DATABASE_URL` only for this initialization step:

```bash
npm install
npm run db:migrate
npm run db:seed
```

Do not commit the production connection string. If your provider supplies a web SQL console, the contents of `db/schema.sql` can also be executed there, followed by the seed script from a secure environment.

The migration creates all required tables and indexes. The seed creates fictional demonstration records and demo accounts.

## 5. Verify the deployment

Open the Vercel public URL.

Then verify:

1. Login page loads.
2. Admin login works with `admin / Admin@123`.
3. Personnel login works with `personnel01 / Personnel@123`.
4. Admin can search and manage personnel.
5. Personnel can view/edit their own profile.
6. Family, leave, posting, document and award CRUD works.
7. Admin can approve/reject pending leave.
8. Payment records are visible to the linked personnel and manageable by admin.
9. `https://YOUR_DOMAIN/api/health` returns a healthy JSON response.

## 6. Production behavior

- Frontend and API are deployed together.
- The browser never receives `DATABASE_URL` or `AUTH_SECRET`.
- Session cookie is HTTP-only and secure in production.
- No hardcoded production URL is required.
- No local filesystem storage is required. Documents store metadata plus an optional storage reference URL. This keeps the base deployment persistent without adding an object-storage service.

## 7. If you later add real file uploads

Use an object-storage provider and add server-side credentials as environment variables. Do not store uploaded files on the Vercel server filesystem.

## 8. Troubleshooting

### `DATABASE_URL is required`
Set `DATABASE_URL` in the shell running the migration or in the deployment environment.

### `password authentication failed`
Re-copy the provider connection string and verify its username/password.

### Login returns `Invalid credentials`
Run `npm run db:seed` against the intended database.

### API returns `503`
Open `/api/health`. If unhealthy, verify the database is reachable and `DATABASE_URL` is set in Vercel.

### Deployment succeeds but old UI appears
Trigger a new Vercel deployment from the latest GitHub commit and check that the intended branch is connected.
