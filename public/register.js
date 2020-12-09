const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

// document
//   .getElementById('register-form')
//   .addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email = e.target.email.value;
//     const password = e.target.password.value;
//     const name = e.target.userName.value;
//     const nickName = e.target.nickName.value;
//     const phone = e.target.phoneNum.value;
//     const dateOfBirth = e.target.dateOfBirth.value;

//     if (!name) {
//       return alert('이름을 입력하세요');
//     }

//     try {
//       await axios.post('/auth/register', {
//         email,
//         password,
//         name,
//         nickName,
//         phone,
//         dateOfBirth,
//       });
//     } catch (err) {
//       console.error(err);
//     }
//     e.target.email.value = '';
//     e.target.password.value = '';
//     e.target.userName.value = '';
//     e.target.nickName.value = '';
//     e.target.phoneNum.value = '';
//     e.target.dateOfBirth.value = '';
//   });

// document.getElementById('login-form').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const email = e.target.email.value;
//   const password = e.target.password.value;

//   try {
//     await axios.post('/auth/login', {
//       email,
//       password,
//     });
//   } catch (err) {
//     console.error(err);
//   }
//   e.target.email.value = '';
//   e.target.password.value = '';
// });
