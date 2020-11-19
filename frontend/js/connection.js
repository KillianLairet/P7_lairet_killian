let signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
        userName: document.getElementById('inp_signup_userName').value,
        email: document.getElementById('inp_signup_email').value,
        password: document.getElementById('inp_signup_password').value
    };
    console.log(JSON.stringify(data));

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/user/signup');
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 201) {
            window.location = 'connection.html';
            alert('Bienvenu sur Groupomania, vous êtes correctement inscrit.');
        } else if(this.readyState == 4) {
            alert('Erreur serveur.');
        };
    };
    xhr.send(JSON.stringify(data));
});

let signinForm = document.getElementById('signin-form');
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
        email: document.getElementById('inp_signin_email').value,
        password: document.getElementById('inp_signin_password').value
    };
    console.log(JSON.stringify(data));

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/user/login');
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            sessionStorage.setItem('token', JSON.parse(this.response).token);
            sessionStorage.setItem('userId', JSON.parse(this.response).userId);
            window.location = 'wall.html';
        } else if(this.readyState == 4) {
            alert('Erreur. Veuillez réessayer plus tard.')
        };
    };
    xhr.send(JSON.stringify(data));
});
