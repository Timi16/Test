document.addEventListener("DOMContentLoaded", () => {
    const userList = document.getElementById('user-list');
    const usernameElement = document.getElementById('username');
  
    // Fetch user data from the API
    fetch('https://test-c0vw.onrender.com/api/users')
      .then(response => response.json())
      .then(data => {
        data.forEach(user => {
          const li = document.createElement('li');
          li.textContent = `Username: ${user.username}, ID: ${user.telegramId}`;
          userList.appendChild(li);
        });
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
      });
  
    // Get the username from URL query parameters and display it
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    if (username) {
      usernameElement.textContent = username;
    } else {
      usernameElement.textContent = 'Guest';
    }
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (username) {
        fetchUserStats(username);
    }
});

async function fetchUserStats(username) {
    try {
        const response = await fetch(`https://test-c0vw.onrender.com/api/users/${username}`);
        const user = await response.json();
        
        if (user) {
            document.getElementById('userStats').classList.remove('hidden');
            document.getElementById('points').textContent = user.points;
            document.getElementById('referralCount').textContent = user.referrals.length;
        }
    } catch (error) {
        console.error('Error fetching user stats:', error);
    }
}