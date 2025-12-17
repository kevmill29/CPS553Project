//script.js
//server port
const API_URL = "http://localhost:4500/api";


// This will run when the user submits to add their registration information
document.addEventListener('DOMContentLoaded', () => {
    // --- Get Elements ---
    const regForm = document.getElementById('regForm');
    const loginForm = document.getElementById('loginForm');
    const postForm = document.getElementById('post');
    const createPostForm = document.getElementById('createPostForm');
    const logoutBtn = document.getElementById("logoutBtn");
    const postsContainer = document.getElementById('postsContainer');
    const userPostsList = document.getElementById('user-posts-list');
    
    // --- Attach Listeners ---
    if (regForm) {
        regForm.addEventListener('submit', register);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', login); 
    }
    
    if (postForm) {
        postForm.addEventListener('submit', postThread);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
    
    // Listener for the dedicated post creation form (e.g., on profile/dashboard)
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }

    // --- Load Data Conditionally ---
    const userID = localStorage.getItem('userID');

    if (postsContainer) {
        loadDashboard();
    }
    
    // Load the user's posts when the page loads (e.g., on profile.html)
    if (userPostsList && userID) {
        fetchUserPosts(userID); 
    }
});


//password validation function
function validPassword(pass, confirmPass) {
    if (pass !== confirmPass) {
        alert("Passwords do not match!");
        return false;
    }
    return true;
}

async function register(e) {
    // this will run when the user submits to add their registration information
    e.preventDefault();

    let pass = document.getElementById("passwd").value.trim();
    let confirmPass = document.getElementById("confirmpasswd").value.trim();

    if (validPassword(pass, confirmPass)) {

        const user = {
            username: document.getElementById("username").value.trim(),
            email: document.getElementById("userEmail").value.trim(),
            password: pass,
            uuid: crypto.randomUUID()
        };
        
        try {
            // api call here
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log("Registration successful:", data);
                alert("Registration successful! You can now log in.");
                window.location.href = 'login.html'; 
            } else {
                alert("Registration failed: " + (data.message || "An unknown server error occurred."));
            }
        } catch (err) {
            console.error("Registration error:", err);
            alert("An error occurred during registration. Please try again later.");
        }
    } else {
        // Note: validPassword already calls alert, but this else block maintains structure
        console.error("Passwords did not match.");
    }
}


// script.js


async function login(e) {
    // this will run when the user submits to add their registration information
    e.preventDefault();

    // --- Element Retrieval & Data Preparation ---
    // Harmonized ID: Uses "password" to match your HTML
    const user = {
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim() // <--- CORRECTED LINE
    };

    // Basic check to ensure fields are not empty after trimming
    if (!user.username || !user.password) {
        alert("Please enter both username and password.");
        return;
    }

    try {
        // api call here
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Login successful:", data);
            alert("Login successful!");

            // Note: Ensure your server sends 'id' and 'token' under data.user
            localStorage.setItem("userID", data.user.id);
            localStorage.setItem("userToken", data.token);

            window.location.href = 'dashboard.html';
        } else {
            console.error("Login failed:", data.message);
            alert("Login failed: " + (data.message || "An unknown server error occurred."));
        }
    } catch (err) {
        // Catches network/fetch errors (e.g., server down)
        console.error("Login error (Network/Fetch failure):", err); alert("An error occurred during login. Please try again later.");
    }
} 
        




function logout(e) {
    e.preventDefault();
    // Clear all local storage
    localStorage.clear();
    alert("Logged out successfully.");
    window.location.href = "login.html";
}


async function postThread(e) {
    //this will run when the user submits a post
    e.preventDefault(); 

    //first get user id we saved in local storage
    const userID = localStorage.getItem("userID");

    //validation to ensure user is logged in
    if (!userID) {
        alert("You must be logged in to post a thread!");
        return;
    }
    
    const contentElement = document.getElementById("text");
    if (!contentElement) {
        alert("Error: Post content field is missing.");
        return;
    }

    //backend exports.createPost expects userID and content
    const postData = {
        userID: userID,
        content: contentElement.value
    };

    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Post created successfully:", data);
            alert("Your post has been created!");
        } else {
            const errorData = await response.json();
            alert("Failed to create post: " + errorData.message);
        }
    } catch (err) {
        console.error("Error creating post:", err);
        alert("An error occurred while creating your post. Please try again later.");
    }
}


