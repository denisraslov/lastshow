<?php

/*
$url = urldecode($_GET['url']);
$url = 'http://' . str_replace('http://', '', $url); // Avoid accessing the file system
$url = str_replace(' ', '%20', $url);
echo file_get_contents($url);
*/
function SendRequest($url, $method, $params)
{
	foreach ($params as $key => $value)
	{
		$params[$key] = urldecode($value);
	}

	$params = http_build_query($params);
	$options = array('http' =>
	    array(
	      'method' => $method,
	      'content' => $params
	    )
	);
	$context = stream_context_create($options);

	return file_get_contents($url, false, $context);
}

?>