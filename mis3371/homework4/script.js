/*
  Program name: script.js
  Author: Viet Nguyen
  Date created: 04/01/2026
  Date last edited: 05/08/2026
  Version: 4.1
  Description: External javascript for Peak Point Medical HW4.
               New things added: Fetch API loads state dropdown from
               states.html, cookies remembering returning users, and local
               storage saves and restores all non-secure form fields.
               All HW3 on the fly validation is still included.
               Fixed phone validation to accept any 10 digit format.
*/

// ── FETCH API ────────────────────────────────────────────────
// loads state dropdown options from the external states.html file
function loadStates() {
  fetch("states.html")
    .then(function(response) {
      if (!response.ok) throw new Error("Could not load states.html");
      return response.text();
    })
    .then(function(html) {
      document.getElementById("state").innerHTML = html;
      var saved = localStorage.getItem("ppm_state");
      if (saved) document.getElementById("state").value = saved;
    })
    .catch(function(err) {
      console.error("Fetch failed, using hardcoded states:", err);
      document.getElementById("state").innerHTML =
        '<option value="">-- Select --</option>' +
        '<option>AL</option><option>AK</option><option>AZ</option><option>AR</option>' +
        '<option>CA</option><option>CO</option><option>CT</option><option>DE</option>' +
        '<option>DC</option><option>FL</option><option>GA</option><option>HI</option>' +
        '<option>ID</option><option>IL</option><option>IN</option><option>IA</option>' +
        '<option>KS</option><option>KY</option><option>LA</option><option>ME</option>' +
        '<option>MD</option><option>MA</option><option>MI</option><option>MN</option>' +
        '<option>MS</option><option>MO</option><option>MT</option><option>NE</option>' +
        '<option>NV</option><option>NH</option><option>NJ</option><option>NM</option>' +
        '<option>NY</option><option>NC</option><option>ND</option><option>OH</option>' +
        '<option>OK</option><option>OR</option><option>PA</option><option>PR</option>' +
        '<option>RI</option><option>SC</option><option>SD</option><option>TN</option>' +
        '<option>TX</option><option>UT</option><option>VT</option>' +
        '<option>VA</option><option>WA</option><option>WV</option><option>WI</option>' +
        '<option>WY</option>';
    });
}

// ── COOKIE FUNCTIONS ─────────────────────────────────────────

