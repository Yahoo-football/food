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

const login = document.getElementById("login");
const aTag = login.querySelector('a')
const userName = document.getElementById('username')
const userPassword = document.getElementById('userpassword')
const dashboard = document.getElementById('Dashboard')
const strategy = document.getElementById('strategy')
console.log(dashboard)

const admin = [{'name':'sreyroth','password':'12345678'}];
console.log(admin[0]['name']);

login.addEventListener('click', () => {
  const user = localStorage.getItem("user");
  if(userPassword.value === admin[0]['password'] && userName.value === admin[0]['name']){
    console.log(userPassword.value)
    dashboard.style.display='none';
    strategy.style.display = 'none';
    aTag.href = 'navbar.html';
  }else{
    for (let data of JSON.parse(user)) {
      if (userPassword.value === data.password && userName.value === data.name || userName.value === data.email) {
        aTag.href = 'navbar.html';
      }
    }
  }
})

btn.addEventListener("click", (e) => {
  e.preventDefault();

  let user = [];
  localStorage.setItem('user', JSON.stringify(user));
  if (count >= 8) {
    const user = localStorage.getItem("user");
    let userAppend = JSON.parse(user);
    userAppend.forEach((u) => {
      console.log(u.name);
      console.log(u.email);
      console.log(u.password);
    });
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value,
    };

    console.log(newUser);
    userAppend.push(newUser);

    localStorage.setItem("user", JSON.stringify(userAppend));

    name.value = "";
    email.value = "";
    password.value = "";
    count = 0;
    text.style.color = 'white'
    container.classList.remove("right-panel-active");
  }
});

password.addEventListener('input', () => {
  if (event.data === null) {
    count -= 1
  }
  else {
    count += 1
  }
  if (count <= 7 && count >= 0) {
    text.style.color = 'red';
  }
  else {
    text.style.color = 'green';
  }
})





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
