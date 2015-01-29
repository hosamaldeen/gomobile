<?php
$data = array();
$data[] = array(
    "title"=>"Tech News",
    "img"=>"http://localhost/phonegap/www/partials/img/blog/1.jpg",
    "details"=>"Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
);

$data[] = array(
    "title"=>"City Road",
    "img"=>"http://localhost/phonegap/www/partials/img/blog/2.jpg",
    "details"=>"Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
);

$data[] = array(
    "title"=>"Ocean",
    "img"=>"http://localhost/phonegap/www/partials/img/blog/3.jpg",
    "details"=>"Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
);

echo json_encode($data);
?>