let paramKey = 'userId';
let params = new URLSearchParams(document.location.search);
if(params.has(paramKey)) {
    let paramValue = params.get(paramKey);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            let data = JSON.parse(xhr.response)[0];
            if(data.profilePhoto == null) {
                data.profilePhoto = './img/defaultPP.png';
            }
            displayUser(data);
        } else if(xhr.readyState == 4) {
            alert('Erreur serveur.');
            document.location.href = 'wall.html'
        };
    };
    xhr.open('GET', 'http://localhost:3000/user/profile/' + paramValue)
    xhr.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));
    xhr.send();

} else {
    alert('Utilisateur introuvable. Vous allez être redirigé.')
    document.location.href = 'wall.html';
};

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

        let formUserTarget = document.getElementById('formUserTarget')
        formUserTarget.innerHTML +=
        `<div class="update-user">
            <form>
                <input type="text" id="userName" name="userName" placeholder="Votre nouveau nom">
                <input type="file" id="profilePicture" name="profilePicture" accept="image/png, image/jpeg, image/jpg">
                <div>
                    <input id="update-user-form-submit-btn" type="submit" value="Modifier">
                    <button id="update-user-form-cancelled-btn">Annuler</button>
                </div>
            </form>
        </div>`

        document.getElementById('update-user-form-cancelled-btn').addEventListener('click', function(e) {
            e.preventDefault();
            document.location.reload();
        });

        document.getElementById('update-user-form-submit-btn').addEventListener('submit', function(e) {
            e.preventDefault();

            let profilePhoto = document.querySelector('input[type=file]').files[0];
            let userObj = {
                userName: document.getElementById('userName').nodeValue
            };
            let fd = new FormData();
            fd.append(image, profilePhoto);
            fd.append(user, JSON.stringify(userObj));

            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    window.location.reload();
                    alert('Informations modifiées.');
                } else if(this.readyState == 4) {
                    alert('Erreur serveur.');
                    document.location.reload();
                };
            };
            xhr.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));
            xhr.open('POST', 'http://localhost:3000/profile/' + paramValue);
            xhr.send(fd);
        });
    });

    document.getElementById('btn_deleteUser').addEventListener("click", function(e) {
        e.preventDefault();

        let paramKey = 'userId';
        let params = new URLSearchParams(document.location.search);
        let paramValue = params.get(paramKey);
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", 'http://localhost:3000/user/profile/' + paramValue)
        xhr.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                alert('Utilisateur supprimé.');
                sessionStorage.clear();
                window.location = 'connection.html';
            } else if(this.readyState == 4) {
                alert('Erreur serveur.');
            };
        };
        xhr.send();
    });
};
