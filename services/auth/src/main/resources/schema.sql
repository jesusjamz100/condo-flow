CREATE TABLE _user (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  role VARCHAR(50) NOT NULL,
  created_date TIMESTAMP NOT NULL,
  last_modified_date TIMESTAMP
);

CREATE TABLE oauth2_authorization (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  registered_client_id VARCHAR(100) NOT NULL,
  principal_name VARCHAR(200) NOT NULL,
  authorization_grant_type VARCHAR(100) NOT NULL,
  authorized_scopes VARCHAR(1000),
  attributes BYTEA,
  state VARCHAR(500),
  authorization_code_value BYTEA,
  authorization_code_issued_at TIMESTAMP,
  authorization_code_expires_at TIMESTAMP,
  authorization_code_metadata BYTEA,
  access_token_value BYTEA,
  access_token_issued_at TIMESTAMP,
  access_token_expires_at TIMESTAMP,
  access_token_metadata BYTEA,
  access_token_type VARCHAR(100),
  access_token_scopes VARCHAR(1000),
  oidc_id_token_value BYTEA,
  oidc_id_token_issued_at TIMESTAMP,
  oidc_id_token_expires_at TIMESTAMP,
  oidc_id_token_metadata BYTEA,
  refresh_token_value BYTEA,
  refresh_token_issued_at TIMESTAMP,
  refresh_token_expires_at TIMESTAMP,
  refresh_token_metadata BYTEA,
  user_code_value BYTEA,
  user_code_issued_at TIMESTAMP,
  user_code_expires_at TIMESTAMP,
  user_code_metadata BYTEA,
  device_code_value BYTEA,
  device_code_issued_at TIMESTAMP,
  device_code_expires_at TIMESTAMP,
  device_code_metadata BYTEA
);

CREATE TABLE oauth2_authorization_consent (
  registered_client_id VARCHAR(100) NOT NULL,
  principal_name VARCHAR(200) NOT NULL,
  authorities VARCHAR(1000),
  PRIMARY KEY (registered_client_id, principal_name)
);