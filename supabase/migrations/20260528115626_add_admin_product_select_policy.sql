/*
  # Add admin product select policy

  1. Security Changes
    - Add new RLS policy allowing admins to SELECT all products (including inactive)
    - This is needed so admins can manage all products in the admin panel
    - Regular users still only see active products via the existing policy
*/

-- Add policy for admins to see all products (including inactive ones)
CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');