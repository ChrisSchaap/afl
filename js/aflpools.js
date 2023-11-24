// var winlocpath;
// var hostname = "";
var tableleft = "";
var tableright = "";
var game = 1;
var radiogrp = 1;
var selectedgames = [];
var logemail = "";
var logpword = "";
var chkbox = false;
var loggedin = false;
var loggedInUser;
var regemail = "";
var regpwrd = "";
var repregpword = "";
var modal = document.getElementById("loginbox");
var modal2 = document.getElementById("loginbox");

var itemNumber = "BET20";
var itemName = "Pool ticket";
var itemPrice = "30";
var currency = "AUD";
var depamt = "0";
var depcurr = "AUD";
var rndvalcode = 0;
var checkedcnt = 0;

<<<<<<< HEAD
var roundnumber = 1;
var games = [];
=======
var games = [
  {
    gameid: "4787",
    homename: "Richmond",
    homeimg: "Richmond.svg",
    awayname: "Carlton",
    awayimg: "Carlton.svg",
  },
  {
    gameid: "4786",
    homename: "Geelong Cats",
    homeimg: "GeelongCats.svg",
    awayname: "Collingwood",
    awayimg: "Collingwood.svg",
  },
  {
    gameid: "4785",
    homename: "North Melbourne",
    homeimg: "NorthMelbourne.svg",
    awayname: "West Coast Eagles",
    awayimg: "WestCoastEagles.svg",
  },
  {
    gameid: "4788",
    homename: "Port Adelaide",
    homeimg: "PortAdelaide.svg",
    awayname: "Brisbane Lions",
    awayimg: "BrisbaneLions.svg",
  },
  {
    gameid: "4791",
    homename: "Melbourne",
    homeimg: "Melbourne.svg",
    awayname: "Western Bulldogs",
    awayimg: "WesternBulldogs.svg",
  },
  {
    gameid: "4789",
    homename: "Gold Coast Suns",
    homeimg: "GoldCoastSuns.svg",
    awayname: "Sydney Swans",
    awayimg: "SydneySwans.svg",
  },
  {
    gameid: "4790",
    homename: "GWS Giants",
    homeimg: "GWSGiants.svg",
    awayname: "Adelaide Crows",
    awayimg: "AdelaideCrows.svg",
  },
  {
    gameid: "4792",
    homename: "Hawthorn",
    homeimg: "Hawthorn.svg",
    awayname: "Essendon",
    awayimg: "Essendon.svg",
  },
  {
    gameid: "4793",
    homename: "St Kilda",
    homeimg: "StKilda.svg",
    awayname: "Fremantle",
    awayimg: "Fremantle.svg",
  },
];
>>>>>>> 095d1c54fe3d361bd629e626857b6bece08bca04

$(document).ready(function () {
  // setLocalStorage();

  document.getElementById("welcome").innerHTML = "Welcome to the game";

  // games = [];
  var parms = { operation: "games", roundnumber: roundnumber };

  $.ajax({
    type: "POST",
    async: false,
    url: "./php/afldb.php",
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    data: JSON.stringify(parms),
    success: function (response) {
        games = response;
      // }
    },
    error: function (xhr, textStatus, error) {
      console.log(xhr.statusText);
      console.log(textStatus);
      console.log(error);
    },
  });
  console.log("games", games);

  for (i = 0; i < games.length; i++) {
    let gameid = games[i].gameid;
    let homename = games[i].hometeamname;
    let homeimg = games[i].hometeamname.replaceAll(" ", "") + ".svg";
    let awayname = games[i].awayteamname;
    let awayimg = games[i].awayteamname.replaceAll(" ", "") + ".svg";
    let checked = false;
    let winname = "";

    tableleft +=
      `
    <tr>
    <td>
      <div>        
          <input class="agame" id="` +
      gameid +
      `" 
            onchange="gameSelected('${gameid}')" 
            type="checkbox" class="form-check-input" value="">
        </div>
    </td>
    <td><img src="./images/` +
      homeimg +
      `" alt="` +
      homename +
      `" width="60" height="60"></td>
    <td style="font-size: 1rem;font-weight: 700;">VS</td>
    <td><img src="./images/` +
      awayimg +
      `" alt="` +
      awayname +
      `" width="60" height="60"></td>
    <td>
      <div class="form-check">
        <label class="form-check-label">
          <input id=${homename.replaceAll(" ", "")}
          type="radio" class="form-check-input" name="optradio${radiogrp}"
          onclick="setWinner('${gameid}', '${homename}')"
          style="font-size: 20px;">` +
      homename +
      `
        </label>
        </div>
        <div class="form-check">
        <label class="form-check-label">
        <input id=${awayname.replaceAll(" ", "")} 
        type="radio" class="form-check-input" name="optradio${radiogrp++}"         
        onclick="setWinner('${gameid}', '${awayname}')"
        style="font-size: 20px;">` +
      awayname +
      `
        </label>
      </div>
    </td>
    </tr>
   `;
  }
  // console.log("games", games);
  document.getElementById("tableleft").innerHTML = tableleft;
});

