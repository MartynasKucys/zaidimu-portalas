CREATE TABLE Zanras
(
	id_Zanras integer NOT NULL,
	name varchar (11) NOT NULL,
	PRIMARY KEY(id_Zanras)
);
INSERT INTO Zanras(id_Zanras, name) VALUES(1, 'Veiksmo');
INSERT INTO Zanras(id_Zanras, name) VALUES(2, 'Lenktyniu');
INSERT INTO Zanras(id_Zanras, name) VALUES(3, 'Siaubo');
INSERT INTO Zanras(id_Zanras, name) VALUES(4, 'Loginis');
INSERT INTO Zanras(id_Zanras, name) VALUES(5, 'RPG');
INSERT INTO Zanras(id_Zanras, name) VALUES(6, 'FPS');
INSERT INTO Zanras(id_Zanras, name) VALUES(7, 'Strateginis');

CREATE TABLE Statusas
(
	id_Statusas integer NOT NULL,
	name varchar (10) NOT NULL,
	PRIMARY KEY(id_Statusas)
);
INSERT INTO Statusas(id_Statusas, name) VALUES(1, 'Paskelbtas');
INSERT INTO Statusas(id_Statusas, name) VALUES(2, 'Pasleptas');

CREATE TABLE Role
(
	id_Role integer NOT NULL,
	name varchar (16) NOT NULL,
	PRIMARY KEY(id_Role)
);
INSERT INTO Role(id_Role, name) VALUES(1, 'Administratorius');
INSERT INTO Role(id_Role, name) VALUES(2, 'Vartotojas');

CREATE TABLE Lytis
(
	id_Lytis integer NOT NULL,
	name varchar (7) NOT NULL,
	PRIMARY KEY(id_Lytis)
);
INSERT INTO Lytis(id_Lytis, name) VALUES(1, 'Vyras');
INSERT INTO Lytis(id_Lytis, name) VALUES(2, 'Moteris');
INSERT INTO Lytis(id_Lytis, name) VALUES(3, 'Kita');

CREATE TABLE Lygis
(
	id_Lygis integer NOT NULL,
	name varchar (12) NOT NULL,
	PRIMARY KEY(id_Lygis)
);
INSERT INTO Lygis(id_Lygis, name) VALUES(1, 'Naujokas');
INSERT INTO Lygis(id_Lygis, name) VALUES(2, 'Vidutiniokas');
INSERT INTO Lygis(id_Lygis, name) VALUES(3, 'Senjoras');

CREATE TABLE Akiu_spalva
(
	id_Akiu_spalva integer NOT NULL,
	name varchar (6) NOT NULL,
	PRIMARY KEY(id_Akiu_spalva)
);
INSERT INTO Akiu_spalva(id_Akiu_spalva, name) VALUES(1, 'Zalia');
INSERT INTO Akiu_spalva(id_Akiu_spalva, name) VALUES(2, 'Ruda');
INSERT INTO Akiu_spalva(id_Akiu_spalva, name) VALUES(3, 'Melyna');

CREATE TABLE Naudotojai
(
	Vardas varchar (255) NOT NULL,
	Elektroninis_pastas varchar (255) NOT NULL,
	Slaptazodis varchar (255) NOT NULL,
	Aprasas varchar (255) NULL,
	Patirties_taskai integer NOT NULL,
	Salis varchar (255) NULL,
	Trumpas_aprasas varchar (255) NULL,
	Ugis float NULL,
	Svoris float NULL,
	Kalba varchar (255) NULL,
	Plauku_spalva varchar (255) NULL,
	Lytis integer NULL,
	Akiu_spalva integer NULL,
	id_Naudotojas integer NOT NULL AUTO_INCREMENT,
	Nuotrauka blob NULL,
	fk_lygis__id_lygis integer NOT NULL,
	PRIMARY KEY(id_Naudotojas),
	FOREIGN KEY(fk_lygis__id_lygis) REFERENCES Lygis(id_Lygis),
	FOREIGN KEY(Akiu_spalva) REFERENCES Akiu_spalva (id_Akiu_spalva),
	FOREIGN KEY(Lytis) REFERENCES Lytis (id_Lytis)

);

