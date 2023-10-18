create table blogs (
	id	    SERIAL PRIMARY KEY,           -- id (unique, incrementing id)
	author  text,                         -- author (string)
	url	    text    CHECK (url <> ''),    -- url (string that cannot be empty)
	title	  text    CHECK (title <> ''),  -- title (string that cannot be empty)
	likes	  integer DEFAULT 0             -- likes (integer with default value zero)
);

insert into blogs (author, url, title) values ('ville', 'https://www.postgresql.org/docs/current/datatype.html', 'Datatypes');
insert into blogs (author, url, title, likes) values ('matti', 'https://www.postgresql.org/docs/current/tutorial-table.html', 'Creating a New Table', 1);