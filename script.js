
//registration form
let regForm = document.getElementById("regForm")
//login form
let loginForm = document.getElementById("loginForm")
//form for creating a post
let post = document.getElementById("post")

// registration form event listener
if(regForm){
regForm.addEventListener('submit', register);
}

//login event listener
if(loginForm){
    loginForm.addEventListener('submit', login)
}
//post event listener
if(post){
post.addEventListener('submit', postThread)
}


function register(e){
    //this will run when the user submits to add their registration information
    e.preventDefault()
    let pass = document.getElementById("passwd").value
    let confirmPass = document.getElementById("confirmpasswd").value

if(validPassword(pass, confirmPass)){

    const user = {
        email: document.getElementById("userEmail").value,
        password: document.getElementById("passwd").value,
        uuid: crypto.randomUUID()
    }
    console.log(user)
} else{
    throw new Error("Passwords must match!")
}


}

function login(e){
    //this will run when the user hits submit on the login form
    e.preventDefault()
    const user = {
        email: document.getElementById("useremail").value,
        password: document.getElementById("passwd").value
    }
    console.log(user)
}

function postThread(e){
    e.preventDefault()
    const timeStamp = new Date()
    const post = {
        text : document.getElementById("text"),
        title: document.getElementById("title"),
        timeStamp: timeStamp.toUTCString
    }
    console.log(post)
}



function validPassword(password, confirmPassword){
    //password validation boolean
    return password == confirmPassword
}

