<?php

$host = 'localhost';
$db = 'afl';
$user = 'john';
$pass = 'john';
$charset = 'utf8mb4';

// $host = '13.49.223.11';
// $db = 'afl';
// $user = 'tiffaman@gmail.com';
// $pass = 'V4513john';
// $charset = 'utf8mb4';


/*
calc balance
SELECT email, sum(dep) , sum(withd) , (sum(dep) - sum(withd)) bal  FROM `balance`
group by email

SELECT sum(`deposit_amt`), sum(`request_amt`), sum(`completed_amt`),
(sum(`deposit_amt`)-sum(`request_amt`)-sum(`completed_amt`)) as balance 
FROM `transaction_history` 
group by email;

select * 
FROM transaction_history
WHERE email= "john.horton86@gmail.com";

drop view transaction_history;

create view transaction_history as
SELECT `email` AS `email`, `amount` AS `deposit_amt`, 0 AS `request_amt`, 0 AS `completed_amt`,`datecreated` 
FROM `deposits` 
union 
SELECT `email` AS `email`, 0 AS `deposit_amt`, `amount` AS `request_amt`, 0 AS `completed_amt`,`datecreated` 
FROM `withdrawalrequests` 
union 
SELECT `email` AS `email`, 0 AS `deposit_amt`, 0 AS `request_amt`, `amount` AS `completed_amt`,`datecreated` 
FROM `withdrawalcompleted`

*/
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_errno) {
  echo "Failed to connect to MySQL: " . $conn->connect_error;
  exit();
}

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$operation = isset($request->operation) ? $request->operation : "";
$email = isset($request->email) ? $request->email : "";
$pswd = isset($request->pswd) ? $request->pswd : "";
$predictionjson = isset($request->predictionjson) ? $request->predictionjson : "";
$amount = isset($request->amount) ? $request->amount : 0;
$roundnumber = isset($request->roundnumber) ? $request->roundnumber : 0;

// testing stand alone
$operation = "makebet";
// $email = "john.horton86@gmail.com";
// $pswd = "999";
// $roundnumber = 1;
$predictionjson = '[{"id":"2","roundid":"955","roundnumber":"1","roundname":"Round 1","gameid":"5899","utcStartTime":"2024-03-14T08:30:00.000+0000","hometeamid":"5","hometeamname":"Carlton","hometeamnickname":"Blues","awayteamid":"16","awayteamname":"Richmond","awayteamnickname":"Tigers","completed":"0","result":"","checked":true,"winname":"Richmond"},{"id":"3","roundid":"955","roundnumber":"1","roundname":"Round 1","gameid":"5900","utcStartTime":"2024-03-14T08:30:00.000+0000","hometeamid":"3","hometeamname":"Collingwood","hometeamnickname":"Magpies","awayteamid":"13","awayteamname":"Sydney Swans","awayteamnickname":"Swans","completed":"0","result":"","checked":true,"winname":"Sydney Swans"},{"id":"4","roundid":"955","roundnumber":"1","roundname":"Round 1","gameid":"5901","utcStartTime":"2024-03-14T08:30:00.000+0000","hometeamid":"12","hometeamname":"Essendon","hometeamnickname":"Bombers","awayteamid":"9","awayteamname":"Hawthorn","awayteamnickname":"Hawks","completed":"0","result":"","checked":true,"winname":"Hawthorn"},{"id":"5","roundid":"955","roundnumber":"1","roundname":"Round 1","gameid":"5902","utcStartTime":"2024-03-14T08:30:00.000+0000","hometeamid":"15","hometeamname":"GWS Giants","hometeamnickname":"Giants","awayteamid":"6","awayteamname":"North Melbourne","awayteamnickname":"Kangaroos","completed":"0","result":"","checked":true,"winname":"North Melbourne"},{"id":"6","roundid":"955","roundnumber":"1","roundname":"Round 1","gameid":"5904","utcStartTime":"2024-03-14T08:30:00.000+0000","hometeamid":"10","hometeamname":"Geelong Cats","hometeamnickname":"Cats","awayteamid":"11","awayteamname":"St Kilda","awayteamnickname":"Saints","completed":"0","result":"","checked":true,"winname":"Geelong Cats"},{"id":"7","roundid":"955","roundnumber":"1","roundname":"Round 1","gameid":"5903","utcStartTime":"2024-03-14T08:30:00.000+0000","hometeamid":"4","hometeamname":"Gold Coast Suns","hometeamnickname":"Suns","awayteamid":"1","awayteamname":"Adelaide Crows","awayteamnickname":"Crows","completed":"0","result":"","checked":true,"winname":"Gold Coast Suns"}]"';
//
for ($i = 10; $i < 25; $i++) {
  $email = "testuser".$i."@afltest.com";
    $amount = $i * 20;
//   $pswd = "999";
  $resparr = makebet($conn, $email, $predictionjson, $amount);
}


$resparr = array();

