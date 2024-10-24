document.addEventListener("DOMContentLoaded", () => {
    const userList = document.getElementById('user-list');
    const usernameElement = document.getElementById('username');
  
    // Fetch user data from the API
    fetch('127.0.0.1:3000/api/users')
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
  
