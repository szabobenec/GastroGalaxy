CREATE DATABASE receptek
DEFAULT CHARACTER SET utf8
COLLATE utf8_hungarian_ci;

USE receptek;

CREATE TABLE recept (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipus VARCHAR(25) NOT NULL,
    nev VARCHAR(100) NOT NULL,
    tagek VARCHAR(75),
    ido INT NOT NULL,
    adag INT NOT NULL,
    hozzavalok TEXT NOT NULL,
    elkeszites TEXT NOT NULL,
    kepnev VARCHAR(100),
    forras VARCHAR(255)
);

CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uname VARCHAR(50),
    passw VARCHAR(100)
);

INSERT INTO admin (uname, passw) VALUE('admin', 'shrek');