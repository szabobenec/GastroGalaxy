CREATE DATABASE receptek
DEFAULT CHARACTER SET utf8
COLLATE utf8_hungarian_ci;

USE receptek;

CREATE TABLE recept (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipus VARCHAR(25) NOT NULL,
    nev VARCHAR(100) NOT NULL,
    tagid INT,
    ido INT,
    adag INT NOT NULL,
    hozzavaloid INT NOT NULL,
    elkeszites TEXT NOT NULL,
    kepnev VARCHAR(100),
    forras VARCHAR(255)

    FOREIGN KEY REFERENCES (recept.tagid = tag.id)
    FOREIGN KEY REFERENCES (recept.hozzavaloid = hozzavalo.id)
);

CREATE TABLE tag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tagek JSON
);

CREATE TABLE hozzavalo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hozzavalok JSON
);