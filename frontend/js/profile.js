const token = 'Bearer ' + sessionStorage.getItem('token')

//Display user information
const params = new URLSearchParams(document.location.search)
if(params.has('userId')) {
    const paramValue = params.get('userId')
    const getUserData = async() => {
        const response = await fetch('http://localhost:3000/user/profile/' + paramValue, {
            headers: {
                'Authorization': token
            }
        })
        const user = await response.json()
        if(response.status == 200) {
            if(user[0].profilePhoto == null) {
                user[0].profilePhoto = './img/defaultPP.png'
            }
            displayUser(user[0])
        } else {
            alert('Erreur ' + response.status + '. Veuillez réessayer')
        }
    }
    getUserData();
} else {
    alert('Utilisateur introuvable. Vous allez être redirigé')
            window.location = 'wall.html'
}

/**
 * displayUser() allows to build a user page with the information of an object user
 * @param {Object} userObj user object with 3 keys : userName, email, profilePhoto
 */
function displayUser(userObj) {
    let target = document.getElementById('userTarget');
    target.innerHTML +=
    `<div class="user">
        <div class="user__header">
            <figure class="user__header__figure">
                <img class="user__header__figure__img" src="${userObj.profilePhoto}" alt="Photo de profil ">
                <button class="user__header__figure__btn" id="btn_updateUser">Modifier</button>
                <button class="user__header__figure__btn user__header__figure__btn--delete" id="btn_deleteUser">Supprimer</button>
            </figure>
            <p class="user__header__name">${userObj.userName}</p>
        </div>
        <div class="user__infos">
            <h2 class="user__infos__title">Infos</h2>
            <div class="user__infos__content">
                <p class="user__infos__content__key">Adresse e-mail</p>
                <p class="user__infos_content__value">${userObj.email}</p>
            </div>
        </div>
    </div>`

    document.getElementById('btn_updateUser').addEventListener('click', function(e) {
        e.preventDefault();

        //Display the form to modify user information
        let formUserTarget = document.getElementById('formUserTarget')
        formUserTarget.innerHTML +=
        `<div class="update-user">
            <form id="modifyUserForm">
                <input type="text" id="userName" name="userName" placeholder="Votre nouveau nom">
                <input type="file" id="profilePicture" name="profilePicture" accept="image/png, image/jpeg, image/jpg">
                <div>
                    <input type="submit" value="Modifier">
                    <button id="update-user-form-cancelled-btn">Annuler</button>
                </div>
            </form>
        </div>`
        
        //Update user from database
        document.getElementById('modifyUserForm').addEventListener('submit', async(e) => {
            e.preventDefault()
            let profilePhoto = document.getElementById('profilePicture').files[0]
            let userObj = JSON.stringify({
                userName: document.getElementById('userName').value
            })
            const fd = new FormData()
            fd.append('image', profilePhoto)
            fd.append('user', userObj)

            const response = await fetch('http://localhost:3000/user/profile/' + sessionStorage.getItem('userId'), {
                method: 'PUT',
                headers: {
                    'Authorization': token
                },
                body: fd
            })
            if(response.status == 200) {
                window.location.reload()
            } else {
                alert('Erreur ' + response.status + '. Veuillez réessayer')
            }
        })

        //Cancel form update user
        document.getElementById('update-user-form-cancelled-btn').addEventListener('click', function() {
            window.location.reload()
        })
    })

    //Delete user from database
    document.getElementById('btn_deleteUser').addEventListener('click', async(e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:3000/user/profile/' + sessionStorage.getItem('userId'), {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        })
        if(response.status == 200) {
            sessionStorage.clear()
            window.location = 'connection.html'
        } else {
            alert('Erreur ' + response.status + '. Veuillez réessayer')
        }
    })
}
