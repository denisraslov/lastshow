<html>
<head>

<?php
	include_once('php/artistImgGetter.php');
	include_once('php/artistShowGetter.php');

	$title = 'LastShow — Почувствуй шоу любимой группы!';

	if ($_GET['share'] != 1 && $_GET['p'] == 'artist' && ($artist = $_GET['id']))
	{
		$tour = $_GET['tour'];

		$title .= ' | ' . $artist;
		$img = GetArtistImg($artist);

		if ($tour)
		{
			$description = 'Слушать сетлист, с которым исполнитель ' . $artist . ' выступал в туре ' . $tour;
		}
		else
		{
			$description = GetArtistLastShowDescription($artist);
		}
	}
	else
	{
		$img = 'http://lastshow.net/img/playlist.png';
    	$description = 'Сервис, позволяющий слушать сетлисты с концертов ваших любимых исполнителей';
	}

	echo '<title>' . $title . '</title>
		<meta property="og:image" content="' . $img . '">
		<meta property="og:description" content="' . $description . '">';

?>

</head>
<body>
</body>
</html>
