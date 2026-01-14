const input = document.getElementById("pw-input");
const bar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");
const entropyLabel = document.getElementById("entropy-bits");
const breachDiv = document.getElementById("breach-status");
const toggleBtn = document.getElementById("toggle-view");
const genBtn = document.getElementById("gen-pw");
const copyBtn = document.getElementById("copy-btn");

let debounceTimer;

// --- SHOW/HIDE ICON ---
toggleBtn.addEventListener("click", () => {
  const isPass = input.type === "password";
  input.type = isPass ? "text" : "password";

  toggleBtn.innerHTML = isPass
    ? '<i class="fa-regular fa-eye-slash"></i>'
    : '<i class="fa-regular fa-eye"></i>';
  toggleBtn.title = isPass ? "Hide password" : "Show password";
  toggleBtn.setAttribute(
    "aria-label",
    isPass ? "Hide password" : "Show password"
  );
});

// --- COPY TO CLIPBOARD ---
copyBtn.addEventListener("click", () => {
  if (!input.value) return;
  navigator.clipboard.writeText(input.value);
  const icon = copyBtn.querySelector("i");
  icon.className = "fa-solid fa-check text-green-500";
  setTimeout(
    () => (icon.className = "fa-regular fa-copy text-slate-400"),
    2000
  );
});

// --- GENERATOR ---
genBtn.addEventListener("click", () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let newPw = "";
  const array = new Uint32Array(16);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < 16; i++) {
    newPw += chars[array[i] % chars.length];
  }
  input.value = newPw;
  input.dispatchEvent(new Event("input"));
});

// --- LOGIC ---
input.addEventListener("input", () => {
  const val = input.value;
  updateUI(val);

  clearTimeout(debounceTimer);
  if (val.length > 3) {
    breachDiv.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Scanning leaks...';
    debounceTimer = setTimeout(() => checkBreach(val), 800);
  } else {
    breachDiv.innerHTML =
      '<i class="fa-solid fa-shield-halved mr-2"></i> Database check: Idle';
    breachDiv.className =
      "mt-6 p-4 rounded-xl border-l-4 border-slate-200 bg-slate-50 text-sm text-slate-600";
  }
});

function updateUI(pw) {
  if (!pw) {
    bar.style.width = "0%";
    strengthText.innerText = "Enter Password";
    strengthText.className =
      "text-sm font-bold text-slate-400 uppercase tracking-wider";
    entropyLabel.innerText = "0 bits";
    return;
  }

  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const width = (score / 5) * 100;
  bar.style.width = width + "%";

  if (score <= 2) {
    bar.className = "h-full transition-all duration-500 bg-red-500";
    strengthText.innerText = "Weak";
    strengthText.className =
      "text-sm font-bold text-red-500 uppercase tracking-wider";
  } else if (score <= 3) {
    bar.className = "h-full transition-all duration-500 bg-amber-400";
    strengthText.innerText = "Moderate";
    strengthText.className =
      "text-sm font-bold text-amber-500 uppercase tracking-wider";
  } else {
    bar.className = "h-full transition-all duration-500 bg-emerald-500";
    strengthText.innerText = "Strong";
    strengthText.className =
      "text-sm font-bold text-emerald-500 uppercase tracking-wider";
  }

  const poolSize =
    (/[a-z]/.test(pw) ? 26 : 0) +
    (/[A-Z]/.test(pw) ? 26 : 0) +
    (/[0-9]/.test(pw) ? 10 : 0) +
    (/[^A-Za-z0-9]/.test(pw) ? 32 : 0);
  const entropy = Math.round(Math.log2(poolSize || 1) * pw.length);
  entropyLabel.innerText = `${entropy} bits`;
}

async function checkBreach(password) {
  try {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await res.text();
    const found = text
      .split("\n")
      .find((line) => line.split(":")[0] === suffix);

    if (found) {
      const count = parseInt(found.split(":")[1]);
      breachDiv.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-2"></i> Leaked ${count.toLocaleString()} times!`;
      breachDiv.className =
        "mt-6 p-4 rounded-xl border-l-4 border-red-500 bg-red-50 text-sm text-red-700 font-semibold";
    } else {
      breachDiv.innerHTML = `<i class="fa-solid fa-circle-check mr-2"></i> No leaks detected.`;
      breachDiv.className =
        "mt-6 p-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 text-sm text-emerald-700 font-semibold";
    }
  } catch (e) {
    breachDiv.innerText = "Check unavailable (Offline)";
  }
}