function showHideLoginbox() {
  if ($("#loginbox").is(":visible")) {
    $("#loginbox").hide();
  } else {
    $("#loginbox").show();
    $("#registerbox").hide();
  }
}
function setLocalStorage(userdata) {
  localStorage.setItem("aflemail", "Obaseki Nosa");
  localStorage.setItem("aflpassword", "abcdefgh");
}

function loginEvent() {
  // e.preventDefault();

  logemail = $("#lemail").val();
  logpword = $("#lpassword").val();

  if ($("#defaultCheck1").is(":checked")) {
    chkbox = true;
  } else {
    chkbox = false;
  }

  console.log(logemail);
  console.log(logpword);
  console.log(chkbox);

  var parms = { operation: "loginUser", email: logemail, pswd: logpword };

  $.ajax({
    type: "POST",
    url: "./php/afldb.php",
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    data: JSON.stringify(parms),
    success: function (response) {
      if (response.length == 0) {
        $(".msg").html("Login is incorrect. Try again");
        $(".msgcontainer").show();
        logemail = "";
        logpword = "";
        loggedin = false;
      } else {
        response[0].pswd = "";
        loggedInUser = response[0];
        $("#loginbox").hide();
        document.getElementById("welcome").innerHTML = `${loggedInUser.email}`;
        loggedin = true;
        console.log("User", loggedInUser);
      }
    },
    error: function () {
      $(".msg").html("Error");
      $(".msgcontainer").show();
    },
  });
}
function registerEvent() {
  // loginemail=document.getElementById("emailaddress").value;
  regemail = $("#remail").val();
  regpwrd = $("#rpassword").val();
  repregpword = $("#rrpassword").val();

  console.log(regemail);
  console.log(regpwrd);
  console.log(repregpword);

  if ((regpwrd > "") & (regpwrd == repregpword)) {
    var parms = { operation: "addUser", email: regemail, pswd: regpwrd };

    $.ajax({
      type: "POST",
      url: "./php/afldb.php",
      contentType: "application/json; charset=UTF-8",
      dataType: "json",
      data: JSON.stringify(parms),
      success: function (response) {
        if (response[1] == "exists") {
          console.log("response", response);
          $(".msg").html("User already exists, please login");
          $(".msgcontainer").show();
          $("#loginbox").show();
          $("#registerbox").hide();
        }
        if (response[0] == "success") {
          $("#loginbox").hide();
          $("#registerbox").hide();
          logemail = regemail;
          document.getElementById("welcome").innerHTML = `Welcome ${logemail}`;
          loggedin = true;
        }
      },
      error: function (xhr, textStatus, error) {
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
      },
    });
  } else {
    $(".msg").html("Invalid password or passwords do not match");
    $(".msgcontainer").show();
  }
}
function resetPassword() {
  regemail = $("#remail").val();
  regpwrd = $("#newpword").val();
  repregpword = $("#rnewpword").val();

  console.log(regemail);
  console.log(regpwrd);
  console.log(repregpword);

  if ((regpwrd > "") & (regpwrd == repregpword)) {
    var parms = { operation: "resetPassword", email: regemail, pswd: regpwrd };

    $.ajax({
      type: "POST",
      url: "./php/afldb.php",
      contentType: "application/json; charset=UTF-8",
      dataType: "json",
      data: JSON.stringify(parms),
      success: function (response) {
        if (response[0] == "success") {
          $("#forgotbox").hide();
          $("#registerbox").hide();
          $("#loginbox").show();
        } else {
          console.log("reset error", response[1]);

          $(".msgcontainer").show();
          $(".msg").html("reset failed. see log");
          $(".msgcontainer").show();
        }
      },
      error: function () {
        $(".msg").html("Error");
        $(".msgcontainer").show();
      },
    });
  } else {
    $(".msg").html("Invalid password or passwords do not match");
    $(".msgcontainer").show();
  }
}
function forgotPassword() {
  rndvalcode = Math.trunc(Math.random() * (999999 - 111111) + 111111);
  let toemail = $("#lemail").val();
  console.log("toemail", toemail);
  let dummyobj = {
    SecureToken: "e897669f-4158-4aa8-9ec9-b427bb86a779",
    To: "" + toemail,
    From: "aflpools@gmail.com",
    Subject: "AFL Pools password reset",
    Body: "Enter the verification code below" + "\r\n" + rndvalcode.toString(),
  };
  console.log("dummyobj", dummyobj);

  Email.send(dummyobj).then(function (message) {
    $(".msg").html("Email successfully sent");
    $(".msgcontainer").show();
  });

  document.getElementById("valEmail").innerHTML =
    document.getElementById("lemail").value;
  console.log("generated code", rndvalcode);
  $("#loginbox").hide();
  $("#forgotbox").show();
}
function chkValCode() {
  let vc = $("#valcode").val();
  console.log("vc", vc);
  if (vc == rndvalcode.toString()) {
    $("#vc").hide();
    $("#chkemailmsg").hide();
    $("#newpassword").show();
  }
}

