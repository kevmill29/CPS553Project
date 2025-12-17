// script.js

// 1. GLOBAL CONSTANT: Declared once at the very top.
const API_URL = "http://localhost:4500/api";


document.addEventListener('DOMContentLoaded', () => {
    // --- Get Elements ---
    const regForm = document.getElementById('regForm');
    const loginForm = document.getElementById('loginForm');
    const postForm = document.getElementById('post'); 
    const createPostForm = document.getElementById('createPostForm'); 
    const logoutBtn = document.getElementById("logoutBtn");
    
    // Elements used for conditional loading (Dashboard and Profile)
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
    
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }

    // --- Load Data Conditionally (CRITICAL FLOW CONTROL) ---
    // NOTE: We retrieve using the standardized client key 'userID' (camelCase)
    const userID = localStorage.getItem('userID'); 
    const token = localStorage.getItem('userToken');

    // 1. Dashboard Loading (Runs only if element is present)
    if (postsContainer) { 
        loadDashboard(userID, token);
    }
    
    // 2. Profile Posts Loading (Runs only if element is present)
    if (userPostsList) {
        if (userID && token) {
             fetchUserPosts(userID); 
        } else {
             userPostsList.innerHTML = '<p style="text-align: center;">Please log in to view your posts.</p>';
        }
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

// --- Auth Functions ---

async function register(e) {
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
    }
}


async function login(e) {
    e.preventDefault();
    // server port 
    const API_URL = "http://localhost:4500/api"; // Often declared globally later
    
    const user = {
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim() 
    };

    if (!user.username || !user.password) {
        alert("Please enter both username and password.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Login successful:", data);
            alert("Login successful!");

            // This line failed because the server returned 'UserID' (PascalCase)
            localStorage.setItem("userID", data.user.UserID); 
            
            localStorage.setItem("userToken", data.token);

            window.location.href = 'dashboard.html';
        } else {
            console.error("Login failed:", data.message);
            alert("Login failed: " + (data.message || "An unknown server error occurred."));
        }
    } catch (err) {
        console.error("Login error (Network/Fetch failure):", err); 
        alert("An error occurred during login. Please try again later.");
    }
}
function logout(e) {
    e.preventDefault();
    localStorage.clear();
    alert("Logged out successfully.");
    window.location.href = "login.html";
}


// --- Post Creation Functions ---

async function postThread(e) {
    e.preventDefault(); 
    
    // We still retrieve the token here for the POST action (creating the post)
    const token = localStorage.getItem("userToken"); 
    
    // Optional: You can remove this check if you want to allow posting without auth (insecure)
    // But usually, creating a post requires a token.
    if (!token) { 
        alert("You must be logged in to post a thread!");
        return;
    }
    
    const contentElement = document.getElementById("text");
    if (!contentElement || !contentElement.value.trim()) {
        alert("Post content cannot be empty.");
        return;
    }

    const postData = {
        content: contentElement.value
    };

    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Post created successfully:", data);
            alert("Your post has been created!");
            
          
            fetchPostsAndPopulate(); 
            
        } else {
            const errorData = await response.json();
            alert("Failed to create post: " + errorData.message);
        }
    } catch (err) {
        console.error("Error creating post:", err);
        alert("An error occurred while creating your post. Please try again later.");
    }
}


async function handleCreatePost(event) {
    event.preventDefault(); 

    const content = document.getElementById('postContent').value; 
    
    // 🛑 FIX: Retrieve the ID directly using the key you set in Login
    const storedUserID = localStorage.getItem('userID'); 
    
    // Check if ID is missing
    if (!storedUserID) {
        alert("You must be logged in to post!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/posts`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: parseInt(storedUserID), // Convert string "7" to number 7
                content: content
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Post created:", data);
            window.location.reload(); 
        } else {
            console.error("Failed to create post:", data.error);
            alert("Error: " + (data.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

// --- Dashboard/Profile Loading Functions ---

// Function signature takes NO parameters
async function loadDashboard() { 
    
    // --- Internal Retrieval ---
    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('userToken');
    
    // 🛑 CHANGED: We ONLY check if userID is missing. We ignore the token.
    if (!userID) { 
        console.warn(`Redirecting to login: userID is missing.`); 
        alert("You must be logged in to view this page.");
        window.location.href = "login.html";
        return;
    }

    // Call the posts function (which we just fixed above)
    fetchPostsAndPopulate(); 

    // FETCH USER DETAILS
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/users/${userID}`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const user = await response.json();
            
            const dashName = document.getElementById("dash-name");
            if(dashName) dashName.innerText = user.Username || user.username || "Anonymous";

            const dashEmail = document.getElementById("dash-email");
            if(dashEmail) dashEmail.innerText = user.Email || user.email;

            const dashId = document.getElementById("dash-id");
            if(dashId) dashId.innerText = user.UserID || user.id; 
            
        } else {
            console.error("Failed to fetch profile data");
        }

    } catch (error) {
        console.error("Dashboard Error:", error);
    }
}


async function fetchUserPosts(userId) {
    if (!userId) {
        console.error("fetchUserPosts called without a valid User ID.");
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/posts/user/${userId}/posts`);
        
        if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
        const posts = await response.json();
        
        const listElement = document.getElementById('user-posts-list');
        
        if (!listElement) return;

        listElement.innerHTML = '<h2>Your Posts</h2>'; 

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
        const listElement = document.getElementById('user-posts-list');
        if(listElement) listElement.innerHTML = `<p style="color: red;">Failed to load posts: ${error.message}</p>`;
    }
}


// Fetch and Populate Posts in the Feed
// Function signature takes NO parameters
async function fetchPostsAndPopulate() { 
    
    // Attempt to get token, but we won't crash if it's missing
    const token = localStorage.getItem('userToken'); 
    const postsContainer = document.getElementById('postsContainer');
    
    if (!postsContainer) return; 

    // Clear previous content
    postsContainer.innerHTML = ''; 

    // 🛑 DELETED THE STRICT TOKEN CHECK HERE
    // We proceed to fetch regardless of whether we have a token or not.

    try {
        const headers = { 'Content-Type': 'application/json' };
        
        // Only attach the token header if the token actually exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/posts`, { 
            method: 'GET',
            headers: headers
        });
        
        if (!response.ok) {
            // If the server blocks us, we just show a generic message or empty feed
            console.warn("Server refused posts request (likely auth):", response.status);
            postsContainer.innerHTML = '<p>No posts available.</p>'; 
            return;
        }

        const posts = await response.json();
        
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts found.</p>';
            return;
        }
        
        posts.forEach(post => {
            const postElement = createPostCard(post);
            postsContainer.appendChild(postElement);
        });

    } catch (error) {
        console.error("Error fetching posts:", error);
        postsContainer.innerHTML = `<p style="color: red;">Failed to load feed.</p>`;
    }
}


// Helper function to create a post card element
function createPostCard(post) {
    // 🔑 Use the PascalCase 'UserID' key from the post object
    const usernamePlaceholder = `User_${post.UserID || 'Unknown'}`; 
    const formattedDate = new Date(post.CreatedAt).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    
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