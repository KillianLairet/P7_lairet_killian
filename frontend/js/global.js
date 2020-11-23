document.getElementById('btn-profile').addEventListener('click', function(e) {
    const userId = sessionStorage.getItem('userId')
    window.location = 'profile.html?userId=' + userId
})

document.getElementById('btn-log-out').addEventListener('click', function(e) {
    sessionStorage.clear()
    window.location = 'connection.html'
})
