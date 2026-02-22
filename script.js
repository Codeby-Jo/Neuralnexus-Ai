// ===== NeuralNexus 2026 Script (split from original HTML) =====

// ─── Validators ───────────────────────────────────────────────
const validators = {
  firstName: (v) => v.trim().length >= 2,
  lastName: (v) => v.trim().length >= 2,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  phone: (v) => /^[\+\d\s\-\(\)]{10,}$/.test(v.trim()),
  company: (v) => v.trim().length >= 2,
  role: (v) => v !== "",
  experience: (v) => v !== "",
  bio: (v) => v.trim().length >= 20,
};

const fields = Object.keys(validators);

// ─── Show/hide error ─────────────────────────────────────────
function setFieldState(id, isValid) {
  const input = document.getElementById(id);
  const err = document.getElementById(id + "Err");
  if (!input) return;

  if (isValid) {
    input.classList.remove("error");
    input.classList.add("valid");
    if (err) err.classList.remove("show");
  } else {
    input.classList.add("error");
    input.classList.remove("valid");
    if (err) err.classList.add("show");
  }
}

// ─── Validate tracks ─────────────────────────────────────────
function validateTracks() {
  const checked =
    document.querySelectorAll('input[name="track"]:checked').length > 0;
  const err = document.getElementById("tracksErr");
  if (!checked) err.classList.add("show");
  else err.classList.remove("show");
  return checked;
}

// ─── Progress bar ─────────────────────────────────────────────
function updateProgress() {
  let count = 0;

  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (el && validators[id](el.value)) count++;
  });

  const tracksOk =
    document.querySelectorAll('input[name="track"]:checked').length > 0;
  if (tracksOk) count++;

  const total = fields.length + 1;
  document.getElementById("progressBar").style.width =
    Math.round((count / total) * 100) + "%";
}

// ─── Live validation ──────────────────────────────────────────
fields.forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener("blur", () => {
    setFieldState(id, validators[id](el.value));
    updateProgress();
  });

  el.addEventListener("input", () => {
    if (el.classList.contains("error")) {
      setFieldState(id, validators[id](el.value));
    }
    updateProgress();
  });
});

document.querySelectorAll('input[name="track"]').forEach((cb) => {
  cb.addEventListener("change", () => {
    validateTracks();
    updateProgress();
  });
});

// ─── Form submit ──────────────────────────────────────────────
document.getElementById("regForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let allValid = true;

  fields.forEach((id) => {
    const el = document.getElementById(id);
    const valid = el && validators[id](el.value);
    setFieldState(id, valid);
    if (!valid) allValid = false;
  });

  const tracksOk = validateTracks();
  if (!tracksOk) allValid = false;

  if (!allValid) {
    // Scroll to first error
    const firstErr = document.querySelector(".error");
    if (firstErr)
      firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // SUCCESS
  const ticketNum =
    "NN26-" + Math.random().toString(36).substr(2, 8).toUpperCase();

  document.getElementById("ticketId").textContent = "🎟  " + ticketNum;
  document.getElementById("regForm").style.display = "none";

  const sp = document.getElementById("successPanel");
  sp.classList.add("show");

  document.getElementById("progressBar").style.width = "100%";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Init progress on load
updateProgress();
