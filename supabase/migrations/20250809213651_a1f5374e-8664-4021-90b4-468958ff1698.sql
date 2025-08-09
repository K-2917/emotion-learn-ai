-- Enable users to delete their own enrollment rows (unenroll)
CREATE POLICY IF NOT EXISTS "Users can unenroll themselves"
ON public.enrollments
FOR DELETE
USING (auth.uid() = user_id);
