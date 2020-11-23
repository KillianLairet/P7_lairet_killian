//Create new user
document.getElementById('signup-form').addEventListener('submit', async(e) => {
    e.preventDefault()
    let data = JSON.stringify({
        userName: this.inp_signup_userName.value,
        email: this.inp_signup_email.value,
        password: this.inp_signup_password.value
    })
    const response = await fetch('http://localhost:3000/user/signup/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
    if(response.status == 201) {
        alert('Utilisateur créé. Vous pouvez vous connecter.')
        window.location.reload()
    } else {
        alert('Erreur ' + response.status + '. Veuillez réessayer')
    }
})

//Log in the application
document.getElementById('signin-form').addEventListener('submit', async(e) => {
    e.preventDefault()
    let data = JSON.stringify({
        email: this.inp_signin_email.value,
        password: this.inp_signin_password.value
    })
    const response = await fetch('http://localhost:3000/user/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
    let apiData = await response.json()
    if(response.status == 200) {
        sessionStorage.setItem('token', apiData.token)
        sessionStorage.setItem('userId', apiData.userId)
        window.location = 'wall.html'
    } else {
        alert('Erreur ' + response.status + '. Veuillez réessayer')
    }
})
