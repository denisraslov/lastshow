<?php

include_once('request.php');

function GetArtistLastShowDescription($artist)
{
	$url = 'http://api.setlist.fm/rest/0.1/search/setlists.json?artistName=' . urlencode($artist);
	$page = SendRequest($url, 'GET', array());

	if ($page)
	{
		$data = json_decode($page);
		$setlist = $data->{'setlists'} -> {'setlist'}[0];

		return 'Слушать сетлист с последнего концерта ' . $artist . ', который состоялся ' . join('.', split('-', $setlist -> {'@eventDate'})) . ' в клубе ' . $setlist -> {'venue'} -> {'@name'} .
			' (' . $setlist -> {'venue'} -> {'city'} -> {'@name'} . ', ' . $setlist -> {'venue'}  -> {'city'} -> {'country'} -> {'@name'} . ')...';
	}
	else
	{
		return '';
	}
}

?>