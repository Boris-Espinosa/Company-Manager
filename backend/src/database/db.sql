
--TYPES
CREATE TYPE tasks_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE task_event_status AS ENUM('CREATED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED', 'DELAYED');


--TABLES
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


-- FUNCTIONS
CREATE OR REPLACE FUNCTION task_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO task_events(task_id, comment, status)
    VALUES (
        NEW.id,
        'Task created',
        'CREATED'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION log_task_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO task_events(task_id, comment, status)
        VALUES (
            NEW.id,
            'status changed',
            NEW.status
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION set_default_assigned_user()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.assigned_to_id IS NULL THEN
        NEW.assigned_to_id := NEW.created_by_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION set_actual_end_time()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'COMPLETED'
       AND OLD.status IS DISTINCT FROM 'COMPLETED' THEN
        NEW.actual_end_time := CURRENT_TIMESTAMP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_delayed_task_event()
RETURNS TRIGGER AS $$
BEGIN
    IF
        NEW.expected_end_time IS NOT NULL
        AND NEW.expected_end_time < NOW()
        AND (OLD.expected_end_time IS NULL OR OLD.expected_end_time >= NOW())
        AND NEW.status IS DISTINCT FROM 'COMPLETED'
    THEN
        INSERT INTO task_events (task_id, comment, status)
        VALUES (
            NEW.id,
            'task delayed',
            'DELAYED'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS
CREATE TRIGGER on_task_insert
AFTER INSERT ON tasks
FOR EACH ROW
EXECUTE FUNCTION task_created();


CREATE TRIGGER on_task_update
AFTER UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION log_task_status_change();


CREATE TRIGGER set_default_assigned_user_trigger
BEFORE INSERT ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_default_assigned_user();


CREATE TRIGGER set_actual_end_time_trigger
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_actual_end_time();

CREATE TRIGGER set_delayed_task_event_trigger
AFTER UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_delayed_task_event();