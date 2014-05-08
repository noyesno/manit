<?php

class ManQuery {
    public function __construct() {
        //$dbfile = '';
        $dbfile = dirname(__FILE__).'/data/man.sqlite3';
        try {
            $this->db = new PDO('sqlite:'.$dbfile, null,null,array(PDO::ATTR_PERSISTENT => false)); // success
        } catch (PDOException $e) {
            echo "open fail";
            throw new SmartyException('sqlite Resource failed: ' . $e->getMessage());
        }

        //$this->stmt_query = $this->db->prepare('SELECT * FROM func_page WHERE WHERE id LIKE = :id');
/*
        $this->fetch = $this->db->prepare('SELECT modified, content FROM page WHERE id = :id');
        $this->fetchTimestamp = $this->db->prepare('SELECT modified FROM page WHERE id = :id');
        $this->save = $this->db->prepare('REPLACE INTO page (id, name, cache_id, compile_id, content, modified)
            VALUES  (:id, :name, :cache_id, :compile_id, :content, :modified)');
*/
    }

    public function query($token, $lang=null, $version=null){
        $sql = sprintf("SELECT * FROM func_page WHERE token LIKE %s ORDER BY npage ASC",
            $this->db->quote("%$token%"));
        $stmt = $this->db->query($sql);
        if(!$stmt){
          echo "error:", $this->db->errorCode(), implode("\t",$this->db->errorInfo());
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
