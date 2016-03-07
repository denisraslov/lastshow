<?php

include_once('request.php');

function GetArtistImg($artist)
{
	$url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" . urlencode($artist) .
		"&api_key=87436ee5f52c9c29bc57cb489660f149&format=json";

	$page = SendRequest($url, 'GET', array());

	if ($page)
	{
		$data = json_decode($page);

		return $data->{'artist'}->{'image'}[1] -> {'#text'};
	}
	else
	{
		return '';
	}
}

?>