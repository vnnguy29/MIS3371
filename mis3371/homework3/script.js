/*
  Program name: script.js
  Author: Viet Nguyen
  Date created: 03/27/2026
  Date last edited: 03/27/2026
  Version: 3.0
  Description: External javascript for Peak Point Medical HW3.
               Every field validates on the fly using oninput and onblur.
               SSN auto formats dashes as you type.
               Submit button only appears when all fields pass validation.
*/

// updates the pain slider label and color when user drags it
function updateSlider() {
  var val    = parseInt(document.getElementById("pain_scale").value);
  var labels = ["0 — None","1 — Minimal","2 — Mild","3 — Uncomfortable",
                "4 — Moderate","5 — Distracting","6 — Distressing",
                "7 — Severe","8 — Intense","9 — Very Intense","10 — Worst Possible"];
  var el = document.getElementById("pain-display");
  el.textContent = labels[val];
  if (val <= 2)      el.style.color = "#27ae60";
  else if (val <= 5) el.style.color = "#e07000";
  else               el.style.color = "#c0392b";
}

// auto formats dashes into SSN as user types
function formatSSN() {
  var field = document.getElementById("ssn");
  var val   = field.value.replace(/\D/g, "");
  if (val.length > 3 && val.length <= 5) {
    val = val.substring(0,3) + "-" + val.substring(3);
  } else if (val.length > 5) {
    val = val.substring(0,3) + "-" + val.substring(3,5) + "-" + val.substring(5,9);
  }
  field.value = val;
  validateSSN();
}

// converts user id to lowercase as the user types
function lowercaseUserID() {
  var field = document.getElementById("userid");
  var pos   = field.selectionStart;
  field.value = field.value.toLowerCase();
  field.setSelectionRange(pos, pos);
}