async function loadDashboard() {
    const userId = localStorage.getItem('userID'); 
    const token = localStorage.getItem('userToken');

    if (!userId || !token) {
        // If no credentials found, boot them back to login
        alert("You must be logged in to view this page.");
        window.location.href = "login.html";
        return;
    }

    fetchPostsAndPopulate(token); 

    // FETCH USER DETAILS
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (response.ok) {
            const user = await response.json();
            
            // Render data to HTML
            document.getElementById("dash-name").innerText = user.name || user.Username || "Anonymous";
            document.getElementById("dash-email").innerText = user.email || user.Email;
            document.getElementById("dash-id").innerText = user.id || user.UserID; 
            
        } else {
            console.error("Failed to fetch profile");
            document.getElementById("profile-info").innerHTML = "<p>Error loading profile data.</p>";
        }

    } catch (error) {
        console.error("Dashboard Error:", error);
    }
}


async function fetchUserPosts(userId) {
  // Current validation is correct, but let's ensure the endpoint is built only if the ID exists.
    if (!userId) {
        console.error("No User ID found for profile.");
        // We will return here, preventing the fetch call.
        return;
    }
    
    try {
        // This is the line that uses the 'userId' parameter, which can be 'undefined' if called incorrectly.
        const response = await fetch(`${API_URL}/user/${userId}/posts`);
        const posts = await response.json();
        
        const listElement = document.getElementById('user-posts-list');
        listElement.innerHTML = '<h2>Your Posts</h2>'; // Clear previous posts

        if (posts.length === 0) {
            listElement.innerHTML += '<p>You have not created any posts yet.</p>';
            return;
        }

        posts.forEach(post => {
            const postHtml = `
                <div class="post-card">
                    <p>${post.Content}</p>
                    <small>Posted on: ${new Date(post.CreatedAt).toLocaleDateString()}</small>
                </div>
            `;
            listElement.innerHTML += postHtml;
        });

    } catch (error) {
        console.error('Error fetching user posts:', error);
    }
}


async function handleCreatePost(event) {
    event.preventDefault();
    
    const userID = localStorage.getItem('userID'); // Get the ID inside the function
    // Title retrieval removed
    const content = document.getElementById('postContent').value.trim();

    // FIX: Removed 'title' from validation
    if (!content || !userID) { 
        alert("Please fill out the content field and ensure you are logged in.");
        return;
    }

    try {
        // FIX: Harmonized route to /posts (assuming this is correct)
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                // FIX: Removed 'title' from body
                content: content, 
                userID: userID 
            })
        });

        if (response.ok) {
            alert('Post created successfully!');
            // Clear the form
            document.getElementById('createPostForm').reset();
            // Refresh the posts list
            await fetchUserPosts(userID); 
        } else {
            const data = await response.json();
            alert(`Failed to create post: ${data.message}`);
        }
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Could not connect to the server.');
    }
}


// Fetch and Populate Posts in the Feed
async function fetchPostsAndPopulate(token) {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = ''; 

    if (!token) {
        postsContainer.innerHTML = '<p style="color: red;">Error: User not authenticated. Please log in.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/posts`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to fetch posts: ${response.status} - ${errorData.message || 'Server error'}`);
        }

        const posts = await response.json();
        
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">No posts found in the community feed.</p>';
            return;
        }
        
        posts.forEach(post => {
            const postElement = createPostCard(post);
            postsContainer.appendChild(postElement);
        });

    } catch (error) {
        console.error("Error fetching posts:", error);
        postsContainer.innerHTML = `<p style="color: red;">Failed to load feed. Error: ${error.message}</p>`;
    }
}


// Helper function to create a post card element
function createPostCard(post) {
    const usernamePlaceholder = `User_${post.UserID || 'Unknown'}`; 
    const formattedDate = new Date(post.CreatedAt).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    
    // Create the post card div
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    
    // Populate the inner HTML
    postCard.innerHTML = `
        <div class="post-header">
            <span class="username-link">@${usernamePlaceholder}</span>
            <span class="post-date">${formattedDate}</span>
        </div>
        <div class="post-body">
            <p>${post.Content}</p>
        </div>
        <div class="post-actions">
            <button class="action-button">Like (0)</button> 
            <button class="action-button">Comment</button>
            <button class="action-button">Share</button>
        </div>
    `;

    return postCard;
}