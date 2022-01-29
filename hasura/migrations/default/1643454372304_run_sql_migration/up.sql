-- Fix current applicants
UPDATE users SET has_samples = (SELECT EXISTS (SELECT id FROM samples WHERE user_id = users.id));