function showPayPal() {
  if (loggedin) {
    $("#pp").show();
  } else {
    $("#loginbox").show();
  }

  // document.getElementById("pt2").innerHTML = `<b>Item Name:</b> ${itemName}`;
  // document.getElementById("pt3").innerHTML = "";
}
function deposit(refid) {
  var parms = { operation: "deposit", email: loggedInUser.email, refid: refid };

  $.ajax({
    type: "POST",
    url: "./php/afldb.php",
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    data: JSON.stringify(parms),
    success: function (response) {
      if (response.length == 0) {
        $(".msg").html("Login is incorrect. Try again");
        $(".msgcontainer").show();
        logemail = "";
        logpword = "";
        loggedin = false;
      } else {
        $("#loginbox").hide();
        document.getElementById("welcome").innerHTML = `Welcome ${logemail}`;
        loggedin = true;
      }
    },
    error: function () {
      $(".msg").html("Error");
      $(".msgcontainer").show();
    },
  });
}

function setWinner(gid, win) {
  if (!loggedin) {
    $("#loginbox").show();
    return;
  }
  for (let i = 0; i < games.length; i++) {
    if (games[i].gameid == gid) {
      games[i].winname = win;
      console.log("setWinner", games[i]);
      break;
    }
  }

  betcnt();
}

