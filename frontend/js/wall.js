const token = 'Bearer ' + sessionStorage.getItem('token')

//Create new post
document.getElementById('newPostForm').addEventListener('submit', async(e) => {
    e.preventDefault()
    let postMedia = document.getElementById('postMedia').files[0]
    let postObj = JSON.stringify({
        userId: sessionStorage.getItem('userId'),
        postContent: this.postContent.value
    })

    const fd = new FormData()
    fd.append('image', postMedia)
    fd.append('post', postObj)

    const response = await fetch('http://localhost:3000/post/', {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: fd
    }, true)
    if(response.status == 201) {
        window.location.reload();
    } else {
        alert('Erreur ' + response.status + '. Veuillez réessayer')
    }
})

//Get post data
const getPostData = async() => {
    const response = await fetch('http://localhost:3000/post', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : token
        }
    })
    const posts = await response.json()
    if(response.status == 200) {
        for (let i = posts.length; i > 0; i--) {
            displayPosts(posts[i-1]);
        }
    } else {
        alert('Erreur ' + response.status + '. Veuillez réessayer')
    }
}
getPostData();

/**
 * displayPosts() allows you to build a post. It will be used in a for loop
 * @param {number} post index of a post in an array of posts
 */
function displayPosts(post) {
    let target = document.getElementById('posts');
    target.innerHTML +=
    `<div class="post">
        <div class="post__header">
            <a href="profile.html?userId=${post.userId}">${post.userName}</a>
            <a onclick="deletePost(${post.id})"><img src="./img/trash.png" alt="Supprimer la publication" width="20px"></a>
        </div>
        <div class="post__content">
            <p>${post.postContent}</p>
            <img class="post__content__img" src="${post.postMedia}">
        </div>
    </div>`
}

/**
 * deletePost() allows you to delete from the server a post with a specific ID
 * @param {number} postId id of a post
 */
async function deletePost(postId) {
    const response = await fetch('http://localhost:3000/post/' + postId, {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
    })
    if(response.status == 200) {
        window.location.reload()
    } else {
        alert('Erreur ' + response.status + '. Veuillez réessayer')
    }
}
