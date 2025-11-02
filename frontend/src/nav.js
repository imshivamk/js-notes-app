const navbarLinks = document.getElementById('navbarLinks');

// Function to check login status (this example uses a dummy API call)
async function checkLoginStatus() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/check-auth', {
      credentials: 'include' // include cookies/session info
    });

    const data = await response.json();
    return response.ok && data.success; // Assume backend sends { loggedIn: true } when logged in
  } catch {
    return false;
  }
}

// Render navbar based on login status
async function renderNavbar() {
  const loggedIn = await checkLoginStatus();

  navbarLinks.innerHTML = ''; // Clear existing content

  if (loggedIn) {
    // Show Logout button
    const homeLink = document.createElement('a');
    homeLink.href = 'home.html';
    homeLink.textContent = 'Home';
    navbarLinks.appendChild(homeLink);
    
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.onclick = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/v1/auth/logout', {
          method: 'POST',
          credentials: 'include'
        });

        const data = await res.json();
        if (res.ok && data.success) {
          alert('Logged out successfully!');
          renderNavbar(); // Re-render navbar after logout
          window.location.reload();

        } else {
          alert(data.message || 'Logout failed.');
        }
      } catch (error) {
        alert('Error logging out: ' + error.message);
      }
    };
    
    navbarLinks.appendChild(logoutBtn);
  } else {
    // Show Login link
    
    const loginLink = document.createElement('a');
    loginLink.href = 'signin.html';
    loginLink.textContent = 'Login';
    navbarLinks.appendChild(loginLink);
    
  }
}

// Initial call to setup navbar
renderNavbar();