CREATE TABLE Zaidimai
(
	Pavadinimas varchar (255) NOT NULL,
	Aprasas varchar (255) NULL,
	Isleidimo_data TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Nuoroda_i_kurejo_puslapi varchar (255) NULL,
	Nuoroda_i_socialinius_tinklus varchar (255) NULL,
	Nuoroda_i_atsisiuntima varchar (255) NULL,
	Zaidimo_ilgis integer NULL,
	Trumpas_aprasymas varchar (255) NULL,
	Sunkumas integer NULL,
	Zanras integer NULL,
	Statusas integer NOT NULL,
	id_Zaidimas integer NOT NULL AUTO_INCREMENT,
	Nuotrauka blob NOT NULL,
	fk_Naudotojas integer NOT NULL,
	PRIMARY KEY(id_Zaidimas),
	FOREIGN KEY(Zanras) REFERENCES Zanras (id_Zanras),
	FOREIGN KEY(Statusas) REFERENCES Statusas (id_Statusas),
	FOREIGN KEY(fk_Naudotojas) REFERENCES Naudotojai (id_Naudotojas)
);

CREATE TABLE Panasus_zaidimai
(
	Data TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	Eiles_numeris integer NOT NULL,
	Atstumas integer NOT NULL,
	id_Panasus_zaidimai  integer NOT NULL AUTO_INCREMENT,
	fk_Zaidimas__id_Zaidimas integer NOT NULL,
	PRIMARY KEY(id_Panasus_zaidimai ),
	CONSTRAINT Apskaiciuojamas FOREIGN KEY(fk_Zaidimas__id_Zaidimas) REFERENCES Zaidimai (id_Zaidimas)
);

CREATE TABLE Roles
(
	Data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Komentaras varchar (255) NULL,
	Role integer NOT NULL,
	id_Role integer NOT NULL AUTO_INCREMENT,
	fk_Naudotojas__id_Naudotojas integer NOT NULL,
	PRIMARY KEY(id_Role),
	FOREIGN KEY(Role) REFERENCES Role (id_Role),
	FOREIGN KEY(fk_Naudotojas__id_Naudotojas) REFERENCES Naudotojai (id_Naudotojas)
);

CREATE TABLE Megstamiausiu_grupes
(
	Pavadinimas varchar (255) NULL,
	Ikelimo_data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	id_Megstamiausiu_grupe integer NOT NULL AUTO_INCREMENT,
	fk_Naudotojas__id_Naudotojas integer NOT NULL,
	PRIMARY KEY(id_Megstamiausiu_grupe),
	FOREIGN KEY(fk_Naudotojas__id_Naudotojas) REFERENCES Naudotojai (id_Naudotojas)
);

CREATE TABLE Draugystes
(
	Data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Pravarde varchar (255) NULL,
	id_Draugyste integer NOT NULL AUTO_INCREMENT,
	fk_Naudotojas__id_Naudotojas integer NOT NULL,
	fk_Naudotojas__id_Naudotojas1 integer NOT NULL,
	PRIMARY KEY(id_Draugyste),
	CONSTRAINT Prisideda FOREIGN KEY(fk_Naudotojas__id_Naudotojas) REFERENCES Naudotojai (id_Naudotojas),
	CONSTRAINT Pridedamas FOREIGN KEY(fk_Naudotojas__id_Naudotojas1) REFERENCES Naudotojai (id_Naudotojas)
);

CREATE TABLE Megstamiausi_zaidimai
(
	Ikelimo_data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Eiles_numeris integer NOT NULL,
	id_Megstamiausias integer NOT NULL AUTO_INCREMENT,
	fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe integer NOT NULL,
	fk_Zaidimas__id_Zaidimas integer NOT NULL,
	PRIMARY KEY(id_Megstamiausias),
	FOREIGN KEY(fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe) REFERENCES Megstamiausiu_grupes (id_Megstamiausiu_grupe),
	FOREIGN KEY(fk_Zaidimas__id_Zaidimas) REFERENCES Zaidimai (id_Zaidimas)
);

CREATE TABLE Megstamiausios_megstamiausiu_grupes
(
	Pridejimo_data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
	id_Megstamiausia_megstamiausiu_grupe integer NOT NULL AUTO_INCREMENT,
	fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe integer NOT NULL,
	fk_Naudotojas__id_Naudotojas integer NOT NULL,
	PRIMARY KEY(id_Megstamiausia_megstamiausiu_grupe),
	FOREIGN KEY(fk_Megstamiausiu_grupe__id_Megstamiausiu_grupe) REFERENCES Megstamiausiu_grupes (id_Megstamiausiu_grupe),
	CONSTRAINT Prideda FOREIGN KEY(fk_Naudotojas__id_Naudotojas) REFERENCES Naudotojai (id_Naudotojas)
);
