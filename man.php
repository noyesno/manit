<?php

if(!empty($_GET['q'])){
  $query = $_GET['q'];

  include('./sqlite.php');
  $manquery = new ManQuery();
  $query = preg_replace('/\s+/','_',$query);
  $result = $manquery->query($query);
  echo json_encode($result);
  exit(0);
}
?>
<!DOCTYPE html>
<html manifest="/man/man.manifest">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="author" content="noyesno.net"/>
<meta name="copyright" content="Copyright since 2013"/> 
<title>manit - A Viewer for Docs and Man Page</title>
<link rel="stylesheet" type="text/css" href="/man/man.css"/>
</head>
<body>
<h1>manit - A Viewer for Docs and Man Page</h1>
<form action="" method="get">
  <input type="query" id="query" name="q" placeholder="lsearch" required/>
  <button type="submit">man</button>
</form>

<hr/>
<table id="query-result">
<caption></caption>
<tbody>
</tbody>
</table>
<iframe id="docwin" name="docwin"></iframe>
<?php

if(!empty($_GET['q'])){
  $query = $_GET['q'];

echo "<h2>query: $query</h2>";
  include('./sqlite.php');
  $manquery = new ManQuery();
  print_query($manquery->query($query));
}
?>
<script type="text/javascript" src="http://cdn.staticfile.org/jquery/2.0.3/jquery.min.js"></script>
<script src="man.js"></script>
</body>
</html>
