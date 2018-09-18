<?php

function get_student_information($cod_est){

  $chp = curl_init();

  curl_setopt($chp, CURLOPT_URL, "https://swebse29.univalle.edu.co/sra//paquetes/graduado/index.php");

  curl_setopt($chp, CURLOPT_RETURNTRANSFER, true);

  curl_setopt($chp, CURLOPT_SSL_VERIFYHOST, false);

  curl_setopt($chp, CURLOPT_HTTPHEADER, array(
    // 'Cookie: PHPSESSID=5d24e68cfed5f81ca7ab7269e58d3cb2',
    // 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0',
    'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'DNT: 1'
  ));

  curl_setopt($chp, CURLOPT_POST, 1);

  $fields = "per_doc_ide_numero=".$cod_est."&wincomboper_doc_ide_numero=".$cod_est."&accion=Consultar+Grados";

  curl_setopt($chp, CURLOPT_POSTFIELDS, $fields);

  $respo = curl_exec($chp);

  curl_close($chp);
  // print_r($respo);
  return $respo;
}


function search_student_info($code_student){

  $html = get_student_information($code_student);

  // print_r($html);

  $dom = new domDocument;

  $dom->loadHTML($html);

  $dom->preserveWhiteSpace = false;


  $tables = $dom->getElementsByTagName('table');

  $rows = $tables->item(3)->getElementsByTagName('tr');

  $cols = $rows[0]->getElementsByTagName('td');

  $data = $cols[4];

  // echo "The element is: " . $data;


  // $cod_per = (string)$cols->item(0)->nodeValue;
  // $cod_estu = (string)$cols->item(1)->nodeValue;
  //
  // $documento = explode(" ", (string)$data->nodeValue);

  // echo (string)$data->nodeValue;

return (string)$data->nodeValue;
}

// print_r($_POST["documento"]);
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html');
$student = search_student_info(16825541);
print_r (explode(" ",$student));
// $student_object = stdClass()
// trim($student);
// echo $student;
?>
