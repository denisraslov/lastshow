<?php

include('request.php');

$params = array();

foreach ($_GET as $key => $value)
{
	if ($key != 'url' && $key != 'request_method')
	{
		$params[$key] = urldecode($value);
	}
}
  
echo SendRequest($_GET['url'], $_GET['request_method'], $params);

?>