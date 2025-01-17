// REGISTER ADMIN
const register = document.querySelector(`#register-form`);

register.addEventListener('submit', async (event) => {

    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const firstname = formData.get('firstname');
    const lastname = formData.get('lastname');
    const confirmPassword = document.querySelector(`#confirmPassword`).value;

    if (password !== confirmPassword) {

        alert(`Password do not match`);
        return;

    }

    const data = {

        username: username,
        password: password,
        first_name: firstname,
        last_name: lastname

    }

    try {

        const response = await fetch(`http://127.0.0.1:4000/register/admin`, {

            method: 'POST',
            headers: {

                'Content-Type': 'application/json'

            },
            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (response.ok) {

            localStorage.setItem('token', result.token);
            location.reload();
            alert(`Successfully registered`);

        } else {

            alert(result.message || `Something went wrong`);

        }

    } catch (error) {

        console.log(error);
        alert(`The Server could be off or down`);

    }

});