if ($operation == "addUser") {
  $resparr = addUser($conn, $email, $pswd);
}
if ($operation == "loginUser") {
  $resparr = loginUser($conn, $email, $pswd);
}
if ($operation == "resetPassword") {
  $resparr = resetPassword($conn, $email, $pswd);
}
if ($operation == "makebet") {
  $resparr = makebet($conn, $email, $predictionjson, $amount);
}
if ($operation == "deposit") {
  $resparr = deposit($conn, $email, $amount);
}
if ($operation == "withdrawalrequest") {
  $resparr = withdrawalrequest($conn, $email, $amount);
}
if ($operation == "withdrawalcompleted") {
  $resparr = withdrawalcompleted($conn, $email, $amount);
}
if ($operation == "games") {
  $resparr = games($conn, $roundnumber);
}

if ($operation == "transactionhistory") {
  $resparr = transactionhistory($conn, $email);
}
// var_dump($resparr);

echo json_encode($resparr);

function games($conn, $roundnumber)
{
  $resparr = array();
  $sql = "SELECT * FROM games
          WHERE roundnumber = '$roundnumber'";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      array_push($resparr, $row);
    }
  } else {
    array_push($resparr, [$sql]);
  }

  return $resparr;
}
function addUser($conn, $email, $pswd)
{

  $resparr = array();

  $sql = "SELECT email from users WHERE email = '" . $email . "'";

  $result = $conn->query($sql);

  // echo ("num-rows" . $result->num_rows . "\n");
  if ($result->num_rows > 0) {
    array_push($resparr, 'error', 'exists');
    return $resparr;
  }

  $sql = "INSERT INTO users (email, pswd, datecreated, dateupdated)
			VALUES
			('$email',MD5('$pswd'), now(), now())";

  if ($conn->query($sql) === true) {
    array_push($resparr, 'success', "added");
  } else {
    array_push($resparr, 'error', $sql);
  }

  return $resparr;
}

function loginUser($conn, $email, $pswd)
{
  $resparr = array();
  $sql = "SELECT * FROM users WHERE email = '$email' AND pswd = MD5('$pswd')";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      array_push($resparr, $row);
    }
  } else {
    array_push($resparr, 'error', $sql);
    return $resparr;
  }

  $sql = "SELECT sum(`deposit_amt`), sum(`request_amt`), sum(`completed_amt`), (sum(`deposit_amt`)-sum(`request_amt`)-sum(`completed_amt`)) as balance FROM `transaction_history` WHERE `email` = '$email' GROUP BY `email`";

  $result2 = $conn->query($sql);

  if ($result2 !== false && $result2->num_rows > 0) {
    while ($row = $result2->fetch_assoc()) {
      array_push($resparr, $row);
    }
  }

  return $resparr;
}

function transactionhistory($conn, $email)
{
  $resparr = array();

  $sql = "SELECT * FROM `transaction_history` WHERE `email` = '$email'";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      array_push($resparr, $row);
    }
  }

  return $resparr;
}


function resetPassword($conn, $email, $pswd)
{
  $resparr = array();
  $sql = "UPDATE users SET pswd = MD5('$pswd'), dateupdated = now() WHERE email = '$email'";

  if ($conn->query($sql) === TRUE) {
    array_push($resparr, 'success', "reset");
  } else {
    array_push($resparr, 'error', $conn->error);
  }

  return $resparr;
}

function makebet($conn, $email, $predictionjson, $amount)
{
  $resparr = array();
  $sql = "INSERT INTO bets (email, predictionjson, amount, datecreated) VALUES ('$email','$predictionjson', $amount, now())";

  if ($conn->query($sql) === true) {
    array_push($resparr, 'success', "added");
  } else {
    array_push($resparr, 'error', $sql);
  }

  return $resparr;
}

function deposit($conn, $email, $amount)
{

  $resparr = array();

  $sql = "INSERT INTO deposits (email, amount, datecreated) VALUES ('$email','$amount', now())";

  if ($conn->query($sql) === true) {
    array_push($resparr, 'success', "success");
  } else {
    array_push($resparr, 'error', $sql);
  }

  return $resparr;
}
function withdrawalrequest($conn, $email, $amount)
{

  $resparr = array();

  $sql = "INSERT INTO withdrawalrequests (email, amount, datecreated) VALUES ('$email','$amount', now())";

  if ($conn->query($sql) === true) {
    array_push($resparr, 'success', "success");
  } else {
    array_push($resparr, 'error', $sql);
  }

  return $resparr;
}
function withdrawalcompleted($conn, $email, $amount)
{

  $resparr = array();

  $sql = "INSERT INTO withdrawalcompleted (email, amount, datecreated) VALUES ('$email','$amount',  now())";

  if ($conn->query($sql) === true) {
    array_push($resparr, 'success', "success");
  } else {
    array_push($resparr, 'error', $sql);
  }

  return $resparr;
}
