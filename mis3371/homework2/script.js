/*
  Program name: script.js
  Author: Viet Nguyen
  Date created: 02/26/2026
  Date last edited: 03/27/2026
  Version: 2.0
  Description: This is my external javascript file for the Peak Point Medical
               patient registration form. It handles the slider, password checks,
               user ID formatting, form validation, and the review panel.
*/

// updates the pain slider label and color when user drags it
function updateSlider() {
  var val    = parseInt(document.getElementById("pain_scale").value);
  var labels = ["0 — None","1 — Minimal","2 — Mild","3 — Uncomfortable",
                "4 — Moderate","5 — Distracting","6 — Distressing",
                "7 — Severe","8 — Intense","9 — Very Intense","10 — Worst Possible"];
  var el = document.getElementById("pain-display");
  el.textContent = labels[val];
  // change color based on severity
  if (val <= 2)      el.style.color = "#27ae60"; // green
  else if (val <= 5) el.style.color = "#e07000"; // orange
  else               el.style.color = "#c0392b"; // red
}

// converts user id to lowercase as the user types
function lowercaseUserID() {
  var field = document.getElementById("userid");
  var pos   = field.selectionStart;
  field.value = field.value.toLowerCase();
  field.setSelectionRange(pos, pos);
}

// checks password strength in real time and shows weak/fair/good/strong
function checkPasswordStrength() {
  var pw  = document.getElementById("password").value;
  var msg = document.getElementById("pw-strength");
  var err = document.getElementById("err-password");
  err.textContent = "";

  if (pw.length === 0) { msg.textContent = ""; return; }

  // no quotation marks allowed
  if (/["']/.test(pw)) {
    err.textContent = "Quotation marks are not allowed.";
    msg.textContent = "";
    return;
  }

  // count how many requirements are met
  var checks = [
    /[A-Z]/.test(pw),  // has uppercase
    /[a-z]/.test(pw),  // has lowercase
    /[0-9]/.test(pw),  // has number
    /[!@#%^&*()\-_+=\/><.,`~]/.test(pw), // has special char
    pw.length >= 8     // long enough
  ].filter(Boolean).length;

  var labels = ["","Weak","Weak","Fair","Good","Strong"];
  var colors = ["","#c0392b","#c0392b","#e07000","#2980b9","#27ae60"];
  msg.textContent = labels[checks];
  msg.style.color = colors[checks];

  // also check if confirm field matches while user is typing
  if (document.getElementById("password2").value.length > 0) checkPasswordMatch();
}

// checks if both password fields match
function checkPasswordMatch() {
  var p1  = document.getElementById("password").value;
  var p2  = document.getElementById("password2").value;
  var err = document.getElementById("err-password2");
  if (p2.length === 0) { err.textContent = ""; return; }
  if (p1 !== p2) {
    err.textContent = "Passwords do not match.";
    err.style.color = "#c0392b";
  } else {
    err.textContent = "✓ Passwords match.";
    err.style.color = "#27ae60";
  }
}

// sets the min and max dates for the date of birth field
// min = 120 years ago, max = today
function setDateLimits() {
  var dob   = document.getElementById("dob");
  var today = new Date();
  dob.setAttribute("max", today.toISOString().split("T")[0]);
  var min = new Date();
  min.setFullYear(min.getFullYear() - 120);
  dob.setAttribute("min", min.toISOString().split("T")[0]);
}

// validates every field and shows error messages next to each one
// returns true if everything is valid, false if anything is wrong
function validateAll() {
  var valid = true;

  // helper functions to show or clear error messages
  function fail(id, msg) {
    var el = document.getElementById(id);
    if (el) el.textContent = msg;
    valid = false;
  }
  function pass(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = "";
  }

  // first name: required, letters/apostrophes/dashes only
  var fname = document.getElementById("fname").value.trim();
  if (!fname) fail("err-fname","Required.");
  else if (!/^[A-Za-z'\-]{1,30}$/.test(fname)) fail("err-fname","Letters, apostrophes, dashes only.");
  else pass("err-fname");

  // middle initial: optional, one letter only
  var mi = document.getElementById("mi").value.trim();
  if (mi && !/^[A-Za-z]$/.test(mi)) fail("err-mi","Single letter only.");
  else pass("err-mi");

  // last name: required, letters/apostrophes/dashes/numbers
  var lname = document.getElementById("lname").value.trim();
  if (!lname) fail("err-lname","Required.");
  else if (!/^[A-Za-z'\-0-9]{1,30}$/.test(lname)) fail("err-lname","Letters, apostrophes, dashes, numbers only.");
  else pass("err-lname");

  // date of birth: required, must be in valid range
  var dob = document.getElementById("dob").value;
  if (!dob) { fail("err-dob","Required."); }
  else {
    var dobDate = new Date(dob + "T00:00:00");
    var today = new Date(); today.setHours(0,0,0,0);
    var minDate = new Date(); minDate.setFullYear(minDate.getFullYear()-120); minDate.setHours(0,0,0,0);
    if (dobDate > today) fail("err-dob","Cannot be in the future.");
    else if (dobDate < minDate) fail("err-dob","Cannot be more than 120 years ago.");
    else pass("err-dob");
  }

  // social security: required, format XXX-XX-XXXX
  var ssn = document.getElementById("ssn").value.trim();
  if (!ssn) fail("err-ssn","Required.");
  else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(ssn)) fail("err-ssn","Format: XXX-XX-XXXX");
  else pass("err-ssn");

  // phone: optional but must be valid format if entered
  var phone = document.getElementById("phone").value.trim();
  if (phone && !/^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/.test(phone)) fail("err-phone","Format: 000-000-0000");
  else pass("err-phone");

  // email: required, must have @ and domain
  var email = document.getElementById("email").value.trim();
  if (!email) fail("err-email","Required.");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("err-email","Format: name@domain.tld");
  else pass("err-email");

  // address line 1: required, 2-30 chars
  var addr1 = document.getElementById("addr1").value.trim();
  if (!addr1 || addr1.length < 2) fail("err-addr1","Required. 2-30 characters.");
  else pass("err-addr1");

  // address line 2: optional, but if entered must be 2+ chars
  var addr2 = document.getElementById("addr2").value.trim();
  if (addr2 && addr2.length < 2) fail("err-addr2","If entered, must be at least 2 characters.");
  else pass("err-addr2");

  // city: required, 2-30 chars
  var city = document.getElementById("city").value.trim();
  if (!city || city.length < 2) fail("err-city","Required. 2-30 characters.");
  else pass("err-city");

  // state: must pick something from dropdown
  var state = document.getElementById("state").value;
  if (!state) fail("err-state","Please select a state.");
  else pass("err-state");

  // zip: required, 5 digits or zip+4 format
  var zip = document.getElementById("zip").value.trim();
  if (!zip) fail("err-zip","Required.");
  else if (!/^\d{5}(-\d{4})?$/.test(zip)) fail("err-zip","Format: XXXXX or XXXXX-XXXX");
  else pass("err-zip");

  // gender: must pick one radio button
  var gender = document.querySelector('input[name="gender"]:checked');
  if (!gender) fail("err-gender","Please select a gender.");
  else pass("err-gender");

  // vaccinated: must pick one
  var vacc = document.querySelector('input[name="vaccinated"]:checked');
  if (!vacc) fail("err-vaccinated","Please select one.");
  else pass("err-vaccinated");

  // insurance: must pick one
  var ins = document.querySelector('input[name="insurance"]:checked');
  if (!ins) fail("err-insurance","Please select one.");
  else pass("err-insurance");

  // symptoms: optional but no double quotes allowed
  var symptoms = document.getElementById("symptoms").value;
  if (symptoms.indexOf('"') !== -1) fail("err-symptoms",'Do not use quotation marks (").');
  else pass("err-symptoms");

  // user id: 5-30 chars, must start with letter, no spaces
  var userid = document.getElementById("userid").value.trim();
  if (!userid) fail("err-userid","Required.");
  else if (userid.length < 5) fail("err-userid","Must be at least 5 characters.");
  else if (userid.length > 30) fail("err-userid","Must be no more than 30 characters.");
  else if (!/^[A-Za-z][A-Za-z0-9_\-]{4,29}$/.test(userid)) fail("err-userid","Must start with a letter. Letters, numbers, _ and - only. No spaces.");
  else pass("err-userid");

  // password: 8-30 chars, needs upper, lower, number, special char
  var pw  = document.getElementById("password").value;
  var pw2 = document.getElementById("password2").value;
  var pwErr = "";
  if (!pw) pwErr = "Required.";
  else if (pw.length < 8)  pwErr = "Must be at least 8 characters.";
  else if (pw.length > 30) pwErr = "Must be no more than 30 characters.";
  else if (!/[A-Z]/.test(pw)) pwErr = "Must contain at least 1 uppercase letter.";
  else if (!/[a-z]/.test(pw)) pwErr = "Must contain at least 1 lowercase letter.";
  else if (!/[0-9]/.test(pw)) pwErr = "Must contain at least 1 number.";
  else if (!/[!@#%^&*()\-_+=\/><.,`~]/.test(pw)) pwErr = "Must contain at least 1 special character.";
  else if (/["']/.test(pw)) pwErr = "Cannot contain quotation marks.";
  else if (userid && pw.toLowerCase().indexOf(userid.toLowerCase()) !== -1) pwErr = "Cannot contain your User ID.";
  if (pwErr) fail("err-password", pwErr); else pass("err-password");

  // confirm password: must match password field
  if (!pw2) fail("err-password2","Required.");
  else if (pw !== pw2) fail("err-password2","Passwords do not match.");
  else pass("err-password2");

  return valid;
}

// builds and shows the review panel with pass/error status for each field
function reviewForm() {
  var allValid = validateAll();

  // collect all form values
  var fname    = document.getElementById("fname").value.trim();
  var mi       = document.getElementById("mi").value.trim();
  var lname    = document.getElementById("lname").value.trim();
  var dob      = document.getElementById("dob").value;
  var ssn      = document.getElementById("ssn").value.trim();
  var phone    = document.getElementById("phone").value.trim();
  var email    = document.getElementById("email").value.trim();
  var addr1    = document.getElementById("addr1").value.trim();
  var addr2    = document.getElementById("addr2").value.trim();
  var city     = document.getElementById("city").value.trim();
  var state    = document.getElementById("state").value;
  var zip      = document.getElementById("zip").value.trim().substring(0,10);
  var genderEl = document.querySelector('input[name="gender"]:checked');
  var vaccEl   = document.querySelector('input[name="vaccinated"]:checked');
  var insEl    = document.querySelector('input[name="insurance"]:checked');
  var painDisp = document.getElementById("pain-display").textContent;
  var symptoms = document.getElementById("symptoms").value.trim();
  var userid   = document.getElementById("userid").value.toLowerCase().trim();
  var pw       = document.getElementById("password").value;
  var pw2      = document.getElementById("password2").value;

  // get which illness checkboxes were checked
  var allIllnesses = ["Chicken Pox","Small Pox","Covid-19","Tetanus","Mumps","Measles"];
  var checkedIll   = Array.from(document.querySelectorAll('input[name="illness"]:checked'))
                         .map(function(c){ return c.value; });

  // helper to build pass or error cell
  function statusCell(isOk, errMsg) {
    if (isOk) return '<td class="rev-pass">&#10003; PASS</td>';
    return '<td class="rev-fail">&#10007; ERROR: ' + errMsg + '</td>';
  }

  // check each field for the review display
  var fullName = fname + (mi ? " " + mi + "." : "") + " " + lname;
  var nameOk   = /^[A-Za-z'\-]{1,30}$/.test(fname) && /^[A-Za-z'\-0-9]{1,30}$/.test(lname);

  var dobOk = false; var dobErr = "Required";
  if (dob) {
    var dobDate = new Date(dob + "T00:00:00");
    var today = new Date(); today.setHours(0,0,0,0);
    var minD  = new Date(); minD.setFullYear(minD.getFullYear()-120); minD.setHours(0,0,0,0);
    if (dobDate > today) dobErr = "Cannot be in the future";
    else if (dobDate < minD) dobErr = "More than 120 years ago";
    else dobOk = true;
  }

  // mask SSN to only show last 4 digits
  var ssnOk   = /^\d{3}-?\d{2}-?\d{4}$/.test(ssn);
  var ssnDisp = ssn ? "***-**-" + ssn.replace(/\D/g,"").slice(-4) : "(not entered)";
  var phoneOk = !phone || /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/.test(phone);
  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  var addr1Ok = addr1.length >= 2;
  var addr2Ok = !addr2 || addr2.length >= 2;
  var cityOk  = city.length >= 2;
  var stateOk = state !== "";
  var zipOk   = /^\d{5}(-\d{4})?$/.test(zip);
  var addrOk  = addr1Ok && addr2Ok && cityOk && stateOk && zipOk;
  var addrDisp = (addr1||"(missing)") + (addr2 ? ", "+addr2 : "") + "<br>" +
                 (city||"(missing)") + ", " + (state||"(missing)") + " " + (zip||"(missing zip)");
  var addrErr = !addr1Ok ? "Address line 1 missing/too short"
              : !cityOk  ? "City missing/too short"
              : !stateOk ? "State not selected"
              : !zipOk   ? "Invalid ZIP code" : "Check address fields";

  var pw2Ok    = pw === pw2;
  var useridOk = userid.length >= 5 && userid.length <= 30 && /^[a-z][a-z0-9_\-]{4,29}$/.test(userid);
  var pwOk     = pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) &&
                 /[0-9]/.test(pw) && /[!@#%^&*()\-_+=\/><.,`~]/.test(pw) &&
                 !/["']/.test(pw) && (!userid || pw.toLowerCase().indexOf(userid.toLowerCase()) === -1);

  // build the review table html
  var html = "";
  html += '<tr class="rev-header"><td colspan="3" style="text-align:center;font-size:1.1rem;font-weight:bold;padding:10px;">PLEASE REVIEW THIS INFORMATION</td></tr>';
  html += '<tr class="rev-col-hdr"><td><b>Field</b></td><td><b>Value Entered</b></td><td><b>Status</b></td></tr>';

  html += '<tr class="rev-section"><td colspan="3"><b>— Personal Information —</b></td></tr>';
  html += '<tr><td class="rev-lbl">Full Name</td><td>' + (fullName.trim()||"(blank)") + '</td>' + statusCell(nameOk && !!fname && !!lname,"Check name fields") + '</tr>';
  html += '<tr><td class="rev-lbl">Date of Birth</td><td>' + (dob||"(not entered)") + '</td>' + statusCell(dobOk, dobErr) + '</tr>';
  html += '<tr><td class="rev-lbl">Social Security</td><td>' + ssnDisp + '</td>' + statusCell(ssnOk,"Format: XXX-XX-XXXX") + '</tr>';
  html += '<tr><td class="rev-lbl">Gender</td><td>' + (genderEl ? genderEl.value : "(not selected)") + '</td>' + statusCell(!!genderEl,"Please select gender") + '</tr>';

  html += '<tr class="rev-section"><td colspan="3"><b>— Contact Information —</b></td></tr>';
  html += '<tr><td class="rev-lbl">Phone Number</td><td>' + (phone||"(not provided)") + '</td>' + statusCell(phoneOk,"Format: 000-000-0000") + '</tr>';
  html += '<tr><td class="rev-lbl">Email Address</td><td>' + (email||"(not entered)") + '</td>' + statusCell(emailOk,"Format: name@domain.tld") + '</tr>';

  html += '<tr class="rev-section"><td colspan="3"><b>— Address —</b></td></tr>';
  html += '<tr><td class="rev-lbl">Address</td><td>' + addrDisp + '</td>' + statusCell(addrOk, addrErr) + '</tr>';

  html += '<tr class="rev-section"><td colspan="3"><b>— Medical History —</b></td></tr>';

  // show each illness with Y or N
  var illHtml = "";
  allIllnesses.forEach(function(ill) {
    illHtml += ill + ": <b>" + (checkedIll.indexOf(ill) !== -1 ? "Y" : "N") + "</b>&nbsp;&nbsp;";
  });
  html += '<tr><td class="rev-lbl">Prior Illnesses</td><td colspan="2">' + illHtml + '</td></tr>';
  html += '<tr><td class="rev-lbl">Vaccinated?</td><td>' + (vaccEl ? vaccEl.value : "(not selected)") + '</td>' + statusCell(!!vaccEl,"Please select one") + '</tr>';
  html += '<tr><td class="rev-lbl">Has Insurance?</td><td>' + (insEl ? insEl.value : "(not selected)") + '</td>' + statusCell(!!insEl,"Please select one") + '</tr>';
  html += '<tr><td class="rev-lbl">Pain Level</td><td>' + painDisp + '</td><td class="rev-pass">&#10003; PASS</td></tr>';
  html += '<tr><td class="rev-lbl" style="vertical-align:top">Described Symptoms</td><td colspan="2">' + (symptoms||"(none provided)") + '</td></tr>';

  html += '<tr class="rev-section"><td colspan="3"><b>— Account Credentials —</b></td></tr>';
  html += '<tr><td class="rev-lbl">User ID</td><td>' + (userid||"(not entered)") + '</td>' + statusCell(useridOk,"5-30 chars, start with letter, no spaces") + '</tr>';
  // only show first 3 chars of password then mask the rest
  html += '<tr><td class="rev-lbl">Password</td><td>' + (pw ? pw.substring(0,3)+"***" : "(not entered)") + ' <i style="font-size:0.75rem;">(partially masked)</i></td>' + statusCell(pwOk,"Check password requirements") + '</tr>';
  html += '<tr><td class="rev-lbl">Passwords Match?</td><td>' + (pw2Ok ? "Yes" : "No") + '</td>' + statusCell(pw2Ok,"Passwords do not match") + '</tr>';

  document.getElementById("review-table").innerHTML = html;

  // show overall pass or fail message
  document.getElementById("review-status").innerHTML = allValid
    ? '<p class="rev-ok">&#10003; All fields validated. Click Submit to complete registration.</p>'
    : '<p class="rev-err-msg">&#10007; Some fields have errors. Please correct them and click Review again.</p>';

  // show the panel and scroll to it
  var panel = document.getElementById("review-panel");
  panel.style.display = "block";
  panel.scrollIntoView({ behavior: "smooth" });
}

// validates then redirects to thank you page
function submitForm() {
  if (validateAll()) {
    window.location.href = "thankyou.html";
  } else {
    alert("Please fix all errors before submitting.");
  }
}

// clears the review panel when clear form button is clicked
function clearReview() {
  document.getElementById("review-panel").style.display = "none";
  document.getElementById("review-table").innerHTML = "";
  document.getElementById("review-status").innerHTML = "";
  document.getElementById("pain-display").textContent = "0 — None";
  document.getElementById("pain-display").style.color = "#27ae60";
  document.getElementById("pw-strength").textContent = "";
  // clear all inline error messages
  document.querySelectorAll(".err").forEach(function(e){ e.textContent = ""; });
}

// runs when page loads - sets date limits and initializes slider
window.onload = function() {
  setDateLimits();
  updateSlider();
};

// END OF FILE: script.js
