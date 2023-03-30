DROP TABLE IF EXISTS Player;

-- Create tables
CREATE TABLE Player(
    [username] VARCHAR(64) PRIMARY KEY NOT NULL,
    [password] VARCHAR(64) NOT NULL,
    [highscore] INT NOT NULL,
    CONSTRAINT CHK_highscore CHECK (highscore >= 0),
);

-- 1) Enter sample players
INSERT INTO Player
    ([username], [password], [highscore])
VALUES
    ('username1', 'password1', '100'),
    ('username2', 'password2', '200'),
    ('username3', 'password3', '300');

