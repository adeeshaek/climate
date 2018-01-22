-- Up
ALTER TABLE Users ADD COLUMN authToken TEXT;
ALTER TABLE Users ADD COLUMN authTokenCreatedAt INTEGER;

-- Down
