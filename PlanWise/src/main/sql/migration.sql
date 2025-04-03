-- Отключаем проверку внешних ключей
SET FOREIGN_KEY_CHECKS = 0;

-- Изменяем типы данных в таблице teams
ALTER TABLE teams MODIFY COLUMN team_id BIGINT AUTO_INCREMENT;
ALTER TABLE teams MODIFY COLUMN project_id BIGINT NOT NULL;

-- Изменяем типы данных в таблице team_members
ALTER TABLE team_members MODIFY COLUMN team_id BIGINT NOT NULL;

-- Изменяем типы данных в таблице projects
ALTER TABLE projects MODIFY COLUMN project_id BIGINT AUTO_INCREMENT;

-- Изменяем типы данных в таблице project_members
ALTER TABLE project_members MODIFY COLUMN project_id BIGINT NOT NULL;

-- Изменяем типы данных в таблице project_member_permissions
ALTER TABLE project_member_permissions MODIFY COLUMN project_id BIGINT NOT NULL;

-- Изменяем типы данных в таблице categories
ALTER TABLE categories MODIFY COLUMN project_id BIGINT NOT NULL;

-- Изменяем типы данных в таблице task_lists
ALTER TABLE task_lists MODIFY COLUMN category_id BIGINT NOT NULL;

-- Изменяем типы данных в таблице list_entries
ALTER TABLE list_entries MODIFY COLUMN task_list_id BIGINT NOT NULL;
ALTER TABLE list_entries MODIFY COLUMN file_id BIGINT;

-- Изменяем типы данных в таблице entry_team_assignments
ALTER TABLE entry_team_assignments MODIFY COLUMN team_id BIGINT NOT NULL;

-- Изменяем тип данных в таблице bug_comments
ALTER TABLE bug_comments MODIFY COLUMN bug_id BIGINT NOT NULL;

-- Изменяем тип данных в таблице bug_reports
ALTER TABLE bug_reports MODIFY COLUMN bug_id BIGINT AUTO_INCREMENT;

-- Включаем проверку внешних ключей
SET FOREIGN_KEY_CHECKS = 1; 