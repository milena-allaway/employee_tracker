INSERT INTO departments (id, name)
VALUES 
    ('001','Hogwarts_Staff'),
    ('002','Hogwarts_Student'),
    ('003','Ministry_of_Magic');

INSERT INTO role (id, title, salary, department_id)
VALUES
    ('001','Headmaster', 100000, '001'),
    ('002','Professor', 80000, '001'),
    ('003','Student', 0, '002'),
    ('004','Minister_of_Magic', 100000, '003'),
    ('005','Caretaker', 50000, '001'),
    ('006','Gameskeeper', 75000, '001'),
    ('007','Ghost', 0, '001'),
    ('008', 'Ministry_Worker', 75000, '003');

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    ('001','Cornelius','Fudge','004','001'), -- minister of magic --
    ('002','Albus','Dumbledore','001','001'), -- headmaster --
    ('003','Severus','Snape','002','002'), -- head of slytherin --
    ('004','Minerva','McGonagall','002','002'), -- head of gryffindor --
    ('005','Remus','Lupin','002','002'), -- defense against the dark arts --
    ('006','Pomona','Sprout','002','002'), -- head of hufflepuff --
    ('007','Filius','Flitwick','002','002'), -- head of ravenclaw --
    ('008','Rubeus','Hagrid','006','002'), -- gameskeeper --
    ('009','Argus','Filch','005','002'), -- caretaker(squib) --
    ('010','Sybill','Trelwaney','002','002'), -- divination --
    ('011','Dolores','Umbridge','008','001'), -- ministry worker --
    ('012','Arthur','Weasley','008','001'), -- ministry worker --
    ('013','Harry','Potter','003','004'), -- student --
    ('014','Ron','Weasley','003','004'), -- student --
    ('015','Hermione','Granger','003','004'), -- student --
    ('016','Neville','Longbottom','003','004'), -- student --
    ('017','Luna','Lovegood','003','007'), -- student --
    ('018','Draco','Malfoy','003','003'), -- student --
    ('019','Cedric','Diggory','003','006'), -- student --
    ('020','Nearly-Headless','Nick','007','002'), -- ghost --
    ('021','Moaning','Myrtle','007','002'); -- ghost --