function setCookie(name, value, hours) {
  var expires = "";
  if (hours) {
    var date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

// checks for cookie and shows welcome message in banner
function checkCookie() {
  var firstName = getCookie("ppm_firstname");
  var welcomeEl = document.getElementById("welcome-msg");
  if (firstName) {
    welcomeEl.innerHTML =
      'Welcome back, <strong>' + firstName + '</strong>! &nbsp;' +
      '<label style="font-size:0.8rem; font-weight:normal; cursor:pointer;">' +
      '<input type="checkbox" id="not-me" onchange="handleNotMe()" style="margin-right:4px;">' +
      'Not ' + firstName + '? Click here to start as a new user.' +
      '</label>';
    welcomeEl.style.color = "#a8e6cf";
    loadFromStorage();
  } else {
    welcomeEl.textContent = "Welcome, New User!";
    welcomeEl.style.color = "#ffd3b6";
  }
}

// handles not me checkbox
function handleNotMe() {
  var checked = document.getElementById("not-me").checked;
  if (checked) {
    deleteCookie("ppm_firstname");
    clearLocalStorage();
    clearAll();
    document.getElementById("welcome-msg").textContent = "Welcome, New User!";
    document.getElementById("welcome-msg").style.color = "#ffd3b6";
  }
}

// handles remember me checkbox
function handleRememberMe() {
  var rememberMe = document.getElementById("remember-me").checked;
  if (!rememberMe) {
    deleteCookie("ppm_firstname");
    clearLocalStorage();
  } else {
    var fname = document.getElementById("fname").value.trim();
    if (fname) setCookie("ppm_firstname", fname, 48);
  }
}

// ── LOCAL STORAGE FUNCTIONS ───────────────────────────────────

function saveToStorage(fieldId) {
  var rememberMe = document.getElementById("remember-me").checked;
  if (!rememberMe) return;
  if (fieldId === "ssn" || fieldId === "password" || fieldId === "password2") return;
  var el = document.getElementById(fieldId);
  if (!el) return;
  localStorage.setItem("ppm_" + fieldId, el.value);
  if (fieldId === "fname" && el.value.trim()) {
    setCookie("ppm_firstname", el.value.trim(), 48);
  }
}

function saveCheckboxes() {
  var rememberMe = document.getElementById("remember-me").checked;
  if (!rememberMe) return;
  var checked = Array.from(document.querySelectorAll('input[name="illness"]:checked'))
                     .map(function(c){ return c.value; });
  localStorage.setItem("ppm_illnesses", JSON.stringify(checked));
}

function loadFromStorage() {
  var fields = ["fname","mi","lname","dob","phone","email",
                "addr1","addr2","city","zip","userid","symptoms","pain_scale"];
  fields.forEach(function(id) {
    var saved = localStorage.getItem("ppm_" + id);
    var el    = document.getElementById(id);
    if (saved && el) el.value = saved;
  });

  var savedGender = localStorage.getItem("ppm_gender");
  if (savedGender) {
    document.querySelectorAll('input[name="gender"]').forEach(function(r){
      if (r.value === savedGender) r.checked = true;
    });
  }

  var savedVacc = localStorage.getItem("ppm_vaccinated");
  if (savedVacc) {
    document.querySelectorAll('input[name="vaccinated"]').forEach(function(r){
      if (r.value === savedVacc) r.checked = true;
    });
  }

  var savedIns = localStorage.getItem("ppm_insurance");
  if (savedIns) {
    document.querySelectorAll('input[name="insurance"]').forEach(function(r){
      if (r.value === savedIns) r.checked = true;
    });
  }

  var savedIll = localStorage.getItem("ppm_illnesses");
  if (savedIll) {
    var illArr = JSON.parse(savedIll);
    document.querySelectorAll('input[name="illness"]').forEach(function(cb){
      cb.checked = illArr.indexOf(cb.value) !== -1;
    });
  }

  var savedPain = localStorage.getItem("ppm_pain_scale");
  if (savedPain) {
    document.getElementById("pain_scale").value = savedPain;
    updateSlider();
  }
}

function clearLocalStorage() {
  var keys = ["fname","mi","lname","dob","phone","email",
              "addr1","addr2","city","state","zip","gender",
              "vaccinated","insurance","illnesses","pain_scale",
              "userid","symptoms"];
  keys.forEach(function(k){ localStorage.removeItem("ppm_" + k); });
}

// ── SLIDER ───────────────────────────────────────────────────
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

// ── SSN AUTO FORMAT ──────────────────────────────────────────
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

// ── USER ID LOWERCASE ────────────────────────────────────────
function lowercaseUserID() {
  var field = document.getElementById("userid");
  var pos   = field.selectionStart;
  field.value = field.value.toLowerCase();
  field.setSelectionRange(pos, pos);
}

// ── PASSWORD STRENGTH ────────────────────────────────────────
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
  var clrs   = ["","#c0392b","#c0392b","#e07000","#2980b9","#27ae60"];
  msg.textContent = labels[checks];
  msg.style.color = clrs[checks];
}

// ── CHECK SUBMIT BUTTON ───────────────────────────────────────
function checkSubmitButton() {
  var hasErrors = false;
  document.querySelectorAll(".err").forEach(function(e) {
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

// fixed phone validation - accepts any 10 digit number regardless of formatting
function validatePhone() {
  var val    = document.getElementById("phone").value.trim();
  var err    = document.getElementById("err-phone");
  var digits = val.replace(/\D/g, "");
  if (val && digits.length !== 10) err.textContent = "Must be 10 digits. Example: 214-843-6669";
  else err.textContent = "\u00a0";
  checkSubmitButton();
}

function validateEmail() {
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

// ── VALIDATE ALL ─────────────────────────────────────────────
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

// ── REVIEW PANEL ─────────────────────────────────────────────
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
  var allIll   = ["Chicken Pox","Small Pox","Covid-19","Tetanus","Mumps","Measles"];
  var checkedIll = Array.from(document.querySelectorAll('input[name="illness"]:checked'))
                        .map(function(c){ return c.value; });

  function sc(ok, msg) {
    return ok ? '<td class="rev-pass">&#10003; PASS</td>'
              : '<td class="rev-fail">&#10007; ERROR: ' + msg + '</td>';
  }

  var fullName = fname + (mi ? " " + mi + "." : "") + " " + lname;
  var nameOk   = /^[A-Za-z'\-]{1,30}$/.test(fname) && /^[A-Za-z'\-]{1,30}$/.test(lname);
  var dobOk = false; var dobErr = "Required";
  if (dob) {
    var dd = new Date(dob+"T00:00:00"), t = new Date(); t.setHours(0,0,0,0);
    var mn = new Date(); mn.setFullYear(mn.getFullYear()-120); mn.setHours(0,0,0,0);
    if (dd > t) dobErr = "Cannot be in the future";
    else if (dd < mn) dobErr = "More than 120 years ago";
    else dobOk = true;
  }
  var ssnOk   = /^\d{3}-\d{2}-\d{4}$/.test(ssn);
  var ssnDisp = ssn ? "***-**-" + ssn.replace(/\D/g,"").slice(-4) : "(not entered)";
  // fixed phone check - just count digits
  var phoneDigits = phone.replace(/\D/g,"");
  var phoneOk = !phone || phoneDigits.length === 10;
  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  var addrOk  = addr1.length>=2 && city.length>=2 && state!=="" && /^\d{5}$/.test(zip);
  var addrDisp= (addr1||"(missing)")+(addr2?", "+addr2:"")+"<br>"+(city||"(missing)")+", "+(state||"(missing)")+" "+(zip||"(missing)");
  var pw2Ok   = pw === document.getElementById("password2").value;
  var uidOk   = userid.length>=5 && userid.length<=20 && /^[a-z][a-z0-9_\-]{4,19}$/.test(userid);
  var pwOk    = pw.length>=8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) &&
                /[!@#%^&*()\-_+=\/><.,`~]/.test(pw) && !/["']/.test(pw) && pw.toLowerCase()!==userid.toLowerCase();

  var h = "";
  h += '<tr class="rev-header"><td colspan="3" style="text-align:center;font-weight:bold;padding:10px;">PLEASE REVIEW THIS INFORMATION</td></tr>';
  h += '<tr class="rev-col-hdr"><td><b>Field</b></td><td><b>Value</b></td><td><b>Status</b></td></tr>';
  h += '<tr class="rev-section"><td colspan="3"><b>— Personal Information —</b></td></tr>';
  h += '<tr><td class="rev-lbl">Full Name</td><td>'+(fullName.trim()||"(blank)")+'</td>'+sc(nameOk&&!!fname&&!!lname,"Check name fields")+'</tr>';
  h += '<tr><td class="rev-lbl">Date of Birth</td><td>'+(dob||"(not entered)")+'</td>'+sc(dobOk,dobErr)+'</tr>';
  h += '<tr><td class="rev-lbl">Social Security</td><td>'+ssnDisp+'</td>'+sc(ssnOk,"Format: XXX-XX-XXXX")+'</tr>';
  h += '<tr><td class="rev-lbl">Ge
