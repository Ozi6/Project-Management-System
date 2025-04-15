DROP DATABASE IF EXISTS planwise;
CREATE DATABASE planwise;
USE planwise;
CREATE TABLE users (
    user_id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    profile_image_url VARCHAR(255)
);

CREATE TABLE projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id VARCHAR(100) NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    background_image LONGBLOB,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE RESTRICT
);
CREATE TABLE project_members (
    project_id INT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

CREATE TABLE team_members (
    team_id INT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    PRIMARY KEY (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

CREATE TABLE task_lists (
    task_list_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    task_list_name VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

CREATE TABLE files (
    file_id INT PRIMARY KEY AUTO_INCREMENT,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_data LONGBLOB NOT NULL,
    uploaded_by VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE TABLE list_entries (
    entry_id INT PRIMARY KEY AUTO_INCREMENT,
    task_list_id INT NOT NULL,
    entry_name VARCHAR(255) NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE,
    file_id INT,
    due_date DATE,
    warning_threshold INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_list_id) REFERENCES task_lists(task_list_id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE SET NULL,
    CONSTRAINT chk_warning_threshold CHECK (
        (due_date IS NULL AND warning_threshold IS NULL) OR
        (due_date IS NOT NULL AND warning_threshold IS NOT NULL)
    )
);

CREATE TABLE entry_user_assignments (
    entry_id INT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (entry_id, user_id),
    FOREIGN KEY (entry_id) REFERENCES list_entries(entry_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE entry_team_assignments (
    entry_id INT NOT NULL,
    team_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (entry_id, team_id),
    FOREIGN KEY (entry_id) REFERENCES list_entries(entry_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);

CREATE TABLE bug_reports (
    bug_id INT PRIMARY KEY AUTO_INCREMENT,
    incident_id VARCHAR(100) NOT NULL UNIQUE,
    issue_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    reported_by VARCHAR(100) NOT NULL,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_by) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE bug_comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    bug_id INT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    commented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bug_id) REFERENCES bug_reports(bug_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE recent_activity (
    activity_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,  -- Added to link activity to specific project
    user_id VARCHAR(100),  -- User who performed the action
    action_type VARCHAR(20) NOT NULL,
    entity_type ENUM(  -- More specific entity types
        'PROJECT',
        'CATEGORY',
        'TASKLIST',
        'ENTRY',
        'TEAM',
        'COMMENT',
        'BUG_COMMENT',
        'BUG_REPORT'
    ) NOT NULL,
    entity_id BIGINT NOT NULL,  -- ID of the affected entity
    entity_name VARCHAR(255),  -- Name/title of the affected entity (for quick display)
    old_value TEXT,  -- Previous value (for updates)
    new_value TEXT,  -- New value (for updates)
    activity_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seen BOOLEAN not null DEFAULT false,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE invitations (
    invitation_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255),
    project_id INT NOT NULL,
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    status ENUM('Pending', 'Accepted', 'Declined') DEFAULT 'Pending',
    token VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

CREATE TABLE message_channels (
    channel_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    channel_name VARCHAR(100) NOT NULL,
    channel_type ENUM('PROJECT', 'TEAM') NOT NULL,
    project_id INT NOT NULL,
    team_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT chk_channel_type CHECK (
        (channel_type = 'PROJECT' AND team_id IS NULL) OR
        (channel_type = 'TEAM' AND team_id IS NOT NULL)
    )
);
CREATE TABLE channel_read_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    channel_id BIGINT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    last_read_timestamp DATETIME NOT NULL,
    FOREIGN KEY (channel_id) REFERENCES message_channels(channel_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_channel_user (channel_id, user_id)
);

CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    sender_id VARCHAR(100) NOT NULL,
    content TEXT NULL,
    channel_id BIGINT NOT NULL,
    timestamp DATETIME NOT NULL,
    edited_at DATETIME NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME NULL,
    reply_to_message_id BIGINT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (channel_id) REFERENCES message_channels(channel_id),
    FOREIGN KEY (reply_to_message_id) REFERENCES messages(id)
);

CREATE TABLE message_reactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    reaction_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_message_user_reaction (message_id, user_id, reaction_type)
);

CREATE TABLE message_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type ENUM('IMAGE', 'DOCUMENT', 'AUDIO', 'VIDEO', 'CODE', 'OTHER') NOT NULL,
    file_size BIGINT NOT NULL,
    file_data LONGBLOB NOT NULL,
    thumbnail_data LONGBLOB NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

CREATE TABLE polls (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT NOT NULL,
    question TEXT NOT NULL,
    is_multiple_choice BOOLEAN DEFAULT FALSE,
    expires_at DATETIME NULL,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

CREATE TABLE poll_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    poll_id BIGINT NOT NULL,
    option_text TEXT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
);

CREATE TABLE poll_votes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    poll_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_poll_user_vote (poll_id, user_id)
);

CREATE TABLE message_mentions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT NOT NULL,
    mentioned_user_id VARCHAR(100) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (mentioned_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE code_snippets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT NOT NULL,
    language VARCHAR(50) NOT NULL,
    code_content LONGTEXT NOT NULL,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

CREATE TABLE voice_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT NOT NULL,
    audio_path VARCHAR(512) NOT NULL,
    duration_seconds INT NOT NULL,
    waveform_data TEXT NULL,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

CREATE TABLE message_read_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_message_user_read (message_id, user_id)
);

CREATE INDEX idx_message_project_id ON messages(project_id);
CREATE INDEX idx_message_timestamp ON messages(timestamp);

CREATE TABLE notes (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	content TEXT NOT NULL,
	shared boolean NOT NULL DEFAULT false,
	user_id VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    pinned boolean NOT NULL DEFAULT false,
	project_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE INDEX idx_projects_owner ON projects(owner_id);

CREATE INDEX idx_categories_project ON categories(project_id);

CREATE INDEX idx_tasklists_category ON task_lists(category_id);

CREATE INDEX idx_listentries_tasklist ON list_entries(task_list_id);
CREATE INDEX idx_listentries_duedate ON list_entries(due_date);

CREATE INDEX idx_files_uploader ON files(uploaded_by);

CREATE INDEX idx_bug_reports_status ON bug_reports(status);
CREATE INDEX idx_bug_reports_priority ON bug_reports(priority);
CREATE INDEX idx_bug_reports_reported_by ON bug_reports(reported_by);
CREATE INDEX idx_bug_comments_bug_id ON bug_comments(bug_id);

CREATE INDEX idx_activity_project ON recent_activity(project_id);
CREATE INDEX idx_activity_user ON recent_activity(user_id);
CREATE INDEX idx_activity_action ON recent_activity(action_type);
CREATE INDEX idx_activity_entity ON recent_activity(entity_type, entity_id);
CREATE INDEX idx_activity_time ON recent_activity(activity_time);

CREATE INDEX idx_invitations_project ON invitations(project_id);