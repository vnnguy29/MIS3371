/*
  Program name: script.js
  Author: Viet Nguyen
  Date created: 02/26/2026
  Date last edited: 03/27/2026
  Version: 2.0
  Description: External JavaScript for Peak Point Medical patient registration form.
*/

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

function lowercaseUserID() {
  var field = document.getElementById("userid");
  var pos   = field.selectionStart;
  field.value = field.value.toLowerCase();
  field.setSelectionRange(pos, pos);
}

function checkPasswordStrength() {
  var pw  = document.getElementById("password").value;
  var msg = document.getElementById("pw-strength");
  var err = document.getElementById("err-password");
  err.textContent = "";
  if (pw.length ===
