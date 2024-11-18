
// LOG IN ADMIN
const login = document.querySelector(`#login-form`);

login.addEventListener('submit', async (event) => {

    event.preventDefault();

    const formData = new FormData(event.target);

    const username = formData.get('username');
    const password = formData.get('password');

    const data = {

        username: username,
        password: password

    }

    try{

        const response = await fetch(`http://localhost:3000/login/admin`, {

            method: 'POST',
            headers: {

                'Content-Type'  :   'application/json'

            },
            body: JSON.stringify(data)

        });

        const result = await response.json();

        if(response.ok){

            localStorage.setItem('token', result.token);
            window.location.href = result.redirectUrl,
            alert(`Welcome, ${username}`);

        }else{

            alert(`Incorrect Password or Username`);

        }

    }catch(error){

        console.log(error);
        alert(`Incorrect Password or Username`);

    }

});