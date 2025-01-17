
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

    try {

        const response = await fetch(`http://127.0.0.1:4000/login/admin`, {

            method: 'POST',
            headers: {

                'Content-Type': 'application/json'

            },
            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (response.ok) {

            localStorage.setItem('token', result.token);
            const tokenPayload = JSON.parse(atob(result.token.split('.')[1]));
            localStorage.setItem('adminId', tokenPayload.Admin_ID);
            window.location.href = result.redirectUrl,
                alert(`Welcome, ${username}`);

        } else {

            alert(`Incorrect Password or Username`);

        }

    } catch (error) {

        console.log(error);
        alert(`Incorrect Password or Username`);

    }

});