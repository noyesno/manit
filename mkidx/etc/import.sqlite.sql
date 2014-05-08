
DROP TABLE tmp;
CREATE TABLE tmp ( lang, version, token, page, npage integer);                                                                                               
.separator "\t"
.import tmp.dat tmp
INSERT INTO func_page select * from tmp; 
DROP TABLE tmp;
