--liquibase formatted sql

--changeset notification-service:001-initial-setup
--comment: Initial setup for notification service database

-- This is a placeholder for future notification-related tables
-- When notification entities are created, add the table definitions here

-- Example structure for future notification table:
-- CREATE TABLE IF NOT EXISTS notifications (
--     id BIGSERIAL PRIMARY KEY,
--     user_id BIGINT NOT NULL,
--     type VARCHAR(50) NOT NULL,
--     subject VARCHAR(255),
--     content TEXT NOT NULL,
--     status VARCHAR(20) NOT NULL,
--     sent_at TIMESTAMP,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- For now, just create a version tracking table
CREATE TABLE IF NOT EXISTS notification_service_version (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notification_service_version (version) VALUES ('1.0.0');

--rollback DROP TABLE IF EXISTS notification_service_version;
