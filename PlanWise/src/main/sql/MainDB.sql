DROP DATABASE IF EXISTS planwise;
CREATE DATABASE planwise;
USE planwise;

CREATE TABLE Users(
    UserID VARCHAR(100) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Projects(
    ProjectID INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(100) NOT NULL,
    Description TEXT,
    OwnerID VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (OwnerID) REFERENCES Users(UserID) ON DELETE RESTRICT
);

CREATE TABLE ProjectMembers(
    ProjectID INT NOT NULL,
    UserID VARCHAR(100) NOT NULL,
    JoinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ProjectID, UserID),
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Teams(
    TeamID INT PRIMARY KEY AUTO_INCREMENT,
    ProjectID INT NOT NULL,
    TeamName VARCHAR(100) NOT NULL,
    IconName VARCHAR(50) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID) ON DELETE CASCADE
);

CREATE TABLE TeamMembers(
    TeamID INT NOT NULL,
    UserID VARCHAR(100) NOT NULL,
    JoinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (TeamID, UserID),
    FOREIGN KEY (TeamID) REFERENCES Teams(TeamID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Categories(
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    ProjectID INT NOT NULL,
    CategoryName VARCHAR(100) NOT NULL,
    Color VARCHAR(20) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID) ON DELETE CASCADE
);

CREATE TABLE TaskLists(
    TaskListID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryID INT NOT NULL,
    TaskListName VARCHAR(100) NOT NULL,
    Color VARCHAR(20) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE
);

CREATE TABLE Files (
    FileID INT PRIMARY KEY AUTO_INCREMENT,
    FileName VARCHAR(255) NOT NULL,
    FileSize INT NOT NULL,
    FileType VARCHAR(100) NOT NULL,
    FileData LONGBLOB NOT NULL,
    UploadedBy VARCHAR(100) NOT NULL,
    UploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UploadedBy) REFERENCES Users(UserID) ON DELETE RESTRICT
);

CREATE TABLE ListEntries(
    EntryID INT PRIMARY KEY AUTO_INCREMENT,
    TaskListID INT NOT NULL,
    EntryName VARCHAR(255) NOT NULL,
    IsChecked BOOLEAN DEFAULT FALSE,
    FileID INT,
    DueDate DATE,
    WarningThreshold INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (TaskListID) REFERENCES TaskLists(TaskListID) ON DELETE CASCADE,
    FOREIGN KEY (FileID) REFERENCES Files(FileID) ON DELETE SET NULL,
    CONSTRAINT chk_warning_threshold CHECK (
        (DueDate IS NULL AND WarningThreshold IS NULL) OR
        (DueDate IS NOT NULL AND WarningThreshold IS NOT NULL)
    )
);

CREATE TABLE EntryUserAssignments(
    EntryID INT NOT NULL,
    UserID VARCHAR(100) NOT NULL,
    AssignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (EntryID, UserID),
    FOREIGN KEY (EntryID) REFERENCES ListEntries(EntryID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE EntryTeamAssignments(
    EntryID INT NOT NULL,
    TeamID INT NOT NULL,
    AssignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (EntryID, TeamID),
    FOREIGN KEY (EntryID) REFERENCES ListEntries(EntryID) ON DELETE CASCADE,
    FOREIGN KEY (TeamID) REFERENCES Teams(TeamID) ON DELETE CASCADE
);

CREATE INDEX idx_projects_owner ON Projects(OwnerID);
CREATE INDEX idx_categories_project ON Categories(ProjectID);
CREATE INDEX idx_tasklists_category ON TaskLists(CategoryID);
CREATE INDEX idx_listentries_tasklist ON ListEntries(TaskListID);
CREATE INDEX idx_listentries_duedate ON ListEntries(DueDate);
CREATE INDEX idx_files_uploader ON Files(UploadedBy);
