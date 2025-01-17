// Check and redirect if the user is logged out
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("Redirecting to login due to missing token.");
        window.location.href = "login.html"; // Update this to your login page URL
    }

    // Refresh page if accessed via browser back button
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            window.location.reload();
        }
    });
});


// DATE and TIME
function updateDateTime() {
    const dateElement = document.getElementById("date");

    const now = new Date();

    const formattedDate = now.toLocaleDateString("en-US", {

        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",

    });

    const formattedTime = now.toLocaleTimeString("en-US", {

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

    });

    dateElement.textContent = `${formattedDate}, ${formattedTime}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);


// DISPLAY THE DATA OF THE USER
async function loadData() {

    const token = localStorage.getItem('token');

    if (!token) {

        console.log(`No token found. Redirecting to login page...`);
        return;

    }

    try {

        const response = await fetch(`http://127.0.0.1:4000/admin/details`, {

            method: 'GET',
            headers: {

                'Authorization': token

            }

        });

        if (!response.ok) {

            const ErrorData = await response.json();
            console.error(`Error`, ErrorData);
            throw new Error(ErrorData.msg || `Failed to fetch the admin data`);

        }

        const data = await response.json();

        const fullname = `${data.first_name} ${data.last_name}`;

        document.querySelector(`#fullname`).textContent = fullname;
        document.querySelector(`#account-name`).textContent = data.username;


    } catch (error) {

        console.log(error);

    }

}

loadData();


// FETCH ALL AVAILABLE PC
async function AvailablePc() {

    const token = localStorage.getItem('token');

    if (!token) {

        console.log(`No token found. Redirecting to Login page...`);
        return;

    }

    try {

        const response = await fetch(`http://127.0.0.1:4000/view_all/pc`, {

            method: 'GET',
            headers: {

                'Authorization': token,


            }

        });

        if (!response.ok) {

            throw new Error(`Failed to fetch the available pc`);

        }

        const pcList = await response.json();

        const availablePCs = pcList.filter(pc => pc.pc_status.toLowerCase() === 'available');

        document.getElementById("availablePCCount").textContent = availablePCs.length;


    } catch (error) {

        console.log(error);

    }

}

AvailablePc();

// FETCH ALL HISTORY SESSION
async function SessionHistory() {

    const token = localStorage.getItem('token');

    if (!token) {

        console.log(`No token found. Redirecting to Login page...`);
        return;

    }

    try {

        const response = await fetch(`http://127.0.0.1:4000/admin/session-history`, {

            method: 'GET',
            headers: {

                'Authorization': token,
                'Content-Type': 'application/json',

            }

        });

        const result = await response.json();

        if (!response.ok) {

            throw new Error(`Failed to fetch the session history`);

        }

        document.querySelector(`#history`).textContent = result.length;


    } catch (error) {

        console.log(error);

    }

}

SessionHistory();



// Modify the Edit Profile button to remove the hardcoded ID
document.addEventListener('DOMContentLoaded', function () {
    const editProfileBtn = document.getElementById('editProfileBtn');
    editProfileBtn.onclick = function () {
        const currentAdminId = localStorage.getItem('adminId');
        if (!currentAdminId) {
            alert('Please log in again');
            return;
        }
        EditAdmin(currentAdminId);
    };
});

// EDIT ADMIN
async function EditAdmin(Admin_ID) {

    const token = localStorage.getItem('token');

    if (!token) {

        console.log(`No token found. Redirecting to Login page...`);
        return;

    }

    try {

        const response = await fetch(`http://127.0.0.1:4000/admin/view/${Admin_ID}`, {

            method: 'GET',
            headers: {

                'Authorization': token,
                'Content-Type': 'application/json'

            }

        });

        const data = await response.json();

        if (data) {

            document.querySelector('#Admin_ID').value = data.Admin_ID || '';
            document.querySelector('#username').value = data.username || '';
            // Remove this line since we don't want to show the password
            // document.querySelector('#password').value = data.password;
            document.querySelector('#firstName').value = data.first_name || '';
            document.querySelector('#lastName').value = data.last_name || '';

            // Clear the password field
            document.querySelector('#password').value = '';
            // Add a placeholder to indicate this is for a new password
            document.querySelector('#password').placeholder = 'Enter new password (leave blank to keep current)';

            $('#editProfileModal').modal('show');

        }

    } catch (error) {

        console.log(error);

    }

    const edit = document.querySelector(`#saveProfileBtn`);

    if (edit) {

        edit.onclick = async (e) => {

            e.preventDefault();
            const passwordField = document.querySelector('#password');
            const newData = {

                username: document.querySelector('#username').value,
                first_name: document.querySelector('#firstName').value,
                last_name: document.querySelector('#lastName').value,
                Admin_ID: document.querySelector(`#Admin_ID`).value

            };

            // Only include password if the user entered a new one
            if (passwordField.value.trim() !== '') {
                newData.password = passwordField.value;
            }

            try {

                const updateResponse = await fetch(`http://127.0.0.1:4000/admin/update-info`, {

                    method: 'PUT',
                    headers: {

                        'Authorization': token,
                        'Content-Type': 'application/json'

                    },
                    body: JSON.stringify(newData)

                });

                const result = await updateResponse.json();

                if (updateResponse.ok) {

                    alert(`Successfully Updated Admin Info`);
                    location.reload();

                } else {

                    console.log(result.error);
                    alert(`Error Updating user: ${result.error}`);

                }

            } catch (error) {

                console.log(error);

            }

        }

    }

}

document.addEventListener('DOMContentLoaded', function () {
    const editProfileModal = document.getElementById('editProfileModal');

    // Clean up modal backdrop when modal is hidden
    $(editProfileModal).on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    });
});