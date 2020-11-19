let xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:3000/post/');
xhr.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));
xhr.onreadystatechange = function (){
    if(this.readyState == 4 && this.status == 200) {
        let posts = JSON.parse(this.response);
        console.log(posts);
        for (let i = posts.length; i > 0; i--) {
            displayPosts(posts[i-1]);
        }
    } else if(this.readyState == 4) {
        alert('Erreur serveur');
    }
}
xhr.send();

function displayPosts(post) {
    let target = document.getElementById('posts');
    target.innerHTML +=
    `<div class="post">
        <div class="post__header">
            <a href="profile.html?userId=${post.userId}">${post.userName}</a>
            <a onclick="deletePost(${post.id})">...</a>
        </div>
        <div class="post__content">
            <p>${post.postContent}</p>
            <img class="post__content__img" src="${post.postMedia}">
        </div>
    </div>`
}
function deletePost(postId) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", 'http://localhost:3000/post/' + postId);
    xhr.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            window.location.reload();
            alert('Publication supprimé.');
        } else if(this.readyState == 4) {
            alert('Erreur serveur.')
        };
    };
    xhr.send();
}

document.getElementById('new-post').innerHTML +=
`<form id="newPostForm">
    <textarea id="postContent" name="postContent" placeholder="Que voulez-vous dire ?"></textarea>
    <div class="inputs">
        <input id="postMedia" name="postMedia" type="file" accept="image/png, image/jpeg, image/jpg, image/gif">
        <input id="submit-new-post" type="submit" class="submit" value="Publier">
    </div>
</form>`;
document.getElementById('newPostForm').addEventListener("submit", function(e) {
    e.preventDefault();
    let postMedia = document.getElementById('postMedia').files[0];
    let postObj = {
        userId: sessionStorage.getItem('userId'),
        postContent: document.getElementById('postContent').value
    };
    let data = new FormData();
    data.append('image', postMedia);
    data.append('post', JSON.stringify(postObj));

    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:3000/post', true);
    xhr.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 201) {
            window.location.reload();
            alert('Nouvelle publication.');
        } else if(this.readyState == 4) {
            alert('Erreur serveur.')
        };
    }
    xhr.send(data);
});