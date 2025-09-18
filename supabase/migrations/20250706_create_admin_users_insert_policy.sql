-- Allow inserts for all users (for development only)
CREATE POLICY "Allow insert for all" ON admin_users
FOR INSERT
WITH CHECK (true);
