<?php
// php calcWinnings.php 1
if (PHP_SAPI === 'cli') {
    $roundnumber = $argv[1];
}
// echo "Round " . $roundnumber . "\n";
// $host = 'localhost';
// $db = 'afl';
// $user = 'john';
// $pass = 'john';
// $charset = 'utf8mb4';

$host = '13.49.223.11';
$db = 'afl';
$user = 'aflpools';
$pass = 'V4513john';
$charset = 'utf8mb4';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_errno) {
    echo "Failed to connect to MySQL: " . $conn->connect_error;
    exit();
}
// get winning predictions for specified round
$predictionsarray = array();
$sql = "SELECT id, email, roundnumber, amount FROM predictions
          WHERE roundnumber = $roundnumber and correct_count = 6";

$result = $conn->query($sql);
$wins = 0;
$winamt = 0;

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // echo ($row["id"] . "\t");
        // echo ($row["email"] . "\t");
        // echo ($row["roundnumber"] . "\t");
        // echo ("$" . $row["amount"] . "\n");
        array_push($predictionsarray, $row);
    }
    $wins = $result->num_rows;
} else {
    echo "No records found or SQL Error" . "\n";
    echo $sql . "\n";
};
// get total prizepool for specified round
// $prizepoolarray = array();
$sql = "SELECT sum(amount) as amt, count(*) as cnt FROM predictions
          WHERE roundnumber = $roundnumber";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $winamt = ($row["amt"] / $wins);
        // echo ("No. of predictions " . $row["cnt"] . "\t");
        // echo ("Prize pool $" . $row["amt"] . "\t");
        // echo ("Winnings per correct prediction " . "$" . $winamt . "\n");
    }
} else {
    echo "No records found or SQL Error" . "\n";
    echo $sql . "\n";
};
// insert winamt for each correct predidtion (predictionid is unique index to prevent duplicates)
// var_dump($predictionsarray);

for ($i = 0; $i < count($predictionsarray); $i++) {
    // echo ($predictionsarray[$i]["id"] . "\t");
    // echo ($predictionsarray[$i]["email"] . "\t");
    // echo ($predictionsarray[$i]["roundnumber"] . "\t");
    // echo ("$" . $winamt . "\n");
    $predictionid = $predictionsarray[$i]["id"];
    $email = $predictionsarray[$i]["email"];
    $roundnumber = $predictionsarray[$i]["roundnumber"];

    $sql = "INSERT INTO winnings (email, roundnumber, predictionid, amount, datecreated) 
                        VALUES ('$email',$roundnumber,$predictionid, $winamt, now())";

    if ($conn->query($sql) === true) {
        echo 'success';
    } else {
        echo ('error ' . mysqli_error($conn) . "\n");
    }
}
