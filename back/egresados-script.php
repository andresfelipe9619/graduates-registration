<?php

function get_student_information($cod_est){

   $curl = curl_init();

   curl_setopt($curl, CURLOPT_URL, "https://swebse29.univalle.edu.co/sra//paquetes/graduado/index.php?accion=ConsultarGraduado");

   curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);

   curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

   $resp = curl_exec($curl);

   curl_close($curl);
   print_r($resp);

   return $resp;
}


// function search_student_info($code_student){
//
// 	$html = get_student_information($code_student);
//
// 	//echo $html;
//
// 	$dom = new domDocument;
//
// 	$dom->loadHTML($html);
//
//    	$dom->preserveWhiteSpace = false;
//
//    	$tables = $dom->getElementsByTagName('table');
//
//    	$rows = $tables->item(0)->getElementsByTagName('tr');
//
//    	$cols = $rows[2]->getElementsByTagName('td');
//
//     $cod_per = (string)$cols->item(9)->nodeValue;
// 	$cod_estu = (string)$cols->item(10)->nodeValue;
//
// 	$documento = explode(" ", (string)$cols->item(11)->nodeValue);
// 	$tipo_doc = $documento[0];
// 	$numero_doc = $documento[1];
// 	$nombre = str_replace(" ","+",(string)$cols->item(12)->nodeValue);
//
// 	$apellido = str_replace(" ","+",(string)$cols->item(13)->nodeValue);
// 	$apellido = (string)$cols->item(13)->nodeValue;
//
//
// 	echo 'Codigo persona '.$cod_per.'<br />';
// 	echo 'Codigo estudiante'.$cod_estu.'<br />';
// 	echo 'Tipo documento '.$tipo_doc.'<br />';
// 	echo 'Numero documento '.$numero_doc.'<br />';
// 	echo 'Nombres '.$nombre.'<br />';
// 	echo 'Apellidos '.$apellido.'<br />';
//
//
//   	$sede_plan_modo = (string)$cols->item(14)->nodeValue;
// 	$tipo_sede = explode("-", $sede_plan_modo);
//
// 	$plan = $tipo_sede[0];
// 	$sede = $tipo_sede[1];
// 	$mod = $tipo_sede[2];
//
// 	echo 'Plan '.$plan.'<br />';
// 	echo 'Sede '.$sede.'<br />';
// 	echo 'Modalidad '.$mod.'<br />';
// 	echo '<hr />';
//
//
//     $chp = curl_init();
//
//     curl_setopt($chp, CURLOPT_URL, "https://swebse32.univalle.edu.co/sra//paquetes/academica/index.php");
//
//     curl_setopt($chp, CURLOPT_RETURNTRANSFER, true);
//
//     curl_setopt($chp, CURLOPT_SSL_VERIFYHOST, false);
//
//     curl_setopt($chp, CURLOPT_HTTPHEADER, array(
//       'Cookie: PHPSESSID=5d24e68cfed5f81ca7ab7269e58d3cb2',
//       'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0',
//       'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
//       'DNT: 1'
//    ));
//
//    	curl_setopt($chp, CURLOPT_POST, 1);
//
//    	$fields = "deu_est_per_codigo=$cod_per&codigo_estudiante=$cod_estu&wincombomep_codigo_estudiante=$nombre_1+$nombre_2++$apellido_1+$apellido_2+->+$plan-$sede-$mod&modulo=Academica&accion=Consultar+Estudiante";
//
//    	curl_setopt($chp, CURLOPT_POSTFIELDS, $fields);
//
//    	$respo = curl_exec($chp);
//
//    	curl_close($chp);
//
//    	//echo $respo;
//
//    	$dom->loadHTML($respo);
//
//     $dom->preserveWhiteSpace = false;
//
//     $tables = $dom->getElementsByTagName('table');
//
//     $rows = $tables->item(0)->getElementsByTagName('tr');
//
//     $cols = $dom->getElementsByTagName('td');
//     $estado = 'INACTIVO';
//     //echo 'El estado es '.$estado.'<br />';
//
//
// 	for ($i = 0; $i <= 100; $i++) {
// 	    $periodo_academico = (string)$cols->item($i)->nodeValue;
// 	    #echo $periodo_academico.'<br />';
// 	    if(substr_count($periodo_academico,"AGOSTO/2018 - DICIEMBRE/2018") == 1){
// 	    	//echo 'I '.$i.' '.$periodo_academico;
// 	    	$estado = 'ACTIVO';
//
// 	    }
//
// 	}
//
// 	echo '<br>EL ESTADO ES '.$estado.'<br />';
// 	$nombre_sp = str_replace("+"," ",$nombre);
// 	$apellido_sp = str_replace("+"," ",$apellido);
//
// 	$information_student = "$cod_estu,$tipo_doc,$numero_doc,$nombre_sp,$apellido_sp,$plan,$sede,$mod,$estado";
//
// 	return $information_student;
// }


get_student_information('1212')
 ?>