function gameSelected(gid) {
  // console.log("games", games);
  console.log("game", game);
  if (!loggedin) {
    $(`#${gid}`).prop("checked", false);
    $("#loginbox").show();
    return;
  }

  for (let i = 0; i < games.length; i++) {
    if (games[i].gameid == gid) {
      games[i].checked = !games[i].checked;
    }
    if (!games[i].checked) {
      $(`#${games[i].homename.replaceAll(" ", "")}`).attr("checked", false);
      $(`#${games[i].awayname.replaceAll(" ", "")}`).attr("checked", false);
    }
  }

  checkedcnt = 0;
  for (let i = 0; i < games.length; i++) {
    if (games[i].checked) {
      checkedcnt++;
      console.log("gamesSelected", games[i].gameid);
    }
  }

  console.log("checkedcnt", checkedcnt);

  if (checkedcnt == 6) {
    for (let i = 0; i < games.length; i++) {
      if (!games[i].checked) {
        $(`#${games[i].gameid}`).attr("disabled", true);
        $(`#${games[i].homename.replaceAll(" ", "")}`).attr("disabled", true);
        $(`#${games[i].awayname.replaceAll(" ", "")}`).attr("disabled", true);
        $(`#${games[i].homename.replaceAll(" ", "")}`).attr("checked", false);
        $(`#${games[i].awayname.replaceAll(" ", "")}`).attr("checked", false);
        games[i].winname = "";
      }
    }
  } else {
    for (let i = 0; i < games.length; i++) {
      $(`#${games[i].gameid}`).attr("disabled", false);
      $(`#${games[i].homename.replaceAll(" ", "")}`).attr("disabled", false);
      $(`#${games[i].awayname.replaceAll(" ", "")}`).attr("disabled", false);
    }
  }
  betcnt();
}

function betcnt() {
  let betcnt = 0;
  for (let i = 0; i < games.length; i++) {
    if (games[i].checked && games[i].winname > "") {
      betcnt++;
      console.log("betcnt", betcnt);
    }
  }
  if (betcnt == 6) {
    $("#betnow").show();
    // document.getElementById("betnow").focus();
    window.scrollTo(0, document.body.scrollHeight);
  } else {
    $("#betnow").hide();
  }
}
function makebet() {
  // check funds =>$20
  for (let i = 0; i < games.length; i++) {
    if (games[i].checked) {
      console.log("make bet", games[i]);
    }
  }

  let betthis = games.filter((games) => games.checked === true);
  let betthisjson = JSON.stringify(betthis);
  console.log("betthisjson", betthisjson);

  var parms = {
    operation: "makebet",
    email: loggedInUser.email,
    betthisjson: betthisjson,
  };

  $.ajax({
    type: "POST",
    url: "./php/afldb.php",
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    data: JSON.stringify(parms),
    success: function (response) {
      console.log("Bet made", parms);
      //reduce funds by $20
      // display bet with ticket number
    },
    error: function () {
      $(".msg").html("Error");
      $(".msgcontainer").show();
    },
  });
}
function withdrawalrequest(refid) {
  var parms = {
    operation: "withdrawalrequest",
    email: loggedInUser.email,
    amount: amount,
  };

  $.ajax({
    type: "POST",
    url: "./php/afldb.php",
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    data: JSON.stringify(parms),
    success: function (response) {
      if (response.length == 0) {
        $(".msg").html("Login is incorrect. Try again");
        $(".msgcontainer").show();
        logemail = "";
        logpword = "";
        loggedin = false;
      } else {
        $("#loginbox").hide();
        document.getElementById("welcome").innerHTML = `Welcome ${logemail}`;
        loggedin = true;
      }
    },
    error: function () {
      $(".msg").html("Error");
      $(".msgcontainer").show();
    },
  });
}
function deposit(refid) {
  var parms = {
    operation: "deposit",
    email: loggedInUser.email,
    amount: amount,
  };

  $.ajax({
    type: "POST",
    url: "./php/afldb.php",
    contentType: "application/json; charset=UTF-8",
    dataType: "json",
    data: JSON.stringify(parms),
    success: function (response) {
      if (response.length == 0) {
        $(".msg").html("Login is incorrect. Try again");
        $(".msgcontainer").show();
        logemail = "";
        logpword = "";
        loggedin = false;
      } else {
        $("#loginbox").hide();
        document.getElementById("welcome").innerHTML = `Welcome ${logemail}`;
        loggedin = true;
      }
    },
    error: function () {
      $(".msg").html("Error");
      $(".msgcontainer").show();
    },
  });
}

