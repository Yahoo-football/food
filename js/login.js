const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

const closeEyeR = document.getElementById("closeR");
const openEyeR = document.getElementById("openR");
const closeEyeL = document.getElementById("closeL");
const openEyeL = document.getElementById("openL");
const showPassword = document.getElementsByClassName("password");

const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn");
const text = document.querySelector('#text')
let count = 0;

const userName = document.getElementById('username')
const userPassword = document.getElementById('userpassword')
const dashboard = document.getElementById('Dashboard')
const strategy = document.getElementById('strategy')

const loginBtn = document.getElementById("login");

const admin = [{ 'name': 'sreyroth', 'password': '12345678' }];

document.addEventListener('DOMContentLoaded', () => {
  const role = localStorage.getItem('role');
  const dashboard = document.getElementById('Dashboard');
  const strategy = document.getElementById('strategy');

  // Hide dashboard & strategy for normal users
  if (role === 'user') {
    if (dashboard) dashboard.style.display = 'none';
    if (strategy) strategy.style.display = 'none';
  } else if (role === 'admin') {
    // Admin: show everything
    if (dashboard) dashboard.style.display = 'block';
    if (strategy) strategy.style.display = 'block';
  } else {
    // If not logged in, redirect to login page
    window.location.href = 'index.html';
  }
});


loginBtn.addEventListener('click', () => {
  const user = localStorage.getItem("user");

  // --- Admin Login ---
  if (userPassword.value === admin[0]['password'] && userName.value === admin[0]['name']) {
    localStorage.setItem("role", "admin"); 
    window.location.href = 'home.html'; 
  } 
  
  // --- Normal User Login ---
  else if (user) {
    for (let data of JSON.parse(user)) {
      if (
        (userPassword.value === data.password && userName.value === data.name) ||
        (userPassword.value === data.password && userName.value === data.email)
      ) {
        localStorage.setItem("role", "user"); // 
        window.location.href = 'home.html';
        return;
      }
    }
    alert("Invalid username or password!");
  } 
  else {
    alert("No users found. Please register first!");
  }
});



btn.addEventListener("click", (e) => {
  e.preventDefault();

  // Get current users from localStorage (if any)
  let users = JSON.parse(localStorage.getItem('user')) || [];

  // Check password length directly
  if (password.value.length >= 8) {
    const newUser = {
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
    };

    // Add new user
    users.push(newUser);

    // Save back to localStorage
    localStorage.setItem("user", JSON.stringify(users));

    // Clear inputs
    name.value = "";
    email.value = "";
    password.value = "";
    text.style.color = 'white';
    text.textContent = '';
    container.classList.remove("right-panel-active");

    alert("User registered successfully!");
  } else {
    text.style.color = 'red';
    text.textContent = 'Password must be at least 8 characters!';
    alert("Password must be at least 8 characters!");
  }
});

// ✅ Proper password length feedback
password.addEventListener('input', () => {
  const length = password.value.length;

  if (length < 8) {
    text.style.color = 'red';
    text.textContent = 'Password must be at least 8 characters!';
  } else {
    text.style.color = 'green';
    text.textContent = 'Password is strong enough.';
  }
});






openEyeR.addEventListener("click", () => {
  openEyeR.style.display = "none";
  closeEyeR.style.display = "block";
  for (let show of showPassword) {
    show.type = 'text';
  }
});
closeEyeR.addEventListener("click", () => {
  closeEyeR.style.display = "none";
  openEyeR.style.display = "block";
  for (let show of showPassword) {
    show.type = 'password';
  }
});
openEyeL.addEventListener("click", () => {
  openEyeL.style.display = "none";
  closeEyeL.style.display = "block";
  for (let show of showPassword) {
    show.type = 'text';
  }
});
closeEyeL.addEventListener("click", () => {
  closeEyeL.style.display = "none";
  openEyeL.style.display = "block";
  for (let show of showPassword) {
    show.type = 'password';
  }
});

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});
