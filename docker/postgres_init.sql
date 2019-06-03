/**
 * Database initialisation script
 */

/**
 * Role insert
 */
INSERT INTO "roles" ("code") VALUES ('ADMIN'), ('USER');

/**
 * User insert
 * password admin : admin
 * password user : user
 */
INSERT INTO "users" ("email", "isActive", "password") VALUES 
('admin@admin.com',TRUE, '8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918'),
('user@user.com', TRUE, '04F8996DA763B7A969B1028EE3007569EAF3A635486DDAB211D512C85B9DF8FB');

/**
 * users roles insertion
 */
INSERT INTO "users_roles" ("usersId", "rolesId") VALUES
(1,1),
(1,2),
(2,2);