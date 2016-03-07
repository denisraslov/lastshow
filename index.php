<?php

	if ($_SERVER['REMOTE_ADDR'] == '87.240.182.154')
	{
		header('Location: share.php/?' . $_SERVER['QUERY_STRING']);
	}

?>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title></title>

    <link rel="shortcut icon" class="favicon" type="image/gif" href="img/favicon.png">
    <link type="text/css" rel="stylesheet" href="fonts/opensans.css">

	<meta name="viewport" content="width=device-width,initial-scale=1">

	<link rel="stylesheet" href="css/compiled.css">

    <link rel="stylesheet" href="plugins/mediaelement/mediaelementplayer.css" />
    <link rel="stylesheet" href="plugins/jquery-ui/jquery-ui-1.10.3.custom.min.css" />
    <link type="text/css" rel="stylesheet" href="plugins/toolbar/jquery.toolbars.css">
    <link href="plugins/bxslider/jquery.bxslider.css" rel="stylesheet" />

	<script src="http://vk.com/js/api/openapi.js" type="text/javascript"></script>
	<script src="js/libs/jquery/jquery-min.js" type="text/javascript"></script>
	<script src="js/libs/underscore/underscore-min.js" type="text/javascript"></script>
	<script src="js/libs/underscore/underscore-str-min.js" type="text/javascript"></script>
	<script src="js/libs/backbone/backbone-min.js" type="text/javascript"></script>
    <script src="js/libs/purl/purl.js" type="text/javascript"></script>
    <script src="js/libs/moment/moment.min.js" type="text/javascript"></script>
    <script src="plugins/mediaelement/mediaelement-and-player.js" type="text/javascript"></script>
    <script src="plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js" type="text/javascript"></script>
    <script src="plugins/toolbar/jquery.toolbar.js" type="text/javascript"></script>
    <script src="plugins/bxslider/jquery.bxslider.min.js"></script>

	<script data-main="js/main" src="js/libs/require/require.js"></script>

    <script type="text/javascript">

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-45631390-1']);
        _gaq.push(['_trackPageview']);

        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

    </script>
</head>
<body>
</body>
</html>
