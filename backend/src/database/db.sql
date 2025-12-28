CREATE TYPE tasks_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE task_event_status AS ENUM('CREATED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users (id)
        ON DELETE CASCADE
);

CREATE TABLE user_companies (
    user_id INT NOT NULL,
    company_id INT NOT NULL,
    PRIMARY KEY (user_id, company_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id)
        ON DELETE CASCADE
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    created_by_id INT NOT NULL,
    assigned_to_id INT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_end_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    status tasks_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_id) REFERENCES users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (assigned_to_id) REFERENCES users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies (id)
        ON DELETE CASCADE
);

CREATE TABLE task_events (
    id SERIAL PRIMARY KEY,
    task_id INT NOT NULL,
    comment TEXT,
    status task_event_status NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks (id)
        ON DELETE CASCADE
);