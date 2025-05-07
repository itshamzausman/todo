const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const showLoginForm = document.getElementById("showLogin");
const showSignupForm = document.getElementById("showSignup");

const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");

// Show/hide login/signup
showLoginForm.addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  loginForm.classList.remove("fade-in");
  void loginForm.offsetWidth;
  loginForm.classList.add("fade-in");
});

showSignupForm.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  signupForm.classList.remove("fade-in");
  void signupForm.offsetWidth;
  signupForm.classList.add("fade-in");
});

// Signup handler
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const newUser = document.getElementById("newUsername").value.trim();
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  let credentials = JSON.parse(localStorage.getItem("credentials")) || [];

  if (newPassword !== confirmPassword) {
    alert("❗ Passwords do not match!");
    return;
  }

  const exists = credentials.some(
    (user) => user.username === newUser || user.email === email
  );

  if (exists) {
    alert("⚠️ Username or Email already exists.");
    return;
  }

  credentials.push({ username: newUser, email, password: newPassword });
  localStorage.setItem("credentials", JSON.stringify(credentials));

  signupForm.reset();
  alert("✅ Signup successful! You can now log in.");
  signupForm.style.display = "none";
  loginForm.style.display = "block";
});

// Login handler
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const identifier = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const credentials = JSON.parse(localStorage.getItem("credentials")) || [];

  const matchedUser = credentials.find(
    (user) =>
      (user.username === identifier || user.email === identifier) &&
      user.password === password
  );

  if (!matchedUser) {
    alert("❌ Invalid credentials. Please try again or sign up.");
    return;
  }

  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("loggedInUser", matchedUser.username);
  window.location.href = "Home.html";
});