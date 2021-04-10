<?php

function get_student_information($cod_est){

  $chp = curl_init();

  curl_setopt($chp, CURLOPT_URL, "https://sira.univalle.edu.co/sra//paquetes/graduado/index.php");

  curl_setopt($chp, CURLOPT_RETURNTRANSFER, true);

  curl_setopt($chp, CURLOPT_SSL_VERIFYHOST, false);

  curl_setopt($chp, CURLOPT_HTTPHEADER, array(
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

  $dom = new domDocument;

  $dom->loadHTML($html);

  $dom->preserveWhiteSpace = false;


  $tables = $dom->getElementsByTagName('table');

  $rows = $tables->item(3)->getElementsByTagName('tr');

  $cols = $rows[0]->getElementsByTagName('td');

  $data = $cols[4];


  return $data->nodeValue;
}

function trim_all( $str , $what = NULL , $with = ' ' ){
  if( $what === NULL ){
    $what   = "\\x00-\\x20";    //all white-spaces and control chars
  }
  return trim( preg_replace( "/[".$what."]+/" , $with , $str ) , $what );
}



// print_r($_POST["documento"]);


if(isset($_POST["cedula"])){
  $student = search_student_info($_POST["cedula"]);

  $student = preg_replace('/\s+/', ' ', $student);
  $student = explode(" ", trim_all($student));
  $clean_student = str_replace("\\u00a0", "", $student);

  $student_object = array('nombre'=>'','titulo'=>array());
  $titulos = array();
  for ($i = 0; $i < count($clean_student); $i++) {
    if(strpos($clean_student[$i], 'Nombre') !== false){
      $student_object['nombre'] = $clean_student[$i+1].' '.$clean_student[$i+2].' '.$clean_student[$i+3];
      if(strpos($clean_student[$i+4], 'Documento') === false){
        $student_object['nombre'] = $student_object['nombre'].' '.$clean_student[$i+4];
      }
    }
    $actualTitulo = '';
    if(strpos($clean_student[$i], 'Obtenido') !== false){
      $esta_fecha = false;
      $j=1;

        while ($esta_fecha===false) {
          if(strpos($clean_student[$i+$j], 'Fecha') === false){
            $actualTitulo = $actualTitulo.''.$clean_student[$i+$j].' ';
            $j = $j +1;
          }else{
            $esta_fecha = true;
          }
        }
        array_push($titulos,$actualTitulo);

    }
  };
  $student_object['titulo'] = $titulos;
  // header('Access-Control-Allow-Origin: https://script.google.com/');
  // header('Access-Control-Allow-Credentials: true');
  // header('Access-Control-Allow-Headers: Content-Type');
  // header('Access-Control-Allow-Methods: POST, GET');
  // header('Content-Type: application/json');
  echo json_encode($student_object,JSON_UNESCAPED_UNICODE);

}
?>
