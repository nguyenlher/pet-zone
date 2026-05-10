--
-- PostgreSQL database dump
--

\restrict OHfuUJS6D87P4RYdxQW8kgLLsj4KqfpxS3qf6U65rZDAgWVucsIYJpWhYOlY8ZT

-- Dumped from database version 16.13
-- Dumped by pg_dump version 17.6

-- Started on 2026-05-07 22:55:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 249 (class 1259 OID 17017)
-- Name: admin_event_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_event_entity (
    id character varying(36) NOT NULL,
    admin_event_time bigint,
    realm_id character varying(255),
    operation_type character varying(255),
    auth_realm_id character varying(255),
    auth_client_id character varying(255),
    auth_user_id character varying(255),
    ip_address character varying(255),
    resource_path character varying(2550),
    representation text,
    error character varying(255),
    resource_type character varying(64),
    details_json text
);


ALTER TABLE public.admin_event_entity OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 17460)
-- Name: associated_policy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.associated_policy (
    policy_id character varying(36) NOT NULL,
    associated_policy_id character varying(36) NOT NULL
);


ALTER TABLE public.associated_policy OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 17032)
-- Name: authentication_execution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authentication_execution (
    id character varying(36) NOT NULL,
    alias character varying(255),
    authenticator character varying(36),
    realm_id character varying(36),
    flow_id character varying(36),
    requirement integer,
    priority integer,
    authenticator_flow boolean DEFAULT false NOT NULL,
    auth_flow_id character varying(36),
    auth_config character varying(36)
);


ALTER TABLE public.authentication_execution OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 17027)
-- Name: authentication_flow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authentication_flow (
    id character varying(36) NOT NULL,
    alias character varying(255),
    description character varying(255),
    realm_id character varying(36),
    provider_id character varying(36) DEFAULT 'basic-flow'::character varying NOT NULL,
    top_level boolean DEFAULT false NOT NULL,
    built_in boolean DEFAULT false NOT NULL
);


ALTER TABLE public.authentication_flow OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 17022)
-- Name: authenticator_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authenticator_config (
    id character varying(36) NOT NULL,
    alias character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.authenticator_config OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 17037)
-- Name: authenticator_config_entry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authenticator_config_entry (
    authenticator_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.authenticator_config_entry OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 17475)
-- Name: broker_link; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.broker_link (
    identity_provider character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL,
    broker_user_id character varying(255),
    broker_username character varying(255),
    token text,
    user_id character varying(255) NOT NULL
);


ALTER TABLE public.broker_link OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16398)
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    full_scope_allowed boolean DEFAULT false NOT NULL,
    client_id character varying(255),
    not_before integer,
    public_client boolean DEFAULT false NOT NULL,
    secret character varying(255),
    base_url character varying(255),
    bearer_only boolean DEFAULT false NOT NULL,
    management_url character varying(255),
    surrogate_auth_required boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    protocol character varying(255),
    node_rereg_timeout integer DEFAULT 0,
    frontchannel_logout boolean DEFAULT false NOT NULL,
    consent_required boolean DEFAULT false NOT NULL,
    name character varying(255),
    service_accounts_enabled boolean DEFAULT false NOT NULL,
    client_authenticator_type character varying(255),
    root_url character varying(255),
    description character varying(255),
    registration_token character varying(255),
    standard_flow_enabled boolean DEFAULT true NOT NULL,
    implicit_flow_enabled boolean DEFAULT false NOT NULL,
    direct_access_grants_enabled boolean DEFAULT false NOT NULL,
    always_display_in_console boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16756)
-- Name: client_attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_attributes (
    client_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.client_attributes OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 17725)
-- Name: client_auth_flow_bindings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_auth_flow_bindings (
    client_id character varying(36) NOT NULL,
    flow_id character varying(36),
    binding_name character varying(255) NOT NULL
);


ALTER TABLE public.client_auth_flow_bindings OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 17599)
-- Name: client_initial_access; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_initial_access (
    id character varying(36) NOT NULL,
    realm_id character varying(36) NOT NULL,
    "timestamp" integer,
    expiration integer,
    count integer,
    remaining_count integer
);


ALTER TABLE public.client_initial_access OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16766)
-- Name: client_node_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_node_registrations (
    client_id character varying(36) NOT NULL,
    value integer,
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_node_registrations OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 17265)
-- Name: client_scope; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_scope (
    id character varying(36) NOT NULL,
    name character varying(255),
    realm_id character varying(36),
    description character varying(255),
    protocol character varying(255)
);


ALTER TABLE public.client_scope OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 17279)
-- Name: client_scope_attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_scope_attributes (
    scope_id character varying(36) NOT NULL,
    value character varying(2048),
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_scope_attributes OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 17766)
-- Name: client_scope_client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_scope_client (
    client_id character varying(255) NOT NULL,
    scope_id character varying(255) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client_scope_client OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 17284)
-- Name: client_scope_role_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_scope_role_mapping (
    scope_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.client_scope_role_mapping OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 17520)
-- Name: component; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.component (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_id character varying(36),
    provider_id character varying(36),
    provider_type character varying(255),
    realm_id character varying(36),
    sub_type character varying(255)
);


ALTER TABLE public.component OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 17515)
-- Name: component_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.component_config (
    id character varying(36) NOT NULL,
    component_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.component_config OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16417)
-- Name: composite_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.composite_role (
    composite character varying(36) NOT NULL,
    child_role character varying(36) NOT NULL
);


ALTER TABLE public.composite_role OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16420)
-- Name: credential; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    user_id character varying(36),
    created_date bigint,
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer,
    version integer DEFAULT 0
);


ALTER TABLE public.credential OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16385)
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16390)
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 17782)
-- Name: default_client_scope; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.default_client_scope (
    realm_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.default_client_scope OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16425)
-- Name: event_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_entity (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    details_json character varying(2550),
    error character varying(255),
    ip_address character varying(255),
    realm_id character varying(255),
    session_id character varying(255),
    event_time bigint,
    type character varying(255),
    user_id character varying(255),
    details_json_long_value text
);


ALTER TABLE public.event_entity OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 17480)
-- Name: fed_user_attribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fed_user_attribute (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    value character varying(2024),
    long_value_hash bytea,
    long_value_hash_lower_case bytea,
    long_value text
);


ALTER TABLE public.fed_user_attribute OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 17485)
-- Name: fed_user_consent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fed_user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.fed_user_consent OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 17808)
-- Name: fed_user_consent_cl_scope; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fed_user_consent_cl_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.fed_user_consent_cl_scope OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 17494)
-- Name: fed_user_credential; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fed_user_credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    created_date bigint,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


ALTER TABLE public.fed_user_credential OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 17503)
-- Name: fed_user_group_membership; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fed_user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_group_membership OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 17506)
-- Name: fed_user_required_action; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fed_user_required_action (
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_required_action OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 17512)
-- Name: fed_user_role_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fed_user_role_mapping (
    role_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_role_mapping OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16802)
-- Name: federated_identity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.federated_identity (
    identity_provider character varying(255) NOT NULL,
    realm_id character varying(36),
    federated_user_id character varying(255),
    federated_username character varying(255),
    token text,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_identity OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 17577)
-- Name: federated_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.federated_user (
    id character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_user OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 17204)
-- Name: group_attribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_attribute OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 17201)
-- Name: group_role_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_role_mapping (
    role_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_role_mapping OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16807)
-- Name: identity_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identity_provider (
    internal_id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    provider_alias character varying(255),
    provider_id character varying(255),
    store_token boolean,
    authenticate_by_default boolean,
    realm_id character varying(36),
    add_token_role boolean,
    trust_email boolean,
    first_broker_login_flow_id character varying(36),
    post_broker_login_flow_id character varying(36),
    provider_display_name character varying(255),
    link_only boolean,
    organization_id character varying(255),
    hide_on_login boolean
);


ALTER TABLE public.identity_provider OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16816)
-- Name: identity_provider_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identity_provider_config (
    identity_provider_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.identity_provider_config OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 16920)
-- Name: identity_provider_mapper; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identity_provider_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    idp_alias character varying(255) NOT NULL,
    idp_mapper_name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.identity_provider_mapper OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16925)
-- Name: idp_mapper_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.idp_mapper_config (
    idp_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.idp_mapper_config OWNER TO postgres;

--
-- TOC entry 301 (class 1259 OID 18009)
-- Name: jgroups_ping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jgroups_ping (
    address character varying(200) NOT NULL,
    name character varying(200),
    cluster_name character varying(200) NOT NULL,
    ip character varying(200) NOT NULL,
    coord boolean
);


ALTER TABLE public.jgroups_ping OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 17198)
-- Name: keycloak_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.keycloak_group (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_group character varying(36) NOT NULL,
    realm_id character varying(36),
    type integer DEFAULT 0 NOT NULL,
    description character varying(255),
    org_id character varying(255),
    created_timestamp bigint,
    last_modified_timestamp bigint
);


ALTER TABLE public.keycloak_group OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16433)
-- Name: keycloak_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.keycloak_role (
    id character varying(36) NOT NULL,
    client_realm_constraint character varying(255),
    client_role boolean DEFAULT false NOT NULL,
    description character varying(255),
    name character varying(255),
    realm_id character varying(255),
    client character varying(36),
    realm character varying(36)
);


ALTER TABLE public.keycloak_role OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16917)
-- Name: migration_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migration_model (
    id character varying(36) NOT NULL,
    version character varying(36),
    update_time bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.migration_model OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 17189)
-- Name: offline_client_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offline_client_session (
    user_session_id character varying(36) NOT NULL,
    client_id character varying(255) NOT NULL,
    offline_flag character varying(4) NOT NULL,
    "timestamp" integer,
    data text,
    client_storage_provider character varying(36) DEFAULT 'local'::character varying NOT NULL,
    external_client_id character varying(255) DEFAULT 'local'::character varying NOT NULL,
    version integer DEFAULT 0,
    realm_id character varying(36)
);


ALTER TABLE public.offline_client_session OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 17184)
-- Name: offline_user_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offline_user_session (
    user_session_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    created_on integer NOT NULL,
    offline_flag character varying(4) NOT NULL,
    data text,
    last_session_refresh integer DEFAULT 0 NOT NULL,
    broker_session_id character varying(1024),
    version integer DEFAULT 0,
    remember_me boolean
);


ALTER TABLE public.offline_user_session OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 17972)
-- Name: org; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.org (
    id character varying(255) NOT NULL,
    enabled boolean NOT NULL,
    realm_id character varying(255) NOT NULL,
    group_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(4000),
    alias character varying(255) NOT NULL,
    redirect_url character varying(2048)
);


ALTER TABLE public.org OWNER TO postgres;

--
-- TOC entry 299 (class 1259 OID 17983)
-- Name: org_domain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.org_domain (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    verified boolean NOT NULL,
    org_id character varying(255) NOT NULL
);


ALTER TABLE public.org_domain OWNER TO postgres;

--
-- TOC entry 304 (class 1259 OID 18048)
-- Name: org_invitation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.org_invitation (
    id character varying(36) NOT NULL,
    organization_id character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    created_at integer NOT NULL,
    expires_at integer,
    invite_link character varying(2048)
);


ALTER TABLE public.org_invitation OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 17403)
-- Name: policy_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.policy_config (
    policy_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.policy_config OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16791)
-- Name: protocol_mapper; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.protocol_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    protocol character varying(255) NOT NULL,
    protocol_mapper_name character varying(255) NOT NULL,
    client_id character varying(36),
    client_scope_id character varying(36)
);


ALTER TABLE public.protocol_mapper OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16797)
-- Name: protocol_mapper_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.protocol_mapper_config (
    protocol_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.protocol_mapper_config OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16439)
-- Name: realm; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realm (
    id character varying(36) NOT NULL,
    access_code_lifespan integer,
    user_action_lifespan integer,
    access_token_lifespan integer,
    account_theme character varying(255),
    admin_theme character varying(255),
    email_theme character varying(255),
    enabled boolean DEFAULT false NOT NULL,
    events_enabled boolean DEFAULT false NOT NULL,
    events_expiration bigint,
    login_theme character varying(255),
    name character varying(255),
    not_before integer,
    password_policy character varying(2550),
    registration_allowed boolean DEFAULT false NOT NULL,
    remember_me boolean DEFAULT false NOT NULL,
    reset_password_allowed boolean DEFAULT false NOT NULL,
    social boolean DEFAULT false NOT NULL,
    ssl_required character varying(255),
    sso_idle_timeout integer,
    sso_max_lifespan integer,
    update_profile_on_soc_login boolean DEFAULT false NOT NULL,
    verify_email boolean DEFAULT false NOT NULL,
    master_admin_client character varying(36),
    login_lifespan integer,
    internationalization_enabled boolean DEFAULT false NOT NULL,
    default_locale character varying(255),
    reg_email_as_username boolean DEFAULT false NOT NULL,
    admin_events_enabled boolean DEFAULT false NOT NULL,
    admin_events_details_enabled boolean DEFAULT false NOT NULL,
    edit_username_allowed boolean DEFAULT false NOT NULL,
    otp_policy_counter integer DEFAULT 0,
    otp_policy_window integer DEFAULT 1,
    otp_policy_period integer DEFAULT 30,
    otp_policy_digits integer DEFAULT 6,
    otp_policy_alg character varying(36) DEFAULT 'HmacSHA1'::character varying,
    otp_policy_type character varying(36) DEFAULT 'totp'::character varying,
    browser_flow character varying(36),
    registration_flow character varying(36),
    direct_grant_flow character varying(36),
    reset_credentials_flow character varying(36),
    client_auth_flow character varying(36),
    offline_session_idle_timeout integer DEFAULT 0,
    revoke_refresh_token boolean DEFAULT false NOT NULL,
    access_token_life_implicit integer DEFAULT 0,
    login_with_email_allowed boolean DEFAULT true NOT NULL,
    duplicate_emails_allowed boolean DEFAULT false NOT NULL,
    docker_auth_flow character varying(36),
    refresh_token_max_reuse integer DEFAULT 0,
    allow_user_managed_access boolean DEFAULT false NOT NULL,
    sso_max_lifespan_remember_me integer DEFAULT 0 NOT NULL,
    sso_idle_timeout_remember_me integer DEFAULT 0 NOT NULL,
    default_role character varying(255)
);


ALTER TABLE public.realm OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16456)
-- Name: realm_attribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realm_attribute (
    name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    value text
);


ALTER TABLE public.realm_attribute OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 17213)
-- Name: realm_default_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realm_default_groups (
    realm_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_default_groups OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16909)
-- Name: realm_enabled_event_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realm_enabled_event_types (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_enabled_event_types OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16464)
-- Name: realm_events_listeners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realm_events_listeners (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_events_listeners OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 17916)
-- Name: realm_localizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realm_localizations (
    realm_id character varying(255) NOT NULL,
    locale character varying(255) NOT NULL,
    texts text NOT NULL
);


ALTER TABLE public.realm_localizations OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16467)
-- Name: realm_required_credential; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realm_required_credential (
    type character varying(255) NOT NULL,
    form_label character varying(255),
    input boolean DEFAULT false NOT NULL,
    secret boolean DEFAULT false NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_required_credential OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16474)
-- Name: realm_smtp_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realm_smtp_config (
    realm_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.realm_smtp_config OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16825)
-- Name: realm_supported_locales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realm_supported_locales (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_supported_locales OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16484)
-- Name: redirect_uris; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.redirect_uris (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.redirect_uris OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 17148)
-- Name: required_action_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.required_action_config (
    required_action_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.required_action_config OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 17141)
-- Name: required_action_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.required_action_provider (
    id character varying(36) NOT NULL,
    alias character varying(255),
    name character varying(255),
    realm_id character varying(36),
    enabled boolean DEFAULT false NOT NULL,
    default_action boolean DEFAULT false NOT NULL,
    provider_id character varying(255),
    priority integer
);


ALTER TABLE public.required_action_provider OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 17847)
-- Name: resource_attribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    resource_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_attribute OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 17430)
-- Name: resource_policy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_policy (
    resource_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_policy OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 17415)
-- Name: resource_scope; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_scope (
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_scope OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 17353)
-- Name: resource_server; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_server (
    id character varying(36) NOT NULL,
    allow_rs_remote_mgmt boolean DEFAULT false NOT NULL,
    policy_enforce_mode smallint NOT NULL,
    decision_strategy smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.resource_server OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 17823)
-- Name: resource_server_perm_ticket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_server_perm_ticket (
    id character varying(36) NOT NULL,
    owner character varying(255) NOT NULL,
    requester character varying(255) NOT NULL,
    created_timestamp bigint NOT NULL,
    granted_timestamp bigint,
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36),
    resource_server_id character varying(36) NOT NULL,
    policy_id character varying(36)
);


ALTER TABLE public.resource_server_perm_ticket OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 17389)
-- Name: resource_server_policy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_server_policy (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    type character varying(255) NOT NULL,
    decision_strategy smallint,
    logic smallint,
    resource_server_id character varying(36) NOT NULL,
    owner character varying(255)
);


ALTER TABLE public.resource_server_policy OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 17361)
-- Name: resource_server_resource; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_server_resource (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255),
    icon_uri character varying(255),
    owner character varying(255) NOT NULL,
    resource_server_id character varying(36) NOT NULL,
    owner_managed_access boolean DEFAULT false NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_resource OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 17375)
-- Name: resource_server_scope; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_server_scope (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    icon_uri character varying(255),
    resource_server_id character varying(36) NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_scope OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 17865)
-- Name: resource_uris; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_uris (
    resource_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.resource_uris OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 18000)
-- Name: revoked_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.revoked_token (
    id character varying(255) NOT NULL,
    expire bigint NOT NULL
);


ALTER TABLE public.revoked_token OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 17875)
-- Name: role_attribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_attribute (
    id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255)
);


ALTER TABLE public.role_attribute OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16487)
-- Name: scope_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scope_mapping (
    client_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_mapping OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 17445)
-- Name: scope_policy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scope_policy (
    scope_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_policy OWNER TO postgres;

--
-- TOC entry 302 (class 1259 OID 18016)
-- Name: server_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.server_config (
    server_config_key character varying(255) NOT NULL,
    value text NOT NULL,
    version integer DEFAULT 0
);


ALTER TABLE public.server_config OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16493)
-- Name: user_attribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_attribute (
    name character varying(255) NOT NULL,
    value character varying(255),
    user_id character varying(36) NOT NULL,
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    long_value_hash bytea,
    long_value_hash_lower_case bytea,
    long_value text
);


ALTER TABLE public.user_attribute OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 16930)
-- Name: user_consent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(36) NOT NULL,
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.user_consent OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 17798)
-- Name: user_consent_client_scope; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_consent_client_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.user_consent_client_scope OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16498)
-- Name: user_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_entity (
    id character varying(36) NOT NULL,
    email character varying(255),
    email_constraint character varying(255),
    email_verified boolean DEFAULT false NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    federation_link character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    realm_id character varying(255),
    username character varying(255),
    created_timestamp bigint,
    service_account_client_link character varying(255),
    not_before integer DEFAULT 0 NOT NULL,
    last_modified_timestamp bigint
);


ALTER TABLE public.user_entity OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16506)
-- Name: user_federation_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_federation_config (
    user_federation_provider_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_config OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 17042)
-- Name: user_federation_mapper; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_federation_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    federation_provider_id character varying(36) NOT NULL,
    federation_mapper_type character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.user_federation_mapper OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 17047)
-- Name: user_federation_mapper_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_federation_mapper_config (
    user_federation_mapper_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_mapper_config OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16511)
-- Name: user_federation_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_federation_provider (
    id character varying(36) NOT NULL,
    changed_sync_period integer,
    display_name character varying(255),
    full_sync_period integer,
    last_sync integer,
    priority integer,
    provider_name character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.user_federation_provider OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 17210)
-- Name: user_group_membership; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL,
    membership_type character varying(255) NOT NULL
);


ALTER TABLE public.user_group_membership OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16516)
-- Name: user_required_action; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_required_action (
    user_id character varying(36) NOT NULL,
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL
);


ALTER TABLE public.user_required_action OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16519)
-- Name: user_role_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_role_mapping (
    role_id character varying(255) NOT NULL,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.user_role_mapping OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16533)
-- Name: web_origins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.web_origins (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.web_origins OWNER TO postgres;

--
-- TOC entry 303 (class 1259 OID 18032)
-- Name: workflow_state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_state (
    execution_id character varying(255) NOT NULL,
    resource_id character varying(255) NOT NULL,
    workflow_id character varying(255) NOT NULL,
    resource_type character varying(255),
    scheduled_step_id character varying(255),
    scheduled_step_timestamp bigint
);


ALTER TABLE public.workflow_state OWNER TO postgres;

--
-- TOC entry 4266 (class 0 OID 17017)
-- Dependencies: 249
-- Data for Name: admin_event_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_event_entity (id, admin_event_time, realm_id, operation_type, auth_realm_id, auth_client_id, auth_user_id, ip_address, resource_path, representation, error, resource_type, details_json) FROM stdin;
\.


--
-- TOC entry 4293 (class 0 OID 17460)
-- Dependencies: 276
-- Data for Name: associated_policy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.associated_policy (policy_id, associated_policy_id) FROM stdin;
\.


--
-- TOC entry 4269 (class 0 OID 17032)
-- Dependencies: 252
-- Data for Name: authentication_execution; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authentication_execution (id, alias, authenticator, realm_id, flow_id, requirement, priority, authenticator_flow, auth_flow_id, auth_config) FROM stdin;
e7b35a57-6f50-4a84-9d3a-6d5a71cda0bd	\N	auth-cookie	da5e2aa6-73ba-48b9-80fd-c2412ca322de	57a49113-8bab-4e8b-a1ac-ec658096e48d	2	10	f	\N	\N
d2e24c2e-17d2-481b-8e74-749497d6c05c	\N	auth-spnego	da5e2aa6-73ba-48b9-80fd-c2412ca322de	57a49113-8bab-4e8b-a1ac-ec658096e48d	3	20	f	\N	\N
710848f7-6c61-4723-a59e-9f843f30499d	\N	identity-provider-redirector	da5e2aa6-73ba-48b9-80fd-c2412ca322de	57a49113-8bab-4e8b-a1ac-ec658096e48d	2	25	f	\N	\N
fa2d0e2b-daf3-49f2-9bf0-dbc8f3a7e619	\N	\N	da5e2aa6-73ba-48b9-80fd-c2412ca322de	57a49113-8bab-4e8b-a1ac-ec658096e48d	2	30	t	6bda29ba-7666-4498-a361-d121817cdc24	\N
371a03cf-6a09-461f-9db5-b4fcb8437e9d	\N	auth-username-password-form	da5e2aa6-73ba-48b9-80fd-c2412ca322de	6bda29ba-7666-4498-a361-d121817cdc24	0	10	f	\N	\N
6f3b7d70-264a-4c81-9d99-d00614b493ae	\N	\N	da5e2aa6-73ba-48b9-80fd-c2412ca322de	6bda29ba-7666-4498-a361-d121817cdc24	1	20	t	c5442e38-b960-465d-84b3-3745e417ab36	\N
8a5468a8-96e8-4f2b-84f1-d54843754343	\N	conditional-user-configured	da5e2aa6-73ba-48b9-80fd-c2412ca322de	c5442e38-b960-465d-84b3-3745e417ab36	0	10	f	\N	\N
8f9e63fd-ff57-40ed-8d0d-061b48b51005	\N	conditional-credential	da5e2aa6-73ba-48b9-80fd-c2412ca322de	c5442e38-b960-465d-84b3-3745e417ab36	0	20	f	\N	310a9040-4b0d-4f3a-acd2-e17cd156b257
fece270c-3120-4b23-953d-b897a7478c61	\N	auth-otp-form	da5e2aa6-73ba-48b9-80fd-c2412ca322de	c5442e38-b960-465d-84b3-3745e417ab36	2	30	f	\N	\N
8bd59320-34cc-4cba-9906-b15f83ccd82f	\N	webauthn-authenticator	da5e2aa6-73ba-48b9-80fd-c2412ca322de	c5442e38-b960-465d-84b3-3745e417ab36	3	40	f	\N	\N
56bdc363-0813-41b0-831c-5197f6422d73	\N	auth-recovery-authn-code-form	da5e2aa6-73ba-48b9-80fd-c2412ca322de	c5442e38-b960-465d-84b3-3745e417ab36	3	50	f	\N	\N
2e0effee-1a40-486b-9d77-001a3a1cebe4	\N	direct-grant-validate-username	da5e2aa6-73ba-48b9-80fd-c2412ca322de	2ddeb16f-eed8-4bc6-b608-1e03c3f110e3	0	10	f	\N	\N
828696da-3519-461b-9907-a3237210787b	\N	direct-grant-validate-password	da5e2aa6-73ba-48b9-80fd-c2412ca322de	2ddeb16f-eed8-4bc6-b608-1e03c3f110e3	0	20	f	\N	\N
65650aae-10e5-4783-b627-52de35400117	\N	\N	da5e2aa6-73ba-48b9-80fd-c2412ca322de	2ddeb16f-eed8-4bc6-b608-1e03c3f110e3	1	30	t	da628956-b467-4a7c-a81f-e05ac453e989	\N
2f10da62-6a06-4f2b-939c-89357e2b7d73	\N	conditional-user-configured	da5e2aa6-73ba-48b9-80fd-c2412ca322de	da628956-b467-4a7c-a81f-e05ac453e989	0	10	f	\N	\N
06f30e6d-201e-4ec8-a60c-c0e983b91bf9	\N	direct-grant-validate-otp	da5e2aa6-73ba-48b9-80fd-c2412ca322de	da628956-b467-4a7c-a81f-e05ac453e989	0	20	f	\N	\N
30eb5ada-563a-4235-a2a6-e8138ce98737	\N	registration-page-form	da5e2aa6-73ba-48b9-80fd-c2412ca322de	76ab432a-4ad6-48c3-969b-b19c6fe6568a	0	10	t	8360836d-aa0b-4b41-8060-5da57a8dc1c1	\N
7af094c8-9fa2-48ac-820e-47c9fd785e44	\N	registration-user-creation	da5e2aa6-73ba-48b9-80fd-c2412ca322de	8360836d-aa0b-4b41-8060-5da57a8dc1c1	0	20	f	\N	\N
ecb05302-a9da-40d5-8bcb-327a1d6a30f9	\N	registration-password-action	da5e2aa6-73ba-48b9-80fd-c2412ca322de	8360836d-aa0b-4b41-8060-5da57a8dc1c1	0	50	f	\N	\N
50096348-da89-4f62-a19f-fb11d96a120b	\N	registration-recaptcha-action	da5e2aa6-73ba-48b9-80fd-c2412ca322de	8360836d-aa0b-4b41-8060-5da57a8dc1c1	3	60	f	\N	\N
0c940a01-a111-4c52-bf06-6331a807874a	\N	registration-terms-and-conditions	da5e2aa6-73ba-48b9-80fd-c2412ca322de	8360836d-aa0b-4b41-8060-5da57a8dc1c1	3	70	f	\N	\N
3be3c25f-6435-4b87-9191-3b268800dfca	\N	reset-credentials-choose-user	da5e2aa6-73ba-48b9-80fd-c2412ca322de	16bb6762-e24e-45ae-9112-87182b11343e	0	10	f	\N	\N
6bcd97f2-cf53-45bb-b7d2-076c5dbf41e6	\N	reset-credential-email	da5e2aa6-73ba-48b9-80fd-c2412ca322de	16bb6762-e24e-45ae-9112-87182b11343e	0	20	f	\N	\N
e27a5b44-8c5d-43ef-95fa-ce058468ab6e	\N	reset-password	da5e2aa6-73ba-48b9-80fd-c2412ca322de	16bb6762-e24e-45ae-9112-87182b11343e	0	30	f	\N	\N
2c4bbb77-7e52-4fec-a50e-9a2395b1e603	\N	\N	da5e2aa6-73ba-48b9-80fd-c2412ca322de	16bb6762-e24e-45ae-9112-87182b11343e	1	40	t	d1b9feef-aaef-431d-99fa-fd3c24266909	\N
c684b448-7868-466f-880c-d37ab09a8b5b	\N	conditional-user-configured	da5e2aa6-73ba-48b9-80fd-c2412ca322de	d1b9feef-aaef-431d-99fa-fd3c24266909	0	10	f	\N	\N
3a5a520a-333e-450c-8bfb-cdcaeb61f555	\N	reset-otp	da5e2aa6-73ba-48b9-80fd-c2412ca322de	d1b9feef-aaef-431d-99fa-fd3c24266909	0	20	f	\N	\N
6747a173-a8ee-4678-87a6-3502b64854f2	\N	client-secret	da5e2aa6-73ba-48b9-80fd-c2412ca322de	49623b46-cd88-4919-8807-655363fd4697	2	10	f	\N	\N
8139e8db-37bc-4532-9775-b72916f50783	\N	client-jwt	da5e2aa6-73ba-48b9-80fd-c2412ca322de	49623b46-cd88-4919-8807-655363fd4697	2	20	f	\N	\N
d1b1402e-26bd-40ce-b312-4c96cf64cbd7	\N	client-secret-jwt	da5e2aa6-73ba-48b9-80fd-c2412ca322de	49623b46-cd88-4919-8807-655363fd4697	2	30	f	\N	\N
7b444f00-c4d3-4f72-8ef0-c5ef24797240	\N	client-x509	da5e2aa6-73ba-48b9-80fd-c2412ca322de	49623b46-cd88-4919-8807-655363fd4697	2	40	f	\N	\N
7802949b-1b05-4832-9843-d12a652b3a70	\N	federated-jwt	da5e2aa6-73ba-48b9-80fd-c2412ca322de	49623b46-cd88-4919-8807-655363fd4697	2	50	f	\N	\N
9dd6cbf5-64db-4772-b11f-426175d318f9	\N	idp-review-profile	da5e2aa6-73ba-48b9-80fd-c2412ca322de	6face769-3364-4d94-b37a-8a632e992914	0	10	f	\N	4337acbd-4a74-4dab-ac64-f20d3fed55d4
84f18bf6-0332-415a-a294-2487826baf1a	\N	\N	da5e2aa6-73ba-48b9-80fd-c2412ca322de	6face769-3364-4d94-b37a-8a632e992914	0	20	t	a6de2626-f01a-4fb0-81ca-dfd685693c59	\N
1dc627eb-b1af-4ea0-a699-bf620911da5c	\N	idp-create-user-if-unique	da5e2aa6-73ba-48b9-80fd-c2412ca322de	a6de2626-f01a-4fb0-81ca-dfd685693c59	2	10	f	\N	99888d5f-9915-46c0-bd44-ad803f6bcfa9
b29c0558-df5e-48da-a6f8-f259e87b59eb	\N	\N	da5e2aa6-73ba-48b9-80fd-c2412ca322de	a6de2626-f01a-4fb0-81ca-dfd685693c59	2	20	t	0d418864-8ec4-4f11-89d9-3e01e7713e4a	\N
b6800147-fafb-4c7b-8063-1043b6bfb15e	\N	idp-confirm-link	da5e2aa6-73ba-48b9-80fd-c2412ca322de	0d418864-8ec4-4f11-89d9-3e01e7713e4a	0	10	f	\N	\N
aac76c6d-2a77-4fe8-87f1-0a3fcff68fec	\N	\N	da5e2aa6-73ba-48b9-80fd-c2412ca322de	0d418864-8ec4-4f11-89d9-3e01e7713e4a	0	20	t	73076576-1825-4d8b-891c-06f2ac19dab2	\N
a6ec0638-b4af-442d-90be-74c89e51701b	\N	idp-email-verification	da5e2aa6-73ba-48b9-80fd-c2412ca322de	73076576-1825-4d8b-891c-06f2ac19dab2	2	10	f	\N	\N
3eefcbaa-bf34-4f85-a441-6b82453a9aaa	\N	\N	da5e2aa6-73ba-48b9-80fd-c2412ca322de	73076576-1825-4d8b-891c-06f2ac19dab2	2	20	t	20161a5a-db5f-4579-8061-d9109f581cc6	\N
8ca9daac-cb1a-427f-ba75-fc45d76829f2	\N	idp-username-password-form	da5e2aa6-73ba-48b9-80fd-c2412ca322de	20161a5a-db5f-4579-8061-d9109f581cc6	0	10	f	\N	\N
d35efe0d-6f81-4e29-be67-6ba4df35257b	\N	\N	da5e2aa6-73ba-48b9-80fd-c2412ca322de	20161a5a-db5f-4579-8061-d9109f581cc6	1	20	t	78b27ca5-d501-40e7-b4db-e6ea09fbe5b2	\N
0fe0e2a6-458b-43eb-a776-da88c440342e	\N	conditional-user-configured	da5e2aa6-73ba-48b9-80fd-c2412ca322de	78b27ca5-d501-40e7-b4db-e6ea09fbe5b2	0	10	f	\N	\N
0c2d88ac-35df-49ca-a547-d444415f390a	\N	conditional-credential	da5e2aa6-73ba-48b9-80fd-c2412ca322de	78b27ca5-d501-40e7-b4db-e6ea09fbe5b2	0	20	f	\N	d7d5242c-f69c-4a0c-b4b1-91cdab7cbf0b
66942718-226d-4ab7-b05d-be2857e36450	\N	auth-otp-form	da5e2aa6-73ba-48b9-80fd-c2412ca322de	78b27ca5-d501-40e7-b4db-e6ea09fbe5b2	2	30	f	\N	\N
db9f1e62-f525-4b82-affd-182366c0a015	\N	webauthn-authenticator	da5e2aa6-73ba-48b9-80fd-c2412ca322de	78b27ca5-d501-40e7-b4db-e6ea09fbe5b2	3	40	f	\N	\N
07cda8e9-756c-497e-8c2a-5dc6302edc54	\N	auth-recovery-authn-code-form	da5e2aa6-73ba-48b9-80fd-c2412ca322de	78b27ca5-d501-40e7-b4db-e6ea09fbe5b2	3	50	f	\N	\N
be33bdd3-5d2c-4505-b4ac-8d3d011398ff	\N	http-basic-authenticator	da5e2aa6-73ba-48b9-80fd-c2412ca322de	5e29dee8-4b60-4f84-bb03-f244e2b45be4	0	10	f	\N	\N
18b00317-10dc-4701-b40e-bf0f8057770a	\N	docker-http-basic-authenticator	da5e2aa6-73ba-48b9-80fd-c2412ca322de	8128654d-d3b4-46f4-ba86-7064c549c903	0	10	f	\N	\N
8c37dc60-9331-4c2f-920e-d5135e20c660	\N	auth-cookie	c5c44cec-b05c-4195-a581-031a8ca23566	82e6e56d-2e33-4507-9122-679362dc9fc1	2	10	f	\N	\N
c135cfa0-02c3-4bfd-bf9a-6b457075ab49	\N	auth-spnego	c5c44cec-b05c-4195-a581-031a8ca23566	82e6e56d-2e33-4507-9122-679362dc9fc1	3	20	f	\N	\N
d482d2d9-4b2d-4e16-abc3-5b2119e8cfa8	\N	identity-provider-redirector	c5c44cec-b05c-4195-a581-031a8ca23566	82e6e56d-2e33-4507-9122-679362dc9fc1	2	25	f	\N	\N
6d0a75a5-10b1-42b6-a8f9-837fa325c324	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	82e6e56d-2e33-4507-9122-679362dc9fc1	2	30	t	7432d42d-85af-4657-b8c3-75626faba1b9	\N
54858587-6b54-4d8d-a996-ab334bd7575e	\N	auth-username-password-form	c5c44cec-b05c-4195-a581-031a8ca23566	7432d42d-85af-4657-b8c3-75626faba1b9	0	10	f	\N	\N
c6902a01-49e3-408d-94b0-f69c73b25196	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	7432d42d-85af-4657-b8c3-75626faba1b9	1	20	t	b5a23a24-f644-4e88-8a5c-e443dcf973c8	\N
79251eb1-59f7-46c4-8a2e-43513cc53127	\N	conditional-user-configured	c5c44cec-b05c-4195-a581-031a8ca23566	b5a23a24-f644-4e88-8a5c-e443dcf973c8	0	10	f	\N	\N
f34a2e39-624d-4f0f-a94a-4b341b683dfd	\N	conditional-credential	c5c44cec-b05c-4195-a581-031a8ca23566	b5a23a24-f644-4e88-8a5c-e443dcf973c8	0	20	f	\N	e37880b7-c559-48a0-b28c-cfd5927279c8
34a2e4bd-7426-4e22-bc65-72546a54ae9e	\N	auth-otp-form	c5c44cec-b05c-4195-a581-031a8ca23566	b5a23a24-f644-4e88-8a5c-e443dcf973c8	2	30	f	\N	\N
107dca44-cb1f-4522-b681-42624fe8f971	\N	webauthn-authenticator	c5c44cec-b05c-4195-a581-031a8ca23566	b5a23a24-f644-4e88-8a5c-e443dcf973c8	3	40	f	\N	\N
79a07221-2259-44a5-9dd7-87a3db26dc34	\N	auth-recovery-authn-code-form	c5c44cec-b05c-4195-a581-031a8ca23566	b5a23a24-f644-4e88-8a5c-e443dcf973c8	3	50	f	\N	\N
b5a785f1-7c99-4e00-a70f-d1b75747b614	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	82e6e56d-2e33-4507-9122-679362dc9fc1	2	26	t	0df15a83-9e67-4135-ab47-8dc72928171e	\N
399d95ea-7843-4b91-8b7b-a6372e615a85	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	0df15a83-9e67-4135-ab47-8dc72928171e	1	10	t	2bb5885f-dadf-472b-8012-fa12758002fc	\N
54284b35-ffa7-4c54-893d-efd1b9bba18e	\N	conditional-user-configured	c5c44cec-b05c-4195-a581-031a8ca23566	2bb5885f-dadf-472b-8012-fa12758002fc	0	10	f	\N	\N
9b3898d3-9774-4fd4-866a-07474fd419ee	\N	organization	c5c44cec-b05c-4195-a581-031a8ca23566	2bb5885f-dadf-472b-8012-fa12758002fc	2	20	f	\N	\N
be611a5b-42fe-4763-88e8-01c5e02727c5	\N	direct-grant-validate-username	c5c44cec-b05c-4195-a581-031a8ca23566	e3143deb-d47a-4055-b3f9-5299cfe6c991	0	10	f	\N	\N
9e59f63f-c4d1-4026-b411-70451fc3fe7e	\N	direct-grant-validate-password	c5c44cec-b05c-4195-a581-031a8ca23566	e3143deb-d47a-4055-b3f9-5299cfe6c991	0	20	f	\N	\N
0ba1381c-748f-4ff8-9e71-e904003eb183	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	e3143deb-d47a-4055-b3f9-5299cfe6c991	1	30	t	2dc4c274-a864-43e6-aaa2-e00ce9bff392	\N
62c5a65c-e634-427d-85c3-80dca89ebfb1	\N	conditional-user-configured	c5c44cec-b05c-4195-a581-031a8ca23566	2dc4c274-a864-43e6-aaa2-e00ce9bff392	0	10	f	\N	\N
01eeb3d1-d001-43d0-825b-2f855134fe9a	\N	direct-grant-validate-otp	c5c44cec-b05c-4195-a581-031a8ca23566	2dc4c274-a864-43e6-aaa2-e00ce9bff392	0	20	f	\N	\N
d091520c-f48a-4b56-ac5c-45d59fc4260b	\N	registration-page-form	c5c44cec-b05c-4195-a581-031a8ca23566	dea14d9b-fb45-44a9-94fd-cd9daa3627e9	0	10	t	b4f9e417-17eb-4cd3-a239-106eaa06b0cc	\N
a8039e96-e663-482d-b68f-c4265052ae23	\N	registration-user-creation	c5c44cec-b05c-4195-a581-031a8ca23566	b4f9e417-17eb-4cd3-a239-106eaa06b0cc	0	20	f	\N	\N
c759c7c9-39d4-4530-9bf5-4fc8ed3675a6	\N	registration-password-action	c5c44cec-b05c-4195-a581-031a8ca23566	b4f9e417-17eb-4cd3-a239-106eaa06b0cc	0	50	f	\N	\N
fd57cf89-7cac-44ee-a969-ae4d542d131c	\N	registration-recaptcha-action	c5c44cec-b05c-4195-a581-031a8ca23566	b4f9e417-17eb-4cd3-a239-106eaa06b0cc	3	60	f	\N	\N
ccfe7b5e-7fc9-4e91-b695-e51ea74b9913	\N	registration-terms-and-conditions	c5c44cec-b05c-4195-a581-031a8ca23566	b4f9e417-17eb-4cd3-a239-106eaa06b0cc	3	70	f	\N	\N
83bcb38c-5e52-4f71-bcee-4b6023d72659	\N	reset-credentials-choose-user	c5c44cec-b05c-4195-a581-031a8ca23566	2b6b4d87-9919-4957-80a0-09628f4860e6	0	10	f	\N	\N
03729cdd-02f4-49f0-806e-93854709e604	\N	reset-credential-email	c5c44cec-b05c-4195-a581-031a8ca23566	2b6b4d87-9919-4957-80a0-09628f4860e6	0	20	f	\N	\N
765c0845-9ec2-47f6-9f3f-ff4c82bf63bd	\N	reset-password	c5c44cec-b05c-4195-a581-031a8ca23566	2b6b4d87-9919-4957-80a0-09628f4860e6	0	30	f	\N	\N
3fa0e51c-e8a2-4617-b0e5-e199a4f6c9f7	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	2b6b4d87-9919-4957-80a0-09628f4860e6	1	40	t	385ad1e0-efb7-43b8-a5f3-216d9b6707c6	\N
e23c3db2-15ed-4ed3-9c6b-8dd8b6840a6e	\N	conditional-user-configured	c5c44cec-b05c-4195-a581-031a8ca23566	385ad1e0-efb7-43b8-a5f3-216d9b6707c6	0	10	f	\N	\N
870eb8a3-f44b-4b34-b595-ab72a4394db4	\N	reset-otp	c5c44cec-b05c-4195-a581-031a8ca23566	385ad1e0-efb7-43b8-a5f3-216d9b6707c6	0	20	f	\N	\N
fbbcfe21-a216-46f9-8af3-03d17c6bf24d	\N	client-secret	c5c44cec-b05c-4195-a581-031a8ca23566	afd38b55-350d-4657-8098-cc176dfde9e4	2	10	f	\N	\N
2431ba80-6236-4fe8-930d-45506979bc48	\N	client-jwt	c5c44cec-b05c-4195-a581-031a8ca23566	afd38b55-350d-4657-8098-cc176dfde9e4	2	20	f	\N	\N
832e450e-2e16-40f8-8096-d2d8154337e5	\N	client-secret-jwt	c5c44cec-b05c-4195-a581-031a8ca23566	afd38b55-350d-4657-8098-cc176dfde9e4	2	30	f	\N	\N
4e4751bf-94c5-4848-b62a-d7e20e69d581	\N	client-x509	c5c44cec-b05c-4195-a581-031a8ca23566	afd38b55-350d-4657-8098-cc176dfde9e4	2	40	f	\N	\N
1660d1a0-3b26-4667-b987-237387f2e38b	\N	federated-jwt	c5c44cec-b05c-4195-a581-031a8ca23566	afd38b55-350d-4657-8098-cc176dfde9e4	2	50	f	\N	\N
caff5e05-51f8-413c-a8f9-c28d4b529798	\N	idp-review-profile	c5c44cec-b05c-4195-a581-031a8ca23566	43ce4676-0993-4b40-9db2-3a5ad69aa252	0	10	f	\N	e8e95e17-c955-4c01-9f04-f397a6f948b5
2a588f11-30bf-4da7-8eda-1c337d7ac4c6	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	43ce4676-0993-4b40-9db2-3a5ad69aa252	0	20	t	a0b5a835-7f4e-4800-af55-eb8f8de039d7	\N
a9152d54-cfb8-43c8-bded-b0a97f3698f0	\N	idp-create-user-if-unique	c5c44cec-b05c-4195-a581-031a8ca23566	a0b5a835-7f4e-4800-af55-eb8f8de039d7	2	10	f	\N	e00a3b48-8c4d-4561-aa82-5905316f50f4
fff9b226-4d99-4d94-bc4b-6d1db58f1b00	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	a0b5a835-7f4e-4800-af55-eb8f8de039d7	2	20	t	d7eca7af-b1ce-4f03-a402-7326ef11c02b	\N
df937129-f47a-4512-8f35-82b33e4669b4	\N	idp-confirm-link	c5c44cec-b05c-4195-a581-031a8ca23566	d7eca7af-b1ce-4f03-a402-7326ef11c02b	0	10	f	\N	\N
a72e2449-6d1a-4d7a-9301-8769ac30e28f	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	d7eca7af-b1ce-4f03-a402-7326ef11c02b	0	20	t	6a2c3cd2-31c4-4230-bb08-31740364f2f6	\N
2e5807cd-a27b-4510-b48d-55a416427b6e	\N	idp-email-verification	c5c44cec-b05c-4195-a581-031a8ca23566	6a2c3cd2-31c4-4230-bb08-31740364f2f6	2	10	f	\N	\N
5f93fde1-c63e-4739-b3b8-abf920bce433	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	6a2c3cd2-31c4-4230-bb08-31740364f2f6	2	20	t	69d51cd0-a136-4293-8615-89ec9bdfa578	\N
a66f5820-1841-4a9a-9949-6264736dfe41	\N	idp-username-password-form	c5c44cec-b05c-4195-a581-031a8ca23566	69d51cd0-a136-4293-8615-89ec9bdfa578	0	10	f	\N	\N
0290e7cf-37d1-4cd9-bf9f-fbdafb1a26ea	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	69d51cd0-a136-4293-8615-89ec9bdfa578	1	20	t	30186be6-324e-48d4-b3e3-a32022b427d6	\N
9bd155fc-7c64-431d-9ccb-7915f8e16083	\N	conditional-user-configured	c5c44cec-b05c-4195-a581-031a8ca23566	30186be6-324e-48d4-b3e3-a32022b427d6	0	10	f	\N	\N
d9930bdf-25bb-40b3-8545-afe9d8f794cb	\N	conditional-credential	c5c44cec-b05c-4195-a581-031a8ca23566	30186be6-324e-48d4-b3e3-a32022b427d6	0	20	f	\N	3026a0ff-ce5c-4473-9b5a-9055de3a3cc1
2cb1b066-78b1-4aa9-94ab-3756bcd93436	\N	auth-otp-form	c5c44cec-b05c-4195-a581-031a8ca23566	30186be6-324e-48d4-b3e3-a32022b427d6	2	30	f	\N	\N
ab1e7428-4e40-4765-bfec-4e03ca75866b	\N	webauthn-authenticator	c5c44cec-b05c-4195-a581-031a8ca23566	30186be6-324e-48d4-b3e3-a32022b427d6	3	40	f	\N	\N
2d424694-e9c4-455a-b0ea-062b91f007a6	\N	auth-recovery-authn-code-form	c5c44cec-b05c-4195-a581-031a8ca23566	30186be6-324e-48d4-b3e3-a32022b427d6	3	50	f	\N	\N
0a610155-0f61-4ffa-aa07-4bf2cd76be9f	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	43ce4676-0993-4b40-9db2-3a5ad69aa252	1	60	t	fbe46c61-3331-4889-8bfc-a3153276aa51	\N
f3f06e6d-5114-4584-a10e-4fff5dfd2806	\N	conditional-user-configured	c5c44cec-b05c-4195-a581-031a8ca23566	fbe46c61-3331-4889-8bfc-a3153276aa51	0	10	f	\N	\N
78f9eae8-248f-4139-9c86-7c1c6a7fa527	\N	idp-add-organization-member	c5c44cec-b05c-4195-a581-031a8ca23566	fbe46c61-3331-4889-8bfc-a3153276aa51	0	20	f	\N	\N
7e72ca00-cd20-4b2c-84f2-1e4d87f3349e	\N	http-basic-authenticator	c5c44cec-b05c-4195-a581-031a8ca23566	cf51361a-5d0f-4519-9ed7-02ed5bb282d6	0	10	f	\N	\N
d1526a55-f508-4a2f-95de-05c62d282179	\N	docker-http-basic-authenticator	c5c44cec-b05c-4195-a581-031a8ca23566	879fd3f4-993b-4260-a0ee-aaa486bc1475	0	10	f	\N	\N
\.


--
-- TOC entry 4268 (class 0 OID 17027)
-- Dependencies: 251
-- Data for Name: authentication_flow; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authentication_flow (id, alias, description, realm_id, provider_id, top_level, built_in) FROM stdin;
57a49113-8bab-4e8b-a1ac-ec658096e48d	browser	Browser based authentication	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	t	t
6bda29ba-7666-4498-a361-d121817cdc24	forms	Username, password, otp and other auth forms.	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	f	t
c5442e38-b960-465d-84b3-3745e417ab36	Browser - Conditional 2FA	Flow to determine if any 2FA is required for the authentication	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	f	t
2ddeb16f-eed8-4bc6-b608-1e03c3f110e3	direct grant	OpenID Connect Resource Owner Grant	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	t	t
da628956-b467-4a7c-a81f-e05ac453e989	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	f	t
76ab432a-4ad6-48c3-969b-b19c6fe6568a	registration	Registration flow	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	t	t
8360836d-aa0b-4b41-8060-5da57a8dc1c1	registration form	Registration form	da5e2aa6-73ba-48b9-80fd-c2412ca322de	form-flow	f	t
16bb6762-e24e-45ae-9112-87182b11343e	reset credentials	Reset credentials for a user if they forgot their password or something	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	t	t
d1b9feef-aaef-431d-99fa-fd3c24266909	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	f	t
49623b46-cd88-4919-8807-655363fd4697	clients	Base authentication for clients	da5e2aa6-73ba-48b9-80fd-c2412ca322de	client-flow	t	t
6face769-3364-4d94-b37a-8a632e992914	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	t	t
a6de2626-f01a-4fb0-81ca-dfd685693c59	User creation or linking	Flow for the existing/non-existing user alternatives	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	f	t
0d418864-8ec4-4f11-89d9-3e01e7713e4a	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	f	t
73076576-1825-4d8b-891c-06f2ac19dab2	Account verification options	Method with which to verify the existing account	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	f	t
20161a5a-db5f-4579-8061-d9109f581cc6	Verify Existing Account by Re-authentication	Reauthentication of existing account	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	f	t
78b27ca5-d501-40e7-b4db-e6ea09fbe5b2	First broker login - Conditional 2FA	Flow to determine if any 2FA is required for the authentication	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	f	t
5e29dee8-4b60-4f84-bb03-f244e2b45be4	saml ecp	SAML ECP Profile Authentication Flow	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	t	t
8128654d-d3b4-46f4-ba86-7064c549c903	docker auth	Used by Docker clients to authenticate against the IDP	da5e2aa6-73ba-48b9-80fd-c2412ca322de	basic-flow	t	t
82e6e56d-2e33-4507-9122-679362dc9fc1	browser	Browser based authentication	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	t	t
7432d42d-85af-4657-b8c3-75626faba1b9	forms	Username, password, otp and other auth forms.	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
b5a23a24-f644-4e88-8a5c-e443dcf973c8	Browser - Conditional 2FA	Flow to determine if any 2FA is required for the authentication	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
0df15a83-9e67-4135-ab47-8dc72928171e	Organization	\N	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
2bb5885f-dadf-472b-8012-fa12758002fc	Browser - Conditional Organization	Flow to determine if the organization identity-first login is to be used	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
e3143deb-d47a-4055-b3f9-5299cfe6c991	direct grant	OpenID Connect Resource Owner Grant	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	t	t
2dc4c274-a864-43e6-aaa2-e00ce9bff392	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
dea14d9b-fb45-44a9-94fd-cd9daa3627e9	registration	Registration flow	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	t	t
b4f9e417-17eb-4cd3-a239-106eaa06b0cc	registration form	Registration form	c5c44cec-b05c-4195-a581-031a8ca23566	form-flow	f	t
2b6b4d87-9919-4957-80a0-09628f4860e6	reset credentials	Reset credentials for a user if they forgot their password or something	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	t	t
385ad1e0-efb7-43b8-a5f3-216d9b6707c6	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
afd38b55-350d-4657-8098-cc176dfde9e4	clients	Base authentication for clients	c5c44cec-b05c-4195-a581-031a8ca23566	client-flow	t	t
43ce4676-0993-4b40-9db2-3a5ad69aa252	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	t	t
a0b5a835-7f4e-4800-af55-eb8f8de039d7	User creation or linking	Flow for the existing/non-existing user alternatives	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
d7eca7af-b1ce-4f03-a402-7326ef11c02b	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
6a2c3cd2-31c4-4230-bb08-31740364f2f6	Account verification options	Method with which to verify the existing account	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
69d51cd0-a136-4293-8615-89ec9bdfa578	Verify Existing Account by Re-authentication	Reauthentication of existing account	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
30186be6-324e-48d4-b3e3-a32022b427d6	First broker login - Conditional 2FA	Flow to determine if any 2FA is required for the authentication	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
fbe46c61-3331-4889-8bfc-a3153276aa51	First Broker Login - Conditional Organization	Flow to determine if the authenticator that adds organization members is to be used	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	f	t
cf51361a-5d0f-4519-9ed7-02ed5bb282d6	saml ecp	SAML ECP Profile Authentication Flow	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	t	t
879fd3f4-993b-4260-a0ee-aaa486bc1475	docker auth	Used by Docker clients to authenticate against the IDP	c5c44cec-b05c-4195-a581-031a8ca23566	basic-flow	t	t
\.


--
-- TOC entry 4267 (class 0 OID 17022)
-- Dependencies: 250
-- Data for Name: authenticator_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authenticator_config (id, alias, realm_id) FROM stdin;
310a9040-4b0d-4f3a-acd2-e17cd156b257	browser-conditional-credential	da5e2aa6-73ba-48b9-80fd-c2412ca322de
4337acbd-4a74-4dab-ac64-f20d3fed55d4	review profile config	da5e2aa6-73ba-48b9-80fd-c2412ca322de
99888d5f-9915-46c0-bd44-ad803f6bcfa9	create unique user config	da5e2aa6-73ba-48b9-80fd-c2412ca322de
d7d5242c-f69c-4a0c-b4b1-91cdab7cbf0b	first-broker-login-conditional-credential	da5e2aa6-73ba-48b9-80fd-c2412ca322de
e37880b7-c559-48a0-b28c-cfd5927279c8	browser-conditional-credential	c5c44cec-b05c-4195-a581-031a8ca23566
e8e95e17-c955-4c01-9f04-f397a6f948b5	review profile config	c5c44cec-b05c-4195-a581-031a8ca23566
e00a3b48-8c4d-4561-aa82-5905316f50f4	create unique user config	c5c44cec-b05c-4195-a581-031a8ca23566
3026a0ff-ce5c-4473-9b5a-9055de3a3cc1	first-broker-login-conditional-credential	c5c44cec-b05c-4195-a581-031a8ca23566
\.


--
-- TOC entry 4270 (class 0 OID 17037)
-- Dependencies: 253
-- Data for Name: authenticator_config_entry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authenticator_config_entry (authenticator_id, value, name) FROM stdin;
310a9040-4b0d-4f3a-acd2-e17cd156b257	webauthn-passwordless	credentials
4337acbd-4a74-4dab-ac64-f20d3fed55d4	missing	update.profile.on.first.login
99888d5f-9915-46c0-bd44-ad803f6bcfa9	false	require.password.update.after.registration
d7d5242c-f69c-4a0c-b4b1-91cdab7cbf0b	webauthn-passwordless	credentials
3026a0ff-ce5c-4473-9b5a-9055de3a3cc1	webauthn-passwordless	credentials
e00a3b48-8c4d-4561-aa82-5905316f50f4	false	require.password.update.after.registration
e37880b7-c559-48a0-b28c-cfd5927279c8	webauthn-passwordless	credentials
e8e95e17-c955-4c01-9f04-f397a6f948b5	missing	update.profile.on.first.login
\.


--
-- TOC entry 4294 (class 0 OID 17475)
-- Dependencies: 277
-- Data for Name: broker_link; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.broker_link (identity_provider, storage_provider_id, realm_id, broker_user_id, broker_username, token, user_id) FROM stdin;
\.


--
-- TOC entry 4234 (class 0 OID 16398)
-- Dependencies: 217
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, enabled, full_scope_allowed, client_id, not_before, public_client, secret, base_url, bearer_only, management_url, surrogate_auth_required, realm_id, protocol, node_rereg_timeout, frontchannel_logout, consent_required, name, service_accounts_enabled, client_authenticator_type, root_url, description, registration_token, standard_flow_enabled, implicit_flow_enabled, direct_access_grants_enabled, always_display_in_console) FROM stdin;
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	f	master-realm	0	f	\N	\N	t	\N	f	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N	0	f	f	master Realm	f	client-secret	\N	\N	\N	t	f	f	f
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	t	f	account	0	t	\N	/realms/master/account/	f	\N	f	da5e2aa6-73ba-48b9-80fd-c2412ca322de	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
d925ebe4-1e14-465b-bbb5-d397a2d035d0	t	f	account-console	0	t	\N	/realms/master/account/	f	\N	f	da5e2aa6-73ba-48b9-80fd-c2412ca322de	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	t	f	broker	0	f	\N	\N	t	\N	f	da5e2aa6-73ba-48b9-80fd-c2412ca322de	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	t	t	security-admin-console	0	t	\N	/admin/master/console/	f	\N	f	da5e2aa6-73ba-48b9-80fd-c2412ca322de	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
5ab2dc70-8327-4695-b002-46e448aef519	t	t	admin-cli	0	t	\N	\N	f	\N	f	da5e2aa6-73ba-48b9-80fd-c2412ca322de	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f
230caeea-39c0-421d-9a97-199f93a4cb5f	t	f	super-petmark-3d-realm	0	f	\N	\N	t	\N	f	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N	0	f	f	super-petmark-3d Realm	f	client-secret	\N	\N	\N	t	f	f	f
8491a817-beba-4ee6-aa5d-c42000848741	t	f	realm-management	0	f	\N	\N	t	\N	f	c5c44cec-b05c-4195-a581-031a8ca23566	openid-connect	0	f	f	${client_realm-management}	f	client-secret	\N	\N	\N	t	f	f	f
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	t	f	account	0	t	\N	/realms/super-petmark-3d/account/	f	\N	f	c5c44cec-b05c-4195-a581-031a8ca23566	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
6994b3c5-b0ab-4cfa-a135-c25a54041c62	t	f	account-console	0	t	\N	/realms/super-petmark-3d/account/	f	\N	f	c5c44cec-b05c-4195-a581-031a8ca23566	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	t	f	broker	0	f	\N	\N	t	\N	f	c5c44cec-b05c-4195-a581-031a8ca23566	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
da8cf327-ae8c-454b-9f89-5f0d53abbf27	t	t	security-admin-console	0	t	\N	/admin/super-petmark-3d/console/	f	\N	f	c5c44cec-b05c-4195-a581-031a8ca23566	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
5ace89b3-91df-49fa-8462-9de437991af8	t	t	admin-cli	0	t	\N	\N	f	\N	f	c5c44cec-b05c-4195-a581-031a8ca23566	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f
6f967252-9033-4cc5-af78-021f02ea431a	t	t	user-service	0	f	FGMD5FRv6U68WA9yOYSAqaTTBquZHoGC		f		f	c5c44cec-b05c-4195-a581-031a8ca23566	openid-connect	-1	t	f		t	client-secret			\N	t	t	t	f
\.


--
-- TOC entry 4253 (class 0 OID 16756)
-- Dependencies: 236
-- Data for Name: client_attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_attributes (client_id, name, value) FROM stdin;
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	post.logout.redirect.uris	+
d925ebe4-1e14-465b-bbb5-d397a2d035d0	post.logout.redirect.uris	+
d925ebe4-1e14-465b-bbb5-d397a2d035d0	pkce.code.challenge.method	S256
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	post.logout.redirect.uris	+
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	pkce.code.challenge.method	S256
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	client.use.lightweight.access.token.enabled	true
5ab2dc70-8327-4695-b002-46e448aef519	client.use.lightweight.access.token.enabled	true
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	post.logout.redirect.uris	+
6994b3c5-b0ab-4cfa-a135-c25a54041c62	post.logout.redirect.uris	+
6994b3c5-b0ab-4cfa-a135-c25a54041c62	pkce.code.challenge.method	S256
da8cf327-ae8c-454b-9f89-5f0d53abbf27	post.logout.redirect.uris	+
da8cf327-ae8c-454b-9f89-5f0d53abbf27	pkce.code.challenge.method	S256
da8cf327-ae8c-454b-9f89-5f0d53abbf27	client.use.lightweight.access.token.enabled	true
5ace89b3-91df-49fa-8462-9de437991af8	client.use.lightweight.access.token.enabled	true
6f967252-9033-4cc5-af78-021f02ea431a	client.secret.creation.time	1777872256
6f967252-9033-4cc5-af78-021f02ea431a	standard.token.exchange.enabled	false
6f967252-9033-4cc5-af78-021f02ea431a	oauth2.jwt.authorization.grant.enabled	false
6f967252-9033-4cc5-af78-021f02ea431a	oauth2.device.authorization.grant.enabled	false
6f967252-9033-4cc5-af78-021f02ea431a	oidc.ciba.grant.enabled	false
6f967252-9033-4cc5-af78-021f02ea431a	dpop.bound.access.tokens	false
6f967252-9033-4cc5-af78-021f02ea431a	backchannel.logout.session.required	true
6f967252-9033-4cc5-af78-021f02ea431a	backchannel.logout.revoke.offline.tokens	false
6f967252-9033-4cc5-af78-021f02ea431a	realm_client	false
6f967252-9033-4cc5-af78-021f02ea431a	display.on.consent.screen	false
6f967252-9033-4cc5-af78-021f02ea431a	frontchannel.logout.session.required	true
6f967252-9033-4cc5-af78-021f02ea431a	logout.confirmation.enabled	false
\.


--
-- TOC entry 4305 (class 0 OID 17725)
-- Dependencies: 288
-- Data for Name: client_auth_flow_bindings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_auth_flow_bindings (client_id, flow_id, binding_name) FROM stdin;
\.


--
-- TOC entry 4304 (class 0 OID 17599)
-- Dependencies: 287
-- Data for Name: client_initial_access; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_initial_access (id, realm_id, "timestamp", expiration, count, remaining_count) FROM stdin;
\.


--
-- TOC entry 4254 (class 0 OID 16766)
-- Dependencies: 237
-- Data for Name: client_node_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_node_registrations (client_id, value, name) FROM stdin;
\.


--
-- TOC entry 4282 (class 0 OID 17265)
-- Dependencies: 265
-- Data for Name: client_scope; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_scope (id, name, realm_id, description, protocol) FROM stdin;
4046233e-eff6-4e63-92e6-282930052813	offline_access	da5e2aa6-73ba-48b9-80fd-c2412ca322de	OpenID Connect built-in scope: offline_access	openid-connect
f398365e-403c-45c3-a495-f62856e2d100	role_list	da5e2aa6-73ba-48b9-80fd-c2412ca322de	SAML role list	saml
27cc463d-81b8-4c6a-ac9d-7c7c5584c6a6	saml_organization	da5e2aa6-73ba-48b9-80fd-c2412ca322de	Organization Membership	saml
d93cc854-4c34-496f-87d7-3ed9902c5424	profile	da5e2aa6-73ba-48b9-80fd-c2412ca322de	OpenID Connect built-in scope: profile	openid-connect
f4e4f3c8-8e87-4289-a553-4492f087cbe8	email	da5e2aa6-73ba-48b9-80fd-c2412ca322de	OpenID Connect built-in scope: email	openid-connect
4a6666c4-7582-4523-a527-104028a6b855	address	da5e2aa6-73ba-48b9-80fd-c2412ca322de	OpenID Connect built-in scope: address	openid-connect
1cd29fac-2115-4830-85fe-d38af17bd545	phone	da5e2aa6-73ba-48b9-80fd-c2412ca322de	OpenID Connect built-in scope: phone	openid-connect
c201c1d6-3826-4ba9-9e00-f8c097fb6204	roles	da5e2aa6-73ba-48b9-80fd-c2412ca322de	OpenID Connect scope for add user roles to the access token	openid-connect
bb1d06dd-b226-4faa-9963-1e4533ff9305	web-origins	da5e2aa6-73ba-48b9-80fd-c2412ca322de	OpenID Connect scope for add allowed web origins to the access token	openid-connect
8cff2ae1-7d86-4e5d-a9de-25dc845e1bce	microprofile-jwt	da5e2aa6-73ba-48b9-80fd-c2412ca322de	Microprofile - JWT built-in scope	openid-connect
ecdc2db2-1d94-42ef-ba5f-9043474a0015	acr	da5e2aa6-73ba-48b9-80fd-c2412ca322de	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
e0808571-27da-4371-98ce-da0abc13dced	basic	da5e2aa6-73ba-48b9-80fd-c2412ca322de	OpenID Connect scope for add all basic claims to the token	openid-connect
226df3d2-0bbf-46a6-9b4d-b56b71bf50f5	service_account	da5e2aa6-73ba-48b9-80fd-c2412ca322de	Specific scope for a client enabled for service accounts	openid-connect
6390dcd2-4351-40f5-95ad-8e89a70a2922	organization	da5e2aa6-73ba-48b9-80fd-c2412ca322de	Additional claims about the organization a subject belongs to	openid-connect
caf932d1-6775-44ff-ae42-63832d1a322b	offline_access	c5c44cec-b05c-4195-a581-031a8ca23566	OpenID Connect built-in scope: offline_access	openid-connect
a16df0ed-f816-4b2c-9283-24b1aa8b14c9	role_list	c5c44cec-b05c-4195-a581-031a8ca23566	SAML role list	saml
6bd946ee-54dd-4326-83dc-58ac224d4de6	saml_organization	c5c44cec-b05c-4195-a581-031a8ca23566	Organization Membership	saml
582ba59c-f4da-42c3-9310-ab346794b0e7	profile	c5c44cec-b05c-4195-a581-031a8ca23566	OpenID Connect built-in scope: profile	openid-connect
7190cb0c-dba4-49de-a61e-023ff60b7987	email	c5c44cec-b05c-4195-a581-031a8ca23566	OpenID Connect built-in scope: email	openid-connect
f1d15268-c3eb-451b-9ef8-ce1aadffecd1	address	c5c44cec-b05c-4195-a581-031a8ca23566	OpenID Connect built-in scope: address	openid-connect
1b225007-6385-432f-a5c2-2b11ca92211a	phone	c5c44cec-b05c-4195-a581-031a8ca23566	OpenID Connect built-in scope: phone	openid-connect
243bbe7b-872f-4407-8432-52dd9f930780	roles	c5c44cec-b05c-4195-a581-031a8ca23566	OpenID Connect scope for add user roles to the access token	openid-connect
531ac0a7-3cb7-4526-9f41-ca1019f27007	web-origins	c5c44cec-b05c-4195-a581-031a8ca23566	OpenID Connect scope for add allowed web origins to the access token	openid-connect
567a97ea-3d93-4a71-a1bf-64ab60ca43d2	microprofile-jwt	c5c44cec-b05c-4195-a581-031a8ca23566	Microprofile - JWT built-in scope	openid-connect
793df6b4-e2c5-4b79-a2fd-32b0aeceb915	acr	c5c44cec-b05c-4195-a581-031a8ca23566	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
119a8746-3a31-4bc7-8591-2bba2111e760	basic	c5c44cec-b05c-4195-a581-031a8ca23566	OpenID Connect scope for add all basic claims to the token	openid-connect
13b13409-71a1-418e-898d-ed1a5fbcb532	service_account	c5c44cec-b05c-4195-a581-031a8ca23566	Specific scope for a client enabled for service accounts	openid-connect
07f3d3ec-baff-45e0-b9e1-32fa8f796330	organization	c5c44cec-b05c-4195-a581-031a8ca23566	Additional claims about the organization a subject belongs to	openid-connect
\.


--
-- TOC entry 4283 (class 0 OID 17279)
-- Dependencies: 266
-- Data for Name: client_scope_attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_scope_attributes (scope_id, value, name) FROM stdin;
4046233e-eff6-4e63-92e6-282930052813	true	display.on.consent.screen
4046233e-eff6-4e63-92e6-282930052813	${offlineAccessScopeConsentText}	consent.screen.text
f398365e-403c-45c3-a495-f62856e2d100	true	display.on.consent.screen
f398365e-403c-45c3-a495-f62856e2d100	${samlRoleListScopeConsentText}	consent.screen.text
27cc463d-81b8-4c6a-ac9d-7c7c5584c6a6	false	display.on.consent.screen
d93cc854-4c34-496f-87d7-3ed9902c5424	true	display.on.consent.screen
d93cc854-4c34-496f-87d7-3ed9902c5424	${profileScopeConsentText}	consent.screen.text
d93cc854-4c34-496f-87d7-3ed9902c5424	true	include.in.token.scope
f4e4f3c8-8e87-4289-a553-4492f087cbe8	true	display.on.consent.screen
f4e4f3c8-8e87-4289-a553-4492f087cbe8	${emailScopeConsentText}	consent.screen.text
f4e4f3c8-8e87-4289-a553-4492f087cbe8	true	include.in.token.scope
4a6666c4-7582-4523-a527-104028a6b855	true	display.on.consent.screen
4a6666c4-7582-4523-a527-104028a6b855	${addressScopeConsentText}	consent.screen.text
4a6666c4-7582-4523-a527-104028a6b855	true	include.in.token.scope
1cd29fac-2115-4830-85fe-d38af17bd545	true	display.on.consent.screen
1cd29fac-2115-4830-85fe-d38af17bd545	${phoneScopeConsentText}	consent.screen.text
1cd29fac-2115-4830-85fe-d38af17bd545	true	include.in.token.scope
c201c1d6-3826-4ba9-9e00-f8c097fb6204	true	display.on.consent.screen
c201c1d6-3826-4ba9-9e00-f8c097fb6204	${rolesScopeConsentText}	consent.screen.text
c201c1d6-3826-4ba9-9e00-f8c097fb6204	false	include.in.token.scope
bb1d06dd-b226-4faa-9963-1e4533ff9305	false	display.on.consent.screen
bb1d06dd-b226-4faa-9963-1e4533ff9305		consent.screen.text
bb1d06dd-b226-4faa-9963-1e4533ff9305	false	include.in.token.scope
8cff2ae1-7d86-4e5d-a9de-25dc845e1bce	false	display.on.consent.screen
8cff2ae1-7d86-4e5d-a9de-25dc845e1bce	true	include.in.token.scope
ecdc2db2-1d94-42ef-ba5f-9043474a0015	false	display.on.consent.screen
ecdc2db2-1d94-42ef-ba5f-9043474a0015	false	include.in.token.scope
e0808571-27da-4371-98ce-da0abc13dced	false	display.on.consent.screen
e0808571-27da-4371-98ce-da0abc13dced	false	include.in.token.scope
226df3d2-0bbf-46a6-9b4d-b56b71bf50f5	false	display.on.consent.screen
226df3d2-0bbf-46a6-9b4d-b56b71bf50f5	false	include.in.token.scope
6390dcd2-4351-40f5-95ad-8e89a70a2922	true	display.on.consent.screen
6390dcd2-4351-40f5-95ad-8e89a70a2922	${organizationScopeConsentText}	consent.screen.text
6390dcd2-4351-40f5-95ad-8e89a70a2922	true	include.in.token.scope
caf932d1-6775-44ff-ae42-63832d1a322b	true	display.on.consent.screen
caf932d1-6775-44ff-ae42-63832d1a322b	${offlineAccessScopeConsentText}	consent.screen.text
a16df0ed-f816-4b2c-9283-24b1aa8b14c9	true	display.on.consent.screen
a16df0ed-f816-4b2c-9283-24b1aa8b14c9	${samlRoleListScopeConsentText}	consent.screen.text
6bd946ee-54dd-4326-83dc-58ac224d4de6	false	display.on.consent.screen
582ba59c-f4da-42c3-9310-ab346794b0e7	true	display.on.consent.screen
582ba59c-f4da-42c3-9310-ab346794b0e7	${profileScopeConsentText}	consent.screen.text
582ba59c-f4da-42c3-9310-ab346794b0e7	true	include.in.token.scope
7190cb0c-dba4-49de-a61e-023ff60b7987	true	display.on.consent.screen
7190cb0c-dba4-49de-a61e-023ff60b7987	${emailScopeConsentText}	consent.screen.text
7190cb0c-dba4-49de-a61e-023ff60b7987	true	include.in.token.scope
f1d15268-c3eb-451b-9ef8-ce1aadffecd1	true	display.on.consent.screen
f1d15268-c3eb-451b-9ef8-ce1aadffecd1	${addressScopeConsentText}	consent.screen.text
f1d15268-c3eb-451b-9ef8-ce1aadffecd1	true	include.in.token.scope
1b225007-6385-432f-a5c2-2b11ca92211a	true	display.on.consent.screen
1b225007-6385-432f-a5c2-2b11ca92211a	${phoneScopeConsentText}	consent.screen.text
1b225007-6385-432f-a5c2-2b11ca92211a	true	include.in.token.scope
243bbe7b-872f-4407-8432-52dd9f930780	true	display.on.consent.screen
243bbe7b-872f-4407-8432-52dd9f930780	${rolesScopeConsentText}	consent.screen.text
243bbe7b-872f-4407-8432-52dd9f930780	false	include.in.token.scope
531ac0a7-3cb7-4526-9f41-ca1019f27007	false	display.on.consent.screen
531ac0a7-3cb7-4526-9f41-ca1019f27007		consent.screen.text
531ac0a7-3cb7-4526-9f41-ca1019f27007	false	include.in.token.scope
567a97ea-3d93-4a71-a1bf-64ab60ca43d2	false	display.on.consent.screen
567a97ea-3d93-4a71-a1bf-64ab60ca43d2	true	include.in.token.scope
793df6b4-e2c5-4b79-a2fd-32b0aeceb915	false	display.on.consent.screen
793df6b4-e2c5-4b79-a2fd-32b0aeceb915	false	include.in.token.scope
119a8746-3a31-4bc7-8591-2bba2111e760	false	display.on.consent.screen
119a8746-3a31-4bc7-8591-2bba2111e760	false	include.in.token.scope
13b13409-71a1-418e-898d-ed1a5fbcb532	false	display.on.consent.screen
13b13409-71a1-418e-898d-ed1a5fbcb532	false	include.in.token.scope
07f3d3ec-baff-45e0-b9e1-32fa8f796330	true	display.on.consent.screen
07f3d3ec-baff-45e0-b9e1-32fa8f796330	${organizationScopeConsentText}	consent.screen.text
07f3d3ec-baff-45e0-b9e1-32fa8f796330	true	include.in.token.scope
\.


--
-- TOC entry 4306 (class 0 OID 17766)
-- Dependencies: 289
-- Data for Name: client_scope_client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_scope_client (client_id, scope_id, default_scope) FROM stdin;
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	d93cc854-4c34-496f-87d7-3ed9902c5424	t
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	f4e4f3c8-8e87-4289-a553-4492f087cbe8	t
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	e0808571-27da-4371-98ce-da0abc13dced	t
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	ecdc2db2-1d94-42ef-ba5f-9043474a0015	t
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	bb1d06dd-b226-4faa-9963-1e4533ff9305	t
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	c201c1d6-3826-4ba9-9e00-f8c097fb6204	t
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	4a6666c4-7582-4523-a527-104028a6b855	f
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	8cff2ae1-7d86-4e5d-a9de-25dc845e1bce	f
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	4046233e-eff6-4e63-92e6-282930052813	f
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	1cd29fac-2115-4830-85fe-d38af17bd545	f
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	6390dcd2-4351-40f5-95ad-8e89a70a2922	f
d925ebe4-1e14-465b-bbb5-d397a2d035d0	d93cc854-4c34-496f-87d7-3ed9902c5424	t
d925ebe4-1e14-465b-bbb5-d397a2d035d0	f4e4f3c8-8e87-4289-a553-4492f087cbe8	t
d925ebe4-1e14-465b-bbb5-d397a2d035d0	e0808571-27da-4371-98ce-da0abc13dced	t
d925ebe4-1e14-465b-bbb5-d397a2d035d0	ecdc2db2-1d94-42ef-ba5f-9043474a0015	t
d925ebe4-1e14-465b-bbb5-d397a2d035d0	bb1d06dd-b226-4faa-9963-1e4533ff9305	t
d925ebe4-1e14-465b-bbb5-d397a2d035d0	c201c1d6-3826-4ba9-9e00-f8c097fb6204	t
d925ebe4-1e14-465b-bbb5-d397a2d035d0	4a6666c4-7582-4523-a527-104028a6b855	f
d925ebe4-1e14-465b-bbb5-d397a2d035d0	8cff2ae1-7d86-4e5d-a9de-25dc845e1bce	f
d925ebe4-1e14-465b-bbb5-d397a2d035d0	4046233e-eff6-4e63-92e6-282930052813	f
d925ebe4-1e14-465b-bbb5-d397a2d035d0	1cd29fac-2115-4830-85fe-d38af17bd545	f
d925ebe4-1e14-465b-bbb5-d397a2d035d0	6390dcd2-4351-40f5-95ad-8e89a70a2922	f
5ab2dc70-8327-4695-b002-46e448aef519	d93cc854-4c34-496f-87d7-3ed9902c5424	t
5ab2dc70-8327-4695-b002-46e448aef519	f4e4f3c8-8e87-4289-a553-4492f087cbe8	t
5ab2dc70-8327-4695-b002-46e448aef519	e0808571-27da-4371-98ce-da0abc13dced	t
5ab2dc70-8327-4695-b002-46e448aef519	ecdc2db2-1d94-42ef-ba5f-9043474a0015	t
5ab2dc70-8327-4695-b002-46e448aef519	bb1d06dd-b226-4faa-9963-1e4533ff9305	t
5ab2dc70-8327-4695-b002-46e448aef519	c201c1d6-3826-4ba9-9e00-f8c097fb6204	t
5ab2dc70-8327-4695-b002-46e448aef519	4a6666c4-7582-4523-a527-104028a6b855	f
5ab2dc70-8327-4695-b002-46e448aef519	8cff2ae1-7d86-4e5d-a9de-25dc845e1bce	f
5ab2dc70-8327-4695-b002-46e448aef519	4046233e-eff6-4e63-92e6-282930052813	f
5ab2dc70-8327-4695-b002-46e448aef519	1cd29fac-2115-4830-85fe-d38af17bd545	f
5ab2dc70-8327-4695-b002-46e448aef519	6390dcd2-4351-40f5-95ad-8e89a70a2922	f
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	d93cc854-4c34-496f-87d7-3ed9902c5424	t
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	f4e4f3c8-8e87-4289-a553-4492f087cbe8	t
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	e0808571-27da-4371-98ce-da0abc13dced	t
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	ecdc2db2-1d94-42ef-ba5f-9043474a0015	t
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	bb1d06dd-b226-4faa-9963-1e4533ff9305	t
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	c201c1d6-3826-4ba9-9e00-f8c097fb6204	t
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	4a6666c4-7582-4523-a527-104028a6b855	f
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	8cff2ae1-7d86-4e5d-a9de-25dc845e1bce	f
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	4046233e-eff6-4e63-92e6-282930052813	f
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	1cd29fac-2115-4830-85fe-d38af17bd545	f
ab36e05d-56f6-4da1-a738-97bb3bf76e3e	6390dcd2-4351-40f5-95ad-8e89a70a2922	f
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	d93cc854-4c34-496f-87d7-3ed9902c5424	t
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	f4e4f3c8-8e87-4289-a553-4492f087cbe8	t
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	e0808571-27da-4371-98ce-da0abc13dced	t
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	ecdc2db2-1d94-42ef-ba5f-9043474a0015	t
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	bb1d06dd-b226-4faa-9963-1e4533ff9305	t
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	c201c1d6-3826-4ba9-9e00-f8c097fb6204	t
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	4a6666c4-7582-4523-a527-104028a6b855	f
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	8cff2ae1-7d86-4e5d-a9de-25dc845e1bce	f
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	4046233e-eff6-4e63-92e6-282930052813	f
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	1cd29fac-2115-4830-85fe-d38af17bd545	f
71adc4d2-3a7d-49fa-8701-87b4bb0b9294	6390dcd2-4351-40f5-95ad-8e89a70a2922	f
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	d93cc854-4c34-496f-87d7-3ed9902c5424	t
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	f4e4f3c8-8e87-4289-a553-4492f087cbe8	t
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	e0808571-27da-4371-98ce-da0abc13dced	t
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	ecdc2db2-1d94-42ef-ba5f-9043474a0015	t
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	bb1d06dd-b226-4faa-9963-1e4533ff9305	t
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	c201c1d6-3826-4ba9-9e00-f8c097fb6204	t
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	4a6666c4-7582-4523-a527-104028a6b855	f
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	8cff2ae1-7d86-4e5d-a9de-25dc845e1bce	f
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	4046233e-eff6-4e63-92e6-282930052813	f
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	1cd29fac-2115-4830-85fe-d38af17bd545	f
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	6390dcd2-4351-40f5-95ad-8e89a70a2922	f
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	243bbe7b-872f-4407-8432-52dd9f930780	t
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	793df6b4-e2c5-4b79-a2fd-32b0aeceb915	t
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	531ac0a7-3cb7-4526-9f41-ca1019f27007	t
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	7190cb0c-dba4-49de-a61e-023ff60b7987	t
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	119a8746-3a31-4bc7-8591-2bba2111e760	t
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	582ba59c-f4da-42c3-9310-ab346794b0e7	t
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	f1d15268-c3eb-451b-9ef8-ce1aadffecd1	f
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	07f3d3ec-baff-45e0-b9e1-32fa8f796330	f
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	567a97ea-3d93-4a71-a1bf-64ab60ca43d2	f
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	caf932d1-6775-44ff-ae42-63832d1a322b	f
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	1b225007-6385-432f-a5c2-2b11ca92211a	f
6994b3c5-b0ab-4cfa-a135-c25a54041c62	243bbe7b-872f-4407-8432-52dd9f930780	t
6994b3c5-b0ab-4cfa-a135-c25a54041c62	793df6b4-e2c5-4b79-a2fd-32b0aeceb915	t
6994b3c5-b0ab-4cfa-a135-c25a54041c62	531ac0a7-3cb7-4526-9f41-ca1019f27007	t
6994b3c5-b0ab-4cfa-a135-c25a54041c62	7190cb0c-dba4-49de-a61e-023ff60b7987	t
6994b3c5-b0ab-4cfa-a135-c25a54041c62	119a8746-3a31-4bc7-8591-2bba2111e760	t
6994b3c5-b0ab-4cfa-a135-c25a54041c62	582ba59c-f4da-42c3-9310-ab346794b0e7	t
6994b3c5-b0ab-4cfa-a135-c25a54041c62	f1d15268-c3eb-451b-9ef8-ce1aadffecd1	f
6994b3c5-b0ab-4cfa-a135-c25a54041c62	07f3d3ec-baff-45e0-b9e1-32fa8f796330	f
6994b3c5-b0ab-4cfa-a135-c25a54041c62	567a97ea-3d93-4a71-a1bf-64ab60ca43d2	f
6994b3c5-b0ab-4cfa-a135-c25a54041c62	caf932d1-6775-44ff-ae42-63832d1a322b	f
6994b3c5-b0ab-4cfa-a135-c25a54041c62	1b225007-6385-432f-a5c2-2b11ca92211a	f
5ace89b3-91df-49fa-8462-9de437991af8	243bbe7b-872f-4407-8432-52dd9f930780	t
5ace89b3-91df-49fa-8462-9de437991af8	793df6b4-e2c5-4b79-a2fd-32b0aeceb915	t
5ace89b3-91df-49fa-8462-9de437991af8	531ac0a7-3cb7-4526-9f41-ca1019f27007	t
5ace89b3-91df-49fa-8462-9de437991af8	7190cb0c-dba4-49de-a61e-023ff60b7987	t
5ace89b3-91df-49fa-8462-9de437991af8	119a8746-3a31-4bc7-8591-2bba2111e760	t
5ace89b3-91df-49fa-8462-9de437991af8	582ba59c-f4da-42c3-9310-ab346794b0e7	t
5ace89b3-91df-49fa-8462-9de437991af8	f1d15268-c3eb-451b-9ef8-ce1aadffecd1	f
5ace89b3-91df-49fa-8462-9de437991af8	07f3d3ec-baff-45e0-b9e1-32fa8f796330	f
5ace89b3-91df-49fa-8462-9de437991af8	567a97ea-3d93-4a71-a1bf-64ab60ca43d2	f
5ace89b3-91df-49fa-8462-9de437991af8	caf932d1-6775-44ff-ae42-63832d1a322b	f
5ace89b3-91df-49fa-8462-9de437991af8	1b225007-6385-432f-a5c2-2b11ca92211a	f
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	243bbe7b-872f-4407-8432-52dd9f930780	t
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	793df6b4-e2c5-4b79-a2fd-32b0aeceb915	t
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	531ac0a7-3cb7-4526-9f41-ca1019f27007	t
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	7190cb0c-dba4-49de-a61e-023ff60b7987	t
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	119a8746-3a31-4bc7-8591-2bba2111e760	t
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	582ba59c-f4da-42c3-9310-ab346794b0e7	t
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	f1d15268-c3eb-451b-9ef8-ce1aadffecd1	f
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	07f3d3ec-baff-45e0-b9e1-32fa8f796330	f
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	567a97ea-3d93-4a71-a1bf-64ab60ca43d2	f
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	caf932d1-6775-44ff-ae42-63832d1a322b	f
43f2658c-9f30-43f2-bde2-b43ac0ff62ae	1b225007-6385-432f-a5c2-2b11ca92211a	f
8491a817-beba-4ee6-aa5d-c42000848741	243bbe7b-872f-4407-8432-52dd9f930780	t
8491a817-beba-4ee6-aa5d-c42000848741	793df6b4-e2c5-4b79-a2fd-32b0aeceb915	t
8491a817-beba-4ee6-aa5d-c42000848741	531ac0a7-3cb7-4526-9f41-ca1019f27007	t
8491a817-beba-4ee6-aa5d-c42000848741	7190cb0c-dba4-49de-a61e-023ff60b7987	t
8491a817-beba-4ee6-aa5d-c42000848741	119a8746-3a31-4bc7-8591-2bba2111e760	t
8491a817-beba-4ee6-aa5d-c42000848741	582ba59c-f4da-42c3-9310-ab346794b0e7	t
8491a817-beba-4ee6-aa5d-c42000848741	f1d15268-c3eb-451b-9ef8-ce1aadffecd1	f
8491a817-beba-4ee6-aa5d-c42000848741	07f3d3ec-baff-45e0-b9e1-32fa8f796330	f
8491a817-beba-4ee6-aa5d-c42000848741	567a97ea-3d93-4a71-a1bf-64ab60ca43d2	f
8491a817-beba-4ee6-aa5d-c42000848741	caf932d1-6775-44ff-ae42-63832d1a322b	f
8491a817-beba-4ee6-aa5d-c42000848741	1b225007-6385-432f-a5c2-2b11ca92211a	f
da8cf327-ae8c-454b-9f89-5f0d53abbf27	243bbe7b-872f-4407-8432-52dd9f930780	t
da8cf327-ae8c-454b-9f89-5f0d53abbf27	793df6b4-e2c5-4b79-a2fd-32b0aeceb915	t
da8cf327-ae8c-454b-9f89-5f0d53abbf27	531ac0a7-3cb7-4526-9f41-ca1019f27007	t
da8cf327-ae8c-454b-9f89-5f0d53abbf27	7190cb0c-dba4-49de-a61e-023ff60b7987	t
da8cf327-ae8c-454b-9f89-5f0d53abbf27	119a8746-3a31-4bc7-8591-2bba2111e760	t
da8cf327-ae8c-454b-9f89-5f0d53abbf27	582ba59c-f4da-42c3-9310-ab346794b0e7	t
da8cf327-ae8c-454b-9f89-5f0d53abbf27	f1d15268-c3eb-451b-9ef8-ce1aadffecd1	f
da8cf327-ae8c-454b-9f89-5f0d53abbf27	07f3d3ec-baff-45e0-b9e1-32fa8f796330	f
da8cf327-ae8c-454b-9f89-5f0d53abbf27	567a97ea-3d93-4a71-a1bf-64ab60ca43d2	f
da8cf327-ae8c-454b-9f89-5f0d53abbf27	caf932d1-6775-44ff-ae42-63832d1a322b	f
da8cf327-ae8c-454b-9f89-5f0d53abbf27	1b225007-6385-432f-a5c2-2b11ca92211a	f
6f967252-9033-4cc5-af78-021f02ea431a	243bbe7b-872f-4407-8432-52dd9f930780	t
6f967252-9033-4cc5-af78-021f02ea431a	793df6b4-e2c5-4b79-a2fd-32b0aeceb915	t
6f967252-9033-4cc5-af78-021f02ea431a	531ac0a7-3cb7-4526-9f41-ca1019f27007	t
6f967252-9033-4cc5-af78-021f02ea431a	7190cb0c-dba4-49de-a61e-023ff60b7987	t
6f967252-9033-4cc5-af78-021f02ea431a	119a8746-3a31-4bc7-8591-2bba2111e760	t
6f967252-9033-4cc5-af78-021f02ea431a	582ba59c-f4da-42c3-9310-ab346794b0e7	t
6f967252-9033-4cc5-af78-021f02ea431a	f1d15268-c3eb-451b-9ef8-ce1aadffecd1	f
6f967252-9033-4cc5-af78-021f02ea431a	07f3d3ec-baff-45e0-b9e1-32fa8f796330	f
6f967252-9033-4cc5-af78-021f02ea431a	567a97ea-3d93-4a71-a1bf-64ab60ca43d2	f
6f967252-9033-4cc5-af78-021f02ea431a	caf932d1-6775-44ff-ae42-63832d1a322b	f
6f967252-9033-4cc5-af78-021f02ea431a	1b225007-6385-432f-a5c2-2b11ca92211a	f
6f967252-9033-4cc5-af78-021f02ea431a	13b13409-71a1-418e-898d-ed1a5fbcb532	t
\.


--
-- TOC entry 4284 (class 0 OID 17284)
-- Dependencies: 267
-- Data for Name: client_scope_role_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_scope_role_mapping (scope_id, role_id) FROM stdin;
4046233e-eff6-4e63-92e6-282930052813	c86c266f-74d0-4c4d-b63a-d3342f2e68b1
caf932d1-6775-44ff-ae42-63832d1a322b	932a68ec-1371-47b7-998c-0874032872fb
\.


--
-- TOC entry 4302 (class 0 OID 17520)
-- Dependencies: 285
-- Data for Name: component; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.component (id, name, parent_id, provider_id, provider_type, realm_id, sub_type) FROM stdin;
cdbaec69-6c6a-47ea-a7e6-a7774c1c6391	Trusted Hosts	da5e2aa6-73ba-48b9-80fd-c2412ca322de	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	anonymous
5b79e604-cc95-4650-9fc9-61ca753aa4fe	Consent Required	da5e2aa6-73ba-48b9-80fd-c2412ca322de	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	anonymous
eb3a0883-b8ea-4b6a-aa02-8cf8819a07eb	Full Scope Disabled	da5e2aa6-73ba-48b9-80fd-c2412ca322de	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	anonymous
0aa77325-d9f7-4e70-ae10-242fad4211d7	Max Clients Limit	da5e2aa6-73ba-48b9-80fd-c2412ca322de	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	anonymous
0325b242-562d-43f4-ac83-58e5b2ac6b2d	Allowed Protocol Mapper Types	da5e2aa6-73ba-48b9-80fd-c2412ca322de	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	anonymous
7b763e14-4e1b-4c75-9538-4dd6b0802604	Allowed Client Scopes	da5e2aa6-73ba-48b9-80fd-c2412ca322de	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	anonymous
4aa297db-dd6d-4b69-b7ef-edcf9d87bcc1	Allowed Registration Web Origins	da5e2aa6-73ba-48b9-80fd-c2412ca322de	registration-web-origins	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	anonymous
8332dab1-14c0-4ec8-8225-ac2e6061a6ad	Allowed Protocol Mapper Types	da5e2aa6-73ba-48b9-80fd-c2412ca322de	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	authenticated
fe735529-f55f-4552-bcaa-7eedfc0a851a	Allowed Client Scopes	da5e2aa6-73ba-48b9-80fd-c2412ca322de	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	authenticated
34e54699-8f07-40df-b4fd-1be3b1c9a964	Allowed Registration Web Origins	da5e2aa6-73ba-48b9-80fd-c2412ca322de	registration-web-origins	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	authenticated
d9675029-9d2c-4ca9-9a39-7e7339b51a13	rsa-generated	da5e2aa6-73ba-48b9-80fd-c2412ca322de	rsa-generated	org.keycloak.keys.KeyProvider	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N
3e0ea514-ccc6-4ea6-9428-fdd3037e21d5	rsa-enc-generated	da5e2aa6-73ba-48b9-80fd-c2412ca322de	rsa-enc-generated	org.keycloak.keys.KeyProvider	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N
5cc59e6f-5adf-4b5e-8a12-f49b35bce3df	hmac-generated-hs512	da5e2aa6-73ba-48b9-80fd-c2412ca322de	hmac-generated	org.keycloak.keys.KeyProvider	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N
a39566ca-effe-4a22-8e90-7c153f01b550	aes-generated	da5e2aa6-73ba-48b9-80fd-c2412ca322de	aes-generated	org.keycloak.keys.KeyProvider	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N
75f67896-b2f9-43d9-8642-ad0439816698	\N	da5e2aa6-73ba-48b9-80fd-c2412ca322de	declarative-user-profile	org.keycloak.userprofile.UserProfileProvider	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N
12c97f7e-89d2-49b1-97ef-0dac5e07b87a	rsa-generated	c5c44cec-b05c-4195-a581-031a8ca23566	rsa-generated	org.keycloak.keys.KeyProvider	c5c44cec-b05c-4195-a581-031a8ca23566	\N
1a221406-8e5e-4cde-a258-f960133ca27a	rsa-enc-generated	c5c44cec-b05c-4195-a581-031a8ca23566	rsa-enc-generated	org.keycloak.keys.KeyProvider	c5c44cec-b05c-4195-a581-031a8ca23566	\N
1df5014c-7f1f-4d49-a2b1-e0bbc991ef65	hmac-generated-hs512	c5c44cec-b05c-4195-a581-031a8ca23566	hmac-generated	org.keycloak.keys.KeyProvider	c5c44cec-b05c-4195-a581-031a8ca23566	\N
3ac10020-03f4-4e1d-9108-f838823a8d0e	aes-generated	c5c44cec-b05c-4195-a581-031a8ca23566	aes-generated	org.keycloak.keys.KeyProvider	c5c44cec-b05c-4195-a581-031a8ca23566	\N
a213fb6b-5aeb-4c15-897c-98bc524be537	Trusted Hosts	c5c44cec-b05c-4195-a581-031a8ca23566	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	anonymous
e0ce4453-0bb1-4e3d-9cfd-a79042324bf9	Consent Required	c5c44cec-b05c-4195-a581-031a8ca23566	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	anonymous
65c9e682-53e3-4f06-96a4-f649df196fb2	Full Scope Disabled	c5c44cec-b05c-4195-a581-031a8ca23566	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	anonymous
fc24b3e1-6f75-421b-872c-95a5bb6371f2	Max Clients Limit	c5c44cec-b05c-4195-a581-031a8ca23566	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	anonymous
4a2e3c21-adba-404b-b484-3eb0b0ff714a	Allowed Protocol Mapper Types	c5c44cec-b05c-4195-a581-031a8ca23566	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	anonymous
d24dd5d6-7caf-4b12-b469-3056f8f4c47b	Allowed Client Scopes	c5c44cec-b05c-4195-a581-031a8ca23566	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	anonymous
f6736516-c564-4bc2-9188-b4f95a7a1805	Allowed Registration Web Origins	c5c44cec-b05c-4195-a581-031a8ca23566	registration-web-origins	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	anonymous
27cc11ab-a6eb-463a-a57b-d63a421d801f	Allowed Protocol Mapper Types	c5c44cec-b05c-4195-a581-031a8ca23566	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	authenticated
53bff735-e6f3-46b7-be05-e2520171b097	Allowed Client Scopes	c5c44cec-b05c-4195-a581-031a8ca23566	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	authenticated
44c1e83a-76da-468b-a085-0ddca2b9a44e	Allowed Registration Web Origins	c5c44cec-b05c-4195-a581-031a8ca23566	registration-web-origins	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	authenticated
\.


--
-- TOC entry 4301 (class 0 OID 17515)
-- Dependencies: 284
-- Data for Name: component_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.component_config (id, component_id, name, value) FROM stdin;
446453b4-f965-4e19-b868-ee6706502351	8332dab1-14c0-4ec8-8225-ac2e6061a6ad	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
68a9390a-3416-4023-b974-7eb90412e3eb	8332dab1-14c0-4ec8-8225-ac2e6061a6ad	allowed-protocol-mapper-types	oidc-full-name-mapper
fc865ff7-808b-4df9-b4ef-4c83c2e47e3d	8332dab1-14c0-4ec8-8225-ac2e6061a6ad	allowed-protocol-mapper-types	saml-user-property-mapper
5bda76d7-03b8-45c9-b14b-7a49a503eb7c	8332dab1-14c0-4ec8-8225-ac2e6061a6ad	allowed-protocol-mapper-types	oidc-address-mapper
dfcb755a-43ce-4d17-878b-13938bfd6a0d	8332dab1-14c0-4ec8-8225-ac2e6061a6ad	allowed-protocol-mapper-types	saml-role-list-mapper
ba1bc105-a327-43ea-9fc0-9f2a37170cc1	8332dab1-14c0-4ec8-8225-ac2e6061a6ad	allowed-protocol-mapper-types	saml-user-attribute-mapper
9401600f-0fb8-4c2a-8f10-d2833dd8582a	8332dab1-14c0-4ec8-8225-ac2e6061a6ad	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
9298c93e-558b-40ea-a5ce-8ba2d112793c	8332dab1-14c0-4ec8-8225-ac2e6061a6ad	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
8cdf4c18-bc67-4c86-9f13-ec0ec9bb6343	0aa77325-d9f7-4e70-ae10-242fad4211d7	max-clients	200
dae9e737-5707-493d-8c65-4357822ac413	0325b242-562d-43f4-ac83-58e5b2ac6b2d	allowed-protocol-mapper-types	saml-user-attribute-mapper
15f18e52-0eca-4323-a5be-bd1bb8a9317c	0325b242-562d-43f4-ac83-58e5b2ac6b2d	allowed-protocol-mapper-types	saml-user-property-mapper
ae6cd348-3dd8-4c4a-ade8-62c554a5ef07	0325b242-562d-43f4-ac83-58e5b2ac6b2d	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
68a8a9e6-9a64-4c3c-8c42-9d530b6890ec	0325b242-562d-43f4-ac83-58e5b2ac6b2d	allowed-protocol-mapper-types	oidc-address-mapper
9a8ac359-dd78-419d-ae6a-0576e713c165	0325b242-562d-43f4-ac83-58e5b2ac6b2d	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
7feaabca-180b-4879-ae58-289c6bfc26c2	0325b242-562d-43f4-ac83-58e5b2ac6b2d	allowed-protocol-mapper-types	saml-role-list-mapper
6c2ce978-c2dd-4132-8bd4-ae725e019909	0325b242-562d-43f4-ac83-58e5b2ac6b2d	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
37b6fa19-2d81-4d3e-9164-fd036369e160	0325b242-562d-43f4-ac83-58e5b2ac6b2d	allowed-protocol-mapper-types	oidc-full-name-mapper
7b609fd2-1652-4201-a0c1-1dd1bcdd9ef6	7b763e14-4e1b-4c75-9538-4dd6b0802604	allow-default-scopes	true
a41f9faf-20c8-4839-980f-3d9b6a2af59c	fe735529-f55f-4552-bcaa-7eedfc0a851a	allow-default-scopes	true
8a18d8f8-3477-4ba4-a0c9-77c3e123b974	cdbaec69-6c6a-47ea-a7e6-a7774c1c6391	client-uris-must-match	true
fd3016b5-7140-42e3-a8e8-1457cd9ebb6c	cdbaec69-6c6a-47ea-a7e6-a7774c1c6391	host-sending-registration-request-must-match	true
f3d49a18-05a7-401a-894c-35b4d4a086e7	5cc59e6f-5adf-4b5e-8a12-f49b35bce3df	kid	24d90d5c-0c0e-45b5-89ba-77679dc5e743
4081d5f1-1ba9-4ec0-83a6-efbac140344f	5cc59e6f-5adf-4b5e-8a12-f49b35bce3df	priority	100
9946db30-425f-49de-afa6-01042ddb96da	5cc59e6f-5adf-4b5e-8a12-f49b35bce3df	algorithm	HS512
91600141-4eb3-4551-b184-d9782f0d4b4a	5cc59e6f-5adf-4b5e-8a12-f49b35bce3df	secret	Tof81V7AoYL2hvNkOEWY1EkO0RFm6s2Rijlj4JZSG0bmgI7rKjeaVGMdb3-iOFnxjAIdr1Rpqa0xVTCeTtVWInmDP98CPSztsI4LWzjFcO2e0ccTMNAqUEnDs5tgjd0nmAdauLmDa65HZPq9gylE9mb1Z8jAB0ozY97oV1sF56U
d91efdfa-69bd-474b-a904-7f1cbe88349f	a39566ca-effe-4a22-8e90-7c153f01b550	priority	100
0c8f0fdc-6d92-452a-9f2e-b0ea99370c89	a39566ca-effe-4a22-8e90-7c153f01b550	secret	owhQp0sksFeSb1Q0fFByqg
e98895cb-7aee-4034-be79-ce3f8d683814	a39566ca-effe-4a22-8e90-7c153f01b550	kid	5abc80da-09b6-4571-8eb3-1a95c282d0ad
015d1e1d-4c3a-4d49-82f0-c0aae37154d6	3e0ea514-ccc6-4ea6-9428-fdd3037e21d5	algorithm	RSA-OAEP
78aae6d0-6615-41cc-9838-a29e2ea9e6d1	3e0ea514-ccc6-4ea6-9428-fdd3037e21d5	privateKey	MIIEpAIBAAKCAQEAvZMegndx7owNkczc+ebIa2wypFeO9ZBuEs0Fpf3ArbWwDimmOMHrJC7htBIDa8c6nDYzTNckNjUetzNcsWTIiffxfE5wCnGwHakxBTZn6iPcGQ9MP5KAWBYT37uIVx8oW9V+YK3iT4YvftDOw9D1U0ilC0nuM15I5HxRdO32T5Ekk99ZyvCGXT27vk/hbxNeSywqywTUcvs2K307wNz5ul0eJHeI7QjKuUr8HX2eYOSIQONdEATOWAHjA1jDaeHRiblJa0TItHPcB0Hzpw2IHpWc2LSvefYfY7kDJhtVpriZUmWuFHyKUCmvJEynoRKLHmnx9jgzmwnMIfCGO0MLNwIDAQABAoIBAAwkT5hwmQn7y2Syt9aDqwOCVw4Ck6Pzv7ERk5KJmZ0mnWOS1FQfS3WyUP9tBe4RwRW/PPLndqjIJzL5pa6w800u5bcd+PwaQvrrWrnoPaiX6mFqguoxcmnx5Az44GcgFkAngOQlTvDj+cfIDO4qxIO0i+mYrxp4J/gGZFs2YIfA+lcC6CErgIzApI8OBneqqN5IaKNNrKxf2VD2VVBnrJJv3CW1NoOrkt+EhMGhoiI6krcgOp+1AP83LljEV8c2jzysCsqcsIp2tZwJQLwYuZiUcp5Lj+lYKhWv/sUcQEz0BQ3rwXA43M1m3NHVaZ6fu4FKDscc0EW1zjjkgJw0VHECgYEA5K3Ml6X1WJbSj+V9ctme1eVDWjk5x5/8r8RScb4HGzW97wIMG6Jtpm4OpUVOzDpz3UsFXH/HZ4JP/VodSqKTsGsX+suRiN/P/MGgwOtxHM26GHf7ia7ClEl//caXbmpDAQDCXALrX76Rp8mvhY7clVwWnrTSwx5vDxjfRSc1lXECgYEA1DlOywtMAYMi6UQI9FnM7wuo50Zckg0N2h8Zks1B8Uu5OJ0yyQ5YBWXFuuMjGEupPPxV3DfUNtqQKqR2sGWUqnO5CLDeoipf/L67Ka9qbV7xdgALj60B31Y7EROVQo3j5H9UgFR0Cu4SuXWeHJxEh0bZnkLaukgWpBwFbBfeNycCgYEArorRjDZJy/JiiR6a39ym1ZAGFolzRqEgl2/7lYF7nxMoA5PGdhlGJDAA0bjS6iL7aL7oOq/1HVZjg3cSwHLS02cKiIx0asqZz8xizJ1oWpnUHvUFcxOGxPRM0wCPeOF2fv97WguIaC3msvDIHeLrDr2ZLk3KSM+j6RwM3pWM2qECgYBZOD6H3hf2CsuChbe+AoLFfIFluY7xV8ubB7gYn3I5nzwfMPdIz17x5fdaumLms+hSW0M9cbsl1H0HcFz1i78UadJAdRsj0ezItOa6f6Selmus0BgMLw+6dOYgJ7t4X26PgXhk+xxN/AijL29pV8j3ljGm9zQ9XFEobR9aci5ZwQKBgQCUb3LxgZqi2QrXyvJ00mfLiwlNJ2sfrPbKBqmDs380B82bjyQyFwCAinqzaTTQ692IS3UyooR257qyGZB8NPoqyl74xX2GC8U/I1sZo8FwluYwjiGsGJLZTu2KK5lpXJM9F7TRBbWAe7YV9tn+YAQcw1E+CCK6l0YZ9liqttMivg==
15d9cc43-ff4d-466e-b465-80e8f1d2eee8	3e0ea514-ccc6-4ea6-9428-fdd3037e21d5	certificate	MIICmzCCAYMCBgGd8WukAjANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjYwNTA0MDUxNTU2WhcNMzYwNTA0MDUxNzM2WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC9kx6Cd3HujA2RzNz55shrbDKkV471kG4SzQWl/cCttbAOKaY4weskLuG0EgNrxzqcNjNM1yQ2NR63M1yxZMiJ9/F8TnAKcbAdqTEFNmfqI9wZD0w/koBYFhPfu4hXHyhb1X5greJPhi9+0M7D0PVTSKULSe4zXkjkfFF07fZPkSST31nK8IZdPbu+T+FvE15LLCrLBNRy+zYrfTvA3Pm6XR4kd4jtCMq5SvwdfZ5g5IhA410QBM5YAeMDWMNp4dGJuUlrRMi0c9wHQfOnDYgelZzYtK959h9juQMmG1WmuJlSZa4UfIpQKa8kTKehEoseafH2ODObCcwh8IY7Qws3AgMBAAEwDQYJKoZIhvcNAQELBQADggEBACII8wo0AfHszhKrhK+Bg+Fzs6b/9NImBFxiieZZzjFcMw7705cLO+4sbQzCmw4qnCgbMej8PhsDLdvGrdseVLyNcE3iDxp+VXyxmEoPPApOQrH+kJjUh6cCYY58/29AD8IBvUEyRH3fAVMgxbkq/MEPBSBqugdDjZsx0J564JGmikqW+XS6B37ZxrE5Ld7B7wijL2+CpvHOF0GyCh5E56tMaqMEyORXMd8AXycqoqt4jHjpOGQrngi1GVM6mJwmQCIMCE2tLQjlxjn+Iv6MwMi2iBwS51C2iWgVUWVGFoV/Y13F8cYS4TV/XKAdUpgBuXhA+p0VKWN8GG6upGw42Nc=
0c1a53b3-b678-44bf-ab79-0a06013e990b	3e0ea514-ccc6-4ea6-9428-fdd3037e21d5	priority	100
8c936ade-2e1a-40ad-bab8-2243140f8d7b	3e0ea514-ccc6-4ea6-9428-fdd3037e21d5	keyUse	ENC
2478b253-dfcf-406d-9eb6-a52711de987e	75f67896-b2f9-43d9-8642-ad0439816698	kc.user.profile.config	{"attributes":[{"name":"username","displayName":"${username}","validations":{"length":{"min":3,"max":255},"username-prohibited-characters":{},"up-username-not-idn-homograph":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"email","displayName":"${email}","validations":{"email":{},"length":{"max":255}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"firstName","displayName":"${firstName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"lastName","displayName":"${lastName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false}],"groups":[{"name":"user-metadata","displayHeader":"User metadata","displayDescription":"Attributes, which refer to user metadata"}]}
f70eca79-691e-4404-8ae7-5a4a5a14d476	d9675029-9d2c-4ca9-9a39-7e7339b51a13	keyUse	SIG
7379a8e6-3ee4-4c8c-9d1c-8de4bb63787b	d9675029-9d2c-4ca9-9a39-7e7339b51a13	certificate	MIICmzCCAYMCBgGd8Wui2zANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjYwNTA0MDUxNTU2WhcNMzYwNTA0MDUxNzM2WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDFB3jZT9z0PvR5T5778UNKULoszmQsf0GeHvaTl9k7guQClQxusSfos0S5V7W8Ejq3VWfqWyGph5Yhtepd7FZedK16gRCpB6YSoKTTHRItNI8Xshv9Ax+XPqI9yF/S+h72MyvsGmi6TpvBUXwPB+DSqfP+kd+uiiMm7AH0yVOQswgw1lz9irUmCYp+Scua7pUSmxTOuOpzOOrflOnEEbpCVfnsaw4YXaGtpk4rwpEI8i3OZ2eWWUEIvhhjxRyhfnIyCU6mA7UzC4bARygbDqMVDW9eC6UCKfiZ4oTHp1fUXyRBngMjsDa7HcyrsX3uCoNFL1ZelHacI70ZFGPLUMsvAgMBAAEwDQYJKoZIhvcNAQELBQADggEBADSpVmwQUJeegKG0vRHtokbUL1vIfg+ACnfZa7wLGVxz7dzsKDyqZ/DDL8Cjtnja6Efrc+dnWLWel52mbsgOnRjo9XX1o7gkax4WcoPusiM7bbUmvYY7SBkWP/GVx8yJBkxEPLzvlNLIkohLJMj8rgZVACw9n+VZwiJNlpFEusZ38Wbz5w7xqx25SbQaOzmqlPZ1Qi+2c4SwHB9WClvKXY28JNpNWGYNtlnjaeA6A4/K+5hck0+Jd72OdnScrNoL0PqgPopFb31E1C/8FeXCnPAETFX8V8yBZ5kxTQ9LEf5ML46revmQydllX/UP5CH8oIHjQkZpZyR02cn5t5ioC1Q=
a7c17ead-d6c8-4153-8d21-7cedb4f32588	d9675029-9d2c-4ca9-9a39-7e7339b51a13	privateKey	MIIEowIBAAKCAQEAxQd42U/c9D70eU+e+/FDSlC6LM5kLH9Bnh72k5fZO4LkApUMbrEn6LNEuVe1vBI6t1Vn6lshqYeWIbXqXexWXnSteoEQqQemEqCk0x0SLTSPF7Ib/QMflz6iPchf0voe9jMr7Bpouk6bwVF8Dwfg0qnz/pHfroojJuwB9MlTkLMIMNZc/Yq1JgmKfknLmu6VEpsUzrjqczjq35TpxBG6QlX57GsOGF2hraZOK8KRCPItzmdnlllBCL4YY8UcoX5yMglOpgO1MwuGwEcoGw6jFQ1vXgulAin4meKEx6dX1F8kQZ4DI7A2ux3Mq7F97gqDRS9WXpR2nCO9GRRjy1DLLwIDAQABAoIBABm+HYQHHeSrn7WEjvkhT0a+ar9ql/FYZHJhs/BvaT/lR3Uu6YOXkedNb4U9IyQsyDnRPCqFOE4LcQomgos9qGs0Q2uQwWR++KvRDA1T7F62UfEpTDmFLEjOiNQZrKtxZ+oy9WImcS3REiNH9OA3NKCm+UIhkmAeRvQm5yUxyMFMPVzpYN/ek0xPv/aWlmrIUe7Fu7/6jVna28YERkSL8hM6hCpzEZTdO4nHwAq5SAcUt3AL/VQgYeM1ITknDyYZ7ZQ7A1g9l9wDaji9qdEk5Q6m1onm/Csfh1etJbjddpvUcxqF/ERifRUrxX7RU5a47FbKTgyD8c9b6Fa/I04R6gECgYEA9X0R4rBwLqUb6vzT11axtkXpuvREVoZ6r/ixBet3TvvKpmf1JnJaoX1oiyiVoVwhGjGXiBad60SM8os7xkFWd7IPss8rXfTi3AZEmkeQOl6ocBoC4/lWHDQAWy6wrFHj+/mfeXNAZ9uu1Q+A6T3noA3fr5Zj6GEDlq0RJHYZGI8CgYEAzXc2obpsoM59evYQO9HKAPMNCkaI6HZDmk7Fi7lxo/xDCG00FxZhiy4mWPuP36OqdC196dwfc1EtRKvhqiw47gm5SFk/qaGjf2QRoB55hRGQc7klWoYL1aUhn1UZ7K/VW/lugl0AOkYYTh118z3Vdj1AW9/31z2qUv01kqZ2M2ECgYEAjlBwUvOoRVJQif0CLl9C7QFAy7IZ//M8ItHQhjcIVpCf3bJ8q0o2AlK6jZn8jKvlQNMpHqrF6AM4ls9i2r88Cm3+rdFuOazi61zy3mHIWh5QFZTuwgzk/7qhzjqWD3/15DjFW9oVp1/yze+L8yuBIQeJ+rf7uVashuhT/Mg+Kj8CgYBNqOiiWndilInDJyxdn97tWvCr2Js42jKVKX7rYA1/AQNJNRWCQHhgBfKCoZrw2ci8ntE/ym6sxJsKoLjr/EkMV+qLWQiCElFc/jLXRY2C6W+i/fELdS0V9JNvyNfCqXdIi0/kwEgsvn/DTsldRhrf1Sj1UQM5fNpbAc/0/SwiIQKBgEl4tHe2Nv3tZopU/L8S0H/16K346P4QjXgt19E1Vjhpa/8vuBMIyEddmbA34n3xUXduJnsb58habTUIbiEAXu4TEOhgS360isaJHpS3HipeuB1/EVTUXGgmrkf2jA09Wyp8eUS5/HWEQjhTdO3o8Hhm3BUaT0qvUmDhWZBNoRy8
e9c89f9a-a055-4fe6-b2a2-8f22434ef15d	d9675029-9d2c-4ca9-9a39-7e7339b51a13	priority	100
8c33f50a-2af5-4172-92ae-62c6ef6997b3	1df5014c-7f1f-4d49-a2b1-e0bbc991ef65	priority	100
6ccc695d-deb6-4e27-b2a4-3870cfcb5c93	1df5014c-7f1f-4d49-a2b1-e0bbc991ef65	algorithm	HS512
240f4a89-1110-4066-b4e7-0a89483e96ce	1df5014c-7f1f-4d49-a2b1-e0bbc991ef65	secret	w4kJs0MLhHHt026QhvK8HMcnGIX_-Qzz1AMuc5wslgmu1noWvttHm52coQbHauuTuvGnrOcEYoicVdigpM7dVgiGCUSxMub8LFYhwZSDN-RLsQtgDqYgoNL0XKjwQ1pTUPlqMutc8o8x6RLFpMPVj3A_nGwme_4TQ3YgjBpPDac
1c333a22-e4e0-4e13-93f9-4f3599275705	1df5014c-7f1f-4d49-a2b1-e0bbc991ef65	kid	69e5cc18-090d-4dd9-9e42-d29c5270e664
b7eaf006-578c-44e5-a6e8-89b3e9f92fd3	12c97f7e-89d2-49b1-97ef-0dac5e07b87a	certificate	MIICrzCCAZcCBgGd8XF3/jANBgkqhkiG9w0BAQsFADAbMRkwFwYDVQQDDBBzdXBlci1wZXRtYXJrLTNkMB4XDTI2MDUwNDA1MjIxOFoXDTM2MDUwNDA1MjM1OFowGzEZMBcGA1UEAwwQc3VwZXItcGV0bWFyay0zZDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAPiZMH8i3pm0KnKZXYHQuvSpYn78myYT6z6zcx1JlBv+nxn6AYXNEmQS/Dkr4LpjeAzGniZQEPL6DLjHmCK9634vOTtrPndeVOb0bNAbQdmdTg7ZIwlPQyObYubDwEhSXH7kaCO32JxSs9sEu4naaESPIE0cSQ8Y7OAxTRqLdzhlHzg4iqrKpNP6Fr2u8I0W2359hS9KYClIfgDQdX4zg9uvD22KfiFF1KQOEKY6HzMhnvVNlibiEmm9d4lvXeWQkbb5hDvIDu/8rddrJ/y5Lm2mj2bqthtuz/OzkOd+xp7Hrsxi450P3KfBtqmLhEferC9Rs5nlq8/Yj8Hn4Y+FruUCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAQi6KZx6nPdE1rUCq4eYw8PhA1fqmsedH2YYwPSJ1rPP8qOm3Sr5Pb1CazTcOYJTXRwP7Z4S9CrsYHNse2Nc9rnD6oAUpb+A+9T1KD4AKEV8HQstWNOgt1Xixfsy+eH1PJqTDxW45sQIl+f1ArUJ5xH8Q4GGj4VwoKYHs5qW+s+aWmMyNP2HJW42fNiuTY+t+4dWcV6iPD24mD5MVLGu1XuXiPpjq8UGWqvfnmHZxq9U9UkptrJHpLJ/C6dag+EqY66KFH28iJ4VUhpM420pADEfZJZMPjt+fXQTDA4qNn8WOVEYOJ15RlDo1zfDDVdX5rFhpWcjS5K6szCRENajLDg==
528adad8-9cd3-4692-8272-90522897b389	12c97f7e-89d2-49b1-97ef-0dac5e07b87a	keyUse	SIG
217eafe2-f218-4a3d-b483-7ede3520877d	12c97f7e-89d2-49b1-97ef-0dac5e07b87a	priority	100
47fddb8e-9625-4bcc-95c4-0144a87f5531	12c97f7e-89d2-49b1-97ef-0dac5e07b87a	privateKey	MIIEowIBAAKCAQEA+JkwfyLembQqcpldgdC69KlifvybJhPrPrNzHUmUG/6fGfoBhc0SZBL8OSvgumN4DMaeJlAQ8voMuMeYIr3rfi85O2s+d15U5vRs0BtB2Z1ODtkjCU9DI5ti5sPASFJcfuRoI7fYnFKz2wS7idpoRI8gTRxJDxjs4DFNGot3OGUfODiKqsqk0/oWva7wjRbbfn2FL0pgKUh+ANB1fjOD268PbYp+IUXUpA4QpjofMyGe9U2WJuISab13iW9d5ZCRtvmEO8gO7/yt12sn/LkubaaPZuq2G27P87OQ537GnseuzGLjnQ/cp8G2qYuER96sL1GzmeWrz9iPwefhj4Wu5QIDAQABAoIBAHE2JjlH0nLR8yDESiqjuXhRKTtmY2t4V8HyrAJS70G+d4s3aPkblnv/j2Cj5FBNmy7KRtxwyv80M5X0w4pSzktlSx2NreFjkquo9WLift8Q/arSZNvI/mzZRzWLQOZOp7Pb5bcaculh2mlsItHZJnHOcmnbb0QSWFGS8iecCtuhf8tlwgLfZ/XKQ4Om6XyqHyiqRrzNZ8zRzXl0LQOYNjkQusNDXPnrlrOCc6bdwyG/H5DXVT2JuGS6oX0OvZjJ0cuDrsjcMW9XcaLY8cRqdG4NosxxwAm46H6KLsjoqwRg0J7TiCPT2wo8LqkMW7vyytnZwsA6/T0b4WSnH0AzBCMCgYEA/VzuEE3dF3lsmQwh/ftieNHnYyAgQq6c9IGroDnzNHxA8dncNiScSbi5yzkP0VBqxyN/B+ktglGLdeNCmrqAb/IgURK4z1k3VGOV/xPMwrwa0ExTQx4PLMMf9asdVDHwxZ85cGkQtH1kWMy8/AmR2rdL+/NHWBvz2Y+Ak0EzndsCgYEA+y+QgoPJ/tuysX1Tuc10YbCIXNlK0ObMGERemCL9b+RbLqIg5n8y0gEnQUsrRgUbm+Jwg/L6eXRhw56Hw50u5PkV7RCLlMSAvyhjdJPZkqtvEIij/nKHqZxHToJfnt+XQL0aow7oWJ1g7ETEGGGm7CF7n3iPOf2kTIR1y0tsYj8CgYBbZhzTcONjRoBwrbnNf9RENaS9U6ePpqIkamrZgE5GDtT26lrQhWCED8mmkE0ue04pzJpU5j9ulbAztOogG0ueFsClvpVA57RYExzXSfNCBM2/eulGex+KTFHJNBN+fg2XnRsBfEV0dw+uIR3D5kfhmOImX9rK5DqRr3z4ojrWpQKBgQDj4vlWj755TFVIlg2Z6n6GCqUMp88qy9mqwoyXtlb8Zs8a9dinhgtTX9x/bnUqJ4Qu3zd5Xr5D5oSz92Xw4PAkqJ9t3q7kH4s24quonmKsoIA5Hd67AKl4BeLjpYCfIPeWsnoyKVo+2zmN4a2O+Tl5zb7cpYI7+JRRH3PHJvyD/QKBgFdrdh20cB3Of/GhCb04ke8FZyMn+LHVOgacstGoueMsIju0TJsCzPb2h3bR/ZkGoOnAfIR1t34YzQ+OZ1jTB2C7P6EYrHMmUDv3Y8fJCkgcyCyFtL9oGRahxqpduIzkUhNWalVLR6xwDFGgknkZIuaoHsoawm7qPI/upItoiwPN
463305d3-8150-4a48-96ad-b8959faa3f5f	3ac10020-03f4-4e1d-9108-f838823a8d0e	priority	100
370616ac-6f74-45bf-a6e2-f0f4147ea8ab	3ac10020-03f4-4e1d-9108-f838823a8d0e	secret	DxVUEqrMFvgYZfQZqrID2A
c2ab4a06-b373-40df-96d5-6200da633314	3ac10020-03f4-4e1d-9108-f838823a8d0e	kid	79ec91dc-bcb1-40dd-8644-a30867450115
1c9007ca-9892-4a7e-ad6a-c0bf4f628a5e	1a221406-8e5e-4cde-a258-f960133ca27a	privateKey	MIIEowIBAAKCAQEAxxnM2EmkQ0c7HxTpfaxeWHUzDxRHJLqid+DIjxmzmGiBcQl+WS3EtwPE11B77yLZi5Ay+UcwVCozKd1kqKXBKZ2x8KDPxEO608GoTeJpmrHmAupI7VnS7psyhwywOLMTuFDIrW4wlAZ92D8mEg+yBWXG49NlUDbXjGchTUnbFXQ5x3NUYY5mX7PlNQxuT3ZwrqLPXD6UCsJcJ3qNpGrC9qGzN8R8Tp5L0KnEqA6y/ql4ZRl/2i86M+uYJ2AUw6GfbxFa6/mQHbAh4Cgi5bbDzctbZKa0j6RVfYeO7dAPstIYrR5aTMRjKCBRFLhxy110YoT8hDrpKzRJ5seefem72QIDAQABAoIBAA/YvwPvUeUkRrwxvbx0cH/pjW+jpV6dgi/jaA3Htb0pgt/x1FNvFUtHFVmD0jwVfIDOBdiZsMA01E9T4TPxGWo2tG0asjQEpgU+Unx8daZL3CrwOxoKaQOiaPJJxr7Z4KBuFu2C1IKmRPQ7YSF/4U3qV1sBE30VGFvYRiobeOtV6bvN7KNqtXQzQ9fad3FRwoot4EU0+tS+J56YTzZoU0IBAPfFVb6JDnZI/CmAddCoz65kxGqhEL8rGcD6fg9h6HniJYveXd4kqsnUzXijmKWrxsKR6nVVvZh+3WG/IVfHTPG4rdJOMVE36wHC9YFqkbRrgkmYjuZEdtePKgUn2lkCgYEA4kEObZEn1rWl6Kg/2PpxHbMXzsWfWISS7Q/kI+LIKynTIzpIPk0o6PC6HGvYZyqA/fz8ON0N+Lkr8UYU6MkjP7OmwY02PzZB/begPw0l3K2xI/3jChFEnUGulHAP88DPUzxkuvO9ksr1tLfYxM19VZXqyM+6wqU7bcuQAnySBXUCgYEA4UbazGSsX4G1tYcuTMGH6WkEGNZL/nnw4/vve6z2kvEFnPt/yITVkkir7o6EtSUIY4rln6+zp2dFp88EK40VZPxKr3Rgw3wYM1Ts/hsMG5XFZ43+YvuL1g/NRWuCVOnKlyA0znz1lvJio4s/AVSb/FScr8UDyV15EjjYAmY8vFUCgYAqIAa5q68JMOTk/n50vZxV9URXgT/70SMx9CV78Ptn3e+rvWw5/U/Cnx9nr0SpYKaHo5SqWa4CQyfFUlEOTnS7pY1EuDADcOy0en3hf2cvQT+b/edJtpFZ3iLNDFhL//gZ/UKb9Em1jQhWT2ySp9fQGYuPO+3/05fPB3mWnO7rCQKBgQC5FHBgKnnfwX5bVGN6limmXywJh85JlT+O3wZDErhFwxT8gzfZsyCQHXp79MUc2f8JYS0EQ+MSrurwUkk3yqKAJDLr8W4qTQLI8YX/wpLw+tyDFoqgIdAiHztjRE+Amc9i2AfqeYl/6UWW3aj229+HsLBGTFOvFUeJ6/+0APD3PQKBgDRw16PddbfFy0GJocjLvt2U9B3Emx66mACnfs6FJyTqKaAeC2Ff7Yyq52nYdFAyOyTXnTaC7Ul/vBc7EZR3vHwTdNpY+vAQwLY2beFahqWhxXH4M7Kx4SjNcd1RBzrf1zhvMgbc2lRmjkBmhF51PThlSc+rkLb1gGVm0LmCAgVe
57751939-6c29-4323-acd9-a3678433a557	1a221406-8e5e-4cde-a258-f960133ca27a	priority	100
fabc3d49-cbe8-4d8d-a89c-a1da7c8a64d6	1a221406-8e5e-4cde-a258-f960133ca27a	algorithm	RSA-OAEP
75068959-a963-4f8f-804a-999026f3a963	1a221406-8e5e-4cde-a258-f960133ca27a	certificate	MIICrzCCAZcCBgGd8XF4mTANBgkqhkiG9w0BAQsFADAbMRkwFwYDVQQDDBBzdXBlci1wZXRtYXJrLTNkMB4XDTI2MDUwNDA1MjIxOFoXDTM2MDUwNDA1MjM1OFowGzEZMBcGA1UEAwwQc3VwZXItcGV0bWFyay0zZDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMcZzNhJpENHOx8U6X2sXlh1Mw8URyS6onfgyI8Zs5hogXEJflktxLcDxNdQe+8i2YuQMvlHMFQqMyndZKilwSmdsfCgz8RDutPBqE3iaZqx5gLqSO1Z0u6bMocMsDizE7hQyK1uMJQGfdg/JhIPsgVlxuPTZVA214xnIU1J2xV0OcdzVGGOZl+z5TUMbk92cK6iz1w+lArCXCd6jaRqwvahszfEfE6eS9CpxKgOsv6peGUZf9ovOjPrmCdgFMOhn28RWuv5kB2wIeAoIuW2w83LW2SmtI+kVX2Hju3QD7LSGK0eWkzEYyggURS4cctddGKE/IQ66Ss0SebHnn3pu9kCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAd1t0ZDLIdTghLtwcGzV5sHSg2JXAXHavXZ6IsgEd09vBxRWLpF1vRBsIKyzFYvf8A9jrXeUhjG41nLc4l8zlyy0S9U9sg8VUgTQFROAoqqTtxHOCtm+6sT3V6FT4+gf9mkfSwVQ/q74Yt7j/YUK565IhsgqEN4DWaNrNRK5T84xhlvPkxQd+0U8pPlFAmf1SkDqbh5ZeWc4Tihx1pVAYsBx6FfZ5CdqoGLEG99Az0HLYA9BnW/C7rNGwiXytiKH9gxwZ5R2O4UgmtmvbdPebThsTfnPseXkdb4UayYW/LvTc8Vxa93D53KAGssVyEdUgFHfAGir7wKkBbj+SB+7JIA==
cfbd2749-9b0a-4224-8963-7dc89ab1c293	1a221406-8e5e-4cde-a258-f960133ca27a	keyUse	ENC
9a362fad-eac0-4c95-b748-2c675ca04de4	a213fb6b-5aeb-4c15-897c-98bc524be537	host-sending-registration-request-must-match	true
29cde0ff-0572-4b48-ad58-38105f5a6a61	a213fb6b-5aeb-4c15-897c-98bc524be537	client-uris-must-match	true
63473297-ad65-49d9-9218-b4d3c8e664ef	4a2e3c21-adba-404b-b484-3eb0b0ff714a	allowed-protocol-mapper-types	saml-user-attribute-mapper
4bc4eb91-1846-460f-9870-d6c89d90ad25	4a2e3c21-adba-404b-b484-3eb0b0ff714a	allowed-protocol-mapper-types	oidc-full-name-mapper
167a4fd2-d5b1-4823-b54c-79d3198b23ec	4a2e3c21-adba-404b-b484-3eb0b0ff714a	allowed-protocol-mapper-types	oidc-address-mapper
dd409963-a6c0-489c-bf44-51a95f2b4304	4a2e3c21-adba-404b-b484-3eb0b0ff714a	allowed-protocol-mapper-types	saml-role-list-mapper
170e4352-9f10-456e-b5b6-31bb1f7bab57	4a2e3c21-adba-404b-b484-3eb0b0ff714a	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
8f0339f2-555e-4ccb-b636-80147bf7b727	4a2e3c21-adba-404b-b484-3eb0b0ff714a	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
298d0356-5aeb-4464-a652-172b2cc215e7	4a2e3c21-adba-404b-b484-3eb0b0ff714a	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
267a0fec-cfaf-40aa-acc3-48e0f55f7365	4a2e3c21-adba-404b-b484-3eb0b0ff714a	allowed-protocol-mapper-types	saml-user-property-mapper
1f8b093d-3e44-4bcf-a7b0-6053168a16ba	fc24b3e1-6f75-421b-872c-95a5bb6371f2	max-clients	200
34cdfe3e-9cce-4b27-b73e-df68bab19657	27cc11ab-a6eb-463a-a57b-d63a421d801f	allowed-protocol-mapper-types	saml-user-attribute-mapper
cecfa180-bbf3-46e4-8f19-872d33ebdec4	27cc11ab-a6eb-463a-a57b-d63a421d801f	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
c70b148f-108d-4719-ae05-5e544d2e4189	27cc11ab-a6eb-463a-a57b-d63a421d801f	allowed-protocol-mapper-types	oidc-full-name-mapper
ae699e3f-e73f-4716-973f-dae8ac822951	27cc11ab-a6eb-463a-a57b-d63a421d801f	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
9e6f3804-a7ce-4c39-a486-1d90bbf8489e	27cc11ab-a6eb-463a-a57b-d63a421d801f	allowed-protocol-mapper-types	saml-user-property-mapper
2bbb4820-b50f-480e-bdd5-10f7f8b47a27	27cc11ab-a6eb-463a-a57b-d63a421d801f	allowed-protocol-mapper-types	saml-role-list-mapper
76731d65-7d97-4cb9-bd3c-572271eec7f2	27cc11ab-a6eb-463a-a57b-d63a421d801f	allowed-protocol-mapper-types	oidc-address-mapper
4a6cbad1-a238-4f1c-9b42-ca3d750d0464	27cc11ab-a6eb-463a-a57b-d63a421d801f	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
4f81acff-a561-4662-b1cf-770b43759753	d24dd5d6-7caf-4b12-b469-3056f8f4c47b	allow-default-scopes	true
3fb487d7-331c-4cc5-8295-58ca3d1c5d82	53bff735-e6f3-46b7-be05-e2520171b097	allow-default-scopes	true
\.


--
-- TOC entry 4235 (class 0 OID 16417)
-- Dependencies: 218
-- Data for Name: composite_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.composite_role (composite, child_role) FROM stdin;
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	54275ea1-6776-42ca-b72e-c5183bfe2fde
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	96b36dc7-055e-4c9d-8919-3623e7cb1c41
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	2aad7fc3-9051-4a25-be66-0c823ca7108e
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	90dd4d0e-91c8-4ce6-9684-b791df979507
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	1349a4f1-80ea-42b0-9d8f-e1f6ec5cbfdd
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	604663f1-e157-465a-b861-772487cd0d49
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	aff80cdb-5a0a-4f63-a848-a5c0743c5216
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	43972a67-7ae0-42da-9ce8-98f9bc82a03f
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	573e1be5-f765-4ac2-a7e9-df70bcf96f32
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	5acbe2a8-e4a7-4604-a1ca-2789542a4872
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	143ce819-9963-435b-a765-860e59182374
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	09517eed-7e71-4a86-aa13-2e7268596c8d
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	76bcc375-0eb8-47e1-837c-5be05e27f217
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	58784dbc-99be-472f-a826-55b2eed9cae6
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	97d5cb46-2a4a-4492-bd57-df2d0ff0cc7d
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	b834ec63-08a9-475f-804a-ab63cad686b4
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	027da30d-82e7-43cb-9074-00aa2326d338
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	35b40f94-f19e-488a-afb2-ed0cf7ed1261
1349a4f1-80ea-42b0-9d8f-e1f6ec5cbfdd	b834ec63-08a9-475f-804a-ab63cad686b4
90dd4d0e-91c8-4ce6-9684-b791df979507	97d5cb46-2a4a-4492-bd57-df2d0ff0cc7d
90dd4d0e-91c8-4ce6-9684-b791df979507	35b40f94-f19e-488a-afb2-ed0cf7ed1261
2e1ed85f-26f2-4e24-bae6-f5ca1926bff3	0d4018f8-a994-4c5d-8ec2-82bfbb344c81
2e1ed85f-26f2-4e24-bae6-f5ca1926bff3	25d15c18-0fe8-463b-8edf-5416c1fc97ba
25d15c18-0fe8-463b-8edf-5416c1fc97ba	5dad36e8-3394-42fd-a75f-5d99e7400822
b792b62b-aff7-42d4-8dc8-7e8695693421	68543fd0-b978-4096-80c4-a6e6decde47a
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	d3be9f4c-0cb7-45a1-ab12-cdd04b6dbdf8
2e1ed85f-26f2-4e24-bae6-f5ca1926bff3	c86c266f-74d0-4c4d-b63a-d3342f2e68b1
2e1ed85f-26f2-4e24-bae6-f5ca1926bff3	29b7b3f7-fc9e-45b9-b8fb-cdeaec3df06a
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	290a33bd-0a3b-4429-98d5-e95d741b24f0
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	394c70d6-f64a-4bd4-a053-138b26c2691d
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	9cba63b0-ce11-4cd6-9495-c7dd79cffc06
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	c9653b3d-6abf-43d9-bf6a-919fd138a63b
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	01699d6f-f0dc-4eca-93c5-0f7daca2ccc5
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	b65ff361-fd1d-4663-a40d-b776aa9b886b
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	75d53b4d-8524-4e41-a9bf-2b69564c4f79
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	1ad075d2-7b7a-4f05-9893-93ed0037c656
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	f3fcffe5-4484-458e-b36f-8703569ec317
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	bc182441-ba7a-42bb-8c1e-2052284d7782
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	66a17f52-e776-494c-a072-8bfedce9f725
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	be70c66a-fb27-48c3-963d-823000426d04
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	33945856-2b6f-41b9-a0b7-3fa14f672243
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	c1879089-c813-4dc3-a002-19592a9b2d5c
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	067cbd94-62c7-46a6-986d-a86e17516432
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	8fda5448-db1a-418a-acfc-9290a3ccc8e6
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	dc064d81-7ede-4212-b2a4-bdd0605eb9ff
c9653b3d-6abf-43d9-bf6a-919fd138a63b	067cbd94-62c7-46a6-986d-a86e17516432
9cba63b0-ce11-4cd6-9495-c7dd79cffc06	c1879089-c813-4dc3-a002-19592a9b2d5c
9cba63b0-ce11-4cd6-9495-c7dd79cffc06	dc064d81-7ede-4212-b2a4-bdd0605eb9ff
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	70f51427-afa4-4c10-8f2f-f339de8acbfd
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	1d1e6152-dd66-4efc-936a-ed411e13ae99
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	3299b8b8-ad65-4f15-9e71-e631057ba996
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	d1b6b8bf-4ce4-4bb2-ae39-d1734b48f3f1
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	7256f0bd-c5bd-4d37-bda6-7a39d2bab510
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	85b39da3-db65-4c8c-bd1b-8f633983dea0
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	b893a4b2-69b2-445c-84a6-859973788c01
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	25659e2e-1230-457f-acfa-088f59b36c40
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	9078c7cc-cfcf-4606-ba7c-a444d3bbedaa
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	d1c19248-0492-4219-ad51-6188db0c3f91
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	3c246ad9-990f-431f-9b51-bf006937fade
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	a6913b1e-33dd-4203-972a-286eb319181d
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	2701ab37-af32-47a1-ac45-1599798c0dc3
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	4a6d2d7c-9bd7-4e2d-b517-2866947527e6
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	77513b20-42ef-4ba6-a725-33a73b169079
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	b8f85547-8d42-42ef-bcae-0b7176c8e3af
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	58f94dab-0c38-4377-8272-3604a34c03d7
d1b6b8bf-4ce4-4bb2-ae39-d1734b48f3f1	77513b20-42ef-4ba6-a725-33a73b169079
3299b8b8-ad65-4f15-9e71-e631057ba996	4a6d2d7c-9bd7-4e2d-b517-2866947527e6
3299b8b8-ad65-4f15-9e71-e631057ba996	58f94dab-0c38-4377-8272-3604a34c03d7
5192c04b-4489-4127-a88d-75de489ed879	db20bac1-5600-444e-8cc2-ff081d099dc7
5192c04b-4489-4127-a88d-75de489ed879	0e556e7c-b1eb-4df9-a40c-24d05655d4c7
0e556e7c-b1eb-4df9-a40c-24d05655d4c7	3129b335-490c-43f9-ab2c-fb4deac99049
13bb9214-df19-44b6-911e-6b1593876e05	6b759ab4-0be4-43df-b791-8072c55dcf3e
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	e74eddd2-922a-480d-b521-723a25f0d74f
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	e716cd09-e542-4a8f-9b3e-365e152133b8
5192c04b-4489-4127-a88d-75de489ed879	932a68ec-1371-47b7-998c-0874032872fb
5192c04b-4489-4127-a88d-75de489ed879	2c6c9d7a-a94b-4a55-8c63-71e747c8116c
\.


--
-- TOC entry 4236 (class 0 OID 16420)
-- Dependencies: 219
-- Data for Name: credential; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credential (id, salt, type, user_id, created_date, user_label, secret_data, credential_data, priority, version) FROM stdin;
f2757609-1316-4c0e-9354-8f16ad049ee2	\N	password	ec9818f5-4754-4ccd-aaed-35e601b8b131	1777871857139	\N	{"value":"q/zM50EPV8oVpQSFysjZvcNrtFESVRdFVuZaMhIpZps=","salt":"UaNLyp60QX08Qim1GjCC3Q==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10	0
04e6f0e4-c745-4cad-834f-7ffec58f9e68	\N	password	1fc08bbd-b989-407d-977a-2e416393633f	1777872545956	My password	{"value":"3qvbOS7hMBGOwoOYeiJ/bnn2ZjzXPa/neAbpwnhQ5Xo=","salt":"hmQKwSxE3zBkW9b+xbrhUA==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10	1
9428ee15-b8e6-4650-a36e-ae06427fdfd4	\N	password	8d8a2c9f-b7a6-4d71-99ec-280b325f34ab	1777881030020	\N	{"value":"Wlu1VX3OW0Vp+3PVKztlxbaGlrk0AxS7nTzr0+/2wDU=","salt":"aE6Pqu2o8QWNoMmON7ommA==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10	0
b410af36-a11b-4efd-aafd-f238b8513e86	\N	password	99b03a0e-fff3-4ab9-bb0f-804431ed4d6e	1777881610820	\N	{"value":"t+ckr9gS9DPfebelXZnfTaBlnSUr29WpVcjTkR1JxTk=","salt":"sI9GtreKy5Oht/9XhlK6gg==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10	0
705bf4a1-5e98-4516-bab6-f30f31cc3252	\N	password	6a1e8772-302d-42cc-ba22-f45c36096f77	1777881642692	\N	{"value":"2FqUBJLDyQQIBeSA5xJoYctKNbhgAWWhPV1U3Ko397g=","salt":"rv2Yz9nfIciEG6AWHOI7DQ==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10	0
dcc8bca9-1909-4cdf-b783-15691e52496e	\N	password	82b423a8-6257-44e1-8461-acc2be304449	1777881686644	\N	{"value":"/enyuQhHIH/0GyA1HLhteIQ0XY/4/eLECTwaeHgyens=","salt":"jFt+jarT4zjfn4BKA6oqwg==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10	0
54dcd689-73ff-45eb-b104-05570daf7117	\N	password	95dc51ff-25cf-4a63-8984-2962c02dff4d	1777913202263	\N	{"value":"0N0lIgPY+wG3ZPOOC5QPumengwWGHy3UoetaginK1PA=","salt":"oCODmYQ5FwVclhfcVYqTcg==","additionalParameters":{}}	{"hashIterations":5,"algorithm":"argon2","additionalParameters":{"hashLength":["32"],"memory":["7168"],"type":["id"],"version":["1.3"],"parallelism":["1"]}}	10	0
\.


--
-- TOC entry 4232 (class 0 OID 16385)
-- Dependencies: 215
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/jpa-changelog-1.0.0.Final.xml	2026-05-04 05:17:19.854477	1	EXECUTED	9:6f1016664e21e16d26517a4418f5e3df	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.33.0	\N	\N	7871835977
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/db2-jpa-changelog-1.0.0.Final.xml	2026-05-04 05:17:19.873981	2	MARK_RAN	9:828775b1596a07d1200ba1d49e5e3941	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.33.0	\N	\N	7871835977
1.1.0.Beta1	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Beta1.xml	2026-05-04 05:17:19.939598	3	EXECUTED	9:5f090e44a7d595883c1fb61f4b41fd38	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=CLIENT_ATTRIBUTES; createTable tableName=CLIENT_SESSION_NOTE; createTable tableName=APP_NODE_REGISTRATIONS; addColumn table...		\N	4.33.0	\N	\N	7871835977
1.1.0.Final	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Final.xml	2026-05-04 05:17:19.948583	4	EXECUTED	9:c07e577387a3d2c04d1adc9aaad8730e	renameColumn newColumnName=EVENT_TIME, oldColumnName=TIME, tableName=EVENT_ENTITY		\N	4.33.0	\N	\N	7871835977
1.2.0.Beta1	psilva@redhat.com	META-INF/jpa-changelog-1.2.0.Beta1.xml	2026-05-04 05:17:20.11919	5	EXECUTED	9:b68ce996c655922dbcd2fe6b6ae72686	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.33.0	\N	\N	7871835977
1.2.0.Beta1	psilva@redhat.com	META-INF/db2-jpa-changelog-1.2.0.Beta1.xml	2026-05-04 05:17:20.126871	6	MARK_RAN	9:543b5c9989f024fe35c6f6c5a97de88e	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.33.0	\N	\N	7871835977
1.2.0.RC1	bburke@redhat.com	META-INF/jpa-changelog-1.2.0.CR1.xml	2026-05-04 05:17:20.262592	7	EXECUTED	9:765afebbe21cf5bbca048e632df38336	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.33.0	\N	\N	7871835977
1.2.0.RC1	bburke@redhat.com	META-INF/db2-jpa-changelog-1.2.0.CR1.xml	2026-05-04 05:17:20.269967	8	MARK_RAN	9:db4a145ba11a6fdaefb397f6dbf829a1	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.33.0	\N	\N	7871835977
1.2.0.Final	keycloak	META-INF/jpa-changelog-1.2.0.Final.xml	2026-05-04 05:17:20.277799	9	EXECUTED	9:9d05c7be10cdb873f8bcb41bc3a8ab23	update tableName=CLIENT; update tableName=CLIENT; update tableName=CLIENT		\N	4.33.0	\N	\N	7871835977
1.3.0	bburke@redhat.com	META-INF/jpa-changelog-1.3.0.xml	2026-05-04 05:17:20.453992	10	EXECUTED	9:18593702353128d53111f9b1ff0b82b8	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=ADMI...		\N	4.33.0	\N	\N	7871835977
1.4.0	bburke@redhat.com	META-INF/jpa-changelog-1.4.0.xml	2026-05-04 05:17:20.538684	11	EXECUTED	9:6122efe5f090e41a85c0f1c9e52cbb62	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.33.0	\N	\N	7871835977
1.4.0	bburke@redhat.com	META-INF/db2-jpa-changelog-1.4.0.xml	2026-05-04 05:17:20.545142	12	MARK_RAN	9:e1ff28bf7568451453f844c5d54bb0b5	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.33.0	\N	\N	7871835977
1.5.0	bburke@redhat.com	META-INF/jpa-changelog-1.5.0.xml	2026-05-04 05:17:20.568228	13	EXECUTED	9:7af32cd8957fbc069f796b61217483fd	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.33.0	\N	\N	7871835977
1.6.1_from15	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-05-04 05:17:20.608232	14	EXECUTED	9:6005e15e84714cd83226bf7879f54190	addColumn tableName=REALM; addColumn tableName=KEYCLOAK_ROLE; addColumn tableName=CLIENT; createTable tableName=OFFLINE_USER_SESSION; createTable tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_US_SES_PK2, tableName=...		\N	4.33.0	\N	\N	7871835977
1.6.1_from16-pre	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-05-04 05:17:20.61253	15	MARK_RAN	9:bf656f5a2b055d07f314431cae76f06c	delete tableName=OFFLINE_CLIENT_SESSION; delete tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
1.6.1_from16	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-05-04 05:17:20.617811	16	MARK_RAN	9:f8dadc9284440469dcf71e25ca6ab99b	dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_US_SES_PK, tableName=OFFLINE_USER_SESSION; dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_CL_SES_PK, tableName=OFFLINE_CLIENT_SESSION; addColumn tableName=OFFLINE_USER_SESSION; update tableName=OF...		\N	4.33.0	\N	\N	7871835977
1.6.1	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2026-05-04 05:17:20.623026	17	EXECUTED	9:d41d8cd98f00b204e9800998ecf8427e	empty		\N	4.33.0	\N	\N	7871835977
1.7.0	bburke@redhat.com	META-INF/jpa-changelog-1.7.0.xml	2026-05-04 05:17:20.694874	18	EXECUTED	9:3368ff0be4c2855ee2dd9ca813b38d8e	createTable tableName=KEYCLOAK_GROUP; createTable tableName=GROUP_ROLE_MAPPING; createTable tableName=GROUP_ATTRIBUTE; createTable tableName=USER_GROUP_MEMBERSHIP; createTable tableName=REALM_DEFAULT_GROUPS; addColumn tableName=IDENTITY_PROVIDER; ...		\N	4.33.0	\N	\N	7871835977
1.8.0	mposolda@redhat.com	META-INF/jpa-changelog-1.8.0.xml	2026-05-04 05:17:20.77056	19	EXECUTED	9:8ac2fb5dd030b24c0570a763ed75ed20	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.33.0	\N	\N	7871835977
1.8.0-2	keycloak	META-INF/jpa-changelog-1.8.0.xml	2026-05-04 05:17:20.779518	20	EXECUTED	9:f91ddca9b19743db60e3057679810e6c	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.33.0	\N	\N	7871835977
22.0.5-24031	keycloak	META-INF/jpa-changelog-22.0.0.xml	2026-05-04 05:17:26.048499	119	MARK_RAN	9:a60d2d7b315ec2d3eba9e2f145f9df28	customChange		\N	4.33.0	\N	\N	7871835977
1.8.0	mposolda@redhat.com	META-INF/db2-jpa-changelog-1.8.0.xml	2026-05-04 05:17:20.785387	21	MARK_RAN	9:831e82914316dc8a57dc09d755f23c51	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.33.0	\N	\N	7871835977
1.8.0-2	keycloak	META-INF/db2-jpa-changelog-1.8.0.xml	2026-05-04 05:17:20.790605	22	MARK_RAN	9:f91ddca9b19743db60e3057679810e6c	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.33.0	\N	\N	7871835977
1.9.0	mposolda@redhat.com	META-INF/jpa-changelog-1.9.0.xml	2026-05-04 05:17:20.861347	23	EXECUTED	9:bc3d0f9e823a69dc21e23e94c7a94bb1	update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=REALM; update tableName=REALM; customChange; dr...		\N	4.33.0	\N	\N	7871835977
1.9.1	keycloak	META-INF/jpa-changelog-1.9.1.xml	2026-05-04 05:17:20.871367	24	EXECUTED	9:c9999da42f543575ab790e76439a2679	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=PUBLIC_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.33.0	\N	\N	7871835977
1.9.1	keycloak	META-INF/db2-jpa-changelog-1.9.1.xml	2026-05-04 05:17:20.875706	25	MARK_RAN	9:0d6c65c6f58732d81569e77b10ba301d	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.33.0	\N	\N	7871835977
1.9.2	keycloak	META-INF/jpa-changelog-1.9.2.xml	2026-05-04 05:17:21.241665	26	EXECUTED	9:fc576660fc016ae53d2d4778d84d86d0	createIndex indexName=IDX_USER_EMAIL, tableName=USER_ENTITY; createIndex indexName=IDX_USER_ROLE_MAPPING, tableName=USER_ROLE_MAPPING; createIndex indexName=IDX_USER_GROUP_MAPPING, tableName=USER_GROUP_MEMBERSHIP; createIndex indexName=IDX_USER_CO...		\N	4.33.0	\N	\N	7871835977
authz-2.0.0	psilva@redhat.com	META-INF/jpa-changelog-authz-2.0.0.xml	2026-05-04 05:17:21.403966	27	EXECUTED	9:43ed6b0da89ff77206289e87eaa9c024	createTable tableName=RESOURCE_SERVER; addPrimaryKey constraintName=CONSTRAINT_FARS, tableName=RESOURCE_SERVER; addUniqueConstraint constraintName=UK_AU8TT6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER; createTable tableName=RESOURCE_SERVER_RESOU...		\N	4.33.0	\N	\N	7871835977
authz-2.5.1	psilva@redhat.com	META-INF/jpa-changelog-authz-2.5.1.xml	2026-05-04 05:17:21.410267	28	EXECUTED	9:44bae577f551b3738740281eceb4ea70	update tableName=RESOURCE_SERVER_POLICY		\N	4.33.0	\N	\N	7871835977
2.1.0-KEYCLOAK-5461	bburke@redhat.com	META-INF/jpa-changelog-2.1.0.xml	2026-05-04 05:17:21.561475	29	EXECUTED	9:bd88e1f833df0420b01e114533aee5e8	createTable tableName=BROKER_LINK; createTable tableName=FED_USER_ATTRIBUTE; createTable tableName=FED_USER_CONSENT; createTable tableName=FED_USER_CONSENT_ROLE; createTable tableName=FED_USER_CONSENT_PROT_MAPPER; createTable tableName=FED_USER_CR...		\N	4.33.0	\N	\N	7871835977
2.2.0	bburke@redhat.com	META-INF/jpa-changelog-2.2.0.xml	2026-05-04 05:17:21.594923	30	EXECUTED	9:a7022af5267f019d020edfe316ef4371	addColumn tableName=ADMIN_EVENT_ENTITY; createTable tableName=CREDENTIAL_ATTRIBUTE; createTable tableName=FED_CREDENTIAL_ATTRIBUTE; modifyDataType columnName=VALUE, tableName=CREDENTIAL; addForeignKeyConstraint baseTableName=FED_CREDENTIAL_ATTRIBU...		\N	4.33.0	\N	\N	7871835977
2.3.0	bburke@redhat.com	META-INF/jpa-changelog-2.3.0.xml	2026-05-04 05:17:21.629924	31	EXECUTED	9:fc155c394040654d6a79227e56f5e25a	createTable tableName=FEDERATED_USER; addPrimaryKey constraintName=CONSTR_FEDERATED_USER, tableName=FEDERATED_USER; dropDefaultValue columnName=TOTP, tableName=USER_ENTITY; dropColumn columnName=TOTP, tableName=USER_ENTITY; addColumn tableName=IDE...		\N	4.33.0	\N	\N	7871835977
2.4.0	bburke@redhat.com	META-INF/jpa-changelog-2.4.0.xml	2026-05-04 05:17:21.636831	32	EXECUTED	9:eac4ffb2a14795e5dc7b426063e54d88	customChange		\N	4.33.0	\N	\N	7871835977
2.5.0	bburke@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-05-04 05:17:21.647394	33	EXECUTED	9:54937c05672568c4c64fc9524c1e9462	customChange; modifyDataType columnName=USER_ID, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
2.5.0-unicode-oracle	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-05-04 05:17:21.653199	34	MARK_RAN	9:f9753208029f582525ed12011a19d054	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.33.0	\N	\N	7871835977
2.5.0-unicode-other-dbs	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-05-04 05:17:21.708752	35	EXECUTED	9:33d72168746f81f98ae3a1e8e0ca3554	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.33.0	\N	\N	7871835977
2.5.0-duplicate-email-support	slawomir@dabek.name	META-INF/jpa-changelog-2.5.0.xml	2026-05-04 05:17:21.720149	36	EXECUTED	9:61b6d3d7a4c0e0024b0c839da283da0c	addColumn tableName=REALM		\N	4.33.0	\N	\N	7871835977
2.5.0-unique-group-names	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2026-05-04 05:17:21.735887	37	EXECUTED	9:8dcac7bdf7378e7d823cdfddebf72fda	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	7871835977
2.5.1	bburke@redhat.com	META-INF/jpa-changelog-2.5.1.xml	2026-05-04 05:17:21.745467	38	EXECUTED	9:a2b870802540cb3faa72098db5388af3	addColumn tableName=FED_USER_CONSENT		\N	4.33.0	\N	\N	7871835977
3.0.0	bburke@redhat.com	META-INF/jpa-changelog-3.0.0.xml	2026-05-04 05:17:21.754751	39	EXECUTED	9:132a67499ba24bcc54fb5cbdcfe7e4c0	addColumn tableName=IDENTITY_PROVIDER		\N	4.33.0	\N	\N	7871835977
3.2.0-fix	keycloak	META-INF/jpa-changelog-3.2.0.xml	2026-05-04 05:17:21.758864	40	MARK_RAN	9:938f894c032f5430f2b0fafb1a243462	addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS		\N	4.33.0	\N	\N	7871835977
3.2.0-fix-with-keycloak-5416	keycloak	META-INF/jpa-changelog-3.2.0.xml	2026-05-04 05:17:21.76369	41	MARK_RAN	9:845c332ff1874dc5d35974b0babf3006	dropIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS; addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS; createIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS		\N	4.33.0	\N	\N	7871835977
3.2.0-fix-offline-sessions	hmlnarik	META-INF/jpa-changelog-3.2.0.xml	2026-05-04 05:17:21.771245	42	EXECUTED	9:fc86359c079781adc577c5a217e4d04c	customChange		\N	4.33.0	\N	\N	7871835977
3.2.0-fixed	keycloak	META-INF/jpa-changelog-3.2.0.xml	2026-05-04 05:17:23.490474	43	EXECUTED	9:59a64800e3c0d09b825f8a3b444fa8f4	addColumn tableName=REALM; dropPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_PK2, tableName=OFFLINE_CLIENT_SESSION; dropColumn columnName=CLIENT_SESSION_ID, tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_P...		\N	4.33.0	\N	\N	7871835977
3.3.0	keycloak	META-INF/jpa-changelog-3.3.0.xml	2026-05-04 05:17:23.500016	44	EXECUTED	9:d48d6da5c6ccf667807f633fe489ce88	addColumn tableName=USER_ENTITY		\N	4.33.0	\N	\N	7871835977
authz-3.4.0.CR1-resource-server-pk-change-part1	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-05-04 05:17:23.509695	45	EXECUTED	9:dde36f7973e80d71fceee683bc5d2951	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_RESOURCE; addColumn tableName=RESOURCE_SERVER_SCOPE		\N	4.33.0	\N	\N	7871835977
authz-3.4.0.CR1-resource-server-pk-change-part2-KEYCLOAK-6095	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-05-04 05:17:23.516278	46	EXECUTED	9:b855e9b0a406b34fa323235a0cf4f640	customChange		\N	4.33.0	\N	\N	7871835977
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-05-04 05:17:23.520192	47	MARK_RAN	9:51abbacd7b416c50c4421a8cabf7927e	dropIndex indexName=IDX_RES_SERV_POL_RES_SERV, tableName=RESOURCE_SERVER_POLICY; dropIndex indexName=IDX_RES_SRV_RES_RES_SRV, tableName=RESOURCE_SERVER_RESOURCE; dropIndex indexName=IDX_RES_SRV_SCOPE_RES_SRV, tableName=RESOURCE_SERVER_SCOPE		\N	4.33.0	\N	\N	7871835977
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed-nodropindex	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-05-04 05:17:23.678455	48	EXECUTED	9:bdc99e567b3398bac83263d375aad143	addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_POLICY; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_RESOURCE; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, ...		\N	4.33.0	\N	\N	7871835977
authn-3.4.0.CR1-refresh-token-max-reuse	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2026-05-04 05:17:23.687808	49	EXECUTED	9:d198654156881c46bfba39abd7769e69	addColumn tableName=REALM		\N	4.33.0	\N	\N	7871835977
3.4.0	keycloak	META-INF/jpa-changelog-3.4.0.xml	2026-05-04 05:17:23.793228	50	EXECUTED	9:cfdd8736332ccdd72c5256ccb42335db	addPrimaryKey constraintName=CONSTRAINT_REALM_DEFAULT_ROLES, tableName=REALM_DEFAULT_ROLES; addPrimaryKey constraintName=CONSTRAINT_COMPOSITE_ROLE, tableName=COMPOSITE_ROLE; addPrimaryKey constraintName=CONSTR_REALM_DEFAULT_GROUPS, tableName=REALM...		\N	4.33.0	\N	\N	7871835977
3.4.0-KEYCLOAK-5230	hmlnarik@redhat.com	META-INF/jpa-changelog-3.4.0.xml	2026-05-04 05:17:24.161333	51	EXECUTED	9:7c84de3d9bd84d7f077607c1a4dcb714	createIndex indexName=IDX_FU_ATTRIBUTE, tableName=FED_USER_ATTRIBUTE; createIndex indexName=IDX_FU_CONSENT, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CONSENT_RU, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CREDENTIAL, t...		\N	4.33.0	\N	\N	7871835977
3.4.1	psilva@redhat.com	META-INF/jpa-changelog-3.4.1.xml	2026-05-04 05:17:24.169856	52	EXECUTED	9:5a6bb36cbefb6a9d6928452c0852af2d	modifyDataType columnName=VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
3.4.2	keycloak	META-INF/jpa-changelog-3.4.2.xml	2026-05-04 05:17:24.175393	53	EXECUTED	9:8f23e334dbc59f82e0a328373ca6ced0	update tableName=REALM		\N	4.33.0	\N	\N	7871835977
3.4.2-KEYCLOAK-5172	mkanis@redhat.com	META-INF/jpa-changelog-3.4.2.xml	2026-05-04 05:17:24.180927	54	EXECUTED	9:9156214268f09d970cdf0e1564d866af	update tableName=CLIENT		\N	4.33.0	\N	\N	7871835977
4.0.0-KEYCLOAK-6335	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-05-04 05:17:24.196246	55	EXECUTED	9:db806613b1ed154826c02610b7dbdf74	createTable tableName=CLIENT_AUTH_FLOW_BINDINGS; addPrimaryKey constraintName=C_CLI_FLOW_BIND, tableName=CLIENT_AUTH_FLOW_BINDINGS		\N	4.33.0	\N	\N	7871835977
4.0.0-CLEANUP-UNUSED-TABLE	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-05-04 05:17:24.208019	56	EXECUTED	9:229a041fb72d5beac76bb94a5fa709de	dropTable tableName=CLIENT_IDENTITY_PROV_MAPPING		\N	4.33.0	\N	\N	7871835977
4.0.0-KEYCLOAK-6228	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-05-04 05:17:24.277795	57	EXECUTED	9:079899dade9c1e683f26b2aa9ca6ff04	dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; dropNotNullConstraint columnName=CLIENT_ID, tableName=USER_CONSENT; addColumn tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHO...		\N	4.33.0	\N	\N	7871835977
4.0.0-KEYCLOAK-5579-fixed	mposolda@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2026-05-04 05:17:24.71421	58	EXECUTED	9:139b79bcbbfe903bb1c2d2a4dbf001d9	dropForeignKeyConstraint baseTableName=CLIENT_TEMPLATE_ATTRIBUTES, constraintName=FK_CL_TEMPL_ATTR_TEMPL; renameTable newTableName=CLIENT_SCOPE_ATTRIBUTES, oldTableName=CLIENT_TEMPLATE_ATTRIBUTES; renameColumn newColumnName=SCOPE_ID, oldColumnName...		\N	4.33.0	\N	\N	7871835977
authz-4.0.0.CR1	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.CR1.xml	2026-05-04 05:17:24.766136	59	EXECUTED	9:b55738ad889860c625ba2bf483495a04	createTable tableName=RESOURCE_SERVER_PERM_TICKET; addPrimaryKey constraintName=CONSTRAINT_FAPMT, tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRHO213XCX4WNKOG82SSPMT...		\N	4.33.0	\N	\N	7871835977
authz-4.0.0.Beta3	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.Beta3.xml	2026-05-04 05:17:24.777616	60	EXECUTED	9:e0057eac39aa8fc8e09ac6cfa4ae15fe	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRPO2128CX4WNKOG82SSRFY, referencedTableName=RESOURCE_SERVER_POLICY		\N	4.33.0	\N	\N	7871835977
authz-4.2.0.Final	mhajas@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2026-05-04 05:17:24.792573	61	EXECUTED	9:42a33806f3a0443fe0e7feeec821326c	createTable tableName=RESOURCE_URIS; addForeignKeyConstraint baseTableName=RESOURCE_URIS, constraintName=FK_RESOURCE_SERVER_URIS, referencedTableName=RESOURCE_SERVER_RESOURCE; customChange; dropColumn columnName=URI, tableName=RESOURCE_SERVER_RESO...		\N	4.33.0	\N	\N	7871835977
authz-4.2.0.Final-KEYCLOAK-9944	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2026-05-04 05:17:24.80857	62	EXECUTED	9:9968206fca46eecc1f51db9c024bfe56	addPrimaryKey constraintName=CONSTRAINT_RESOUR_URIS_PK, tableName=RESOURCE_URIS		\N	4.33.0	\N	\N	7871835977
4.2.0-KEYCLOAK-6313	wadahiro@gmail.com	META-INF/jpa-changelog-4.2.0.xml	2026-05-04 05:17:24.817927	63	EXECUTED	9:92143a6daea0a3f3b8f598c97ce55c3d	addColumn tableName=REQUIRED_ACTION_PROVIDER		\N	4.33.0	\N	\N	7871835977
4.3.0-KEYCLOAK-7984	wadahiro@gmail.com	META-INF/jpa-changelog-4.3.0.xml	2026-05-04 05:17:24.824217	64	EXECUTED	9:82bab26a27195d889fb0429003b18f40	update tableName=REQUIRED_ACTION_PROVIDER		\N	4.33.0	\N	\N	7871835977
4.6.0-KEYCLOAK-7950	psilva@redhat.com	META-INF/jpa-changelog-4.6.0.xml	2026-05-04 05:17:24.830367	65	EXECUTED	9:e590c88ddc0b38b0ae4249bbfcb5abc3	update tableName=RESOURCE_SERVER_RESOURCE		\N	4.33.0	\N	\N	7871835977
4.6.0-KEYCLOAK-8377	keycloak	META-INF/jpa-changelog-4.6.0.xml	2026-05-04 05:17:24.891278	66	EXECUTED	9:5c1f475536118dbdc38d5d7977950cc0	createTable tableName=ROLE_ATTRIBUTE; addPrimaryKey constraintName=CONSTRAINT_ROLE_ATTRIBUTE_PK, tableName=ROLE_ATTRIBUTE; addForeignKeyConstraint baseTableName=ROLE_ATTRIBUTE, constraintName=FK_ROLE_ATTRIBUTE_ID, referencedTableName=KEYCLOAK_ROLE...		\N	4.33.0	\N	\N	7871835977
4.6.0-KEYCLOAK-8555	gideonray@gmail.com	META-INF/jpa-changelog-4.6.0.xml	2026-05-04 05:17:24.933174	67	EXECUTED	9:e7c9f5f9c4d67ccbbcc215440c718a17	createIndex indexName=IDX_COMPONENT_PROVIDER_TYPE, tableName=COMPONENT		\N	4.33.0	\N	\N	7871835977
4.7.0-KEYCLOAK-1267	sguilhen@redhat.com	META-INF/jpa-changelog-4.7.0.xml	2026-05-04 05:17:24.942375	68	EXECUTED	9:88e0bfdda924690d6f4e430c53447dd5	addColumn tableName=REALM		\N	4.33.0	\N	\N	7871835977
4.7.0-KEYCLOAK-7275	keycloak	META-INF/jpa-changelog-4.7.0.xml	2026-05-04 05:17:24.988659	69	EXECUTED	9:f53177f137e1c46b6a88c59ec1cb5218	renameColumn newColumnName=CREATED_ON, oldColumnName=LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION; addNotNullConstraint columnName=CREATED_ON, tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_USER_SESSION; customChange; createIn...		\N	4.33.0	\N	\N	7871835977
4.8.0-KEYCLOAK-8835	sguilhen@redhat.com	META-INF/jpa-changelog-4.8.0.xml	2026-05-04 05:17:24.998046	70	EXECUTED	9:a74d33da4dc42a37ec27121580d1459f	addNotNullConstraint columnName=SSO_MAX_LIFESPAN_REMEMBER_ME, tableName=REALM; addNotNullConstraint columnName=SSO_IDLE_TIMEOUT_REMEMBER_ME, tableName=REALM		\N	4.33.0	\N	\N	7871835977
authz-7.0.0-KEYCLOAK-10443	psilva@redhat.com	META-INF/jpa-changelog-authz-7.0.0.xml	2026-05-04 05:17:25.006081	71	EXECUTED	9:fd4ade7b90c3b67fae0bfcfcb42dfb5f	addColumn tableName=RESOURCE_SERVER		\N	4.33.0	\N	\N	7871835977
8.0.0-adding-credential-columns	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-05-04 05:17:25.017719	72	EXECUTED	9:aa072ad090bbba210d8f18781b8cebf4	addColumn tableName=CREDENTIAL; addColumn tableName=FED_USER_CREDENTIAL		\N	4.33.0	\N	\N	7871835977
8.0.0-updating-credential-data-not-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-05-04 05:17:25.026747	73	EXECUTED	9:1ae6be29bab7c2aa376f6983b932be37	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.33.0	\N	\N	7871835977
8.0.0-updating-credential-data-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-05-04 05:17:25.031447	74	MARK_RAN	9:14706f286953fc9a25286dbd8fb30d97	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.33.0	\N	\N	7871835977
8.0.0-credential-cleanup-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-05-04 05:17:25.05602	75	EXECUTED	9:2b9cc12779be32c5b40e2e67711a218b	dropDefaultValue columnName=COUNTER, tableName=CREDENTIAL; dropDefaultValue columnName=DIGITS, tableName=CREDENTIAL; dropDefaultValue columnName=PERIOD, tableName=CREDENTIAL; dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; dropColumn ...		\N	4.33.0	\N	\N	7871835977
8.0.0-resource-tag-support	keycloak	META-INF/jpa-changelog-8.0.0.xml	2026-05-04 05:17:25.098046	76	EXECUTED	9:91fa186ce7a5af127a2d7a91ee083cc5	addColumn tableName=MIGRATION_MODEL; createIndex indexName=IDX_UPDATE_TIME, tableName=MIGRATION_MODEL		\N	4.33.0	\N	\N	7871835977
9.0.0-always-display-client	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-05-04 05:17:25.106791	77	EXECUTED	9:6335e5c94e83a2639ccd68dd24e2e5ad	addColumn tableName=CLIENT		\N	4.33.0	\N	\N	7871835977
9.0.0-drop-constraints-for-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-05-04 05:17:25.110919	78	MARK_RAN	9:6bdb5658951e028bfe16fa0a8228b530	dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5PMT, tableName=RESOURCE_SERVER_PERM_TICKET; dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER_RESOURCE; dropPrimaryKey constraintName=CONSTRAINT_O...		\N	4.33.0	\N	\N	7871835977
9.0.0-increase-column-size-federated-fk	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-05-04 05:17:25.147531	79	EXECUTED	9:d5bc15a64117ccad481ce8792d4c608f	modifyDataType columnName=CLIENT_ID, tableName=FED_USER_CONSENT; modifyDataType columnName=CLIENT_REALM_CONSTRAINT, tableName=KEYCLOAK_ROLE; modifyDataType columnName=OWNER, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=CLIENT_ID, ta...		\N	4.33.0	\N	\N	7871835977
9.0.0-recreate-constraints-after-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2026-05-04 05:17:25.151876	80	MARK_RAN	9:077cba51999515f4d3e7ad5619ab592c	addNotNullConstraint columnName=CLIENT_ID, tableName=OFFLINE_CLIENT_SESSION; addNotNullConstraint columnName=OWNER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNullConstraint columnName=REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNull...		\N	4.33.0	\N	\N	7871835977
9.0.1-add-index-to-client.client_id	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-05-04 05:17:25.192467	81	EXECUTED	9:be969f08a163bf47c6b9e9ead8ac2afb	createIndex indexName=IDX_CLIENT_ID, tableName=CLIENT		\N	4.33.0	\N	\N	7871835977
9.0.1-KEYCLOAK-12579-drop-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-05-04 05:17:25.196308	82	MARK_RAN	9:6d3bb4408ba5a72f39bd8a0b301ec6e3	dropUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	7871835977
9.0.1-KEYCLOAK-12579-add-not-null-constraint	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-05-04 05:17:25.205385	83	EXECUTED	9:966bda61e46bebf3cc39518fbed52fa7	addNotNullConstraint columnName=PARENT_GROUP, tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	7871835977
9.0.1-KEYCLOAK-12579-recreate-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-05-04 05:17:25.209067	84	MARK_RAN	9:8dcac7bdf7378e7d823cdfddebf72fda	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	7871835977
9.0.1-add-index-to-events	keycloak	META-INF/jpa-changelog-9.0.1.xml	2026-05-04 05:17:25.249677	85	EXECUTED	9:7d93d602352a30c0c317e6a609b56599	createIndex indexName=IDX_EVENT_TIME, tableName=EVENT_ENTITY		\N	4.33.0	\N	\N	7871835977
map-remove-ri	keycloak	META-INF/jpa-changelog-11.0.0.xml	2026-05-04 05:17:25.260218	86	EXECUTED	9:71c5969e6cdd8d7b6f47cebc86d37627	dropForeignKeyConstraint baseTableName=REALM, constraintName=FK_TRAF444KK6QRKMS7N56AIWQ5Y; dropForeignKeyConstraint baseTableName=KEYCLOAK_ROLE, constraintName=FK_KJHO5LE2C0RAL09FL8CM9WFW9		\N	4.33.0	\N	\N	7871835977
map-remove-ri	keycloak	META-INF/jpa-changelog-12.0.0.xml	2026-05-04 05:17:25.274911	87	EXECUTED	9:a9ba7d47f065f041b7da856a81762021	dropForeignKeyConstraint baseTableName=REALM_DEFAULT_GROUPS, constraintName=FK_DEF_GROUPS_GROUP; dropForeignKeyConstraint baseTableName=REALM_DEFAULT_ROLES, constraintName=FK_H4WPD7W4HSOOLNI3H0SW7BTJE; dropForeignKeyConstraint baseTableName=CLIENT...		\N	4.33.0	\N	\N	7871835977
12.1.0-add-realm-localization-table	keycloak	META-INF/jpa-changelog-12.0.0.xml	2026-05-04 05:17:25.29737	88	EXECUTED	9:fffabce2bc01e1a8f5110d5278500065	createTable tableName=REALM_LOCALIZATIONS; addPrimaryKey tableName=REALM_LOCALIZATIONS		\N	4.33.0	\N	\N	7871835977
default-roles	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-05-04 05:17:25.307242	89	EXECUTED	9:fa8a5b5445e3857f4b010bafb5009957	addColumn tableName=REALM; customChange		\N	4.33.0	\N	\N	7871835977
default-roles-cleanup	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-05-04 05:17:25.32072	90	EXECUTED	9:67ac3241df9a8582d591c5ed87125f39	dropTable tableName=REALM_DEFAULT_ROLES; dropTable tableName=CLIENT_DEFAULT_ROLES		\N	4.33.0	\N	\N	7871835977
13.0.0-KEYCLOAK-16844	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-05-04 05:17:25.363141	91	EXECUTED	9:ad1194d66c937e3ffc82386c050ba089	createIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
map-remove-ri-13.0.0	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-05-04 05:17:25.378379	92	EXECUTED	9:d9be619d94af5a2f5d07b9f003543b91	dropForeignKeyConstraint baseTableName=DEFAULT_CLIENT_SCOPE, constraintName=FK_R_DEF_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SCOPE_CLIENT, constraintName=FK_C_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SC...		\N	4.33.0	\N	\N	7871835977
13.0.0-KEYCLOAK-17992-drop-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-05-04 05:17:25.382746	93	MARK_RAN	9:544d201116a0fcc5a5da0925fbbc3bde	dropPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CLSCOPE_CL, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CL_CLSCOPE, tableName=CLIENT_SCOPE_CLIENT		\N	4.33.0	\N	\N	7871835977
13.0.0-increase-column-size-federated	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-05-04 05:17:25.402601	94	EXECUTED	9:43c0c1055b6761b4b3e89de76d612ccf	modifyDataType columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; modifyDataType columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT		\N	4.33.0	\N	\N	7871835977
13.0.0-KEYCLOAK-17992-recreate-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-05-04 05:17:25.406983	95	MARK_RAN	9:8bd711fd0330f4fe980494ca43ab1139	addNotNullConstraint columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; addNotNullConstraint columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT; addPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; createIndex indexName=...		\N	4.33.0	\N	\N	7871835977
json-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-13.0.0.xml	2026-05-04 05:17:25.417498	96	EXECUTED	9:e07d2bc0970c348bb06fb63b1f82ddbf	addColumn tableName=REALM_ATTRIBUTE; update tableName=REALM_ATTRIBUTE; dropColumn columnName=VALUE, tableName=REALM_ATTRIBUTE; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=REALM_ATTRIBUTE		\N	4.33.0	\N	\N	7871835977
14.0.0-KEYCLOAK-11019	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-05-04 05:17:25.526978	97	EXECUTED	9:24fb8611e97f29989bea412aa38d12b7	createIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USER, tableName=OFFLINE_USER_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
14.0.0-KEYCLOAK-18286	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-05-04 05:17:25.531248	98	MARK_RAN	9:259f89014ce2506ee84740cbf7163aa7	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
14.0.0-KEYCLOAK-18286-revert	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-05-04 05:17:25.547178	99	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
14.0.0-KEYCLOAK-18286-supported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-05-04 05:17:25.611903	100	EXECUTED	9:60ca84a0f8c94ec8c3504a5a3bc88ee8	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
14.0.0-KEYCLOAK-18286-unsupported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-05-04 05:17:25.616387	101	MARK_RAN	9:d3d977031d431db16e2c181ce49d73e9	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
KEYCLOAK-17267-add-index-to-user-attributes	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-05-04 05:17:25.660065	102	EXECUTED	9:0b305d8d1277f3a89a0a53a659ad274c	createIndex indexName=IDX_USER_ATTRIBUTE_NAME, tableName=USER_ATTRIBUTE		\N	4.33.0	\N	\N	7871835977
KEYCLOAK-18146-add-saml-art-binding-identifier	keycloak	META-INF/jpa-changelog-14.0.0.xml	2026-05-04 05:17:25.666773	103	EXECUTED	9:2c374ad2cdfe20e2905a84c8fac48460	customChange		\N	4.33.0	\N	\N	7871835977
15.0.0-KEYCLOAK-18467	keycloak	META-INF/jpa-changelog-15.0.0.xml	2026-05-04 05:17:25.677429	104	EXECUTED	9:47a760639ac597360a8219f5b768b4de	addColumn tableName=REALM_LOCALIZATIONS; update tableName=REALM_LOCALIZATIONS; dropColumn columnName=TEXTS, tableName=REALM_LOCALIZATIONS; renameColumn newColumnName=TEXTS, oldColumnName=TEXTS_NEW, tableName=REALM_LOCALIZATIONS; addNotNullConstrai...		\N	4.33.0	\N	\N	7871835977
17.0.0-9562	keycloak	META-INF/jpa-changelog-17.0.0.xml	2026-05-04 05:17:25.72153	105	EXECUTED	9:a6272f0576727dd8cad2522335f5d99e	createIndex indexName=IDX_USER_SERVICE_ACCOUNT, tableName=USER_ENTITY		\N	4.33.0	\N	\N	7871835977
18.0.0-10625-IDX_ADMIN_EVENT_TIME	keycloak	META-INF/jpa-changelog-18.0.0.xml	2026-05-04 05:17:25.76312	106	EXECUTED	9:015479dbd691d9cc8669282f4828c41d	createIndex indexName=IDX_ADMIN_EVENT_TIME, tableName=ADMIN_EVENT_ENTITY		\N	4.33.0	\N	\N	7871835977
18.0.15-30992-index-consent	keycloak	META-INF/jpa-changelog-18.0.15.xml	2026-05-04 05:17:25.811882	107	EXECUTED	9:80071ede7a05604b1f4906f3bf3b00f0	createIndex indexName=IDX_USCONSENT_SCOPE_ID, tableName=USER_CONSENT_CLIENT_SCOPE		\N	4.33.0	\N	\N	7871835977
19.0.0-10135	keycloak	META-INF/jpa-changelog-19.0.0.xml	2026-05-04 05:17:25.819021	108	EXECUTED	9:9518e495fdd22f78ad6425cc30630221	customChange		\N	4.33.0	\N	\N	7871835977
20.0.0-12964-supported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-05-04 05:17:25.861506	109	EXECUTED	9:e5f243877199fd96bcc842f27a1656ac	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.33.0	\N	\N	7871835977
20.0.0-12964-supported-dbs-edb-migration	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-05-04 05:17:25.91261	110	EXECUTED	9:a6b18a8e38062df5793edbe064f4aecd	dropIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE; createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.33.0	\N	\N	7871835977
20.0.0-12964-unsupported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-05-04 05:17:25.917148	111	MARK_RAN	9:1a6fcaa85e20bdeae0a9ce49b41946a5	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.33.0	\N	\N	7871835977
client-attributes-string-accomodation-fixed-pre-drop-index	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-05-04 05:17:25.927382	112	EXECUTED	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
client-attributes-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-05-04 05:17:25.938676	113	EXECUTED	9:3f332e13e90739ed0c35b0b25b7822ca	addColumn tableName=CLIENT_ATTRIBUTES; update tableName=CLIENT_ATTRIBUTES; dropColumn columnName=VALUE, tableName=CLIENT_ATTRIBUTES; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
client-attributes-string-accomodation-fixed-post-create-index	keycloak	META-INF/jpa-changelog-20.0.0.xml	2026-05-04 05:17:25.943318	114	MARK_RAN	9:bd2bd0fc7768cf0845ac96a8786fa735	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
21.0.2-17277	keycloak	META-INF/jpa-changelog-21.0.2.xml	2026-05-04 05:17:25.949756	115	EXECUTED	9:7ee1f7a3fb8f5588f171fb9a6ab623c0	customChange		\N	4.33.0	\N	\N	7871835977
21.1.0-19404	keycloak	META-INF/jpa-changelog-21.1.0.xml	2026-05-04 05:17:26.028319	116	EXECUTED	9:3d7e830b52f33676b9d64f7f2b2ea634	modifyDataType columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=LOGIC, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=POLICY_ENFORCE_MODE, tableName=RESOURCE_SERVER		\N	4.33.0	\N	\N	7871835977
21.1.0-19404-2	keycloak	META-INF/jpa-changelog-21.1.0.xml	2026-05-04 05:17:26.03473	117	MARK_RAN	9:627d032e3ef2c06c0e1f73d2ae25c26c	addColumn tableName=RESOURCE_SERVER_POLICY; update tableName=RESOURCE_SERVER_POLICY; dropColumn columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; renameColumn newColumnName=DECISION_STRATEGY, oldColumnName=DECISION_STRATEGY_NEW, tabl...		\N	4.33.0	\N	\N	7871835977
22.0.0-17484-updated	keycloak	META-INF/jpa-changelog-22.0.0.xml	2026-05-04 05:17:26.044023	118	EXECUTED	9:90af0bfd30cafc17b9f4d6eccd92b8b3	customChange		\N	4.33.0	\N	\N	7871835977
23.0.0-12062	keycloak	META-INF/jpa-changelog-23.0.0.xml	2026-05-04 05:17:26.05968	120	EXECUTED	9:2168fbe728fec46ae9baf15bf80927b8	addColumn tableName=COMPONENT_CONFIG; update tableName=COMPONENT_CONFIG; dropColumn columnName=VALUE, tableName=COMPONENT_CONFIG; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=COMPONENT_CONFIG		\N	4.33.0	\N	\N	7871835977
23.0.0-17258	keycloak	META-INF/jpa-changelog-23.0.0.xml	2026-05-04 05:17:26.067832	121	EXECUTED	9:36506d679a83bbfda85a27ea1864dca8	addColumn tableName=EVENT_ENTITY		\N	4.33.0	\N	\N	7871835977
24.0.0-9758	keycloak	META-INF/jpa-changelog-24.0.0.xml	2026-05-04 05:17:26.212679	122	EXECUTED	9:502c557a5189f600f0f445a9b49ebbce	addColumn tableName=USER_ATTRIBUTE; addColumn tableName=FED_USER_ATTRIBUTE; createIndex indexName=USER_ATTR_LONG_VALUES, tableName=USER_ATTRIBUTE; createIndex indexName=FED_USER_ATTR_LONG_VALUES, tableName=FED_USER_ATTRIBUTE; createIndex indexName...		\N	4.33.0	\N	\N	7871835977
24.0.0-9758-2	keycloak	META-INF/jpa-changelog-24.0.0.xml	2026-05-04 05:17:26.218496	123	EXECUTED	9:bf0fdee10afdf597a987adbf291db7b2	customChange		\N	4.33.0	\N	\N	7871835977
24.0.0-26618-drop-index-if-present	keycloak	META-INF/jpa-changelog-24.0.0.xml	2026-05-04 05:17:26.226736	124	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
24.0.0-26618-reindex	keycloak	META-INF/jpa-changelog-24.0.0.xml	2026-05-04 05:17:26.274933	125	EXECUTED	9:08707c0f0db1cef6b352db03a60edc7f	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
24.0.0-26618-edb-migration	keycloak	META-INF/jpa-changelog-24.0.0.xml	2026-05-04 05:17:26.324398	126	EXECUTED	9:2f684b29d414cd47efe3a3599f390741	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES; createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
24.0.2-27228	keycloak	META-INF/jpa-changelog-24.0.2.xml	2026-05-04 05:17:26.330799	127	EXECUTED	9:eaee11f6b8aa25d2cc6a84fb86fc6238	customChange		\N	4.33.0	\N	\N	7871835977
24.0.2-27967-drop-index-if-present	keycloak	META-INF/jpa-changelog-24.0.2.xml	2026-05-04 05:17:26.335363	128	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
24.0.2-27967-reindex	keycloak	META-INF/jpa-changelog-24.0.2.xml	2026-05-04 05:17:26.34073	129	MARK_RAN	9:d3d977031d431db16e2c181ce49d73e9	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.33.0	\N	\N	7871835977
25.0.0-28265-tables	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.351728	130	EXECUTED	9:deda2df035df23388af95bbd36c17cef	addColumn tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	7871835977
25.0.0-28265-index-creation	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.395833	131	EXECUTED	9:3e96709818458ae49f3c679ae58d263a	createIndex indexName=IDX_OFFLINE_USS_BY_LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
25.0.0-28265-index-cleanup-uss-createdon	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.409069	132	EXECUTED	9:78ab4fc129ed5e8265dbcc3485fba92f	dropIndex indexName=IDX_OFFLINE_USS_CREATEDON, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
25.0.0-28265-index-cleanup-uss-preload	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.422386	133	EXECUTED	9:de5f7c1f7e10994ed8b62e621d20eaab	dropIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
25.0.0-28265-index-cleanup-uss-by-usersess	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.435813	134	EXECUTED	9:6eee220d024e38e89c799417ec33667f	dropIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
25.0.0-28265-index-cleanup-css-preload	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.44946	135	EXECUTED	9:5411d2fb2891d3e8d63ddb55dfa3c0c9	dropIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	7871835977
25.0.0-28265-index-2-mysql	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.453936	136	MARK_RAN	9:b7ef76036d3126bb83c2423bf4d449d6	createIndex indexName=IDX_OFFLINE_USS_BY_BROKER_SESSION_ID, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
25.0.0-28265-index-2-not-mysql	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.497918	137	EXECUTED	9:23396cf51ab8bc1ae6f0cac7f9f6fcf7	createIndex indexName=IDX_OFFLINE_USS_BY_BROKER_SESSION_ID, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
25.0.0-org	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.529428	138	EXECUTED	9:5c859965c2c9b9c72136c360649af157	createTable tableName=ORG; addUniqueConstraint constraintName=UK_ORG_NAME, tableName=ORG; addUniqueConstraint constraintName=UK_ORG_GROUP, tableName=ORG; createTable tableName=ORG_DOMAIN		\N	4.33.0	\N	\N	7871835977
unique-consentuser	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.543345	139	EXECUTED	9:5857626a2ea8767e9a6c66bf3a2cb32f	customChange; dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_LOCAL_CONSENT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_EXTERNAL_CONSENT, tableName=...		\N	4.33.0	\N	\N	7871835977
unique-consentuser-edb-migration	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.554061	140	MARK_RAN	9:5857626a2ea8767e9a6c66bf3a2cb32f	customChange; dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_LOCAL_CONSENT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_EXTERNAL_CONSENT, tableName=...		\N	4.33.0	\N	\N	7871835977
unique-consentuser-mysql	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.556952	141	MARK_RAN	9:b79478aad5adaa1bc428e31563f55e8e	customChange; dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_LOCAL_CONSENT, tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_EXTERNAL_CONSENT, tableName=...		\N	4.33.0	\N	\N	7871835977
25.0.0-28861-index-creation	keycloak	META-INF/jpa-changelog-25.0.0.xml	2026-05-04 05:17:26.682138	142	EXECUTED	9:b9acb58ac958d9ada0fe12a5d4794ab1	createIndex indexName=IDX_PERM_TICKET_REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; createIndex indexName=IDX_PERM_TICKET_OWNER, tableName=RESOURCE_SERVER_PERM_TICKET		\N	4.33.0	\N	\N	7871835977
26.0.0-org-alias	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-05-04 05:17:26.773473	143	EXECUTED	9:6ef7d63e4412b3c2d66ed179159886a4	addColumn tableName=ORG; update tableName=ORG; addNotNullConstraint columnName=ALIAS, tableName=ORG; addUniqueConstraint constraintName=UK_ORG_ALIAS, tableName=ORG		\N	4.33.0	\N	\N	7871835977
26.0.0-org-group	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-05-04 05:17:26.793123	144	EXECUTED	9:da8e8087d80ef2ace4f89d8c5b9ca223	addColumn tableName=KEYCLOAK_GROUP; update tableName=KEYCLOAK_GROUP; addNotNullConstraint columnName=TYPE, tableName=KEYCLOAK_GROUP; customChange		\N	4.33.0	\N	\N	7871835977
26.0.0-org-indexes	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-05-04 05:17:26.904399	145	EXECUTED	9:79b05dcd610a8c7f25ec05135eec0857	createIndex indexName=IDX_ORG_DOMAIN_ORG_ID, tableName=ORG_DOMAIN		\N	4.33.0	\N	\N	7871835977
26.0.0-org-group-membership	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-05-04 05:17:26.95193	146	EXECUTED	9:a6ace2ce583a421d89b01ba2a28dc2d4	addColumn tableName=USER_GROUP_MEMBERSHIP; update tableName=USER_GROUP_MEMBERSHIP; addNotNullConstraint columnName=MEMBERSHIP_TYPE, tableName=USER_GROUP_MEMBERSHIP		\N	4.33.0	\N	\N	7871835977
31296-persist-revoked-access-tokens	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-05-04 05:17:27.05719	147	EXECUTED	9:64ef94489d42a358e8304b0e245f0ed4	createTable tableName=REVOKED_TOKEN; addPrimaryKey constraintName=CONSTRAINT_RT, tableName=REVOKED_TOKEN		\N	4.33.0	\N	\N	7871835977
31725-index-persist-revoked-access-tokens	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-05-04 05:17:27.195317	148	EXECUTED	9:b994246ec2bf7c94da881e1d28782c7b	createIndex indexName=IDX_REV_TOKEN_ON_EXPIRE, tableName=REVOKED_TOKEN		\N	4.33.0	\N	\N	7871835977
26.0.0-idps-for-login	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-05-04 05:17:27.420678	149	EXECUTED	9:51f5fffadf986983d4bd59582c6c1604	addColumn tableName=IDENTITY_PROVIDER; createIndex indexName=IDX_IDP_REALM_ORG, tableName=IDENTITY_PROVIDER; createIndex indexName=IDX_IDP_FOR_LOGIN, tableName=IDENTITY_PROVIDER; customChange		\N	4.33.0	\N	\N	7871835977
26.0.0-32583-drop-redundant-index-on-client-session	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-05-04 05:17:27.477631	150	EXECUTED	9:24972d83bf27317a055d234187bb4af9	dropIndex indexName=IDX_US_SESS_ID_ON_CL_SESS, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	7871835977
26.0.0.32582-remove-tables-user-session-user-session-note-and-client-session	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-05-04 05:17:27.570784	151	EXECUTED	9:febdc0f47f2ed241c59e60f58c3ceea5	dropTable tableName=CLIENT_SESSION_ROLE; dropTable tableName=CLIENT_SESSION_NOTE; dropTable tableName=CLIENT_SESSION_PROT_MAPPER; dropTable tableName=CLIENT_SESSION_AUTH_STATUS; dropTable tableName=CLIENT_USER_SESSION_NOTE; dropTable tableName=CLI...		\N	4.33.0	\N	\N	7871835977
26.0.0-33201-org-redirect-url	keycloak	META-INF/jpa-changelog-26.0.0.xml	2026-05-04 05:17:27.642746	152	EXECUTED	9:4d0e22b0ac68ebe9794fa9cb752ea660	addColumn tableName=ORG		\N	4.33.0	\N	\N	7871835977
29399-jdbc-ping-default	keycloak	META-INF/jpa-changelog-26.1.0.xml	2026-05-04 05:17:27.800951	153	EXECUTED	9:007dbe99d7203fca403b89d4edfdf21e	createTable tableName=JGROUPS_PING; addPrimaryKey constraintName=CONSTRAINT_JGROUPS_PING, tableName=JGROUPS_PING		\N	4.33.0	\N	\N	7871835977
26.1.0-34013	keycloak	META-INF/jpa-changelog-26.1.0.xml	2026-05-04 05:17:27.870772	154	EXECUTED	9:e6b686a15759aef99a6d758a5c4c6a26	addColumn tableName=ADMIN_EVENT_ENTITY		\N	4.33.0	\N	\N	7871835977
26.1.0-34380	keycloak	META-INF/jpa-changelog-26.1.0.xml	2026-05-04 05:17:27.928385	155	EXECUTED	9:ac8b9edb7c2b6c17a1c7a11fcf5ccf01	dropTable tableName=USERNAME_LOGIN_FAILURE		\N	4.33.0	\N	\N	7871835977
26.2.0-36750	keycloak	META-INF/jpa-changelog-26.2.0.xml	2026-05-04 05:17:28.116347	156	EXECUTED	9:b49ce951c22f7eb16480ff085640a33a	createTable tableName=SERVER_CONFIG		\N	4.33.0	\N	\N	7871835977
26.2.0-26106	keycloak	META-INF/jpa-changelog-26.2.0.xml	2026-05-04 05:17:28.169253	157	EXECUTED	9:b5877d5dab7d10ff3a9d209d7beb6680	addColumn tableName=CREDENTIAL		\N	4.33.0	\N	\N	7871835977
26.2.6-39866-duplicate	keycloak	META-INF/jpa-changelog-26.2.6.xml	2026-05-04 05:17:28.19923	158	EXECUTED	9:1dc67ccee24f30331db2cba4f372e40e	customChange		\N	4.33.0	\N	\N	7871835977
26.2.6-39866-uk	keycloak	META-INF/jpa-changelog-26.2.6.xml	2026-05-04 05:17:28.316578	159	EXECUTED	9:b70b76f47210cf0a5f4ef0e219eac7cd	addUniqueConstraint constraintName=UK_MIGRATION_VERSION, tableName=MIGRATION_MODEL		\N	4.33.0	\N	\N	7871835977
26.2.6-40088-duplicate	keycloak	META-INF/jpa-changelog-26.2.6.xml	2026-05-04 05:17:28.344351	160	EXECUTED	9:cc7e02ed69ab31979afb1982f9670e8f	customChange		\N	4.33.0	\N	\N	7871835977
26.2.6-40088-uk	keycloak	META-INF/jpa-changelog-26.2.6.xml	2026-05-04 05:17:28.459319	161	EXECUTED	9:5bb848128da7bc4595cc507383325241	addUniqueConstraint constraintName=UK_MIGRATION_UPDATE_TIME, tableName=MIGRATION_MODEL		\N	4.33.0	\N	\N	7871835977
26.3.0-groups-description	keycloak	META-INF/jpa-changelog-26.3.0.xml	2026-05-04 05:17:28.561733	162	EXECUTED	9:e1a3c05574326fb5b246b73b9a4c4d49	addColumn tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	7871835977
26.4.0-40933-saml-encryption-attributes	keycloak	META-INF/jpa-changelog-26.4.0.xml	2026-05-04 05:17:28.590969	163	EXECUTED	9:7e9eaba362ca105efdda202303a4fe49	customChange		\N	4.33.0	\N	\N	7871835977
26.4.0-51321	keycloak	META-INF/jpa-changelog-26.4.0.xml	2026-05-04 05:17:28.735941	164	EXECUTED	9:34bab2bc56f75ffd7e347c580874e306	createIndex indexName=IDX_EVENT_ENTITY_USER_ID_TYPE, tableName=EVENT_ENTITY		\N	4.33.0	\N	\N	7871835977
40343-workflow-state-table	keycloak	META-INF/jpa-changelog-26.4.0.xml	2026-05-04 05:17:29.160749	165	EXECUTED	9:ed3ab4723ceed210e5b5e60ac4562106	createTable tableName=WORKFLOW_STATE; addPrimaryKey constraintName=PK_WORKFLOW_STATE, tableName=WORKFLOW_STATE; addUniqueConstraint constraintName=UQ_WORKFLOW_RESOURCE, tableName=WORKFLOW_STATE; createIndex indexName=IDX_WORKFLOW_STATE_STEP, table...		\N	4.33.0	\N	\N	7871835977
26.5.0-index-offline-css-by-client	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:29.293494	166	EXECUTED	9:383e981ce95d16e32af757b7998820f7	createIndex indexName=IDX_OFFLINE_CSS_BY_CLIENT, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	7871835977
26.5.0-index-offline-css-by-client-storage-provider	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:29.440409	167	EXECUTED	9:f5bc200e6fa7d7e483854dee535ca425	createIndex indexName=IDX_OFFLINE_CSS_BY_CLIENT_STORAGE_PROVIDER, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	7871835977
26.5.0-idp-config-allow-null-fixed-drop-mssql-index	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:29.470055	168	MARK_RAN	9:50c51d2c98cd1d624eb1c485c3cf1f75	dropIndex indexName=IDX_IDP_FOR_LOGIN, tableName=IDENTITY_PROVIDER		\N	4.33.0	\N	\N	7871835977
26.5.0-idp-config-allow-null	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:29.538817	169	EXECUTED	9:b667fb087874303b324c1af7fae4f606	dropDefaultValue columnName=TRUST_EMAIL, tableName=IDENTITY_PROVIDER; dropNotNullConstraint columnName=TRUST_EMAIL, tableName=IDENTITY_PROVIDER; dropNotNullConstraint columnName=STORE_TOKEN, tableName=IDENTITY_PROVIDER; dropDefaultValue columnName...		\N	4.33.0	\N	\N	7871835977
26.5.0-idp-config-allow-null-fixed-create-mssql-index	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:29.568607	170	MARK_RAN	9:dcbbb24c151c3b0b59f12fede23cc94d	createIndex indexName=IDX_IDP_FOR_LOGIN, tableName=IDENTITY_PROVIDER		\N	4.33.0	\N	\N	7871835977
26.5.0-remove-workflow-provider-id-column	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:29.729544	171	EXECUTED	9:d8eeb324484d45e946d03b953e168b21	dropIndex indexName=IDX_WORKFLOW_STATE_PROVIDER, tableName=WORKFLOW_STATE; createIndex indexName=IDX_WORKFLOW_STATE_PROVIDER, tableName=WORKFLOW_STATE; dropColumn columnName=WORKFLOW_PROVIDER_ID, tableName=WORKFLOW_STATE		\N	4.33.0	\N	\N	7871835977
26.5.0-add-remember-me	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:29.786228	172	EXECUTED	9:a7273ea8b21bd2f674c9c49141999f05	addColumn tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
26.5.0-add-sess-refresh-idx	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:29.911305	173	EXECUTED	9:ce49383d317ccbcd3434d1f21172b0b7	createIndex indexName=IDX_USER_SESSION_EXPIRATION_CREATED, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
26.5.0-add-sess-create-idx	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:29.967784	174	EXECUTED	9:aaee09e23a4d8468fbc5c51b7b314c58	createIndex indexName=IDX_USER_SESSION_EXPIRATION_LAST_REFRESH, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
26.5.0-drop-sess-refresh-idx	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:29.987338	175	EXECUTED	9:f0082210b6ccbbaf81287c27aa23753c	dropIndex indexName=IDX_OFFLINE_USS_BY_LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION		\N	4.33.0	\N	\N	7871835977
26.5.0-mysql-mariadb-default-charset-collation	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:29.995839	176	MARK_RAN	9:1b383fa60d2db0a8952b365e725f9d16	customChange		\N	4.33.0	\N	\N	7871835977
26.5.0-invitations-table-fixed2	keycloak	META-INF/jpa-changelog-26.5.0.xml	2026-05-04 05:17:30.151864	177	EXECUTED	9:322cb11fc03181903dcd67a54f8b3cf0	createTable tableName=ORG_INVITATION; addForeignKeyConstraint baseTableName=ORG_INVITATION, constraintName=FK_ORG_INVITATION_ORG, referencedTableName=ORG; createIndex indexName=IDX_ORG_INVITATION_ORG_ID, tableName=ORG_INVITATION; createIndex index...		\N	4.33.0	\N	\N	7871835977
26.6.0-45009-broker-link-user-id	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-05-04 05:17:30.21135	178	EXECUTED	9:05026bbbc8d2ead5afcbda2f5fdf3a2b	createIndex indexName=IDX_BROKER_LINK_USER_ID, tableName=BROKER_LINK		\N	4.33.0	\N	\N	7871835977
26.6.0-45009-broker-link-identity-provider	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-05-04 05:17:30.258399	179	EXECUTED	9:7d9a0253c9de7be754efef8bba4265bd	createIndex indexName=IDX_BROKER_LINK_IDENTITY_PROVIDER, tableName=BROKER_LINK		\N	4.33.0	\N	\N	7871835977
26.6.0-org-group-relationship	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-05-04 05:17:30.308494	180	EXECUTED	9:05685853fba030f53548ac6bf23245e3	addColumn tableName=KEYCLOAK_GROUP; addForeignKeyConstraint baseTableName=KEYCLOAK_GROUP, constraintName=FK_GROUP_ORGANIZATION, referencedTableName=ORG; createIndex indexName=IDX_GROUP_ORG_ID, tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	7871835977
26.6.0-44424-index-css-user-session-and-offline	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-05-04 05:17:30.366993	181	EXECUTED	9:a704d8598df241a3fd3cb91b6ab4b2d4	createIndex indexName=IDX_OFFLINE_CSS_BY_USER_SESSION_AND_OFFLINE, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	7871835977
26.6.0-44424-create-realm-in-client-session	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-05-04 05:17:30.378753	182	EXECUTED	9:77dbbc72d943e98cfe472ba8cc56a31c	addColumn tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	7871835977
26.6.0-44424-set-realm-in-client-session	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-05-04 05:17:30.387177	183	EXECUTED	9:3964a3148d32a55ef81126e23cdf6721	customChange		\N	4.33.0	\N	\N	7871835977
26.6.0-44424-idx-css-realm-and-clients	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-05-04 05:17:30.451912	184	EXECUTED	9:a093877fff41185ac24103be80e00968	createIndex indexName=IDX_OFFLINE_CSS_BY_CLIENT_AND_REALM, tableName=OFFLINE_CLIENT_SESSION		\N	4.33.0	\N	\N	7871835977
26.6.0-add-last-modified-timestamp-user	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-05-04 05:17:30.462118	185	EXECUTED	9:8aa583d2cdd9e913dff42fecd626c560	addColumn tableName=USER_ENTITY		\N	4.33.0	\N	\N	7871835977
26.6.0-add-timestamps-group	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-05-04 05:17:30.473574	186	EXECUTED	9:4363d45dc25105a3fc5db9ff6936b0a9	addColumn tableName=KEYCLOAK_GROUP		\N	4.33.0	\N	\N	7871835977
26.6.0-43829-user-created-timestamp-index	keycloak	META-INF/jpa-changelog-26.6.0.xml	2026-05-04 05:17:30.532636	187	EXECUTED	9:f2531a49b8bb21a7a97966d88fd1a411	createIndex indexName=IDX_USER_CREATED_TIMESTAMP, tableName=USER_ENTITY		\N	4.33.0	\N	\N	7871835977
\.


--
-- TOC entry 4233 (class 0 OID 16390)
-- Dependencies: 216
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
1000	f	\N	\N
\.


--
-- TOC entry 4307 (class 0 OID 17782)
-- Dependencies: 290
-- Data for Name: default_client_scope; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.default_client_scope (realm_id, scope_id, default_scope) FROM stdin;
da5e2aa6-73ba-48b9-80fd-c2412ca322de	4046233e-eff6-4e63-92e6-282930052813	f
da5e2aa6-73ba-48b9-80fd-c2412ca322de	f398365e-403c-45c3-a495-f62856e2d100	t
da5e2aa6-73ba-48b9-80fd-c2412ca322de	27cc463d-81b8-4c6a-ac9d-7c7c5584c6a6	t
da5e2aa6-73ba-48b9-80fd-c2412ca322de	d93cc854-4c34-496f-87d7-3ed9902c5424	t
da5e2aa6-73ba-48b9-80fd-c2412ca322de	f4e4f3c8-8e87-4289-a553-4492f087cbe8	t
da5e2aa6-73ba-48b9-80fd-c2412ca322de	4a6666c4-7582-4523-a527-104028a6b855	f
da5e2aa6-73ba-48b9-80fd-c2412ca322de	1cd29fac-2115-4830-85fe-d38af17bd545	f
da5e2aa6-73ba-48b9-80fd-c2412ca322de	c201c1d6-3826-4ba9-9e00-f8c097fb6204	t
da5e2aa6-73ba-48b9-80fd-c2412ca322de	bb1d06dd-b226-4faa-9963-1e4533ff9305	t
da5e2aa6-73ba-48b9-80fd-c2412ca322de	8cff2ae1-7d86-4e5d-a9de-25dc845e1bce	f
da5e2aa6-73ba-48b9-80fd-c2412ca322de	ecdc2db2-1d94-42ef-ba5f-9043474a0015	t
da5e2aa6-73ba-48b9-80fd-c2412ca322de	e0808571-27da-4371-98ce-da0abc13dced	t
da5e2aa6-73ba-48b9-80fd-c2412ca322de	6390dcd2-4351-40f5-95ad-8e89a70a2922	f
c5c44cec-b05c-4195-a581-031a8ca23566	caf932d1-6775-44ff-ae42-63832d1a322b	f
c5c44cec-b05c-4195-a581-031a8ca23566	a16df0ed-f816-4b2c-9283-24b1aa8b14c9	t
c5c44cec-b05c-4195-a581-031a8ca23566	6bd946ee-54dd-4326-83dc-58ac224d4de6	t
c5c44cec-b05c-4195-a581-031a8ca23566	582ba59c-f4da-42c3-9310-ab346794b0e7	t
c5c44cec-b05c-4195-a581-031a8ca23566	7190cb0c-dba4-49de-a61e-023ff60b7987	t
c5c44cec-b05c-4195-a581-031a8ca23566	f1d15268-c3eb-451b-9ef8-ce1aadffecd1	f
c5c44cec-b05c-4195-a581-031a8ca23566	1b225007-6385-432f-a5c2-2b11ca92211a	f
c5c44cec-b05c-4195-a581-031a8ca23566	243bbe7b-872f-4407-8432-52dd9f930780	t
c5c44cec-b05c-4195-a581-031a8ca23566	531ac0a7-3cb7-4526-9f41-ca1019f27007	t
c5c44cec-b05c-4195-a581-031a8ca23566	567a97ea-3d93-4a71-a1bf-64ab60ca43d2	f
c5c44cec-b05c-4195-a581-031a8ca23566	793df6b4-e2c5-4b79-a2fd-32b0aeceb915	t
c5c44cec-b05c-4195-a581-031a8ca23566	119a8746-3a31-4bc7-8591-2bba2111e760	t
c5c44cec-b05c-4195-a581-031a8ca23566	07f3d3ec-baff-45e0-b9e1-32fa8f796330	f
\.


--
-- TOC entry 4237 (class 0 OID 16425)
-- Dependencies: 220
-- Data for Name: event_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_entity (id, client_id, details_json, error, ip_address, realm_id, session_id, event_time, type, user_id, details_json_long_value) FROM stdin;
\.


--
-- TOC entry 4295 (class 0 OID 17480)
-- Dependencies: 278
-- Data for Name: fed_user_attribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fed_user_attribute (id, name, user_id, realm_id, storage_provider_id, value, long_value_hash, long_value_hash_lower_case, long_value) FROM stdin;
\.


--
-- TOC entry 4296 (class 0 OID 17485)
-- Dependencies: 279
-- Data for Name: fed_user_consent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fed_user_consent (id, client_id, user_id, realm_id, storage_provider_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- TOC entry 4309 (class 0 OID 17808)
-- Dependencies: 292
-- Data for Name: fed_user_consent_cl_scope; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fed_user_consent_cl_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- TOC entry 4297 (class 0 OID 17494)
-- Dependencies: 280
-- Data for Name: fed_user_credential; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fed_user_credential (id, salt, type, created_date, user_id, realm_id, storage_provider_id, user_label, secret_data, credential_data, priority) FROM stdin;
\.


--
-- TOC entry 4298 (class 0 OID 17503)
-- Dependencies: 281
-- Data for Name: fed_user_group_membership; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fed_user_group_membership (group_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- TOC entry 4299 (class 0 OID 17506)
-- Dependencies: 282
-- Data for Name: fed_user_required_action; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fed_user_required_action (required_action, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- TOC entry 4300 (class 0 OID 17512)
-- Dependencies: 283
-- Data for Name: fed_user_role_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fed_user_role_mapping (role_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- TOC entry 4257 (class 0 OID 16802)
-- Dependencies: 240
-- Data for Name: federated_identity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.federated_identity (identity_provider, realm_id, federated_user_id, federated_username, token, user_id) FROM stdin;
\.


--
-- TOC entry 4303 (class 0 OID 17577)
-- Dependencies: 286
-- Data for Name: federated_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.federated_user (id, storage_provider_id, realm_id) FROM stdin;
\.


--
-- TOC entry 4279 (class 0 OID 17204)
-- Dependencies: 262
-- Data for Name: group_attribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_attribute (id, name, value, group_id) FROM stdin;
\.


--
-- TOC entry 4278 (class 0 OID 17201)
-- Dependencies: 261
-- Data for Name: group_role_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_role_mapping (role_id, group_id) FROM stdin;
\.


--
-- TOC entry 4258 (class 0 OID 16807)
-- Dependencies: 241
-- Data for Name: identity_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identity_provider (internal_id, enabled, provider_alias, provider_id, store_token, authenticate_by_default, realm_id, add_token_role, trust_email, first_broker_login_flow_id, post_broker_login_flow_id, provider_display_name, link_only, organization_id, hide_on_login) FROM stdin;
\.


--
-- TOC entry 4259 (class 0 OID 16816)
-- Dependencies: 242
-- Data for Name: identity_provider_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identity_provider_config (identity_provider_id, value, name) FROM stdin;
\.


--
-- TOC entry 4263 (class 0 OID 16920)
-- Dependencies: 246
-- Data for Name: identity_provider_mapper; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identity_provider_mapper (id, name, idp_alias, idp_mapper_name, realm_id) FROM stdin;
\.


--
-- TOC entry 4264 (class 0 OID 16925)
-- Dependencies: 247
-- Data for Name: idp_mapper_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.idp_mapper_config (idp_mapper_id, value, name) FROM stdin;
\.


--
-- TOC entry 4318 (class 0 OID 18009)
-- Dependencies: 301
-- Data for Name: jgroups_ping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jgroups_ping (address, name, cluster_name, ip, coord) FROM stdin;
\.


--
-- TOC entry 4277 (class 0 OID 17198)
-- Dependencies: 260
-- Data for Name: keycloak_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.keycloak_group (id, name, parent_group, realm_id, type, description, org_id, created_timestamp, last_modified_timestamp) FROM stdin;
\.


--
-- TOC entry 4238 (class 0 OID 16433)
-- Dependencies: 221
-- Data for Name: keycloak_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.keycloak_role (id, client_realm_constraint, client_role, description, name, realm_id, client, realm) FROM stdin;
2e1ed85f-26f2-4e24-bae6-f5ca1926bff3	da5e2aa6-73ba-48b9-80fd-c2412ca322de	f	${role_default-roles}	default-roles-master	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N	\N
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	da5e2aa6-73ba-48b9-80fd-c2412ca322de	f	${role_admin}	admin	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N	\N
54275ea1-6776-42ca-b72e-c5183bfe2fde	da5e2aa6-73ba-48b9-80fd-c2412ca322de	f	${role_create-realm}	create-realm	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N	\N
96b36dc7-055e-4c9d-8919-3623e7cb1c41	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_create-client}	create-client	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
2aad7fc3-9051-4a25-be66-0c823ca7108e	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_view-realm}	view-realm	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
90dd4d0e-91c8-4ce6-9684-b791df979507	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_view-users}	view-users	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
1349a4f1-80ea-42b0-9d8f-e1f6ec5cbfdd	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_view-clients}	view-clients	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
604663f1-e157-465a-b861-772487cd0d49	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_view-events}	view-events	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
aff80cdb-5a0a-4f63-a848-a5c0743c5216	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_view-identity-providers}	view-identity-providers	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
43972a67-7ae0-42da-9ce8-98f9bc82a03f	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_view-authorization}	view-authorization	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
573e1be5-f765-4ac2-a7e9-df70bcf96f32	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_manage-realm}	manage-realm	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
5acbe2a8-e4a7-4604-a1ca-2789542a4872	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_manage-users}	manage-users	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
143ce819-9963-435b-a765-860e59182374	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_manage-clients}	manage-clients	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
09517eed-7e71-4a86-aa13-2e7268596c8d	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_manage-events}	manage-events	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
76bcc375-0eb8-47e1-837c-5be05e27f217	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_manage-identity-providers}	manage-identity-providers	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
58784dbc-99be-472f-a826-55b2eed9cae6	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_manage-authorization}	manage-authorization	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
97d5cb46-2a4a-4492-bd57-df2d0ff0cc7d	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_query-users}	query-users	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
b834ec63-08a9-475f-804a-ab63cad686b4	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_query-clients}	query-clients	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
027da30d-82e7-43cb-9074-00aa2326d338	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_query-realms}	query-realms	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
35b40f94-f19e-488a-afb2-ed0cf7ed1261	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_query-groups}	query-groups	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
0d4018f8-a994-4c5d-8ec2-82bfbb344c81	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	t	${role_view-profile}	view-profile	da5e2aa6-73ba-48b9-80fd-c2412ca322de	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	\N
25d15c18-0fe8-463b-8edf-5416c1fc97ba	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	t	${role_manage-account}	manage-account	da5e2aa6-73ba-48b9-80fd-c2412ca322de	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	\N
5dad36e8-3394-42fd-a75f-5d99e7400822	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	t	${role_manage-account-links}	manage-account-links	da5e2aa6-73ba-48b9-80fd-c2412ca322de	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	\N
2bd0cf09-71ee-4452-8dd6-942603e59d2b	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	t	${role_view-applications}	view-applications	da5e2aa6-73ba-48b9-80fd-c2412ca322de	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	\N
68543fd0-b978-4096-80c4-a6e6decde47a	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	t	${role_view-consent}	view-consent	da5e2aa6-73ba-48b9-80fd-c2412ca322de	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	\N
b792b62b-aff7-42d4-8dc8-7e8695693421	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	t	${role_manage-consent}	manage-consent	da5e2aa6-73ba-48b9-80fd-c2412ca322de	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	\N
5e9c38bc-6eee-42df-ae67-c68c7d646930	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	t	${role_view-groups}	view-groups	da5e2aa6-73ba-48b9-80fd-c2412ca322de	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	\N
e87b9a30-be03-4a49-889d-d94c43a57214	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	t	${role_delete-account}	delete-account	da5e2aa6-73ba-48b9-80fd-c2412ca322de	bf7df9e3-f340-4d2e-b2fd-b15564e3384c	\N
22756917-1a34-4c21-82b2-926a7addc9d2	ab36e05d-56f6-4da1-a738-97bb3bf76e3e	t	${role_read-token}	read-token	da5e2aa6-73ba-48b9-80fd-c2412ca322de	ab36e05d-56f6-4da1-a738-97bb3bf76e3e	\N
d3be9f4c-0cb7-45a1-ab12-cdd04b6dbdf8	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	t	${role_impersonation}	impersonation	da5e2aa6-73ba-48b9-80fd-c2412ca322de	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	\N
c86c266f-74d0-4c4d-b63a-d3342f2e68b1	da5e2aa6-73ba-48b9-80fd-c2412ca322de	f	${role_offline-access}	offline_access	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N	\N
29b7b3f7-fc9e-45b9-b8fb-cdeaec3df06a	da5e2aa6-73ba-48b9-80fd-c2412ca322de	f	${role_uma_authorization}	uma_authorization	da5e2aa6-73ba-48b9-80fd-c2412ca322de	\N	\N
5192c04b-4489-4127-a88d-75de489ed879	c5c44cec-b05c-4195-a581-031a8ca23566	f	${role_default-roles}	default-roles-super-petmark-3d	c5c44cec-b05c-4195-a581-031a8ca23566	\N	\N
290a33bd-0a3b-4429-98d5-e95d741b24f0	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_create-client}	create-client	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
394c70d6-f64a-4bd4-a053-138b26c2691d	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_view-realm}	view-realm	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
9cba63b0-ce11-4cd6-9495-c7dd79cffc06	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_view-users}	view-users	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
c9653b3d-6abf-43d9-bf6a-919fd138a63b	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_view-clients}	view-clients	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
01699d6f-f0dc-4eca-93c5-0f7daca2ccc5	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_view-events}	view-events	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
b65ff361-fd1d-4663-a40d-b776aa9b886b	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_view-identity-providers}	view-identity-providers	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
75d53b4d-8524-4e41-a9bf-2b69564c4f79	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_view-authorization}	view-authorization	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
1ad075d2-7b7a-4f05-9893-93ed0037c656	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_manage-realm}	manage-realm	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
f3fcffe5-4484-458e-b36f-8703569ec317	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_manage-users}	manage-users	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
bc182441-ba7a-42bb-8c1e-2052284d7782	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_manage-clients}	manage-clients	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
66a17f52-e776-494c-a072-8bfedce9f725	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_manage-events}	manage-events	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
be70c66a-fb27-48c3-963d-823000426d04	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_manage-identity-providers}	manage-identity-providers	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
33945856-2b6f-41b9-a0b7-3fa14f672243	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_manage-authorization}	manage-authorization	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
c1879089-c813-4dc3-a002-19592a9b2d5c	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_query-users}	query-users	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
067cbd94-62c7-46a6-986d-a86e17516432	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_query-clients}	query-clients	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
8fda5448-db1a-418a-acfc-9290a3ccc8e6	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_query-realms}	query-realms	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
dc064d81-7ede-4212-b2a4-bdd0605eb9ff	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_query-groups}	query-groups	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
a23226c5-0686-49a1-a8e0-2dd2c3df50d4	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_realm-admin}	realm-admin	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
70f51427-afa4-4c10-8f2f-f339de8acbfd	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_create-client}	create-client	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
1d1e6152-dd66-4efc-936a-ed411e13ae99	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_view-realm}	view-realm	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
3299b8b8-ad65-4f15-9e71-e631057ba996	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_view-users}	view-users	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
d1b6b8bf-4ce4-4bb2-ae39-d1734b48f3f1	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_view-clients}	view-clients	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
7256f0bd-c5bd-4d37-bda6-7a39d2bab510	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_view-events}	view-events	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
85b39da3-db65-4c8c-bd1b-8f633983dea0	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_view-identity-providers}	view-identity-providers	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
b893a4b2-69b2-445c-84a6-859973788c01	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_view-authorization}	view-authorization	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
25659e2e-1230-457f-acfa-088f59b36c40	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_manage-realm}	manage-realm	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
9078c7cc-cfcf-4606-ba7c-a444d3bbedaa	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_manage-users}	manage-users	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
d1c19248-0492-4219-ad51-6188db0c3f91	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_manage-clients}	manage-clients	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
3c246ad9-990f-431f-9b51-bf006937fade	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_manage-events}	manage-events	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
a6913b1e-33dd-4203-972a-286eb319181d	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_manage-identity-providers}	manage-identity-providers	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
2701ab37-af32-47a1-ac45-1599798c0dc3	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_manage-authorization}	manage-authorization	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
4a6d2d7c-9bd7-4e2d-b517-2866947527e6	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_query-users}	query-users	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
77513b20-42ef-4ba6-a725-33a73b169079	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_query-clients}	query-clients	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
b8f85547-8d42-42ef-bcae-0b7176c8e3af	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_query-realms}	query-realms	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
58f94dab-0c38-4377-8272-3604a34c03d7	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_query-groups}	query-groups	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
db20bac1-5600-444e-8cc2-ff081d099dc7	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	t	${role_view-profile}	view-profile	c5c44cec-b05c-4195-a581-031a8ca23566	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	\N
0e556e7c-b1eb-4df9-a40c-24d05655d4c7	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	t	${role_manage-account}	manage-account	c5c44cec-b05c-4195-a581-031a8ca23566	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	\N
3129b335-490c-43f9-ab2c-fb4deac99049	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	t	${role_manage-account-links}	manage-account-links	c5c44cec-b05c-4195-a581-031a8ca23566	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	\N
423cc06c-c1f9-4c5d-97f5-0f1f683ce775	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	t	${role_view-applications}	view-applications	c5c44cec-b05c-4195-a581-031a8ca23566	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	\N
6b759ab4-0be4-43df-b791-8072c55dcf3e	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	t	${role_view-consent}	view-consent	c5c44cec-b05c-4195-a581-031a8ca23566	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	\N
13bb9214-df19-44b6-911e-6b1593876e05	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	t	${role_manage-consent}	manage-consent	c5c44cec-b05c-4195-a581-031a8ca23566	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	\N
092875df-42af-48f7-894c-e19e474f806b	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	t	${role_view-groups}	view-groups	c5c44cec-b05c-4195-a581-031a8ca23566	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	\N
8c132460-b64b-4253-90cb-7131ada5267f	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	t	${role_delete-account}	delete-account	c5c44cec-b05c-4195-a581-031a8ca23566	12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	\N
e74eddd2-922a-480d-b521-723a25f0d74f	230caeea-39c0-421d-9a97-199f93a4cb5f	t	${role_impersonation}	impersonation	da5e2aa6-73ba-48b9-80fd-c2412ca322de	230caeea-39c0-421d-9a97-199f93a4cb5f	\N
e716cd09-e542-4a8f-9b3e-365e152133b8	8491a817-beba-4ee6-aa5d-c42000848741	t	${role_impersonation}	impersonation	c5c44cec-b05c-4195-a581-031a8ca23566	8491a817-beba-4ee6-aa5d-c42000848741	\N
9a66fba8-9eac-47fa-9803-07ada878786d	43f2658c-9f30-43f2-bde2-b43ac0ff62ae	t	${role_read-token}	read-token	c5c44cec-b05c-4195-a581-031a8ca23566	43f2658c-9f30-43f2-bde2-b43ac0ff62ae	\N
932a68ec-1371-47b7-998c-0874032872fb	c5c44cec-b05c-4195-a581-031a8ca23566	f	${role_offline-access}	offline_access	c5c44cec-b05c-4195-a581-031a8ca23566	\N	\N
2c6c9d7a-a94b-4a55-8c63-71e747c8116c	c5c44cec-b05c-4195-a581-031a8ca23566	f	${role_uma_authorization}	uma_authorization	c5c44cec-b05c-4195-a581-031a8ca23566	\N	\N
03d794c9-adce-4237-b597-b6519c74f89b	6f967252-9033-4cc5-af78-021f02ea431a	t	\N	uma_protection	c5c44cec-b05c-4195-a581-031a8ca23566	6f967252-9033-4cc5-af78-021f02ea431a	\N
8bc3b755-5c20-479a-b64b-7408df0620c7	c5c44cec-b05c-4195-a581-031a8ca23566	f		USER	c5c44cec-b05c-4195-a581-031a8ca23566	\N	\N
0aaa199d-6fda-4ad9-b836-2953071a70d2	c5c44cec-b05c-4195-a581-031a8ca23566	f		ADMIN	c5c44cec-b05c-4195-a581-031a8ca23566	\N	\N
\.


--
-- TOC entry 4262 (class 0 OID 16917)
-- Dependencies: 245
-- Data for Name: migration_model; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migration_model (id, version, update_time) FROM stdin;
t35ek	26.6.1	1777871854
\.


--
-- TOC entry 4276 (class 0 OID 17189)
-- Dependencies: 259
-- Data for Name: offline_client_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offline_client_session (user_session_id, client_id, offline_flag, "timestamp", data, client_storage_provider, external_client_id, version, realm_id) FROM stdin;
\.


--
-- TOC entry 4275 (class 0 OID 17184)
-- Dependencies: 258
-- Data for Name: offline_user_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offline_user_session (user_session_id, user_id, realm_id, created_on, offline_flag, data, last_session_refresh, broker_session_id, version, remember_me) FROM stdin;
\.


--
-- TOC entry 4315 (class 0 OID 17972)
-- Dependencies: 298
-- Data for Name: org; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.org (id, enabled, realm_id, group_id, name, description, alias, redirect_url) FROM stdin;
\.


--
-- TOC entry 4316 (class 0 OID 17983)
-- Dependencies: 299
-- Data for Name: org_domain; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.org_domain (id, name, verified, org_id) FROM stdin;
\.


--
-- TOC entry 4321 (class 0 OID 18048)
-- Dependencies: 304
-- Data for Name: org_invitation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.org_invitation (id, organization_id, email, first_name, last_name, created_at, expires_at, invite_link) FROM stdin;
\.


--
-- TOC entry 4289 (class 0 OID 17403)
-- Dependencies: 272
-- Data for Name: policy_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.policy_config (policy_id, name, value) FROM stdin;
\.


--
-- TOC entry 4255 (class 0 OID 16791)
-- Dependencies: 238
-- Data for Name: protocol_mapper; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.protocol_mapper (id, name, protocol, protocol_mapper_name, client_id, client_scope_id) FROM stdin;
4f6f3ff9-ceae-4764-8e3c-d604624a5e1f	audience resolve	openid-connect	oidc-audience-resolve-mapper	d925ebe4-1e14-465b-bbb5-d397a2d035d0	\N
7f5ea92c-594e-4842-8442-d169befcc09b	locale	openid-connect	oidc-usermodel-attribute-mapper	77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	\N
5479b98b-c04e-445e-a2c7-30e28eea4bee	role list	saml	saml-role-list-mapper	\N	f398365e-403c-45c3-a495-f62856e2d100
f25546ce-a0f9-4be2-8a94-970a5cf301d8	organization	saml	saml-organization-membership-mapper	\N	27cc463d-81b8-4c6a-ac9d-7c7c5584c6a6
13b9d5e0-660f-4af7-82b7-c5de1cecc2e9	full name	openid-connect	oidc-full-name-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
190ceb66-002b-4aeb-b09f-3fa494724719	family name	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
01a55051-a746-432f-9a2a-d90c1ff55c50	given name	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
c1c9413c-df6a-4733-bfd1-da8eac542741	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
640d530b-ec64-43d5-aefa-a6dcc0c9e211	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
73575947-511e-4de5-8170-647b29e19d47	username	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
772ca536-1773-465c-bb31-d51ff26001fd	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
0c978458-78f4-431a-8a73-05447e7820fb	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
04472543-1503-417e-bdaf-47d33ec5db86	website	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
45d2003d-3802-45a9-bb36-7f0eaf93cc35	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
72638eab-076d-4133-b652-c67502bb53c1	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
8fa6729f-d91a-42a9-b459-8f339c4ea4d6	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
d5639025-4a67-4688-a10e-f089b13ba7e5	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
79cedda4-8a9b-4a7d-bc2b-06de7eb99d58	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	d93cc854-4c34-496f-87d7-3ed9902c5424
27926d02-ff21-4b87-b61b-ae557e93e075	email	openid-connect	oidc-usermodel-attribute-mapper	\N	f4e4f3c8-8e87-4289-a553-4492f087cbe8
1d027eaf-b0c9-4dd5-81da-b624891e5da7	email verified	openid-connect	oidc-usermodel-property-mapper	\N	f4e4f3c8-8e87-4289-a553-4492f087cbe8
e7c1e155-ad29-43b9-8662-d0c785bce29f	address	openid-connect	oidc-address-mapper	\N	4a6666c4-7582-4523-a527-104028a6b855
3179d96b-f529-417f-b785-d62de554c0f5	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	1cd29fac-2115-4830-85fe-d38af17bd545
61615769-b36c-4cf9-94c4-971dc97d0d18	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	1cd29fac-2115-4830-85fe-d38af17bd545
fc48d79c-83b3-413e-a857-5a95724960b6	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	c201c1d6-3826-4ba9-9e00-f8c097fb6204
f40e97b2-88ea-4127-9f07-9d91dc260b40	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	c201c1d6-3826-4ba9-9e00-f8c097fb6204
399c7d06-e1e5-4990-beef-0e0c25544cd9	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	c201c1d6-3826-4ba9-9e00-f8c097fb6204
5e19957b-ffb5-49d6-96a9-4252f8624973	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	bb1d06dd-b226-4faa-9963-1e4533ff9305
8d279f05-21b2-4471-9bd2-0a1fcd08c521	upn	openid-connect	oidc-usermodel-attribute-mapper	\N	8cff2ae1-7d86-4e5d-a9de-25dc845e1bce
bbb84bc4-d4bd-455c-b373-7a6c41879abd	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	8cff2ae1-7d86-4e5d-a9de-25dc845e1bce
247595f4-908e-4339-a64d-f4378edb0fe1	acr loa level	openid-connect	oidc-acr-mapper	\N	ecdc2db2-1d94-42ef-ba5f-9043474a0015
2873ea4a-d265-4dc6-a454-65daa46074f6	auth_time	openid-connect	oidc-usersessionmodel-note-mapper	\N	e0808571-27da-4371-98ce-da0abc13dced
9846df88-fec5-4c73-ad23-f3017e1b0ceb	sub	openid-connect	oidc-sub-mapper	\N	e0808571-27da-4371-98ce-da0abc13dced
f3a5ee88-858a-4196-b6e9-afc4a4f6f48f	Client ID	openid-connect	oidc-usersessionmodel-note-mapper	\N	226df3d2-0bbf-46a6-9b4d-b56b71bf50f5
cef8409d-6756-49fa-8012-79c6542f0431	Client Host	openid-connect	oidc-usersessionmodel-note-mapper	\N	226df3d2-0bbf-46a6-9b4d-b56b71bf50f5
4072f9de-395d-4cb4-8ab3-5114c22d47f5	Client IP Address	openid-connect	oidc-usersessionmodel-note-mapper	\N	226df3d2-0bbf-46a6-9b4d-b56b71bf50f5
46afa422-cfd5-4b38-b4a4-4d0534c1858c	organization	openid-connect	oidc-organization-membership-mapper	\N	6390dcd2-4351-40f5-95ad-8e89a70a2922
0d7cf803-ceee-4ae7-bb7c-bbf98d25c45d	audience resolve	openid-connect	oidc-audience-resolve-mapper	6994b3c5-b0ab-4cfa-a135-c25a54041c62	\N
6d586fe0-2bf7-4039-ac45-7d2790ed0a8c	role list	saml	saml-role-list-mapper	\N	a16df0ed-f816-4b2c-9283-24b1aa8b14c9
c4bae2dd-b037-421a-bcb5-a8c86014fcc2	organization	saml	saml-organization-membership-mapper	\N	6bd946ee-54dd-4326-83dc-58ac224d4de6
d74f64a6-9ec6-4644-abbd-3a26e6708408	full name	openid-connect	oidc-full-name-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
71d82aea-2f04-4afa-97b0-281c4ddafa1b	family name	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
a39210c7-aac6-45eb-9d8e-f5ab3309feae	given name	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
125bf87b-be06-4d3e-8456-79b27705ebbc	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
140f8999-5b6c-462d-a666-02501f5926da	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
f556cc47-50fa-4d56-868f-6b8adeb3334e	username	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
1e212756-b5ff-4ce0-a62f-d983d16644ea	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
c0c27193-6d93-4ef0-ab34-3237d9a31053	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
8b20943e-2c0f-415f-8f01-6448c5a51cc4	website	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
7d93d575-d271-4fe2-bdfb-a5a53a068fea	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
44eac84d-12ab-43bf-abec-ccdf8e6a96f0	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
93548cfe-441d-49fb-8f8a-ed6cee69fda3	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
9fcf97fb-ad55-43ef-81df-34feb22a2e8c	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
56790018-920b-4070-8d8f-8bf199d3adc6	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	582ba59c-f4da-42c3-9310-ab346794b0e7
5176fce0-f9a0-4172-885c-d4a562783a95	email	openid-connect	oidc-usermodel-attribute-mapper	\N	7190cb0c-dba4-49de-a61e-023ff60b7987
51ec289a-4d07-4348-ae4c-5bc362d88fb6	email verified	openid-connect	oidc-usermodel-property-mapper	\N	7190cb0c-dba4-49de-a61e-023ff60b7987
4e9f3b5f-891f-4935-aeb6-4365a9aa93d9	address	openid-connect	oidc-address-mapper	\N	f1d15268-c3eb-451b-9ef8-ce1aadffecd1
4e8e6ce3-b59c-4764-9947-bef85760c766	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	1b225007-6385-432f-a5c2-2b11ca92211a
8ccd0331-a031-4b78-9017-5366d624ac17	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	1b225007-6385-432f-a5c2-2b11ca92211a
203861fb-2ad4-41f3-92dc-4937b004e443	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	243bbe7b-872f-4407-8432-52dd9f930780
5fae0b0c-e7ce-406a-aa2e-9c9156bf8cd3	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	243bbe7b-872f-4407-8432-52dd9f930780
7929e356-0ba3-4765-a4d4-655c2ef7519d	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	243bbe7b-872f-4407-8432-52dd9f930780
e9733f7e-9a04-4b20-be3a-fe57c7a6f93c	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	531ac0a7-3cb7-4526-9f41-ca1019f27007
8a4d5c52-11ef-41cb-8280-3b9246a620d3	upn	openid-connect	oidc-usermodel-attribute-mapper	\N	567a97ea-3d93-4a71-a1bf-64ab60ca43d2
2f933717-c733-4ce9-87d4-cf13d93aac8a	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	567a97ea-3d93-4a71-a1bf-64ab60ca43d2
98fe3939-5515-4721-ba61-59c262b69756	acr loa level	openid-connect	oidc-acr-mapper	\N	793df6b4-e2c5-4b79-a2fd-32b0aeceb915
84a00b34-e54d-4d21-9284-a1c48a344e12	auth_time	openid-connect	oidc-usersessionmodel-note-mapper	\N	119a8746-3a31-4bc7-8591-2bba2111e760
bc8cd863-100b-4267-ba15-8c430f91cd87	sub	openid-connect	oidc-sub-mapper	\N	119a8746-3a31-4bc7-8591-2bba2111e760
f8a069f9-eacc-4f99-bd1d-a0297c8d66b6	Client ID	openid-connect	oidc-usersessionmodel-note-mapper	\N	13b13409-71a1-418e-898d-ed1a5fbcb532
12e11fe0-357b-4df1-8618-0934fa2e8562	Client Host	openid-connect	oidc-usersessionmodel-note-mapper	\N	13b13409-71a1-418e-898d-ed1a5fbcb532
b977dd97-cfef-449e-b6af-b14616dbb0ac	Client IP Address	openid-connect	oidc-usersessionmodel-note-mapper	\N	13b13409-71a1-418e-898d-ed1a5fbcb532
746cbaec-9731-4e3f-a3ba-4f4dced31c64	organization	openid-connect	oidc-organization-membership-mapper	\N	07f3d3ec-baff-45e0-b9e1-32fa8f796330
dd148887-8c5b-416a-96ab-53959883f65f	locale	openid-connect	oidc-usermodel-attribute-mapper	da8cf327-ae8c-454b-9f89-5f0d53abbf27	\N
\.


--
-- TOC entry 4256 (class 0 OID 16797)
-- Dependencies: 239
-- Data for Name: protocol_mapper_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.protocol_mapper_config (protocol_mapper_id, value, name) FROM stdin;
7f5ea92c-594e-4842-8442-d169befcc09b	true	introspection.token.claim
7f5ea92c-594e-4842-8442-d169befcc09b	true	userinfo.token.claim
7f5ea92c-594e-4842-8442-d169befcc09b	locale	user.attribute
7f5ea92c-594e-4842-8442-d169befcc09b	true	id.token.claim
7f5ea92c-594e-4842-8442-d169befcc09b	true	access.token.claim
7f5ea92c-594e-4842-8442-d169befcc09b	locale	claim.name
7f5ea92c-594e-4842-8442-d169befcc09b	String	jsonType.label
5479b98b-c04e-445e-a2c7-30e28eea4bee	false	single
5479b98b-c04e-445e-a2c7-30e28eea4bee	Basic	attribute.nameformat
5479b98b-c04e-445e-a2c7-30e28eea4bee	Role	attribute.name
01a55051-a746-432f-9a2a-d90c1ff55c50	true	introspection.token.claim
01a55051-a746-432f-9a2a-d90c1ff55c50	true	userinfo.token.claim
01a55051-a746-432f-9a2a-d90c1ff55c50	firstName	user.attribute
01a55051-a746-432f-9a2a-d90c1ff55c50	true	id.token.claim
01a55051-a746-432f-9a2a-d90c1ff55c50	true	access.token.claim
01a55051-a746-432f-9a2a-d90c1ff55c50	given_name	claim.name
01a55051-a746-432f-9a2a-d90c1ff55c50	String	jsonType.label
04472543-1503-417e-bdaf-47d33ec5db86	true	introspection.token.claim
04472543-1503-417e-bdaf-47d33ec5db86	true	userinfo.token.claim
04472543-1503-417e-bdaf-47d33ec5db86	website	user.attribute
04472543-1503-417e-bdaf-47d33ec5db86	true	id.token.claim
04472543-1503-417e-bdaf-47d33ec5db86	true	access.token.claim
04472543-1503-417e-bdaf-47d33ec5db86	website	claim.name
04472543-1503-417e-bdaf-47d33ec5db86	String	jsonType.label
0c978458-78f4-431a-8a73-05447e7820fb	true	introspection.token.claim
0c978458-78f4-431a-8a73-05447e7820fb	true	userinfo.token.claim
0c978458-78f4-431a-8a73-05447e7820fb	picture	user.attribute
0c978458-78f4-431a-8a73-05447e7820fb	true	id.token.claim
0c978458-78f4-431a-8a73-05447e7820fb	true	access.token.claim
0c978458-78f4-431a-8a73-05447e7820fb	picture	claim.name
0c978458-78f4-431a-8a73-05447e7820fb	String	jsonType.label
13b9d5e0-660f-4af7-82b7-c5de1cecc2e9	true	introspection.token.claim
13b9d5e0-660f-4af7-82b7-c5de1cecc2e9	true	userinfo.token.claim
13b9d5e0-660f-4af7-82b7-c5de1cecc2e9	true	id.token.claim
13b9d5e0-660f-4af7-82b7-c5de1cecc2e9	true	access.token.claim
190ceb66-002b-4aeb-b09f-3fa494724719	true	introspection.token.claim
190ceb66-002b-4aeb-b09f-3fa494724719	true	userinfo.token.claim
190ceb66-002b-4aeb-b09f-3fa494724719	lastName	user.attribute
190ceb66-002b-4aeb-b09f-3fa494724719	true	id.token.claim
190ceb66-002b-4aeb-b09f-3fa494724719	true	access.token.claim
190ceb66-002b-4aeb-b09f-3fa494724719	family_name	claim.name
190ceb66-002b-4aeb-b09f-3fa494724719	String	jsonType.label
45d2003d-3802-45a9-bb36-7f0eaf93cc35	true	introspection.token.claim
45d2003d-3802-45a9-bb36-7f0eaf93cc35	true	userinfo.token.claim
45d2003d-3802-45a9-bb36-7f0eaf93cc35	gender	user.attribute
45d2003d-3802-45a9-bb36-7f0eaf93cc35	true	id.token.claim
45d2003d-3802-45a9-bb36-7f0eaf93cc35	true	access.token.claim
45d2003d-3802-45a9-bb36-7f0eaf93cc35	gender	claim.name
45d2003d-3802-45a9-bb36-7f0eaf93cc35	String	jsonType.label
640d530b-ec64-43d5-aefa-a6dcc0c9e211	true	introspection.token.claim
640d530b-ec64-43d5-aefa-a6dcc0c9e211	true	userinfo.token.claim
640d530b-ec64-43d5-aefa-a6dcc0c9e211	nickname	user.attribute
640d530b-ec64-43d5-aefa-a6dcc0c9e211	true	id.token.claim
640d530b-ec64-43d5-aefa-a6dcc0c9e211	true	access.token.claim
640d530b-ec64-43d5-aefa-a6dcc0c9e211	nickname	claim.name
640d530b-ec64-43d5-aefa-a6dcc0c9e211	String	jsonType.label
72638eab-076d-4133-b652-c67502bb53c1	true	introspection.token.claim
72638eab-076d-4133-b652-c67502bb53c1	true	userinfo.token.claim
72638eab-076d-4133-b652-c67502bb53c1	birthdate	user.attribute
72638eab-076d-4133-b652-c67502bb53c1	true	id.token.claim
72638eab-076d-4133-b652-c67502bb53c1	true	access.token.claim
72638eab-076d-4133-b652-c67502bb53c1	birthdate	claim.name
72638eab-076d-4133-b652-c67502bb53c1	String	jsonType.label
73575947-511e-4de5-8170-647b29e19d47	true	introspection.token.claim
73575947-511e-4de5-8170-647b29e19d47	true	userinfo.token.claim
73575947-511e-4de5-8170-647b29e19d47	username	user.attribute
73575947-511e-4de5-8170-647b29e19d47	true	id.token.claim
73575947-511e-4de5-8170-647b29e19d47	true	access.token.claim
73575947-511e-4de5-8170-647b29e19d47	preferred_username	claim.name
73575947-511e-4de5-8170-647b29e19d47	String	jsonType.label
772ca536-1773-465c-bb31-d51ff26001fd	true	introspection.token.claim
772ca536-1773-465c-bb31-d51ff26001fd	true	userinfo.token.claim
772ca536-1773-465c-bb31-d51ff26001fd	profile	user.attribute
772ca536-1773-465c-bb31-d51ff26001fd	true	id.token.claim
772ca536-1773-465c-bb31-d51ff26001fd	true	access.token.claim
772ca536-1773-465c-bb31-d51ff26001fd	profile	claim.name
772ca536-1773-465c-bb31-d51ff26001fd	String	jsonType.label
79cedda4-8a9b-4a7d-bc2b-06de7eb99d58	true	introspection.token.claim
79cedda4-8a9b-4a7d-bc2b-06de7eb99d58	true	userinfo.token.claim
79cedda4-8a9b-4a7d-bc2b-06de7eb99d58	updatedAt	user.attribute
79cedda4-8a9b-4a7d-bc2b-06de7eb99d58	true	id.token.claim
79cedda4-8a9b-4a7d-bc2b-06de7eb99d58	true	access.token.claim
79cedda4-8a9b-4a7d-bc2b-06de7eb99d58	updated_at	claim.name
79cedda4-8a9b-4a7d-bc2b-06de7eb99d58	long	jsonType.label
8fa6729f-d91a-42a9-b459-8f339c4ea4d6	true	introspection.token.claim
8fa6729f-d91a-42a9-b459-8f339c4ea4d6	true	userinfo.token.claim
8fa6729f-d91a-42a9-b459-8f339c4ea4d6	zoneinfo	user.attribute
8fa6729f-d91a-42a9-b459-8f339c4ea4d6	true	id.token.claim
8fa6729f-d91a-42a9-b459-8f339c4ea4d6	true	access.token.claim
8fa6729f-d91a-42a9-b459-8f339c4ea4d6	zoneinfo	claim.name
8fa6729f-d91a-42a9-b459-8f339c4ea4d6	String	jsonType.label
c1c9413c-df6a-4733-bfd1-da8eac542741	true	introspection.token.claim
c1c9413c-df6a-4733-bfd1-da8eac542741	true	userinfo.token.claim
c1c9413c-df6a-4733-bfd1-da8eac542741	middleName	user.attribute
c1c9413c-df6a-4733-bfd1-da8eac542741	true	id.token.claim
c1c9413c-df6a-4733-bfd1-da8eac542741	true	access.token.claim
c1c9413c-df6a-4733-bfd1-da8eac542741	middle_name	claim.name
c1c9413c-df6a-4733-bfd1-da8eac542741	String	jsonType.label
d5639025-4a67-4688-a10e-f089b13ba7e5	true	introspection.token.claim
d5639025-4a67-4688-a10e-f089b13ba7e5	true	userinfo.token.claim
d5639025-4a67-4688-a10e-f089b13ba7e5	locale	user.attribute
d5639025-4a67-4688-a10e-f089b13ba7e5	true	id.token.claim
d5639025-4a67-4688-a10e-f089b13ba7e5	true	access.token.claim
d5639025-4a67-4688-a10e-f089b13ba7e5	locale	claim.name
d5639025-4a67-4688-a10e-f089b13ba7e5	String	jsonType.label
1d027eaf-b0c9-4dd5-81da-b624891e5da7	true	introspection.token.claim
1d027eaf-b0c9-4dd5-81da-b624891e5da7	true	userinfo.token.claim
1d027eaf-b0c9-4dd5-81da-b624891e5da7	emailVerified	user.attribute
1d027eaf-b0c9-4dd5-81da-b624891e5da7	true	id.token.claim
1d027eaf-b0c9-4dd5-81da-b624891e5da7	true	access.token.claim
1d027eaf-b0c9-4dd5-81da-b624891e5da7	email_verified	claim.name
1d027eaf-b0c9-4dd5-81da-b624891e5da7	boolean	jsonType.label
27926d02-ff21-4b87-b61b-ae557e93e075	true	introspection.token.claim
27926d02-ff21-4b87-b61b-ae557e93e075	true	userinfo.token.claim
27926d02-ff21-4b87-b61b-ae557e93e075	email	user.attribute
27926d02-ff21-4b87-b61b-ae557e93e075	true	id.token.claim
27926d02-ff21-4b87-b61b-ae557e93e075	true	access.token.claim
27926d02-ff21-4b87-b61b-ae557e93e075	email	claim.name
27926d02-ff21-4b87-b61b-ae557e93e075	String	jsonType.label
e7c1e155-ad29-43b9-8662-d0c785bce29f	formatted	user.attribute.formatted
e7c1e155-ad29-43b9-8662-d0c785bce29f	country	user.attribute.country
e7c1e155-ad29-43b9-8662-d0c785bce29f	true	introspection.token.claim
e7c1e155-ad29-43b9-8662-d0c785bce29f	postal_code	user.attribute.postal_code
e7c1e155-ad29-43b9-8662-d0c785bce29f	true	userinfo.token.claim
e7c1e155-ad29-43b9-8662-d0c785bce29f	street	user.attribute.street
e7c1e155-ad29-43b9-8662-d0c785bce29f	true	id.token.claim
e7c1e155-ad29-43b9-8662-d0c785bce29f	region	user.attribute.region
e7c1e155-ad29-43b9-8662-d0c785bce29f	true	access.token.claim
e7c1e155-ad29-43b9-8662-d0c785bce29f	locality	user.attribute.locality
3179d96b-f529-417f-b785-d62de554c0f5	true	introspection.token.claim
3179d96b-f529-417f-b785-d62de554c0f5	true	userinfo.token.claim
3179d96b-f529-417f-b785-d62de554c0f5	phoneNumber	user.attribute
3179d96b-f529-417f-b785-d62de554c0f5	true	id.token.claim
3179d96b-f529-417f-b785-d62de554c0f5	true	access.token.claim
3179d96b-f529-417f-b785-d62de554c0f5	phone_number	claim.name
3179d96b-f529-417f-b785-d62de554c0f5	String	jsonType.label
61615769-b36c-4cf9-94c4-971dc97d0d18	true	introspection.token.claim
61615769-b36c-4cf9-94c4-971dc97d0d18	true	userinfo.token.claim
61615769-b36c-4cf9-94c4-971dc97d0d18	phoneNumberVerified	user.attribute
61615769-b36c-4cf9-94c4-971dc97d0d18	true	id.token.claim
61615769-b36c-4cf9-94c4-971dc97d0d18	true	access.token.claim
61615769-b36c-4cf9-94c4-971dc97d0d18	phone_number_verified	claim.name
61615769-b36c-4cf9-94c4-971dc97d0d18	boolean	jsonType.label
399c7d06-e1e5-4990-beef-0e0c25544cd9	true	introspection.token.claim
399c7d06-e1e5-4990-beef-0e0c25544cd9	true	access.token.claim
f40e97b2-88ea-4127-9f07-9d91dc260b40	true	introspection.token.claim
f40e97b2-88ea-4127-9f07-9d91dc260b40	true	multivalued
f40e97b2-88ea-4127-9f07-9d91dc260b40	foo	user.attribute
f40e97b2-88ea-4127-9f07-9d91dc260b40	true	access.token.claim
f40e97b2-88ea-4127-9f07-9d91dc260b40	resource_access.${client_id}.roles	claim.name
f40e97b2-88ea-4127-9f07-9d91dc260b40	String	jsonType.label
fc48d79c-83b3-413e-a857-5a95724960b6	true	introspection.token.claim
fc48d79c-83b3-413e-a857-5a95724960b6	true	multivalued
fc48d79c-83b3-413e-a857-5a95724960b6	foo	user.attribute
fc48d79c-83b3-413e-a857-5a95724960b6	true	access.token.claim
fc48d79c-83b3-413e-a857-5a95724960b6	realm_access.roles	claim.name
fc48d79c-83b3-413e-a857-5a95724960b6	String	jsonType.label
5e19957b-ffb5-49d6-96a9-4252f8624973	true	introspection.token.claim
5e19957b-ffb5-49d6-96a9-4252f8624973	true	access.token.claim
8d279f05-21b2-4471-9bd2-0a1fcd08c521	true	introspection.token.claim
8d279f05-21b2-4471-9bd2-0a1fcd08c521	true	userinfo.token.claim
8d279f05-21b2-4471-9bd2-0a1fcd08c521	username	user.attribute
8d279f05-21b2-4471-9bd2-0a1fcd08c521	true	id.token.claim
8d279f05-21b2-4471-9bd2-0a1fcd08c521	true	access.token.claim
8d279f05-21b2-4471-9bd2-0a1fcd08c521	upn	claim.name
8d279f05-21b2-4471-9bd2-0a1fcd08c521	String	jsonType.label
bbb84bc4-d4bd-455c-b373-7a6c41879abd	true	introspection.token.claim
bbb84bc4-d4bd-455c-b373-7a6c41879abd	true	multivalued
bbb84bc4-d4bd-455c-b373-7a6c41879abd	foo	user.attribute
bbb84bc4-d4bd-455c-b373-7a6c41879abd	true	id.token.claim
bbb84bc4-d4bd-455c-b373-7a6c41879abd	true	access.token.claim
bbb84bc4-d4bd-455c-b373-7a6c41879abd	groups	claim.name
bbb84bc4-d4bd-455c-b373-7a6c41879abd	String	jsonType.label
247595f4-908e-4339-a64d-f4378edb0fe1	true	introspection.token.claim
247595f4-908e-4339-a64d-f4378edb0fe1	true	id.token.claim
247595f4-908e-4339-a64d-f4378edb0fe1	true	access.token.claim
2873ea4a-d265-4dc6-a454-65daa46074f6	AUTH_TIME	user.session.note
2873ea4a-d265-4dc6-a454-65daa46074f6	true	introspection.token.claim
2873ea4a-d265-4dc6-a454-65daa46074f6	true	id.token.claim
2873ea4a-d265-4dc6-a454-65daa46074f6	true	access.token.claim
2873ea4a-d265-4dc6-a454-65daa46074f6	auth_time	claim.name
2873ea4a-d265-4dc6-a454-65daa46074f6	long	jsonType.label
9846df88-fec5-4c73-ad23-f3017e1b0ceb	true	introspection.token.claim
9846df88-fec5-4c73-ad23-f3017e1b0ceb	true	access.token.claim
4072f9de-395d-4cb4-8ab3-5114c22d47f5	clientAddress	user.session.note
4072f9de-395d-4cb4-8ab3-5114c22d47f5	true	introspection.token.claim
4072f9de-395d-4cb4-8ab3-5114c22d47f5	true	id.token.claim
4072f9de-395d-4cb4-8ab3-5114c22d47f5	true	access.token.claim
4072f9de-395d-4cb4-8ab3-5114c22d47f5	clientAddress	claim.name
4072f9de-395d-4cb4-8ab3-5114c22d47f5	String	jsonType.label
cef8409d-6756-49fa-8012-79c6542f0431	clientHost	user.session.note
cef8409d-6756-49fa-8012-79c6542f0431	true	introspection.token.claim
cef8409d-6756-49fa-8012-79c6542f0431	true	id.token.claim
cef8409d-6756-49fa-8012-79c6542f0431	true	access.token.claim
cef8409d-6756-49fa-8012-79c6542f0431	clientHost	claim.name
cef8409d-6756-49fa-8012-79c6542f0431	String	jsonType.label
f3a5ee88-858a-4196-b6e9-afc4a4f6f48f	client_id	user.session.note
f3a5ee88-858a-4196-b6e9-afc4a4f6f48f	true	introspection.token.claim
f3a5ee88-858a-4196-b6e9-afc4a4f6f48f	true	id.token.claim
f3a5ee88-858a-4196-b6e9-afc4a4f6f48f	true	access.token.claim
f3a5ee88-858a-4196-b6e9-afc4a4f6f48f	client_id	claim.name
f3a5ee88-858a-4196-b6e9-afc4a4f6f48f	String	jsonType.label
46afa422-cfd5-4b38-b4a4-4d0534c1858c	true	introspection.token.claim
46afa422-cfd5-4b38-b4a4-4d0534c1858c	true	multivalued
46afa422-cfd5-4b38-b4a4-4d0534c1858c	true	id.token.claim
46afa422-cfd5-4b38-b4a4-4d0534c1858c	true	access.token.claim
46afa422-cfd5-4b38-b4a4-4d0534c1858c	organization	claim.name
46afa422-cfd5-4b38-b4a4-4d0534c1858c	String	jsonType.label
6d586fe0-2bf7-4039-ac45-7d2790ed0a8c	false	single
6d586fe0-2bf7-4039-ac45-7d2790ed0a8c	Basic	attribute.nameformat
6d586fe0-2bf7-4039-ac45-7d2790ed0a8c	Role	attribute.name
125bf87b-be06-4d3e-8456-79b27705ebbc	true	introspection.token.claim
125bf87b-be06-4d3e-8456-79b27705ebbc	true	userinfo.token.claim
125bf87b-be06-4d3e-8456-79b27705ebbc	middleName	user.attribute
125bf87b-be06-4d3e-8456-79b27705ebbc	true	id.token.claim
125bf87b-be06-4d3e-8456-79b27705ebbc	true	access.token.claim
125bf87b-be06-4d3e-8456-79b27705ebbc	middle_name	claim.name
125bf87b-be06-4d3e-8456-79b27705ebbc	String	jsonType.label
140f8999-5b6c-462d-a666-02501f5926da	true	introspection.token.claim
140f8999-5b6c-462d-a666-02501f5926da	true	userinfo.token.claim
140f8999-5b6c-462d-a666-02501f5926da	nickname	user.attribute
140f8999-5b6c-462d-a666-02501f5926da	true	id.token.claim
140f8999-5b6c-462d-a666-02501f5926da	true	access.token.claim
140f8999-5b6c-462d-a666-02501f5926da	nickname	claim.name
140f8999-5b6c-462d-a666-02501f5926da	String	jsonType.label
1e212756-b5ff-4ce0-a62f-d983d16644ea	true	introspection.token.claim
1e212756-b5ff-4ce0-a62f-d983d16644ea	true	userinfo.token.claim
1e212756-b5ff-4ce0-a62f-d983d16644ea	profile	user.attribute
1e212756-b5ff-4ce0-a62f-d983d16644ea	true	id.token.claim
1e212756-b5ff-4ce0-a62f-d983d16644ea	true	access.token.claim
1e212756-b5ff-4ce0-a62f-d983d16644ea	profile	claim.name
1e212756-b5ff-4ce0-a62f-d983d16644ea	String	jsonType.label
44eac84d-12ab-43bf-abec-ccdf8e6a96f0	true	introspection.token.claim
44eac84d-12ab-43bf-abec-ccdf8e6a96f0	true	userinfo.token.claim
44eac84d-12ab-43bf-abec-ccdf8e6a96f0	birthdate	user.attribute
44eac84d-12ab-43bf-abec-ccdf8e6a96f0	true	id.token.claim
44eac84d-12ab-43bf-abec-ccdf8e6a96f0	true	access.token.claim
44eac84d-12ab-43bf-abec-ccdf8e6a96f0	birthdate	claim.name
44eac84d-12ab-43bf-abec-ccdf8e6a96f0	String	jsonType.label
56790018-920b-4070-8d8f-8bf199d3adc6	true	introspection.token.claim
56790018-920b-4070-8d8f-8bf199d3adc6	true	userinfo.token.claim
56790018-920b-4070-8d8f-8bf199d3adc6	updatedAt	user.attribute
56790018-920b-4070-8d8f-8bf199d3adc6	true	id.token.claim
56790018-920b-4070-8d8f-8bf199d3adc6	true	access.token.claim
56790018-920b-4070-8d8f-8bf199d3adc6	updated_at	claim.name
56790018-920b-4070-8d8f-8bf199d3adc6	long	jsonType.label
71d82aea-2f04-4afa-97b0-281c4ddafa1b	true	introspection.token.claim
71d82aea-2f04-4afa-97b0-281c4ddafa1b	true	userinfo.token.claim
71d82aea-2f04-4afa-97b0-281c4ddafa1b	lastName	user.attribute
71d82aea-2f04-4afa-97b0-281c4ddafa1b	true	id.token.claim
71d82aea-2f04-4afa-97b0-281c4ddafa1b	true	access.token.claim
71d82aea-2f04-4afa-97b0-281c4ddafa1b	family_name	claim.name
71d82aea-2f04-4afa-97b0-281c4ddafa1b	String	jsonType.label
7d93d575-d271-4fe2-bdfb-a5a53a068fea	true	introspection.token.claim
7d93d575-d271-4fe2-bdfb-a5a53a068fea	true	userinfo.token.claim
7d93d575-d271-4fe2-bdfb-a5a53a068fea	gender	user.attribute
7d93d575-d271-4fe2-bdfb-a5a53a068fea	true	id.token.claim
7d93d575-d271-4fe2-bdfb-a5a53a068fea	true	access.token.claim
7d93d575-d271-4fe2-bdfb-a5a53a068fea	gender	claim.name
7d93d575-d271-4fe2-bdfb-a5a53a068fea	String	jsonType.label
8b20943e-2c0f-415f-8f01-6448c5a51cc4	true	introspection.token.claim
8b20943e-2c0f-415f-8f01-6448c5a51cc4	true	userinfo.token.claim
8b20943e-2c0f-415f-8f01-6448c5a51cc4	website	user.attribute
8b20943e-2c0f-415f-8f01-6448c5a51cc4	true	id.token.claim
8b20943e-2c0f-415f-8f01-6448c5a51cc4	true	access.token.claim
8b20943e-2c0f-415f-8f01-6448c5a51cc4	website	claim.name
8b20943e-2c0f-415f-8f01-6448c5a51cc4	String	jsonType.label
93548cfe-441d-49fb-8f8a-ed6cee69fda3	true	introspection.token.claim
93548cfe-441d-49fb-8f8a-ed6cee69fda3	true	userinfo.token.claim
93548cfe-441d-49fb-8f8a-ed6cee69fda3	zoneinfo	user.attribute
93548cfe-441d-49fb-8f8a-ed6cee69fda3	true	id.token.claim
93548cfe-441d-49fb-8f8a-ed6cee69fda3	true	access.token.claim
93548cfe-441d-49fb-8f8a-ed6cee69fda3	zoneinfo	claim.name
93548cfe-441d-49fb-8f8a-ed6cee69fda3	String	jsonType.label
9fcf97fb-ad55-43ef-81df-34feb22a2e8c	true	introspection.token.claim
9fcf97fb-ad55-43ef-81df-34feb22a2e8c	true	userinfo.token.claim
9fcf97fb-ad55-43ef-81df-34feb22a2e8c	locale	user.attribute
9fcf97fb-ad55-43ef-81df-34feb22a2e8c	true	id.token.claim
9fcf97fb-ad55-43ef-81df-34feb22a2e8c	true	access.token.claim
9fcf97fb-ad55-43ef-81df-34feb22a2e8c	locale	claim.name
9fcf97fb-ad55-43ef-81df-34feb22a2e8c	String	jsonType.label
a39210c7-aac6-45eb-9d8e-f5ab3309feae	true	introspection.token.claim
a39210c7-aac6-45eb-9d8e-f5ab3309feae	true	userinfo.token.claim
a39210c7-aac6-45eb-9d8e-f5ab3309feae	firstName	user.attribute
a39210c7-aac6-45eb-9d8e-f5ab3309feae	true	id.token.claim
a39210c7-aac6-45eb-9d8e-f5ab3309feae	true	access.token.claim
a39210c7-aac6-45eb-9d8e-f5ab3309feae	given_name	claim.name
a39210c7-aac6-45eb-9d8e-f5ab3309feae	String	jsonType.label
c0c27193-6d93-4ef0-ab34-3237d9a31053	true	introspection.token.claim
c0c27193-6d93-4ef0-ab34-3237d9a31053	true	userinfo.token.claim
c0c27193-6d93-4ef0-ab34-3237d9a31053	picture	user.attribute
c0c27193-6d93-4ef0-ab34-3237d9a31053	true	id.token.claim
c0c27193-6d93-4ef0-ab34-3237d9a31053	true	access.token.claim
c0c27193-6d93-4ef0-ab34-3237d9a31053	picture	claim.name
c0c27193-6d93-4ef0-ab34-3237d9a31053	String	jsonType.label
d74f64a6-9ec6-4644-abbd-3a26e6708408	true	introspection.token.claim
d74f64a6-9ec6-4644-abbd-3a26e6708408	true	userinfo.token.claim
d74f64a6-9ec6-4644-abbd-3a26e6708408	true	id.token.claim
d74f64a6-9ec6-4644-abbd-3a26e6708408	true	access.token.claim
f556cc47-50fa-4d56-868f-6b8adeb3334e	true	introspection.token.claim
f556cc47-50fa-4d56-868f-6b8adeb3334e	true	userinfo.token.claim
f556cc47-50fa-4d56-868f-6b8adeb3334e	username	user.attribute
f556cc47-50fa-4d56-868f-6b8adeb3334e	true	id.token.claim
f556cc47-50fa-4d56-868f-6b8adeb3334e	true	access.token.claim
f556cc47-50fa-4d56-868f-6b8adeb3334e	preferred_username	claim.name
f556cc47-50fa-4d56-868f-6b8adeb3334e	String	jsonType.label
5176fce0-f9a0-4172-885c-d4a562783a95	true	introspection.token.claim
5176fce0-f9a0-4172-885c-d4a562783a95	true	userinfo.token.claim
5176fce0-f9a0-4172-885c-d4a562783a95	email	user.attribute
5176fce0-f9a0-4172-885c-d4a562783a95	true	id.token.claim
5176fce0-f9a0-4172-885c-d4a562783a95	true	access.token.claim
5176fce0-f9a0-4172-885c-d4a562783a95	email	claim.name
5176fce0-f9a0-4172-885c-d4a562783a95	String	jsonType.label
51ec289a-4d07-4348-ae4c-5bc362d88fb6	true	introspection.token.claim
51ec289a-4d07-4348-ae4c-5bc362d88fb6	true	userinfo.token.claim
51ec289a-4d07-4348-ae4c-5bc362d88fb6	emailVerified	user.attribute
51ec289a-4d07-4348-ae4c-5bc362d88fb6	true	id.token.claim
51ec289a-4d07-4348-ae4c-5bc362d88fb6	true	access.token.claim
51ec289a-4d07-4348-ae4c-5bc362d88fb6	email_verified	claim.name
51ec289a-4d07-4348-ae4c-5bc362d88fb6	boolean	jsonType.label
4e9f3b5f-891f-4935-aeb6-4365a9aa93d9	formatted	user.attribute.formatted
4e9f3b5f-891f-4935-aeb6-4365a9aa93d9	country	user.attribute.country
4e9f3b5f-891f-4935-aeb6-4365a9aa93d9	true	introspection.token.claim
4e9f3b5f-891f-4935-aeb6-4365a9aa93d9	postal_code	user.attribute.postal_code
4e9f3b5f-891f-4935-aeb6-4365a9aa93d9	true	userinfo.token.claim
4e9f3b5f-891f-4935-aeb6-4365a9aa93d9	street	user.attribute.street
4e9f3b5f-891f-4935-aeb6-4365a9aa93d9	true	id.token.claim
4e9f3b5f-891f-4935-aeb6-4365a9aa93d9	region	user.attribute.region
4e9f3b5f-891f-4935-aeb6-4365a9aa93d9	true	access.token.claim
4e9f3b5f-891f-4935-aeb6-4365a9aa93d9	locality	user.attribute.locality
4e8e6ce3-b59c-4764-9947-bef85760c766	true	introspection.token.claim
4e8e6ce3-b59c-4764-9947-bef85760c766	true	userinfo.token.claim
4e8e6ce3-b59c-4764-9947-bef85760c766	phoneNumber	user.attribute
4e8e6ce3-b59c-4764-9947-bef85760c766	true	id.token.claim
4e8e6ce3-b59c-4764-9947-bef85760c766	true	access.token.claim
4e8e6ce3-b59c-4764-9947-bef85760c766	phone_number	claim.name
4e8e6ce3-b59c-4764-9947-bef85760c766	String	jsonType.label
8ccd0331-a031-4b78-9017-5366d624ac17	true	introspection.token.claim
8ccd0331-a031-4b78-9017-5366d624ac17	true	userinfo.token.claim
8ccd0331-a031-4b78-9017-5366d624ac17	phoneNumberVerified	user.attribute
8ccd0331-a031-4b78-9017-5366d624ac17	true	id.token.claim
8ccd0331-a031-4b78-9017-5366d624ac17	true	access.token.claim
8ccd0331-a031-4b78-9017-5366d624ac17	phone_number_verified	claim.name
8ccd0331-a031-4b78-9017-5366d624ac17	boolean	jsonType.label
203861fb-2ad4-41f3-92dc-4937b004e443	true	introspection.token.claim
203861fb-2ad4-41f3-92dc-4937b004e443	true	multivalued
203861fb-2ad4-41f3-92dc-4937b004e443	foo	user.attribute
203861fb-2ad4-41f3-92dc-4937b004e443	true	access.token.claim
203861fb-2ad4-41f3-92dc-4937b004e443	realm_access.roles	claim.name
203861fb-2ad4-41f3-92dc-4937b004e443	String	jsonType.label
5fae0b0c-e7ce-406a-aa2e-9c9156bf8cd3	true	introspection.token.claim
5fae0b0c-e7ce-406a-aa2e-9c9156bf8cd3	true	multivalued
5fae0b0c-e7ce-406a-aa2e-9c9156bf8cd3	foo	user.attribute
5fae0b0c-e7ce-406a-aa2e-9c9156bf8cd3	true	access.token.claim
5fae0b0c-e7ce-406a-aa2e-9c9156bf8cd3	resource_access.${client_id}.roles	claim.name
5fae0b0c-e7ce-406a-aa2e-9c9156bf8cd3	String	jsonType.label
7929e356-0ba3-4765-a4d4-655c2ef7519d	true	introspection.token.claim
7929e356-0ba3-4765-a4d4-655c2ef7519d	true	access.token.claim
e9733f7e-9a04-4b20-be3a-fe57c7a6f93c	true	introspection.token.claim
e9733f7e-9a04-4b20-be3a-fe57c7a6f93c	true	access.token.claim
2f933717-c733-4ce9-87d4-cf13d93aac8a	true	introspection.token.claim
2f933717-c733-4ce9-87d4-cf13d93aac8a	true	multivalued
2f933717-c733-4ce9-87d4-cf13d93aac8a	foo	user.attribute
2f933717-c733-4ce9-87d4-cf13d93aac8a	true	id.token.claim
2f933717-c733-4ce9-87d4-cf13d93aac8a	true	access.token.claim
2f933717-c733-4ce9-87d4-cf13d93aac8a	groups	claim.name
2f933717-c733-4ce9-87d4-cf13d93aac8a	String	jsonType.label
8a4d5c52-11ef-41cb-8280-3b9246a620d3	true	introspection.token.claim
8a4d5c52-11ef-41cb-8280-3b9246a620d3	true	userinfo.token.claim
8a4d5c52-11ef-41cb-8280-3b9246a620d3	username	user.attribute
8a4d5c52-11ef-41cb-8280-3b9246a620d3	true	id.token.claim
8a4d5c52-11ef-41cb-8280-3b9246a620d3	true	access.token.claim
8a4d5c52-11ef-41cb-8280-3b9246a620d3	upn	claim.name
8a4d5c52-11ef-41cb-8280-3b9246a620d3	String	jsonType.label
98fe3939-5515-4721-ba61-59c262b69756	true	introspection.token.claim
98fe3939-5515-4721-ba61-59c262b69756	true	id.token.claim
98fe3939-5515-4721-ba61-59c262b69756	true	access.token.claim
84a00b34-e54d-4d21-9284-a1c48a344e12	AUTH_TIME	user.session.note
84a00b34-e54d-4d21-9284-a1c48a344e12	true	introspection.token.claim
84a00b34-e54d-4d21-9284-a1c48a344e12	true	id.token.claim
84a00b34-e54d-4d21-9284-a1c48a344e12	true	access.token.claim
84a00b34-e54d-4d21-9284-a1c48a344e12	auth_time	claim.name
84a00b34-e54d-4d21-9284-a1c48a344e12	long	jsonType.label
bc8cd863-100b-4267-ba15-8c430f91cd87	true	introspection.token.claim
bc8cd863-100b-4267-ba15-8c430f91cd87	true	access.token.claim
12e11fe0-357b-4df1-8618-0934fa2e8562	clientHost	user.session.note
12e11fe0-357b-4df1-8618-0934fa2e8562	true	introspection.token.claim
12e11fe0-357b-4df1-8618-0934fa2e8562	true	id.token.claim
12e11fe0-357b-4df1-8618-0934fa2e8562	true	access.token.claim
12e11fe0-357b-4df1-8618-0934fa2e8562	clientHost	claim.name
12e11fe0-357b-4df1-8618-0934fa2e8562	String	jsonType.label
b977dd97-cfef-449e-b6af-b14616dbb0ac	clientAddress	user.session.note
b977dd97-cfef-449e-b6af-b14616dbb0ac	true	introspection.token.claim
b977dd97-cfef-449e-b6af-b14616dbb0ac	true	id.token.claim
b977dd97-cfef-449e-b6af-b14616dbb0ac	true	access.token.claim
b977dd97-cfef-449e-b6af-b14616dbb0ac	clientAddress	claim.name
b977dd97-cfef-449e-b6af-b14616dbb0ac	String	jsonType.label
f8a069f9-eacc-4f99-bd1d-a0297c8d66b6	client_id	user.session.note
f8a069f9-eacc-4f99-bd1d-a0297c8d66b6	true	introspection.token.claim
f8a069f9-eacc-4f99-bd1d-a0297c8d66b6	true	id.token.claim
f8a069f9-eacc-4f99-bd1d-a0297c8d66b6	true	access.token.claim
f8a069f9-eacc-4f99-bd1d-a0297c8d66b6	client_id	claim.name
f8a069f9-eacc-4f99-bd1d-a0297c8d66b6	String	jsonType.label
746cbaec-9731-4e3f-a3ba-4f4dced31c64	true	introspection.token.claim
746cbaec-9731-4e3f-a3ba-4f4dced31c64	true	multivalued
746cbaec-9731-4e3f-a3ba-4f4dced31c64	true	id.token.claim
746cbaec-9731-4e3f-a3ba-4f4dced31c64	true	access.token.claim
746cbaec-9731-4e3f-a3ba-4f4dced31c64	organization	claim.name
746cbaec-9731-4e3f-a3ba-4f4dced31c64	String	jsonType.label
dd148887-8c5b-416a-96ab-53959883f65f	true	introspection.token.claim
dd148887-8c5b-416a-96ab-53959883f65f	true	userinfo.token.claim
dd148887-8c5b-416a-96ab-53959883f65f	locale	user.attribute
dd148887-8c5b-416a-96ab-53959883f65f	true	id.token.claim
dd148887-8c5b-416a-96ab-53959883f65f	true	access.token.claim
dd148887-8c5b-416a-96ab-53959883f65f	locale	claim.name
dd148887-8c5b-416a-96ab-53959883f65f	String	jsonType.label
\.


--
-- TOC entry 4239 (class 0 OID 16439)
-- Dependencies: 222
-- Data for Name: realm; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realm (id, access_code_lifespan, user_action_lifespan, access_token_lifespan, account_theme, admin_theme, email_theme, enabled, events_enabled, events_expiration, login_theme, name, not_before, password_policy, registration_allowed, remember_me, reset_password_allowed, social, ssl_required, sso_idle_timeout, sso_max_lifespan, update_profile_on_soc_login, verify_email, master_admin_client, login_lifespan, internationalization_enabled, default_locale, reg_email_as_username, admin_events_enabled, admin_events_details_enabled, edit_username_allowed, otp_policy_counter, otp_policy_window, otp_policy_period, otp_policy_digits, otp_policy_alg, otp_policy_type, browser_flow, registration_flow, direct_grant_flow, reset_credentials_flow, client_auth_flow, offline_session_idle_timeout, revoke_refresh_token, access_token_life_implicit, login_with_email_allowed, duplicate_emails_allowed, docker_auth_flow, refresh_token_max_reuse, allow_user_managed_access, sso_max_lifespan_remember_me, sso_idle_timeout_remember_me, default_role) FROM stdin;
c5c44cec-b05c-4195-a581-031a8ca23566	60	300	300	\N	\N	\N	t	f	0	\N	super-petmark-3d	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	230caeea-39c0-421d-9a97-199f93a4cb5f	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	82e6e56d-2e33-4507-9122-679362dc9fc1	dea14d9b-fb45-44a9-94fd-cd9daa3627e9	e3143deb-d47a-4055-b3f9-5299cfe6c991	2b6b4d87-9919-4957-80a0-09628f4860e6	afd38b55-350d-4657-8098-cc176dfde9e4	2592000	f	900	t	f	879fd3f4-993b-4260-a0ee-aaa486bc1475	0	f	0	0	5192c04b-4489-4127-a88d-75de489ed879
da5e2aa6-73ba-48b9-80fd-c2412ca322de	60	300	60	\N	\N	\N	t	f	0	\N	master	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	71adc4d2-3a7d-49fa-8701-87b4bb0b9294	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	57a49113-8bab-4e8b-a1ac-ec658096e48d	76ab432a-4ad6-48c3-969b-b19c6fe6568a	2ddeb16f-eed8-4bc6-b608-1e03c3f110e3	16bb6762-e24e-45ae-9112-87182b11343e	49623b46-cd88-4919-8807-655363fd4697	2592000	f	900	t	f	8128654d-d3b4-46f4-ba86-7064c549c903	0	f	0	0	2e1ed85f-26f2-4e24-bae6-f5ca1926bff3
\.


--
-- TOC entry 4240 (class 0 OID 16456)
-- Dependencies: 223
-- Data for Name: realm_attribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realm_attribute (name, realm_id, value) FROM stdin;
_browser_header.contentSecurityPolicyReportOnly	da5e2aa6-73ba-48b9-80fd-c2412ca322de	
_browser_header.xContentTypeOptions	da5e2aa6-73ba-48b9-80fd-c2412ca322de	nosniff
_browser_header.referrerPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	no-referrer
_browser_header.xRobotsTag	da5e2aa6-73ba-48b9-80fd-c2412ca322de	none
_browser_header.xFrameOptions	da5e2aa6-73ba-48b9-80fd-c2412ca322de	SAMEORIGIN
_browser_header.contentSecurityPolicy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.strictTransportSecurity	da5e2aa6-73ba-48b9-80fd-c2412ca322de	max-age=31536000; includeSubDomains
bruteForceProtected	da5e2aa6-73ba-48b9-80fd-c2412ca322de	false
permanentLockout	da5e2aa6-73ba-48b9-80fd-c2412ca322de	false
maxTemporaryLockouts	da5e2aa6-73ba-48b9-80fd-c2412ca322de	0
bruteForceStrategy	da5e2aa6-73ba-48b9-80fd-c2412ca322de	MULTIPLE
maxFailureWaitSeconds	da5e2aa6-73ba-48b9-80fd-c2412ca322de	900
minimumQuickLoginWaitSeconds	da5e2aa6-73ba-48b9-80fd-c2412ca322de	60
waitIncrementSeconds	da5e2aa6-73ba-48b9-80fd-c2412ca322de	60
quickLoginCheckMilliSeconds	da5e2aa6-73ba-48b9-80fd-c2412ca322de	1000
maxDeltaTimeSeconds	da5e2aa6-73ba-48b9-80fd-c2412ca322de	43200
failureFactor	da5e2aa6-73ba-48b9-80fd-c2412ca322de	30
maxSecondaryAuthFailures	da5e2aa6-73ba-48b9-80fd-c2412ca322de	0
realmReusableOtpCode	da5e2aa6-73ba-48b9-80fd-c2412ca322de	false
firstBrokerLoginFlowId	da5e2aa6-73ba-48b9-80fd-c2412ca322de	6face769-3364-4d94-b37a-8a632e992914
displayName	da5e2aa6-73ba-48b9-80fd-c2412ca322de	Keycloak
displayNameHtml	da5e2aa6-73ba-48b9-80fd-c2412ca322de	<div class="kc-logo-text"><span>Keycloak</span></div>
defaultSignatureAlgorithm	da5e2aa6-73ba-48b9-80fd-c2412ca322de	RS256
offlineSessionMaxLifespanEnabled	da5e2aa6-73ba-48b9-80fd-c2412ca322de	false
offlineSessionMaxLifespan	da5e2aa6-73ba-48b9-80fd-c2412ca322de	5184000
_browser_header.contentSecurityPolicyReportOnly	c5c44cec-b05c-4195-a581-031a8ca23566	
_browser_header.xContentTypeOptions	c5c44cec-b05c-4195-a581-031a8ca23566	nosniff
_browser_header.referrerPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	no-referrer
_browser_header.xRobotsTag	c5c44cec-b05c-4195-a581-031a8ca23566	none
_browser_header.xFrameOptions	c5c44cec-b05c-4195-a581-031a8ca23566	SAMEORIGIN
_browser_header.contentSecurityPolicy	c5c44cec-b05c-4195-a581-031a8ca23566	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.strictTransportSecurity	c5c44cec-b05c-4195-a581-031a8ca23566	max-age=31536000; includeSubDomains
bruteForceProtected	c5c44cec-b05c-4195-a581-031a8ca23566	false
permanentLockout	c5c44cec-b05c-4195-a581-031a8ca23566	false
maxTemporaryLockouts	c5c44cec-b05c-4195-a581-031a8ca23566	0
bruteForceStrategy	c5c44cec-b05c-4195-a581-031a8ca23566	MULTIPLE
maxFailureWaitSeconds	c5c44cec-b05c-4195-a581-031a8ca23566	900
minimumQuickLoginWaitSeconds	c5c44cec-b05c-4195-a581-031a8ca23566	60
waitIncrementSeconds	c5c44cec-b05c-4195-a581-031a8ca23566	60
quickLoginCheckMilliSeconds	c5c44cec-b05c-4195-a581-031a8ca23566	1000
maxDeltaTimeSeconds	c5c44cec-b05c-4195-a581-031a8ca23566	43200
failureFactor	c5c44cec-b05c-4195-a581-031a8ca23566	30
maxSecondaryAuthFailures	c5c44cec-b05c-4195-a581-031a8ca23566	0
realmReusableOtpCode	c5c44cec-b05c-4195-a581-031a8ca23566	false
defaultSignatureAlgorithm	c5c44cec-b05c-4195-a581-031a8ca23566	RS256
offlineSessionMaxLifespanEnabled	c5c44cec-b05c-4195-a581-031a8ca23566	false
offlineSessionMaxLifespan	c5c44cec-b05c-4195-a581-031a8ca23566	5184000
actionTokenGeneratedByAdminLifespan	c5c44cec-b05c-4195-a581-031a8ca23566	43200
actionTokenGeneratedByUserLifespan	c5c44cec-b05c-4195-a581-031a8ca23566	300
oauth2DeviceCodeLifespan	c5c44cec-b05c-4195-a581-031a8ca23566	600
oauth2DevicePollingInterval	c5c44cec-b05c-4195-a581-031a8ca23566	5
webAuthnPolicyRpEntityName	c5c44cec-b05c-4195-a581-031a8ca23566	keycloak
webAuthnPolicySignatureAlgorithms	c5c44cec-b05c-4195-a581-031a8ca23566	ES256,RS256
webAuthnPolicyRpId	c5c44cec-b05c-4195-a581-031a8ca23566	
webAuthnPolicyAttestationConveyancePreference	c5c44cec-b05c-4195-a581-031a8ca23566	not specified
webAuthnPolicyAuthenticatorAttachment	c5c44cec-b05c-4195-a581-031a8ca23566	not specified
webAuthnPolicyRequireResidentKey	c5c44cec-b05c-4195-a581-031a8ca23566	not specified
webAuthnPolicyUserVerificationRequirement	c5c44cec-b05c-4195-a581-031a8ca23566	not specified
webAuthnPolicyCreateTimeout	c5c44cec-b05c-4195-a581-031a8ca23566	0
webAuthnPolicyAvoidSameAuthenticatorRegister	c5c44cec-b05c-4195-a581-031a8ca23566	false
webAuthnPolicyRpEntityNamePasswordless	c5c44cec-b05c-4195-a581-031a8ca23566	keycloak
webAuthnPolicySignatureAlgorithmsPasswordless	c5c44cec-b05c-4195-a581-031a8ca23566	ES256,RS256
webAuthnPolicyRpIdPasswordless	c5c44cec-b05c-4195-a581-031a8ca23566	
webAuthnPolicyAttestationConveyancePreferencePasswordless	c5c44cec-b05c-4195-a581-031a8ca23566	not specified
webAuthnPolicyAuthenticatorAttachmentPasswordless	c5c44cec-b05c-4195-a581-031a8ca23566	not specified
webAuthnPolicyRequireResidentKeyPasswordless	c5c44cec-b05c-4195-a581-031a8ca23566	Yes
webAuthnPolicyUserVerificationRequirementPasswordless	c5c44cec-b05c-4195-a581-031a8ca23566	required
webAuthnPolicyCreateTimeoutPasswordless	c5c44cec-b05c-4195-a581-031a8ca23566	0
webAuthnPolicyAvoidSameAuthenticatorRegisterPasswordless	c5c44cec-b05c-4195-a581-031a8ca23566	false
cibaBackchannelTokenDeliveryMode	c5c44cec-b05c-4195-a581-031a8ca23566	poll
cibaExpiresIn	c5c44cec-b05c-4195-a581-031a8ca23566	120
cibaInterval	c5c44cec-b05c-4195-a581-031a8ca23566	5
cibaAuthRequestedUserHint	c5c44cec-b05c-4195-a581-031a8ca23566	login_hint
parRequestUriLifespan	c5c44cec-b05c-4195-a581-031a8ca23566	60
firstBrokerLoginFlowId	c5c44cec-b05c-4195-a581-031a8ca23566	43ce4676-0993-4b40-9db2-3a5ad69aa252
\.


--
-- TOC entry 4281 (class 0 OID 17213)
-- Dependencies: 264
-- Data for Name: realm_default_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realm_default_groups (realm_id, group_id) FROM stdin;
\.


--
-- TOC entry 4261 (class 0 OID 16909)
-- Dependencies: 244
-- Data for Name: realm_enabled_event_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realm_enabled_event_types (realm_id, value) FROM stdin;
\.


--
-- TOC entry 4241 (class 0 OID 16464)
-- Dependencies: 224
-- Data for Name: realm_events_listeners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realm_events_listeners (realm_id, value) FROM stdin;
da5e2aa6-73ba-48b9-80fd-c2412ca322de	jboss-logging
c5c44cec-b05c-4195-a581-031a8ca23566	jboss-logging
\.


--
-- TOC entry 4314 (class 0 OID 17916)
-- Dependencies: 297
-- Data for Name: realm_localizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realm_localizations (realm_id, locale, texts) FROM stdin;
\.


--
-- TOC entry 4242 (class 0 OID 16467)
-- Dependencies: 225
-- Data for Name: realm_required_credential; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realm_required_credential (type, form_label, input, secret, realm_id) FROM stdin;
password	password	t	t	da5e2aa6-73ba-48b9-80fd-c2412ca322de
password	password	t	t	c5c44cec-b05c-4195-a581-031a8ca23566
\.


--
-- TOC entry 4243 (class 0 OID 16474)
-- Dependencies: 226
-- Data for Name: realm_smtp_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realm_smtp_config (realm_id, value, name) FROM stdin;
\.


--
-- TOC entry 4260 (class 0 OID 16825)
-- Dependencies: 243
-- Data for Name: realm_supported_locales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realm_supported_locales (realm_id, value) FROM stdin;
\.


--
-- TOC entry 4244 (class 0 OID 16484)
-- Dependencies: 227
-- Data for Name: redirect_uris; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.redirect_uris (client_id, value) FROM stdin;
bf7df9e3-f340-4d2e-b2fd-b15564e3384c	/realms/master/account/*
d925ebe4-1e14-465b-bbb5-d397a2d035d0	/realms/master/account/*
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	/admin/master/console/*
12f47d83-9f25-4f5a-8b9a-9bd513cc89ba	/realms/super-petmark-3d/account/*
6994b3c5-b0ab-4cfa-a135-c25a54041c62	/realms/super-petmark-3d/account/*
da8cf327-ae8c-454b-9f89-5f0d53abbf27	/admin/super-petmark-3d/console/*
6f967252-9033-4cc5-af78-021f02ea431a	
\.


--
-- TOC entry 4274 (class 0 OID 17148)
-- Dependencies: 257
-- Data for Name: required_action_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.required_action_config (required_action_id, value, name) FROM stdin;
\.


--
-- TOC entry 4273 (class 0 OID 17141)
-- Dependencies: 256
-- Data for Name: required_action_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.required_action_provider (id, alias, name, realm_id, enabled, default_action, provider_id, priority) FROM stdin;
7d82c4c0-da4f-4b01-a669-497dd0e08883	VERIFY_EMAIL	Verify Email	da5e2aa6-73ba-48b9-80fd-c2412ca322de	t	f	VERIFY_EMAIL	50
0819cb09-c2ca-4ecf-81ab-8cd27b7df714	UPDATE_PROFILE	Update Profile	da5e2aa6-73ba-48b9-80fd-c2412ca322de	t	f	UPDATE_PROFILE	40
eb3c13a5-b022-486a-a566-183357023b32	CONFIGURE_TOTP	Configure OTP	da5e2aa6-73ba-48b9-80fd-c2412ca322de	t	f	CONFIGURE_TOTP	10
b1f31d93-c6e1-412b-a2a3-920df6d9e510	UPDATE_PASSWORD	Update Password	da5e2aa6-73ba-48b9-80fd-c2412ca322de	t	f	UPDATE_PASSWORD	30
fe65d71d-ee98-40fe-bea3-740703b44ee9	TERMS_AND_CONDITIONS	Terms and Conditions	da5e2aa6-73ba-48b9-80fd-c2412ca322de	f	f	TERMS_AND_CONDITIONS	20
86296f61-13ee-4560-a627-8317d99b4fe7	delete_account	Delete Account	da5e2aa6-73ba-48b9-80fd-c2412ca322de	f	f	delete_account	60
0b0fcb3c-aa97-41d1-bbd7-59dc5fd459b2	delete_credential	Delete Credential	da5e2aa6-73ba-48b9-80fd-c2412ca322de	t	f	delete_credential	110
f363a40d-43a0-41de-8144-13b2ac4bf704	update_user_locale	Update User Locale	da5e2aa6-73ba-48b9-80fd-c2412ca322de	t	f	update_user_locale	1000
03fd5143-cc40-4441-8846-340ee8c7cf2b	UPDATE_EMAIL	Update Email	da5e2aa6-73ba-48b9-80fd-c2412ca322de	f	f	UPDATE_EMAIL	70
402df3d9-e2cb-4fff-a92c-38f9b73ee638	CONFIGURE_RECOVERY_AUTHN_CODES	Recovery Authentication Codes	da5e2aa6-73ba-48b9-80fd-c2412ca322de	t	f	CONFIGURE_RECOVERY_AUTHN_CODES	130
dc2771ba-933b-46c7-920f-d113979f7039	webauthn-register	Webauthn Register	da5e2aa6-73ba-48b9-80fd-c2412ca322de	t	f	webauthn-register	80
3ab8fa7c-015b-4e75-8492-10560e80330c	webauthn-register-passwordless	Webauthn Register Passwordless	da5e2aa6-73ba-48b9-80fd-c2412ca322de	t	f	webauthn-register-passwordless	90
b46627ca-2b65-48f3-86c6-3f28ad266caf	VERIFY_PROFILE	Verify Profile	da5e2aa6-73ba-48b9-80fd-c2412ca322de	t	f	VERIFY_PROFILE	100
45b2ee0e-1590-43ec-9277-49c7c9ab8791	idp_link	Linking Identity Provider	da5e2aa6-73ba-48b9-80fd-c2412ca322de	t	f	idp_link	120
9b98f552-11b7-446c-8415-f9263860768e	VERIFY_EMAIL	Verify Email	c5c44cec-b05c-4195-a581-031a8ca23566	t	f	VERIFY_EMAIL	50
6c9a29c1-5710-4648-95f2-db43009a6eab	UPDATE_PROFILE	Update Profile	c5c44cec-b05c-4195-a581-031a8ca23566	t	f	UPDATE_PROFILE	40
30c0ae72-593f-4e0f-bd5e-00553e2ebea2	CONFIGURE_TOTP	Configure OTP	c5c44cec-b05c-4195-a581-031a8ca23566	t	f	CONFIGURE_TOTP	10
9dd10d88-f890-49a0-9aeb-95446c1deeb7	UPDATE_PASSWORD	Update Password	c5c44cec-b05c-4195-a581-031a8ca23566	t	f	UPDATE_PASSWORD	30
058ef703-aa3d-4cd5-9dd6-a177267eebb6	TERMS_AND_CONDITIONS	Terms and Conditions	c5c44cec-b05c-4195-a581-031a8ca23566	f	f	TERMS_AND_CONDITIONS	20
23fc2255-7738-4e8f-91d7-409f55c7f927	delete_account	Delete Account	c5c44cec-b05c-4195-a581-031a8ca23566	f	f	delete_account	60
72e3b1a3-4bc4-4360-8d58-4ecc500134cf	delete_credential	Delete Credential	c5c44cec-b05c-4195-a581-031a8ca23566	t	f	delete_credential	110
9fd1e7b3-5122-4f5e-a754-7ee6d458ed13	update_user_locale	Update User Locale	c5c44cec-b05c-4195-a581-031a8ca23566	t	f	update_user_locale	1000
6d591ac9-6803-45e5-8360-adeb02644325	UPDATE_EMAIL	Update Email	c5c44cec-b05c-4195-a581-031a8ca23566	f	f	UPDATE_EMAIL	70
fa9ad6d3-db41-47cc-8ab4-46dfe5739448	CONFIGURE_RECOVERY_AUTHN_CODES	Recovery Authentication Codes	c5c44cec-b05c-4195-a581-031a8ca23566	t	f	CONFIGURE_RECOVERY_AUTHN_CODES	130
ee1cd0da-38c1-40b2-b480-cae84ba6d924	webauthn-register	Webauthn Register	c5c44cec-b05c-4195-a581-031a8ca23566	t	f	webauthn-register	80
c028ac55-7723-4173-8404-162b7f04baf9	webauthn-register-passwordless	Webauthn Register Passwordless	c5c44cec-b05c-4195-a581-031a8ca23566	t	f	webauthn-register-passwordless	90
f74d15c5-885e-4356-99ea-949b26537893	VERIFY_PROFILE	Verify Profile	c5c44cec-b05c-4195-a581-031a8ca23566	t	f	VERIFY_PROFILE	100
64f3a7ea-ed42-4526-9923-81958ffba27f	idp_link	Linking Identity Provider	c5c44cec-b05c-4195-a581-031a8ca23566	t	f	idp_link	120
\.


--
-- TOC entry 4311 (class 0 OID 17847)
-- Dependencies: 294
-- Data for Name: resource_attribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_attribute (id, name, value, resource_id) FROM stdin;
\.


--
-- TOC entry 4291 (class 0 OID 17430)
-- Dependencies: 274
-- Data for Name: resource_policy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_policy (resource_id, policy_id) FROM stdin;
\.


--
-- TOC entry 4290 (class 0 OID 17415)
-- Dependencies: 273
-- Data for Name: resource_scope; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_scope (resource_id, scope_id) FROM stdin;
\.


--
-- TOC entry 4285 (class 0 OID 17353)
-- Dependencies: 268
-- Data for Name: resource_server; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_server (id, allow_rs_remote_mgmt, policy_enforce_mode, decision_strategy) FROM stdin;
6f967252-9033-4cc5-af78-021f02ea431a	t	0	1
\.


--
-- TOC entry 4310 (class 0 OID 17823)
-- Dependencies: 293
-- Data for Name: resource_server_perm_ticket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_server_perm_ticket (id, owner, requester, created_timestamp, granted_timestamp, resource_id, scope_id, resource_server_id, policy_id) FROM stdin;
\.


--
-- TOC entry 4288 (class 0 OID 17389)
-- Dependencies: 271
-- Data for Name: resource_server_policy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_server_policy (id, name, description, type, decision_strategy, logic, resource_server_id, owner) FROM stdin;
\.


--
-- TOC entry 4286 (class 0 OID 17361)
-- Dependencies: 269
-- Data for Name: resource_server_resource; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_server_resource (id, name, type, icon_uri, owner, resource_server_id, owner_managed_access, display_name) FROM stdin;
\.


--
-- TOC entry 4287 (class 0 OID 17375)
-- Dependencies: 270
-- Data for Name: resource_server_scope; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_server_scope (id, name, icon_uri, resource_server_id, display_name) FROM stdin;
\.


--
-- TOC entry 4312 (class 0 OID 17865)
-- Dependencies: 295
-- Data for Name: resource_uris; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_uris (resource_id, value) FROM stdin;
\.


--
-- TOC entry 4317 (class 0 OID 18000)
-- Dependencies: 300
-- Data for Name: revoked_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.revoked_token (id, expire) FROM stdin;
\.


--
-- TOC entry 4313 (class 0 OID 17875)
-- Dependencies: 296
-- Data for Name: role_attribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_attribute (id, role_id, name, value) FROM stdin;
\.


--
-- TOC entry 4245 (class 0 OID 16487)
-- Dependencies: 228
-- Data for Name: scope_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scope_mapping (client_id, role_id) FROM stdin;
d925ebe4-1e14-465b-bbb5-d397a2d035d0	25d15c18-0fe8-463b-8edf-5416c1fc97ba
d925ebe4-1e14-465b-bbb5-d397a2d035d0	5e9c38bc-6eee-42df-ae67-c68c7d646930
6994b3c5-b0ab-4cfa-a135-c25a54041c62	092875df-42af-48f7-894c-e19e474f806b
6994b3c5-b0ab-4cfa-a135-c25a54041c62	0e556e7c-b1eb-4df9-a40c-24d05655d4c7
\.


--
-- TOC entry 4292 (class 0 OID 17445)
-- Dependencies: 275
-- Data for Name: scope_policy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scope_policy (scope_id, policy_id) FROM stdin;
\.


--
-- TOC entry 4319 (class 0 OID 18016)
-- Dependencies: 302
-- Data for Name: server_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.server_config (server_config_key, value, version) FROM stdin;
\.


--
-- TOC entry 4246 (class 0 OID 16493)
-- Dependencies: 229
-- Data for Name: user_attribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_attribute (name, value, user_id, id, long_value_hash, long_value_hash_lower_case, long_value) FROM stdin;
is_temporary_admin	true	ec9818f5-4754-4ccd-aaed-35e601b8b131	89e80dd3-8a6a-41a4-8858-b49812be8de6	\N	\N	\N
\.


--
-- TOC entry 4265 (class 0 OID 16930)
-- Dependencies: 248
-- Data for Name: user_consent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_consent (id, client_id, user_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- TOC entry 4308 (class 0 OID 17798)
-- Dependencies: 291
-- Data for Name: user_consent_client_scope; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_consent_client_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- TOC entry 4247 (class 0 OID 16498)
-- Dependencies: 230
-- Data for Name: user_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_entity (id, email, email_constraint, email_verified, enabled, federation_link, first_name, last_name, realm_id, username, created_timestamp, service_account_client_link, not_before, last_modified_timestamp) FROM stdin;
ec9818f5-4754-4ccd-aaed-35e601b8b131	\N	f275bc9e-5ba4-44a3-9227-25801729bb88	f	t	\N	\N	\N	da5e2aa6-73ba-48b9-80fd-c2412ca322de	admin	1777871856891	\N	0	1777871856891
89d79c22-b560-401b-a8a1-c1401d78ce7b	\N	850f4f71-14ae-4263-ae74-382cd21dc6ae	f	t	\N	\N	\N	c5c44cec-b05c-4195-a581-031a8ca23566	service-account-user-service	1777872256137	6f967252-9033-4cc5-af78-021f02ea431a	0	1777872256137
1fc08bbd-b989-407d-977a-2e416393633f	admin@petstore.com	admin@petstore.com	f	t	\N	Admin	User	c5c44cec-b05c-4195-a581-031a8ca23566	admin	1777872300220	\N	0	1777872300220
8d8a2c9f-b7a6-4d71-99ec-280b325f34ab	nguyenvana@gmail.com	nguyenvana@gmail.com	f	t	\N	Van A	Nguyen	c5c44cec-b05c-4195-a581-031a8ca23566	nguyenvana@gmail.com	1777881029924	\N	0	1777881029924
99b03a0e-fff3-4ab9-bb0f-804431ed4d6e	tranthib@gmail.com	tranthib@gmail.com	f	t	\N	Thi B	Tran	c5c44cec-b05c-4195-a581-031a8ca23566	tranthib@gmail.com	1777881610742	\N	0	1777881610742
6a1e8772-302d-42cc-ba22-f45c36096f77	levanc@gmail.com	levanc@gmail.com	f	t	\N	Van C	Le	c5c44cec-b05c-4195-a581-031a8ca23566	levanc@gmail.com	1777881642626	\N	0	1777881642626
82b423a8-6257-44e1-8461-acc2be304449	nguyenlher@gmail.com	nguyenlher@gmail.com	f	t	\N	Hoang Nguyen	Le	c5c44cec-b05c-4195-a581-031a8ca23566	nguyenlher@gmail.com	1777881686596	\N	0	1777881686596
95dc51ff-25cf-4a63-8984-2962c02dff4d	testuser@example.com	testuser@example.com	f	t	\N	Test	User	c5c44cec-b05c-4195-a581-031a8ca23566	testuser@example.com	1777913202084	\N	0	1777913202084
\.


--
-- TOC entry 4248 (class 0 OID 16506)
-- Dependencies: 231
-- Data for Name: user_federation_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_federation_config (user_federation_provider_id, value, name) FROM stdin;
\.


--
-- TOC entry 4271 (class 0 OID 17042)
-- Dependencies: 254
-- Data for Name: user_federation_mapper; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_federation_mapper (id, name, federation_provider_id, federation_mapper_type, realm_id) FROM stdin;
\.


--
-- TOC entry 4272 (class 0 OID 17047)
-- Dependencies: 255
-- Data for Name: user_federation_mapper_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_federation_mapper_config (user_federation_mapper_id, value, name) FROM stdin;
\.


--
-- TOC entry 4249 (class 0 OID 16511)
-- Dependencies: 232
-- Data for Name: user_federation_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_federation_provider (id, changed_sync_period, display_name, full_sync_period, last_sync, priority, provider_name, realm_id) FROM stdin;
\.


--
-- TOC entry 4280 (class 0 OID 17210)
-- Dependencies: 263
-- Data for Name: user_group_membership; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_group_membership (group_id, user_id, membership_type) FROM stdin;
\.


--
-- TOC entry 4250 (class 0 OID 16516)
-- Dependencies: 233
-- Data for Name: user_required_action; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_required_action (user_id, required_action) FROM stdin;
\.


--
-- TOC entry 4251 (class 0 OID 16519)
-- Dependencies: 234
-- Data for Name: user_role_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_role_mapping (role_id, user_id) FROM stdin;
2e1ed85f-26f2-4e24-bae6-f5ca1926bff3	ec9818f5-4754-4ccd-aaed-35e601b8b131
1ba0a0c5-fd17-4ea8-acf9-4ab0b222025e	ec9818f5-4754-4ccd-aaed-35e601b8b131
5192c04b-4489-4127-a88d-75de489ed879	89d79c22-b560-401b-a8a1-c1401d78ce7b
03d794c9-adce-4237-b597-b6519c74f89b	89d79c22-b560-401b-a8a1-c1401d78ce7b
5192c04b-4489-4127-a88d-75de489ed879	1fc08bbd-b989-407d-977a-2e416393633f
0aaa199d-6fda-4ad9-b836-2953071a70d2	1fc08bbd-b989-407d-977a-2e416393633f
4a6d2d7c-9bd7-4e2d-b517-2866947527e6	89d79c22-b560-401b-a8a1-c1401d78ce7b
9078c7cc-cfcf-4606-ba7c-a444d3bbedaa	89d79c22-b560-401b-a8a1-c1401d78ce7b
3299b8b8-ad65-4f15-9e71-e631057ba996	89d79c22-b560-401b-a8a1-c1401d78ce7b
5192c04b-4489-4127-a88d-75de489ed879	8d8a2c9f-b7a6-4d71-99ec-280b325f34ab
5192c04b-4489-4127-a88d-75de489ed879	99b03a0e-fff3-4ab9-bb0f-804431ed4d6e
5192c04b-4489-4127-a88d-75de489ed879	6a1e8772-302d-42cc-ba22-f45c36096f77
5192c04b-4489-4127-a88d-75de489ed879	82b423a8-6257-44e1-8461-acc2be304449
5192c04b-4489-4127-a88d-75de489ed879	95dc51ff-25cf-4a63-8984-2962c02dff4d
\.


--
-- TOC entry 4252 (class 0 OID 16533)
-- Dependencies: 235
-- Data for Name: web_origins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.web_origins (client_id, value) FROM stdin;
77e98fd7-dc38-41f2-98ea-ecbfe8d211aa	+
da8cf327-ae8c-454b-9f89-5f0d53abbf27	+
6f967252-9033-4cc5-af78-021f02ea431a	
\.


--
-- TOC entry 4320 (class 0 OID 18032)
-- Dependencies: 303
-- Data for Name: workflow_state; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_state (execution_id, resource_id, workflow_id, resource_type, scheduled_step_id, scheduled_step_timestamp) FROM stdin;
\.


--
-- TOC entry 3998 (class 2606 OID 17989)
-- Name: org_domain ORG_DOMAIN_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_domain
    ADD CONSTRAINT "ORG_DOMAIN_pkey" PRIMARY KEY (id, name);


--
-- TOC entry 3990 (class 2606 OID 17978)
-- Name: org ORG_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT "ORG_pkey" PRIMARY KEY (id);


--
-- TOC entry 4006 (class 2606 OID 18023)
-- Name: server_config SERVER_CONFIG_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.server_config
    ADD CONSTRAINT "SERVER_CONFIG_pkey" PRIMARY KEY (server_config_key);


--
-- TOC entry 3711 (class 2606 OID 17899)
-- Name: keycloak_role UK_J3RWUVD56ONTGSUHOGM184WW2-2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT "UK_J3RWUVD56ONTGSUHOGM184WW2-2" UNIQUE (name, client_realm_constraint);


--
-- TOC entry 3959 (class 2606 OID 17729)
-- Name: client_auth_flow_bindings c_cli_flow_bind; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_auth_flow_bindings
    ADD CONSTRAINT c_cli_flow_bind PRIMARY KEY (client_id, binding_name);


--
-- TOC entry 3961 (class 2606 OID 17928)
-- Name: client_scope_client c_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_scope_client
    ADD CONSTRAINT c_cli_scope_bind PRIMARY KEY (client_id, scope_id);


--
-- TOC entry 3956 (class 2606 OID 17603)
-- Name: client_initial_access cnstr_client_init_acc_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT cnstr_client_init_acc_pk PRIMARY KEY (id);


--
-- TOC entry 3869 (class 2606 OID 17251)
-- Name: realm_default_groups con_group_id_def_groups; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT con_group_id_def_groups UNIQUE (group_id);


--
-- TOC entry 3917 (class 2606 OID 17526)
-- Name: broker_link constr_broker_link_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.broker_link
    ADD CONSTRAINT constr_broker_link_pk PRIMARY KEY (identity_provider, user_id);


--
-- TOC entry 3947 (class 2606 OID 17546)
-- Name: component_config constr_component_config_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT constr_component_config_pk PRIMARY KEY (id);


--
-- TOC entry 3950 (class 2606 OID 17544)
-- Name: component constr_component_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT constr_component_pk PRIMARY KEY (id);


--
-- TOC entry 3939 (class 2606 OID 17542)
-- Name: fed_user_required_action constr_fed_required_action; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fed_user_required_action
    ADD CONSTRAINT constr_fed_required_action PRIMARY KEY (required_action, user_id);


--
-- TOC entry 3921 (class 2606 OID 17528)
-- Name: fed_user_attribute constr_fed_user_attr_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fed_user_attribute
    ADD CONSTRAINT constr_fed_user_attr_pk PRIMARY KEY (id);


--
-- TOC entry 3926 (class 2606 OID 17530)
-- Name: fed_user_consent constr_fed_user_consent_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fed_user_consent
    ADD CONSTRAINT constr_fed_user_consent_pk PRIMARY KEY (id);


--
-- TOC entry 3931 (class 2606 OID 17536)
-- Name: fed_user_credential constr_fed_user_cred_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fed_user_credential
    ADD CONSTRAINT constr_fed_user_cred_pk PRIMARY KEY (id);


--
-- TOC entry 3935 (class 2606 OID 17538)
-- Name: fed_user_group_membership constr_fed_user_group; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fed_user_group_membership
    ADD CONSTRAINT constr_fed_user_group PRIMARY KEY (group_id, user_id);


--
-- TOC entry 3943 (class 2606 OID 17540)
-- Name: fed_user_role_mapping constr_fed_user_role; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fed_user_role_mapping
    ADD CONSTRAINT constr_fed_user_role PRIMARY KEY (role_id, user_id);


--
-- TOC entry 3954 (class 2606 OID 17583)
-- Name: federated_user constr_federated_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.federated_user
    ADD CONSTRAINT constr_federated_user PRIMARY KEY (id);


--
-- TOC entry 3871 (class 2606 OID 17688)
-- Name: realm_default_groups constr_realm_default_groups; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT constr_realm_default_groups PRIMARY KEY (realm_id, group_id);


--
-- TOC entry 3794 (class 2606 OID 17705)
-- Name: realm_enabled_event_types constr_realm_enabl_event_types; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT constr_realm_enabl_event_types PRIMARY KEY (realm_id, value);


--
-- TOC entry 3725 (class 2606 OID 17707)
-- Name: realm_events_listeners constr_realm_events_listeners; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT constr_realm_events_listeners PRIMARY KEY (realm_id, value);


--
-- TOC entry 3791 (class 2606 OID 17709)
-- Name: realm_supported_locales constr_realm_supported_locales; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT constr_realm_supported_locales PRIMARY KEY (realm_id, value);


--
-- TOC entry 3782 (class 2606 OID 16837)
-- Name: identity_provider constraint_2b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT constraint_2b PRIMARY KEY (internal_id);


--
-- TOC entry 3767 (class 2606 OID 16771)
-- Name: client_attributes constraint_3c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT constraint_3c PRIMARY KEY (client_id, name);


--
-- TOC entry 3707 (class 2606 OID 16545)
-- Name: event_entity constraint_4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_entity
    ADD CONSTRAINT constraint_4 PRIMARY KEY (id);


--
-- TOC entry 3778 (class 2606 OID 16839)
-- Name: federated_identity constraint_40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT constraint_40 PRIMARY KEY (identity_provider, user_id);


--
-- TOC entry 3717 (class 2606 OID 16547)
-- Name: realm constraint_4a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT constraint_4a PRIMARY KEY (id);


--
-- TOC entry 3755 (class 2606 OID 16553)
-- Name: user_federation_provider constraint_5c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT constraint_5c PRIMARY KEY (id);


--
-- TOC entry 3695 (class 2606 OID 16557)
-- Name: client constraint_7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT constraint_7 PRIMARY KEY (id);


--
-- TOC entry 3735 (class 2606 OID 16561)
-- Name: scope_mapping constraint_81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT constraint_81 PRIMARY KEY (client_id, role_id);


--
-- TOC entry 3770 (class 2606 OID 16775)
-- Name: client_node_registrations constraint_84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT constraint_84 PRIMARY KEY (client_id, name);


--
-- TOC entry 3722 (class 2606 OID 16563)
-- Name: realm_attribute constraint_9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT constraint_9 PRIMARY KEY (name, realm_id);


--
-- TOC entry 3728 (class 2606 OID 16565)
-- Name: realm_required_credential constraint_92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT constraint_92 PRIMARY KEY (realm_id, type);


--
-- TOC entry 3713 (class 2606 OID 16567)
-- Name: keycloak_role constraint_a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT constraint_a PRIMARY KEY (id);


--
-- TOC entry 3816 (class 2606 OID 17692)
-- Name: admin_event_entity constraint_admin_event_entity; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_event_entity
    ADD CONSTRAINT constraint_admin_event_entity PRIMARY KEY (id);


--
-- TOC entry 3829 (class 2606 OID 17068)
-- Name: authenticator_config_entry constraint_auth_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authenticator_config_entry
    ADD CONSTRAINT constraint_auth_cfg_pk PRIMARY KEY (authenticator_id, name);


--
-- TOC entry 3825 (class 2606 OID 17066)
-- Name: authentication_execution constraint_auth_exec_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT constraint_auth_exec_pk PRIMARY KEY (id);


--
-- TOC entry 3822 (class 2606 OID 17064)
-- Name: authentication_flow constraint_auth_flow_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT constraint_auth_flow_pk PRIMARY KEY (id);


--
-- TOC entry 3819 (class 2606 OID 17062)
-- Name: authenticator_config constraint_auth_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT constraint_auth_pk PRIMARY KEY (id);


--
-- TOC entry 3761 (class 2606 OID 16569)
-- Name: user_role_mapping constraint_c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT constraint_c PRIMARY KEY (role_id, user_id);


--
-- TOC entry 3700 (class 2606 OID 17686)
-- Name: composite_role constraint_composite_role; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT constraint_composite_role PRIMARY KEY (composite, child_role);


--
-- TOC entry 3789 (class 2606 OID 16841)
-- Name: identity_provider_config constraint_d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT constraint_d PRIMARY KEY (identity_provider_id, name);


--
-- TOC entry 3903 (class 2606 OID 17409)
-- Name: policy_config constraint_dpc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT constraint_dpc PRIMARY KEY (policy_id, name);


--
-- TOC entry 3730 (class 2606 OID 16571)
-- Name: realm_smtp_config constraint_e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT constraint_e PRIMARY KEY (realm_id, name);


--
-- TOC entry 3704 (class 2606 OID 16573)
-- Name: credential constraint_f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT constraint_f PRIMARY KEY (id);


--
-- TOC entry 3753 (class 2606 OID 16575)
-- Name: user_federation_config constraint_f9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT constraint_f9 PRIMARY KEY (user_federation_provider_id, name);


--
-- TOC entry 3975 (class 2606 OID 17827)
-- Name: resource_server_perm_ticket constraint_fapmt; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT constraint_fapmt PRIMARY KEY (id);


--
-- TOC entry 3888 (class 2606 OID 17367)
-- Name: resource_server_resource constraint_farsr; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT constraint_farsr PRIMARY KEY (id);


--
-- TOC entry 3898 (class 2606 OID 17395)
-- Name: resource_server_policy constraint_farsrp; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT constraint_farsrp PRIMARY KEY (id);


--
-- TOC entry 3914 (class 2606 OID 17464)
-- Name: associated_policy constraint_farsrpap; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT constraint_farsrpap PRIMARY KEY (policy_id, associated_policy_id);


--
-- TOC entry 3908 (class 2606 OID 17434)
-- Name: resource_policy constraint_farsrpp; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT constraint_farsrpp PRIMARY KEY (resource_id, policy_id);


--
-- TOC entry 3893 (class 2606 OID 17381)
-- Name: resource_server_scope constraint_farsrs; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT constraint_farsrs PRIMARY KEY (id);


--
-- TOC entry 3905 (class 2606 OID 17419)
-- Name: resource_scope constraint_farsrsp; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT constraint_farsrsp PRIMARY KEY (resource_id, scope_id);


--
-- TOC entry 3911 (class 2606 OID 17449)
-- Name: scope_policy constraint_farsrsps; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT constraint_farsrsps PRIMARY KEY (scope_id, policy_id);


--
-- TOC entry 3744 (class 2606 OID 16577)
-- Name: user_entity constraint_fb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT constraint_fb PRIMARY KEY (id);


--
-- TOC entry 3835 (class 2606 OID 17076)
-- Name: user_federation_mapper_config constraint_fedmapper_cfg_pm; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT constraint_fedmapper_cfg_pm PRIMARY KEY (user_federation_mapper_id, name);


--
-- TOC entry 3831 (class 2606 OID 17074)
-- Name: user_federation_mapper constraint_fedmapperpm; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT constraint_fedmapperpm PRIMARY KEY (id);


--
-- TOC entry 3973 (class 2606 OID 17812)
-- Name: fed_user_consent_cl_scope constraint_fgrntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fed_user_consent_cl_scope
    ADD CONSTRAINT constraint_fgrntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- TOC entry 3969 (class 2606 OID 17802)
-- Name: user_consent_client_scope constraint_grntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT constraint_grntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- TOC entry 3809 (class 2606 OID 16949)
-- Name: user_consent constraint_grntcsnt_pm; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT constraint_grntcsnt_pm PRIMARY KEY (id);


--
-- TOC entry 3854 (class 2606 OID 17218)
-- Name: keycloak_group constraint_group; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT constraint_group PRIMARY KEY (id);


--
-- TOC entry 3862 (class 2606 OID 17225)
-- Name: group_attribute constraint_group_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT constraint_group_attribute_pk PRIMARY KEY (id);


--
-- TOC entry 3859 (class 2606 OID 17239)
-- Name: group_role_mapping constraint_group_role; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT constraint_group_role PRIMARY KEY (role_id, group_id);


--
-- TOC entry 3804 (class 2606 OID 16945)
-- Name: identity_provider_mapper constraint_idpm; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT constraint_idpm PRIMARY KEY (id);


--
-- TOC entry 3807 (class 2606 OID 17125)
-- Name: idp_mapper_config constraint_idpmconfig; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT constraint_idpmconfig PRIMARY KEY (idp_mapper_id, name);


--
-- TOC entry 4004 (class 2606 OID 18015)
-- Name: jgroups_ping constraint_jgroups_ping; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jgroups_ping
    ADD CONSTRAINT constraint_jgroups_ping PRIMARY KEY (address);


--
-- TOC entry 3797 (class 2606 OID 16943)
-- Name: migration_model constraint_migmod; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT constraint_migmod PRIMARY KEY (id);


--
-- TOC entry 3848 (class 2606 OID 17905)
-- Name: offline_client_session constraint_offl_cl_ses_pk3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offline_client_session
    ADD CONSTRAINT constraint_offl_cl_ses_pk3 PRIMARY KEY (user_session_id, client_id, client_storage_provider, external_client_id, offline_flag);


--
-- TOC entry 3842 (class 2606 OID 17195)
-- Name: offline_user_session constraint_offl_us_ses_pk2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offline_user_session
    ADD CONSTRAINT constraint_offl_us_ses_pk2 PRIMARY KEY (user_session_id, offline_flag);


--
-- TOC entry 4014 (class 2606 OID 18054)
-- Name: org_invitation constraint_org_invitation; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_invitation
    ADD CONSTRAINT constraint_org_invitation PRIMARY KEY (id);


--
-- TOC entry 3772 (class 2606 OID 16835)
-- Name: protocol_mapper constraint_pcm; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT constraint_pcm PRIMARY KEY (id);


--
-- TOC entry 3776 (class 2606 OID 17118)
-- Name: protocol_mapper_config constraint_pmconfig; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT constraint_pmconfig PRIMARY KEY (protocol_mapper_id, name);


--
-- TOC entry 3732 (class 2606 OID 17711)
-- Name: redirect_uris constraint_redirect_uris; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT constraint_redirect_uris PRIMARY KEY (client_id, value);


--
-- TOC entry 3840 (class 2606 OID 17158)
-- Name: required_action_config constraint_req_act_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.required_action_config
    ADD CONSTRAINT constraint_req_act_cfg_pk PRIMARY KEY (required_action_id, name);


--
-- TOC entry 3837 (class 2606 OID 17156)
-- Name: required_action_provider constraint_req_act_prv_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT constraint_req_act_prv_pk PRIMARY KEY (id);


--
-- TOC entry 3758 (class 2606 OID 17070)
-- Name: user_required_action constraint_required_action; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT constraint_required_action PRIMARY KEY (required_action, user_id);


--
-- TOC entry 3983 (class 2606 OID 17874)
-- Name: resource_uris constraint_resour_uris_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT constraint_resour_uris_pk PRIMARY KEY (resource_id, value);


--
-- TOC entry 3985 (class 2606 OID 17881)
-- Name: role_attribute constraint_role_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT constraint_role_attribute_pk PRIMARY KEY (id);


--
-- TOC entry 4001 (class 2606 OID 18004)
-- Name: revoked_token constraint_rt; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revoked_token
    ADD CONSTRAINT constraint_rt PRIMARY KEY (id);


--
-- TOC entry 3738 (class 2606 OID 17154)
-- Name: user_attribute constraint_user_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT constraint_user_attribute_pk PRIMARY KEY (id);


--
-- TOC entry 3866 (class 2606 OID 17232)
-- Name: user_group_membership constraint_user_group; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT constraint_user_group PRIMARY KEY (group_id, user_id);


--
-- TOC entry 3764 (class 2606 OID 17713)
-- Name: web_origins constraint_web_origins; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT constraint_web_origins PRIMARY KEY (client_id, value);


--
-- TOC entry 3693 (class 2606 OID 16394)
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- TOC entry 3880 (class 2606 OID 17335)
-- Name: client_scope_attributes pk_cl_tmpl_attr; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT pk_cl_tmpl_attr PRIMARY KEY (scope_id, name);


--
-- TOC entry 3875 (class 2606 OID 17294)
-- Name: client_scope pk_cli_template; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT pk_cli_template PRIMARY KEY (id);


--
-- TOC entry 3886 (class 2606 OID 17666)
-- Name: resource_server pk_resource_server; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server
    ADD CONSTRAINT pk_resource_server PRIMARY KEY (id);


--
-- TOC entry 3884 (class 2606 OID 17323)
-- Name: client_scope_role_mapping pk_template_scope; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT pk_template_scope PRIMARY KEY (scope_id, role_id);


--
-- TOC entry 4010 (class 2606 OID 18038)
-- Name: workflow_state pk_workflow_state; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_state
    ADD CONSTRAINT pk_workflow_state PRIMARY KEY (execution_id);


--
-- TOC entry 3967 (class 2606 OID 17787)
-- Name: default_client_scope r_def_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT r_def_cli_scope_bind PRIMARY KEY (realm_id, scope_id);


--
-- TOC entry 3988 (class 2606 OID 17922)
-- Name: realm_localizations realm_localizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_localizations
    ADD CONSTRAINT realm_localizations_pkey PRIMARY KEY (realm_id, locale);


--
-- TOC entry 3981 (class 2606 OID 17854)
-- Name: resource_attribute res_attr_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT res_attr_pk PRIMARY KEY (id);


--
-- TOC entry 3857 (class 2606 OID 17595)
-- Name: keycloak_group sibling_names; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT sibling_names UNIQUE (realm_id, parent_group, name);


--
-- TOC entry 3787 (class 2606 OID 16892)
-- Name: identity_provider uk_2daelwnibji49avxsrtuf6xj33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT uk_2daelwnibji49avxsrtuf6xj33 UNIQUE (provider_alias, realm_id);


--
-- TOC entry 3698 (class 2606 OID 16581)
-- Name: client uk_b71cjlbenv945rb6gcon438at; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT uk_b71cjlbenv945rb6gcon438at UNIQUE (realm_id, client_id);


--
-- TOC entry 3877 (class 2606 OID 17740)
-- Name: client_scope uk_cli_scope; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT uk_cli_scope UNIQUE (realm_id, name);


--
-- TOC entry 3749 (class 2606 OID 16585)
-- Name: user_entity uk_dykn684sl8up1crfei6eckhd7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_dykn684sl8up1crfei6eckhd7 UNIQUE (realm_id, email_constraint);


--
-- TOC entry 3812 (class 2606 OID 17993)
-- Name: user_consent uk_external_consent; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_external_consent UNIQUE (client_storage_provider, external_client_id, user_id);


--
-- TOC entry 3891 (class 2606 OID 17913)
-- Name: resource_server_resource uk_frsr6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5ha6 UNIQUE (name, owner, resource_server_id);


--
-- TOC entry 3979 (class 2606 OID 17909)
-- Name: resource_server_perm_ticket uk_frsr6t700s9v50bu18ws5pmt; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5pmt UNIQUE (owner, requester, resource_server_id, resource_id, scope_id);


--
-- TOC entry 3901 (class 2606 OID 17657)
-- Name: resource_server_policy uk_frsrpt700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT uk_frsrpt700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- TOC entry 3896 (class 2606 OID 17661)
-- Name: resource_server_scope uk_frsrst700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT uk_frsrst700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- TOC entry 3814 (class 2606 OID 17991)
-- Name: user_consent uk_local_consent; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_local_consent UNIQUE (client_id, user_id);


--
-- TOC entry 3800 (class 2606 OID 18028)
-- Name: migration_model uk_migration_update_time; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT uk_migration_update_time UNIQUE (update_time);


--
-- TOC entry 3802 (class 2606 OID 18026)
-- Name: migration_model uk_migration_version; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT uk_migration_version UNIQUE (version);


--
-- TOC entry 3992 (class 2606 OID 17997)
-- Name: org uk_org_alias; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_alias UNIQUE (realm_id, alias);


--
-- TOC entry 3994 (class 2606 OID 17982)
-- Name: org uk_org_group; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_group UNIQUE (group_id);


--
-- TOC entry 4019 (class 2606 OID 18064)
-- Name: org_invitation uk_org_invitation_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_invitation
    ADD CONSTRAINT uk_org_invitation_email UNIQUE (organization_id, email);


--
-- TOC entry 3996 (class 2606 OID 17980)
-- Name: org uk_org_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT uk_org_name UNIQUE (realm_id, name);


--
-- TOC entry 3720 (class 2606 OID 16593)
-- Name: realm uk_orvsdmla56612eaefiq6wl5oi; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT uk_orvsdmla56612eaefiq6wl5oi UNIQUE (name);


--
-- TOC entry 3751 (class 2606 OID 17585)
-- Name: user_entity uk_ru8tt6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_ru8tt6t700s9v50bu18ws5ha6 UNIQUE (realm_id, username);


--
-- TOC entry 4012 (class 2606 OID 18040)
-- Name: workflow_state uq_workflow_resource; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_state
    ADD CONSTRAINT uq_workflow_resource UNIQUE (workflow_id, resource_id);


--
-- TOC entry 3922 (class 1259 OID 17963)
-- Name: fed_user_attr_long_values; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fed_user_attr_long_values ON public.fed_user_attribute USING btree (long_value_hash, name);


--
-- TOC entry 3923 (class 1259 OID 17965)
-- Name: fed_user_attr_long_values_lower_case; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fed_user_attr_long_values_lower_case ON public.fed_user_attribute USING btree (long_value_hash_lower_case, name);


--
-- TOC entry 3817 (class 1259 OID 17938)
-- Name: idx_admin_event_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_event_time ON public.admin_event_entity USING btree (realm_id, admin_event_time);


--
-- TOC entry 3915 (class 1259 OID 17609)
-- Name: idx_assoc_pol_assoc_pol_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assoc_pol_assoc_pol_id ON public.associated_policy USING btree (associated_policy_id);


--
-- TOC entry 3820 (class 1259 OID 17613)
-- Name: idx_auth_config_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auth_config_realm ON public.authenticator_config USING btree (realm_id);


--
-- TOC entry 3826 (class 1259 OID 17611)
-- Name: idx_auth_exec_flow; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auth_exec_flow ON public.authentication_execution USING btree (flow_id);


--
-- TOC entry 3827 (class 1259 OID 17610)
-- Name: idx_auth_exec_realm_flow; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auth_exec_realm_flow ON public.authentication_execution USING btree (realm_id, flow_id);


--
-- TOC entry 3823 (class 1259 OID 17612)
-- Name: idx_auth_flow_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auth_flow_realm ON public.authentication_flow USING btree (realm_id);


--
-- TOC entry 3918 (class 1259 OID 18066)
-- Name: idx_broker_link_identity_provider; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_broker_link_identity_provider ON public.broker_link USING btree (realm_id, identity_provider, broker_user_id);


--
-- TOC entry 3919 (class 1259 OID 18065)
-- Name: idx_broker_link_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_broker_link_user_id ON public.broker_link USING btree (user_id);


--
-- TOC entry 3962 (class 1259 OID 17929)
-- Name: idx_cl_clscope; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cl_clscope ON public.client_scope_client USING btree (scope_id);


--
-- TOC entry 3768 (class 1259 OID 17967)
-- Name: idx_client_att_by_name_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_client_att_by_name_value ON public.client_attributes USING btree (name, substr(value, 1, 255));


--
-- TOC entry 3696 (class 1259 OID 17914)
-- Name: idx_client_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_client_id ON public.client USING btree (client_id);


--
-- TOC entry 3957 (class 1259 OID 17654)
-- Name: idx_client_init_acc_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_client_init_acc_realm ON public.client_initial_access USING btree (realm_id);


--
-- TOC entry 3878 (class 1259 OID 17817)
-- Name: idx_clscope_attrs; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clscope_attrs ON public.client_scope_attributes USING btree (scope_id);


--
-- TOC entry 3963 (class 1259 OID 17926)
-- Name: idx_clscope_cl; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clscope_cl ON public.client_scope_client USING btree (client_id);


--
-- TOC entry 3773 (class 1259 OID 17814)
-- Name: idx_clscope_protmap; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clscope_protmap ON public.protocol_mapper USING btree (client_scope_id);


--
-- TOC entry 3881 (class 1259 OID 17815)
-- Name: idx_clscope_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clscope_role ON public.client_scope_role_mapping USING btree (scope_id);


--
-- TOC entry 3948 (class 1259 OID 17620)
-- Name: idx_compo_config_compo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_compo_config_compo ON public.component_config USING btree (component_id);


--
-- TOC entry 3951 (class 1259 OID 17888)
-- Name: idx_component_provider_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_component_provider_type ON public.component USING btree (provider_type);


--
-- TOC entry 3952 (class 1259 OID 17618)
-- Name: idx_component_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_component_realm ON public.component USING btree (realm_id);


--
-- TOC entry 3701 (class 1259 OID 17621)
-- Name: idx_composite; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_composite ON public.composite_role USING btree (composite);


--
-- TOC entry 3702 (class 1259 OID 17622)
-- Name: idx_composite_child; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_composite_child ON public.composite_role USING btree (child_role);


--
-- TOC entry 3964 (class 1259 OID 17820)
-- Name: idx_defcls_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_defcls_realm ON public.default_client_scope USING btree (realm_id);


--
-- TOC entry 3965 (class 1259 OID 17821)
-- Name: idx_defcls_scope; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_defcls_scope ON public.default_client_scope USING btree (scope_id);


--
-- TOC entry 3708 (class 1259 OID 18031)
-- Name: idx_event_entity_user_id_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_entity_user_id_type ON public.event_entity USING btree (user_id, type, event_time);


--
-- TOC entry 3709 (class 1259 OID 17915)
-- Name: idx_event_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_time ON public.event_entity USING btree (realm_id, event_time);


--
-- TOC entry 3779 (class 1259 OID 17352)
-- Name: idx_fedidentity_feduser; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fedidentity_feduser ON public.federated_identity USING btree (federated_user_id);


--
-- TOC entry 3780 (class 1259 OID 17351)
-- Name: idx_fedidentity_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fedidentity_user ON public.federated_identity USING btree (user_id);


--
-- TOC entry 3924 (class 1259 OID 17714)
-- Name: idx_fu_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_attribute ON public.fed_user_attribute USING btree (user_id, realm_id, name);


--
-- TOC entry 3927 (class 1259 OID 17734)
-- Name: idx_fu_cnsnt_ext; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_cnsnt_ext ON public.fed_user_consent USING btree (user_id, client_storage_provider, external_client_id);


--
-- TOC entry 3928 (class 1259 OID 17897)
-- Name: idx_fu_consent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_consent ON public.fed_user_consent USING btree (user_id, client_id);


--
-- TOC entry 3929 (class 1259 OID 17716)
-- Name: idx_fu_consent_ru; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_consent_ru ON public.fed_user_consent USING btree (realm_id, user_id);


--
-- TOC entry 3932 (class 1259 OID 17717)
-- Name: idx_fu_credential; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_credential ON public.fed_user_credential USING btree (user_id, type);


--
-- TOC entry 3933 (class 1259 OID 17718)
-- Name: idx_fu_credential_ru; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_credential_ru ON public.fed_user_credential USING btree (realm_id, user_id);


--
-- TOC entry 3936 (class 1259 OID 17719)
-- Name: idx_fu_group_membership; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_group_membership ON public.fed_user_group_membership USING btree (user_id, group_id);


--
-- TOC entry 3937 (class 1259 OID 17720)
-- Name: idx_fu_group_membership_ru; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_group_membership_ru ON public.fed_user_group_membership USING btree (realm_id, user_id);


--
-- TOC entry 3940 (class 1259 OID 17721)
-- Name: idx_fu_required_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_required_action ON public.fed_user_required_action USING btree (user_id, required_action);


--
-- TOC entry 3941 (class 1259 OID 17722)
-- Name: idx_fu_required_action_ru; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_required_action_ru ON public.fed_user_required_action USING btree (realm_id, user_id);


--
-- TOC entry 3944 (class 1259 OID 17723)
-- Name: idx_fu_role_mapping; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_role_mapping ON public.fed_user_role_mapping USING btree (user_id, role_id);


--
-- TOC entry 3945 (class 1259 OID 17724)
-- Name: idx_fu_role_mapping_ru; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fu_role_mapping_ru ON public.fed_user_role_mapping USING btree (realm_id, user_id);


--
-- TOC entry 3863 (class 1259 OID 17941)
-- Name: idx_group_att_by_name_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_group_att_by_name_value ON public.group_attribute USING btree (name, ((value)::character varying(250)));


--
-- TOC entry 3864 (class 1259 OID 17625)
-- Name: idx_group_attr_group; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_group_attr_group ON public.group_attribute USING btree (group_id);


--
-- TOC entry 3855 (class 1259 OID 18072)
-- Name: idx_group_org_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_group_org_id ON public.keycloak_group USING btree (org_id);


--
-- TOC entry 3860 (class 1259 OID 17626)
-- Name: idx_group_role_mapp_group; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_group_role_mapp_group ON public.group_role_mapping USING btree (group_id);


--
-- TOC entry 3805 (class 1259 OID 17628)
-- Name: idx_id_prov_mapp_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_id_prov_mapp_realm ON public.identity_provider_mapper USING btree (realm_id);


--
-- TOC entry 3783 (class 1259 OID 17627)
-- Name: idx_ident_prov_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ident_prov_realm ON public.identity_provider USING btree (realm_id);


--
-- TOC entry 3784 (class 1259 OID 18008)
-- Name: idx_idp_for_login; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_idp_for_login ON public.identity_provider USING btree (realm_id, enabled, link_only, hide_on_login, organization_id);


--
-- TOC entry 3785 (class 1259 OID 18007)
-- Name: idx_idp_realm_org; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_idp_realm_org ON public.identity_provider USING btree (realm_id, organization_id);


--
-- TOC entry 3714 (class 1259 OID 17629)
-- Name: idx_keycloak_role_client; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keycloak_role_client ON public.keycloak_role USING btree (client);


--
-- TOC entry 3715 (class 1259 OID 17630)
-- Name: idx_keycloak_role_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keycloak_role_realm ON public.keycloak_role USING btree (realm);


--
-- TOC entry 3849 (class 1259 OID 18043)
-- Name: idx_offline_css_by_client; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_offline_css_by_client ON public.offline_client_session USING btree (client_id, offline_flag) WHERE ((client_id)::text <> 'external'::text);


--
-- TOC entry 3850 (class 1259 OID 18074)
-- Name: idx_offline_css_by_client_and_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_offline_css_by_client_and_realm ON public.offline_client_session USING btree (realm_id, offline_flag, client_id, client_storage_provider, external_client_id);


--
-- TOC entry 3851 (class 1259 OID 18044)
-- Name: idx_offline_css_by_client_storage_provider; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_offline_css_by_client_storage_provider ON public.offline_client_session USING btree (client_storage_provider, external_client_id, offline_flag) WHERE ((client_storage_provider)::text <> 'internal'::text);


--
-- TOC entry 3852 (class 1259 OID 18073)
-- Name: idx_offline_css_by_user_session_and_offline; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_offline_css_by_user_session_and_offline ON public.offline_client_session USING btree (offline_flag, user_session_id);


--
-- TOC entry 3843 (class 1259 OID 17971)
-- Name: idx_offline_uss_by_broker_session_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_offline_uss_by_broker_session_id ON public.offline_user_session USING btree (broker_session_id, realm_id);


--
-- TOC entry 3844 (class 1259 OID 17933)
-- Name: idx_offline_uss_by_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_offline_uss_by_user ON public.offline_user_session USING btree (user_id, realm_id, offline_flag);


--
-- TOC entry 3999 (class 1259 OID 17999)
-- Name: idx_org_domain_org_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_org_domain_org_id ON public.org_domain USING btree (org_id);


--
-- TOC entry 4015 (class 1259 OID 18061)
-- Name: idx_org_invitation_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_org_invitation_email ON public.org_invitation USING btree (email);


--
-- TOC entry 4016 (class 1259 OID 18062)
-- Name: idx_org_invitation_expires; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_org_invitation_expires ON public.org_invitation USING btree (expires_at);


--
-- TOC entry 4017 (class 1259 OID 18060)
-- Name: idx_org_invitation_org_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_org_invitation_org_id ON public.org_invitation USING btree (organization_id);


--
-- TOC entry 3976 (class 1259 OID 17995)
-- Name: idx_perm_ticket_owner; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_perm_ticket_owner ON public.resource_server_perm_ticket USING btree (owner);


--
-- TOC entry 3977 (class 1259 OID 17994)
-- Name: idx_perm_ticket_requester; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_perm_ticket_requester ON public.resource_server_perm_ticket USING btree (requester);


--
-- TOC entry 3774 (class 1259 OID 17631)
-- Name: idx_protocol_mapper_client; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_protocol_mapper_client ON public.protocol_mapper USING btree (client_id);


--
-- TOC entry 3723 (class 1259 OID 17634)
-- Name: idx_realm_attr_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_realm_attr_realm ON public.realm_attribute USING btree (realm_id);


--
-- TOC entry 3873 (class 1259 OID 17813)
-- Name: idx_realm_clscope; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_realm_clscope ON public.client_scope USING btree (realm_id);


--
-- TOC entry 3872 (class 1259 OID 17635)
-- Name: idx_realm_def_grp_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_realm_def_grp_realm ON public.realm_default_groups USING btree (realm_id);


--
-- TOC entry 3726 (class 1259 OID 17638)
-- Name: idx_realm_evt_list_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_realm_evt_list_realm ON public.realm_events_listeners USING btree (realm_id);


--
-- TOC entry 3795 (class 1259 OID 17637)
-- Name: idx_realm_evt_types_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_realm_evt_types_realm ON public.realm_enabled_event_types USING btree (realm_id);


--
-- TOC entry 3718 (class 1259 OID 17633)
-- Name: idx_realm_master_adm_cli; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_realm_master_adm_cli ON public.realm USING btree (master_admin_client);


--
-- TOC entry 3792 (class 1259 OID 17639)
-- Name: idx_realm_supp_local_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_realm_supp_local_realm ON public.realm_supported_locales USING btree (realm_id);


--
-- TOC entry 3733 (class 1259 OID 17640)
-- Name: idx_redir_uri_client; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_redir_uri_client ON public.redirect_uris USING btree (client_id);


--
-- TOC entry 3838 (class 1259 OID 17641)
-- Name: idx_req_act_prov_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_req_act_prov_realm ON public.required_action_provider USING btree (realm_id);


--
-- TOC entry 3909 (class 1259 OID 17642)
-- Name: idx_res_policy_policy; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_res_policy_policy ON public.resource_policy USING btree (policy_id);


--
-- TOC entry 3906 (class 1259 OID 17643)
-- Name: idx_res_scope_scope; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_res_scope_scope ON public.resource_scope USING btree (scope_id);


--
-- TOC entry 3899 (class 1259 OID 17662)
-- Name: idx_res_serv_pol_res_serv; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_res_serv_pol_res_serv ON public.resource_server_policy USING btree (resource_server_id);


--
-- TOC entry 3889 (class 1259 OID 17663)
-- Name: idx_res_srv_res_res_srv; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_res_srv_res_res_srv ON public.resource_server_resource USING btree (resource_server_id);


--
-- TOC entry 3894 (class 1259 OID 17664)
-- Name: idx_res_srv_scope_res_srv; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_res_srv_scope_res_srv ON public.resource_server_scope USING btree (resource_server_id);


--
-- TOC entry 4002 (class 1259 OID 18005)
-- Name: idx_rev_token_on_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rev_token_on_expire ON public.revoked_token USING btree (expire);


--
-- TOC entry 3986 (class 1259 OID 17887)
-- Name: idx_role_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_role_attribute ON public.role_attribute USING btree (role_id);


--
-- TOC entry 3882 (class 1259 OID 17816)
-- Name: idx_role_clscope; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_role_clscope ON public.client_scope_role_mapping USING btree (role_id);


--
-- TOC entry 3736 (class 1259 OID 17647)
-- Name: idx_scope_mapping_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scope_mapping_role ON public.scope_mapping USING btree (role_id);


--
-- TOC entry 3912 (class 1259 OID 17648)
-- Name: idx_scope_policy_policy; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scope_policy_policy ON public.scope_policy USING btree (policy_id);


--
-- TOC entry 3798 (class 1259 OID 17895)
-- Name: idx_update_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_update_time ON public.migration_model USING btree (update_time);


--
-- TOC entry 3970 (class 1259 OID 17822)
-- Name: idx_usconsent_clscope; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usconsent_clscope ON public.user_consent_client_scope USING btree (user_consent_id);


--
-- TOC entry 3971 (class 1259 OID 17939)
-- Name: idx_usconsent_scope_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usconsent_scope_id ON public.user_consent_client_scope USING btree (scope_id);


--
-- TOC entry 3739 (class 1259 OID 17348)
-- Name: idx_user_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_attribute ON public.user_attribute USING btree (user_id);


--
-- TOC entry 3740 (class 1259 OID 17936)
-- Name: idx_user_attribute_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_attribute_name ON public.user_attribute USING btree (name, value);


--
-- TOC entry 3810 (class 1259 OID 17345)
-- Name: idx_user_consent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_consent ON public.user_consent USING btree (user_id);


--
-- TOC entry 3745 (class 1259 OID 18075)
-- Name: idx_user_created_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_created_timestamp ON public.user_entity USING btree (realm_id, created_timestamp);


--
-- TOC entry 3705 (class 1259 OID 17349)
-- Name: idx_user_credential; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_credential ON public.credential USING btree (user_id);


--
-- TOC entry 3746 (class 1259 OID 17342)
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_email ON public.user_entity USING btree (email);


--
-- TOC entry 3867 (class 1259 OID 17344)
-- Name: idx_user_group_mapping; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_group_mapping ON public.user_group_membership USING btree (user_id);


--
-- TOC entry 3759 (class 1259 OID 17350)
-- Name: idx_user_reqactions; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_reqactions ON public.user_required_action USING btree (user_id);


--
-- TOC entry 3762 (class 1259 OID 17343)
-- Name: idx_user_role_mapping; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_role_mapping ON public.user_role_mapping USING btree (user_id);


--
-- TOC entry 3747 (class 1259 OID 17937)
-- Name: idx_user_service_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_service_account ON public.user_entity USING btree (realm_id, service_account_client_link);


--
-- TOC entry 3845 (class 1259 OID 18046)
-- Name: idx_user_session_expiration_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_session_expiration_created ON public.offline_user_session USING btree (realm_id, offline_flag, remember_me, created_on, user_session_id, user_id);


--
-- TOC entry 3846 (class 1259 OID 18047)
-- Name: idx_user_session_expiration_last_refresh; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_session_expiration_last_refresh ON public.offline_user_session USING btree (realm_id, offline_flag, remember_me, last_session_refresh, user_session_id, user_id);


--
-- TOC entry 3832 (class 1259 OID 17650)
-- Name: idx_usr_fed_map_fed_prv; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usr_fed_map_fed_prv ON public.user_federation_mapper USING btree (federation_provider_id);


--
-- TOC entry 3833 (class 1259 OID 17651)
-- Name: idx_usr_fed_map_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usr_fed_map_realm ON public.user_federation_mapper USING btree (realm_id);


--
-- TOC entry 3756 (class 1259 OID 17652)
-- Name: idx_usr_fed_prv_realm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usr_fed_prv_realm ON public.user_federation_provider USING btree (realm_id);


--
-- TOC entry 3765 (class 1259 OID 17653)
-- Name: idx_web_orig_client; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_web_orig_client ON public.web_origins USING btree (client_id);


--
-- TOC entry 4007 (class 1259 OID 18045)
-- Name: idx_workflow_state_provider; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_workflow_state_provider ON public.workflow_state USING btree (resource_id);


--
-- TOC entry 4008 (class 1259 OID 18041)
-- Name: idx_workflow_state_step; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_workflow_state_step ON public.workflow_state USING btree (workflow_id, scheduled_step_id);


--
-- TOC entry 3741 (class 1259 OID 17962)
-- Name: user_attr_long_values; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_attr_long_values ON public.user_attribute USING btree (long_value_hash, name);


--
-- TOC entry 3742 (class 1259 OID 17964)
-- Name: user_attr_long_values_lower_case; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_attr_long_values_lower_case ON public.user_attribute USING btree (long_value_hash_lower_case, name);


--
-- TOC entry 4042 (class 2606 OID 16846)
-- Name: identity_provider fk2b4ebc52ae5c3b34; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT fk2b4ebc52ae5c3b34 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4036 (class 2606 OID 16776)
-- Name: client_attributes fk3c47c64beacca966; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT fk3c47c64beacca966 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4041 (class 2606 OID 16856)
-- Name: federated_identity fk404288b92ef007a6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT fk404288b92ef007a6 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4037 (class 2606 OID 17003)
-- Name: client_node_registrations fk4129723ba992f594; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT fk4129723ba992f594 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4028 (class 2606 OID 16601)
-- Name: redirect_uris fk_1burs8pb4ouj97h5wuppahv9f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT fk_1burs8pb4ouj97h5wuppahv9f FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4032 (class 2606 OID 16606)
-- Name: user_federation_provider fk_1fj32f6ptolw2qy60cd8n01e8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT fk_1fj32f6ptolw2qy60cd8n01e8 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4026 (class 2606 OID 16616)
-- Name: realm_required_credential fk_5hg65lybevavkqfki3kponh9v; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT fk_5hg65lybevavkqfki3kponh9v FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4085 (class 2606 OID 17855)
-- Name: resource_attribute fk_5hrm2vlf9ql5fu022kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu022kqepovbr FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- TOC entry 4030 (class 2606 OID 16621)
-- Name: user_attribute fk_5hrm2vlf9ql5fu043kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu043kqepovbr FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4033 (class 2606 OID 16631)
-- Name: user_required_action fk_6qj3w1jw9cvafhe19bwsiuvmd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT fk_6qj3w1jw9cvafhe19bwsiuvmd FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4023 (class 2606 OID 16636)
-- Name: keycloak_role fk_6vyqfe4cn4wlq8r6kt5vdsj5c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT fk_6vyqfe4cn4wlq8r6kt5vdsj5c FOREIGN KEY (realm) REFERENCES public.realm(id);


--
-- TOC entry 4027 (class 2606 OID 16641)
-- Name: realm_smtp_config fk_70ej8xdxgxd0b9hh6180irr0o; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT fk_70ej8xdxgxd0b9hh6180irr0o FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4024 (class 2606 OID 16656)
-- Name: realm_attribute fk_8shxd6l3e9atqukacxgpffptw; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT fk_8shxd6l3e9atqukacxgpffptw FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4020 (class 2606 OID 16661)
-- Name: composite_role fk_a63wvekftu8jo1pnj81e7mce2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_a63wvekftu8jo1pnj81e7mce2 FOREIGN KEY (composite) REFERENCES public.keycloak_role(id);


--
-- TOC entry 4051 (class 2606 OID 17097)
-- Name: authentication_execution fk_auth_exec_flow; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_flow FOREIGN KEY (flow_id) REFERENCES public.authentication_flow(id);


--
-- TOC entry 4052 (class 2606 OID 17092)
-- Name: authentication_execution fk_auth_exec_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4050 (class 2606 OID 17087)
-- Name: authentication_flow fk_auth_flow_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT fk_auth_flow_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4049 (class 2606 OID 17082)
-- Name: authenticator_config fk_auth_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT fk_auth_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4034 (class 2606 OID 16671)
-- Name: user_role_mapping fk_c4fqv34p1mbylloxang7b1q3l; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT fk_c4fqv34p1mbylloxang7b1q3l FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4062 (class 2606 OID 17761)
-- Name: client_scope_attributes fk_cl_scope_attr_scope; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT fk_cl_scope_attr_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- TOC entry 4063 (class 2606 OID 17751)
-- Name: client_scope_role_mapping fk_cl_scope_rm_scope; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT fk_cl_scope_rm_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- TOC entry 4038 (class 2606 OID 17746)
-- Name: protocol_mapper fk_cli_scope_mapper; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_cli_scope_mapper FOREIGN KEY (client_scope_id) REFERENCES public.client_scope(id);


--
-- TOC entry 4078 (class 2606 OID 17604)
-- Name: client_initial_access fk_client_init_acc_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT fk_client_init_acc_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4076 (class 2606 OID 17552)
-- Name: component_config fk_component_config; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT fk_component_config FOREIGN KEY (component_id) REFERENCES public.component(id);


--
-- TOC entry 4077 (class 2606 OID 17547)
-- Name: component fk_component_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT fk_component_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4061 (class 2606 OID 17252)
-- Name: realm_default_groups fk_def_groups_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT fk_def_groups_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4055 (class 2606 OID 17112)
-- Name: user_federation_mapper_config fk_fedmapper_cfg; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT fk_fedmapper_cfg FOREIGN KEY (user_federation_mapper_id) REFERENCES public.user_federation_mapper(id);


--
-- TOC entry 4053 (class 2606 OID 17107)
-- Name: user_federation_mapper fk_fedmapperpm_fedprv; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_fedprv FOREIGN KEY (federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- TOC entry 4054 (class 2606 OID 17102)
-- Name: user_federation_mapper fk_fedmapperpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4074 (class 2606 OID 17470)
-- Name: associated_policy fk_frsr5s213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsr5s213xcx4wnkog82ssrfy FOREIGN KEY (associated_policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4072 (class 2606 OID 17455)
-- Name: scope_policy fk_frsrasp13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrasp13xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4081 (class 2606 OID 17828)
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog82sspmt; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82sspmt FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- TOC entry 4064 (class 2606 OID 17672)
-- Name: resource_server_resource fk_frsrho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- TOC entry 4082 (class 2606 OID 17833)
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog83sspmt; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog83sspmt FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- TOC entry 4083 (class 2606 OID 17838)
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog84sspmt; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog84sspmt FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- TOC entry 4075 (class 2606 OID 17465)
-- Name: associated_policy fk_frsrpas14xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsrpas14xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4073 (class 2606 OID 17450)
-- Name: scope_policy fk_frsrpass3xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrpass3xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- TOC entry 4084 (class 2606 OID 17860)
-- Name: resource_server_perm_ticket fk_frsrpo2128cx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrpo2128cx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4066 (class 2606 OID 17667)
-- Name: resource_server_policy fk_frsrpo213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT fk_frsrpo213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- TOC entry 4068 (class 2606 OID 17420)
-- Name: resource_scope fk_frsrpos13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrpos13xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- TOC entry 4070 (class 2606 OID 17435)
-- Name: resource_policy fk_frsrpos53xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpos53xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- TOC entry 4071 (class 2606 OID 17440)
-- Name: resource_policy fk_frsrpp213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpp213xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4069 (class 2606 OID 17425)
-- Name: resource_scope fk_frsrps213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrps213xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- TOC entry 4065 (class 2606 OID 17677)
-- Name: resource_server_scope fk_frsrso213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT fk_frsrso213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- TOC entry 4021 (class 2606 OID 16686)
-- Name: composite_role fk_gr7thllb9lu8q4vqa4524jjy8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_gr7thllb9lu8q4vqa4524jjy8 FOREIGN KEY (child_role) REFERENCES public.keycloak_role(id);


--
-- TOC entry 4080 (class 2606 OID 17803)
-- Name: user_consent_client_scope fk_grntcsnt_clsc_usc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT fk_grntcsnt_clsc_usc FOREIGN KEY (user_consent_id) REFERENCES public.user_consent(id);


--
-- TOC entry 4048 (class 2606 OID 16966)
-- Name: user_consent fk_grntcsnt_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT fk_grntcsnt_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4059 (class 2606 OID 17226)
-- Name: group_attribute fk_group_attribute_group; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT fk_group_attribute_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- TOC entry 4057 (class 2606 OID 18067)
-- Name: keycloak_group fk_group_organization; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT fk_group_organization FOREIGN KEY (org_id) REFERENCES public.org(id);


--
-- TOC entry 4058 (class 2606 OID 17240)
-- Name: group_role_mapping fk_group_role_group; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT fk_group_role_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- TOC entry 4045 (class 2606 OID 16912)
-- Name: realm_enabled_event_types fk_h846o4h0w8epx5nwedrf5y69j; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT fk_h846o4h0w8epx5nwedrf5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4025 (class 2606 OID 16696)
-- Name: realm_events_listeners fk_h846o4h0w8epx5nxev9f5y69j; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT fk_h846o4h0w8epx5nxev9f5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4046 (class 2606 OID 16956)
-- Name: identity_provider_mapper fk_idpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT fk_idpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4047 (class 2606 OID 17126)
-- Name: idp_mapper_config fk_idpmconfig; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT fk_idpmconfig FOREIGN KEY (idp_mapper_id) REFERENCES public.identity_provider_mapper(id);


--
-- TOC entry 4035 (class 2606 OID 16706)
-- Name: web_origins fk_lojpho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT fk_lojpho213xcx4wnkog82ssrfy FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4088 (class 2606 OID 18055)
-- Name: org_invitation fk_org_invitation_org; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_invitation
    ADD CONSTRAINT fk_org_invitation_org FOREIGN KEY (organization_id) REFERENCES public.org(id) ON DELETE CASCADE;


--
-- TOC entry 4029 (class 2606 OID 16716)
-- Name: scope_mapping fk_ouse064plmlr732lxjcn1q5f1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT fk_ouse064plmlr732lxjcn1q5f1 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4039 (class 2606 OID 16851)
-- Name: protocol_mapper fk_pcm_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_pcm_realm FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- TOC entry 4022 (class 2606 OID 16731)
-- Name: credential fk_pfyr0glasqyl0dei3kl69r6v0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT fk_pfyr0glasqyl0dei3kl69r6v0 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4040 (class 2606 OID 17119)
-- Name: protocol_mapper_config fk_pmconfig; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT fk_pmconfig FOREIGN KEY (protocol_mapper_id) REFERENCES public.protocol_mapper(id);


--
-- TOC entry 4079 (class 2606 OID 17788)
-- Name: default_client_scope fk_r_def_cli_scope_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT fk_r_def_cli_scope_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4056 (class 2606 OID 17161)
-- Name: required_action_provider fk_req_act_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT fk_req_act_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4086 (class 2606 OID 17868)
-- Name: resource_uris fk_resource_server_uris; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT fk_resource_server_uris FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- TOC entry 4087 (class 2606 OID 17882)
-- Name: role_attribute fk_role_attribute_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT fk_role_attribute_id FOREIGN KEY (role_id) REFERENCES public.keycloak_role(id);


--
-- TOC entry 4044 (class 2606 OID 16881)
-- Name: realm_supported_locales fk_supported_locales_realm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT fk_supported_locales_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- TOC entry 4031 (class 2606 OID 16751)
-- Name: user_federation_config fk_t13hpu1j94r2ebpekr39x5eu5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT fk_t13hpu1j94r2ebpekr39x5eu5 FOREIGN KEY (user_federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- TOC entry 4060 (class 2606 OID 17233)
-- Name: user_group_membership fk_user_group_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT fk_user_group_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- TOC entry 4067 (class 2606 OID 17410)
-- Name: policy_config fkdc34197cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT fkdc34197cf864c4e43 FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- TOC entry 4043 (class 2606 OID 16861)
-- Name: identity_provider_config fkdc4897cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT fkdc4897cf864c4e43 FOREIGN KEY (identity_provider_id) REFERENCES public.identity_provider(internal_id);


-- Completed on 2026-05-07 22:55:12

--
-- PostgreSQL database dump complete
--

\unrestrict OHfuUJS6D87P4RYdxQW8kgLLsj4KqfpxS3qf6U65rZDAgWVucsIYJpWhYOlY8ZT