// shows password strength as user types
function checkPasswordStrength() {
  var pw  = document.getElementById("password").value;
  var msg = document.getElementById("pw-strength");
  if (pw.length === 0) { msg.textContent = ""; return; }
  if (/["']/.test(pw)) { msg.textContent = ""; return; }
  var checks = [
    /[A-Z]/.test(pw), /[a-z]/.test(pw),
    /[0-9]/.test(pw), /[!@#%^&*()\-_+=\/><.,`~]/.test(pw),
    pw.length >= 8
  ].filter(Boolean).length;
  var labels = ["","Weak","Weak","Fair","Good","Strong"];
  var colors = ["","#c0392b","#c0392b","#e07000","#2980b9","#27ae60"];
  msg.textContent = labels[checks];
  msg.style.color = colors[checks];
}

// checks if submit button should be shown or hidden
function checkSubmitButton() {
  var errors = document.querySelectorAll(".err");
  var hasErrors = false;
  errors.forEach(function(e) {
    if (e.textContent && e.textContent.trim() !== "" && e.textContent !== "\u00a0") {
      hasErrors = true;
    }
  });
  document.getElementById("btn-submit").style.display = hasErrors ? "none" : "inline-block";
}

// ── INDIVIDUAL FIELD VALIDATORS ──────────────────────────────

function validateFname() {
  var val = document.getElementById("fname").value.trim();
  var err = document.getElementById("err-fname");
  if (!val) err.textContent = "First name is required.";
  else if (!/^[A-Za-z'\-]{1,30}$/.test(val)) err.textContent = "Letters, apostrophes, and dashes only.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateMI() {
  var val = document.getElementById("mi").value.trim();
  var err = document.getElementById("err-mi");
  if (val && !/^[A-Za-z]$/.test(val)) err.textContent = "One letter only.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateLname() {
  var val = document.getElementById("lname").value.trim();
  var err = document.getElementById("err-lname");
  if (!val) err.textContent = "Last name is required.";
  else if (!/^[A-Za-z'\-]{1,30}$/.test(val)) err.textContent = "Letters, apostrophes, and dashes only.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateDOB() {
  var val = document.getElementById("dob").value;
  var err = document.getElementById("err-dob");
  if (!val) { err.textContent = "Date of birth is required."; }
  else {
    var d       = new Date(val + "T00:00:00");
    var today   = new Date(); today.setHours(0,0,0,0);
    var minDate = new Date(); minDate.setFullYear(minDate.getFullYear()-120); minDate.setHours(0,0,0,0);
    if (d > today) err.textContent = "Cannot be in the future.";
    else if (d < minDate) err.textContent = "Cannot be more than 120 years ago.";
    else err.textContent = "\u00a0";
  }
  checkSubmitButton();
}

function validateSSN() {
  var val = document.getElementById("ssn").value.trim();
  var err = document.getElementById("err-ssn");
  if (!val) err.textContent = "Social Security Number is required.";
  else if (!/^\d{3}-\d{2}-\d{4}$/.test(val)) err.textContent = "Format: XXX-XX-XXXX";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validatePhone() {
  var val = document.getElementById("phone").value.trim();
  var err = document.getElementById("err-phone");
  if (val && !/^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/.test(val)) err.textContent = "Format: 000-000-0000";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateEmail() {
  // force lowercase on email field
  var field = document.getElementById("email");
  field.value = field.value.toLowerCase();
  var val = field.value.trim();
  var err = document.getElementById("err-email");
  if (!val) err.textContent = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) err.textContent = "Format: name@domain.tld";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateAddr1() {
  var val = document.getElementById("addr1").value.trim();
  var err = document.getElementById("err-addr1");
  if (!val || val.length < 2) err.textContent = "Required. At least 2 characters.";
  else if (val.length > 30) err.textContent = "Cannot exceed 30 characters.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateAddr2() {
  var val = document.getElementById("addr2").value.trim();
  var err = document.getElementById("err-addr2");
  if (val && val.length < 2) err.textContent = "If entered, must be at least 2 characters.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateCity() {
  var val = document.getElementById("city").value.trim();
  var err = document.getElementById("err-city");
  if (!val || val.length < 2) err.textContent = "Required. At least 2 characters.";
  else if (val.length > 30) err.textContent = "Cannot exceed 30 characters.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateState() {
  var val = document.getElementById("state").value;
  var err = document.getElementById("err-state");
  if (!val) err.textContent = "Please select a state.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateZip() {
  var val = document.getElementById("zip").value.trim();
  var err = document.getElementById("err-zip");
  if (!val) err.textContent = "ZIP code is required.";
  else if (!/^\d{5}$/.test(val)) err.textContent = "Must be exactly 5 digits.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateGender() {
  var val = document.querySelector('input[name="gender"]:checked');
  var err = document.getElementById("err-gender");
  if (!val) err.textContent = "Please select a gender.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateVacc() {
  var val = document.querySelector('input[name="vaccinated"]:checked');
  var err = document.getElementById("err-vaccinated");
  if (!val) err.textContent = "Please select one.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateIns() {
  var val = document.querySelector('input[name="insurance"]:checked');
  var err = document.getElementById("err-insurance");
  if (!val) err.textContent = "Please select one.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateSymptoms() {
  var val = document.getElementById("symptoms").value;
  var err = document.getElementById("err-symptoms");
  if (val.indexOf('"') !== -1) err.textContent = "Do not use quotation marks.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateUserID() {
  var val = document.getElementById("userid").value.trim();
  var err = document.getElementById("err-userid");
  if (!val) err.textContent = "User ID is required.";
  else if (/^\d/.test(val)) err.textContent = "Cannot start with a number.";
  else if (val.length < 5) err.textContent = "Must be at least 5 characters.";
  else if (val.length > 20) err.textContent = "Cannot be more than 20 characters.";
  else if (/\s/.test(val)) err.textContent = "No spaces allowed.";
  else if (!/^[a-z][a-z0-9_\-]{4,19}$/.test(val)) err.textContent = "Letters, numbers, underscore, and dash only.";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validatePassword() {
  var pw     = document.getElementById("password").value;
  var userid = document.getElementById("userid").value.trim();
  var err    = document.getElementById("err-password");
  var msg    = "";
  if (!pw) msg = "Password is required.";
  else if (pw.length < 8) msg = "Must be at least 8 characters.";
  else if (pw.length > 30) msg = "Cannot be more than 30 characters.";
  else if (!/[A-Z]/.test(pw)) msg = "Must have at least 1 uppercase letter.";
  else if (!/[a-z]/.test(pw)) msg = "Must have at least 1 lowercase letter.";
  else if (!/[0-9]/.test(pw)) msg = "Must have at least 1 number.";
  else if (!/[!@#%^&*()\-_+=\/><.,`~]/.test(pw)) msg = "Must have at least 1 special character.";
  else if (/["']/.test(pw)) msg = "Cannot contain quotation marks.";
  else if (userid && pw.toLowerCase() === userid.toLowerCase()) msg = "Password cannot equal your User ID.";
  else if (userid && pw.toLowerCase().indexOf(userid.toLowerCase()) !== -1) msg = "Password cannot contain your User ID.";
  err.textContent = msg || "\u00a0";
  if (document.getElementById("password2").value.length > 0) checkPasswordMatch();
  checkSubmitButton();
}

function checkPasswordMatch() {
  var p1  = document.getElementById("password").value;
  var p2  = document.getElementById("password2").value;
  var err = document.getElementById("err-password2");
  if (!p2) { err.textContent = "\u00a0"; checkSubmitButton(); return; }
  if (p1 !== p2) {
    err.textContent = "Passwords do not match.";
    err.style.color = "#c0392b";
  } else {
    err.textContent = "\u2713 Passwords match.";
    err.style.color = "#27ae60";
  }
  checkSubmitButton();
}

// runs all validators at once when validate button is clicked
function validateAll() {
  validateFname(); validateMI(); validateLname();
  validateDOB(); validateSSN(); validatePhone(); validateEmail();
  validateAddr1(); validateAddr2(); validateCity();
  validateState(); validateZip(); validateGender();
  validateVacc(); validateIns(); validateSymptoms();
  validateUserID(); validatePassword(); checkPasswordMatch();
  checkSubmitButton();

  var firstErr = null;
  document.querySelectorAll(".err").forEach(function(e) {
    if (!firstErr && e.textContent && e.textContent.trim() !== "" && e.textContent !== "\u00a0") {
      firstErr = e;
    }
  });

  if (firstErr) {
    firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
    alert("Please fix all errors before submitting.");
  } else {
    alert("All fields look good! You can now click Submit.");
  }
}

// builds and shows the review panel
function reviewForm() {
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
  var zip      = document.getElementById("zip").value.trim();
  var genderEl = document.querySelector('input[name="gender"]:checked');
  var vaccEl   = document.querySelector('input[name="vaccinated"]:checked');
  var insEl    = document.querySelector('input[name="insurance"]:checked');
  var painDisp = document.getElementById("pain-display").textContent;
  var symptoms = document.getElementById("symptoms").value.trim();
  var userid   = document.getElementById("userid").value.toLowerCase().trim();
  var pw       = document.getElementById("password").value;

  var allIllnesses = ["Chicken Pox","Small Pox","Covid-19","Tetanus","Mumps","Measles"];
  var checkedIll   = Array.from(document.querySelectorAll('input[name="illness"]:checked'))
                         .map(function(c){ return c.value; });

  function statusCell(isOk, errMsg) {
    if (isOk) return '<td class="rev-pass">&#10003; PASS</td>';
    return '<td class="rev-fail">&#10007; ERROR: ' + errMsg + '</td>';
  }

  var fullName = fname + (mi ? " " + mi + "." : "") + " " + lname;
  var nameOk   = /^[A-Za-z'\-]{1,30}$/.test(fname) && /^[A-Za-z'\-]{1,30}$/.test(lname);
  var dobOk = false; var dobErr = "Required";
  if (dob) {
    var dobDate = new Date(dob + "T00:00:00");
    var today = new Date(); today.setHours(0,0,0,0);
    var minD  = new Date(); minD.setFullYear(minD.getFullYear()-120); minD.setHours(0,0,0,0);
    if (dobDate > today) dobErr = "Cannot be in the future";
    else if (dobDate < minD) dobErr = "More than 120 years ago";
    else dobOk = true;
  }
  var ssnOk   = /^\d{3}-\d{2}-\d{4}$/.test(ssn);
  var ssnDisp = ssn ? "***-**-" + ssn.replace(/\D/g,"").slice(-4) : "(not entered)";
  var phoneOk = !phone || /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/.test(phone);
  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  var addrOk  = addr1.length >= 2 && city.length >= 2 && state !== "" && /^\d{5}$/.test(zip);
  var addrDisp = (addr1||"(missing)") + (addr2 ? ", "+addr2 : "") + "<br>" +
                 (city||"(missing)") + ", " + (state||"(missing)") + " " + (zip||"(missing)");
  var pw2Ok    = pw === document.getElementById("password2").value;
  var useridOk = userid.length >= 5 && userid.length <= 20 && /^[a-z][a-z0-9_\-]{4,19}$/.test(userid);
  var pwOk     = pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) &&
                 /[0-9]/.test(pw) && /[!@#%^&*()\-_+=\/><.,`~]/.test(pw) &&
                 !/["']/.test(pw) && pw.toLowerCase() !== userid.toLowerCase();

  var html = "";
  html += '<tr class="rev-header"><td colspan="3" style="text-align:center;font-weight:bold;padding:10px;">PLEASE REVIEW THIS INFORMATION</td></tr>';
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
  html += '<tr><td class="rev-lbl">Address</td><td>' + addrDisp + '</td>' + statusCell(addrOk,"Check address fields") + '</tr>';

  html += '<tr class="rev-section"><td colspan="3"><b>— Medical History —</b></td></tr>';
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
  html += '<tr><td class="rev-lbl">User ID</td><td>' + (userid||"(not entered)") + '</td>' + statusCell(useridOk,"5-20 chars, start with letter, no spaces") + '</tr>';
  html += '<tr><td class="rev-lbl">Password</td><td>' + (pw ? pw.substring(0,3)+"***" : "(not entered)") + ' <i style="font-size:0.75rem;">(partially masked)</i></td>' + statusCell(pwOk,"Check password requirements") + '</tr>';
  html += '<tr><td class="rev-lbl">Passwords Match?</td><td>' + (pw2Ok ? "Yes" : "No") + '</td>' + statusCell(pw2Ok,"Passwords do not match") + '</tr>';

  document.getElementById("review-table").innerHTML = html;
  document.getElementById("review-status").innerHTML = "";

  var panel = document.getElementById("review-panel");
  panel.style.display = "block";
  panel.scrollIntoView({ behavior: "smooth" });
}

// redirects to thank you page
function submitForm() {
  window.location.href = "thankyou.html";
}

// clears everything when clear button is clicked
function clearAll() {
  document.getElementById("review-panel").style.display = "none";
  document.getElementById("review-table").innerHTML = "";
  document.getElementById("review-status").innerHTML = "";
  document.getElementById("btn-submit").style.display = "none";
  document.getElementById("pain-display").textContent = "0 — None";
  document.getElementById("pain-display").style.color = "#27ae60";
  document.getElementById("pw-strength").textContent = "";
  document.querySelectorAll(".err").forEach(function(e){ e.textContent = "\u00a0"; });
}

// runs on page load
window.onload = function() {
  var dob   = document.getElementById("dob");
  var today = new Date();
  dob.setAttribute("max", today.toISOString().split("T")[0]);
  var min = new Date();
  min.setFullYear(min.getFullYear() - 120);
  dob.setAttribute("min", min.toISOString().split("T")[0]);
  updateSlider();
  document.getElementById("btn-submit").style.display = "none";
};

// END OF FILE: script.js
