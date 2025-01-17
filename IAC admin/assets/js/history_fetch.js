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

        document.querySelector(`#account-name`).textContent = data.username;


    } catch (error) {

        console.log(error);

    }

}

loadData();


// DISPLAY SESSION HISTORY
async function SessionHistory() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log(`No token found. Redirecting to login page...`);
        return;
    }
    try {
        const response = await fetch(`http://127.0.0.1:4000/admin/session-history`, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const ErrorData = await response.json();
            console.error(`Error`, ErrorData);
            throw new Error(ErrorData.msg || `Failed to fetch the history data`);
        }
        const sessionHistory = await response.json();
        const tableBody = document.getElementById("sessionHistoryTable");
        tableBody.innerHTML = "";
        sessionHistory.forEach(session => {
            const row = document.createElement("tr");
            row.style.height = "55px";
            const formattedEndTime = formatTime(session.time_used);
            const formattedDateUsed = formatDate(session.date_used);
            row.innerHTML = `
                <td>${session.PC_ID}</td>
                <td>${session.Student_ID}</td>
                <td>${session.full_name}</td>
                <td>${formattedDateUsed}</td>
                <td>${formattedEndTime}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.log(error);
    }
}


function formatTime(timeString) {
    try {
        // Create a date object for today with the given time
        const today = new Date();
        const [hours, minutes, seconds] = timeString.split(':');

        // Set the time components
        today.setHours(parseInt(hours));
        today.setMinutes(parseInt(minutes));
        today.setSeconds(parseInt(seconds));

        // Format the time in Asia/Manila timezone
        return today.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Manila'
        });
    } catch (e) {
        console.error(`Error formatting time:`, e, timeString);
        return timeString;
    }
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date)) throw new Error("Invalid date");

        // Format the date in Asia/Manila timezone
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Manila'
        });
    } catch (e) {
        console.error(`Error formatting date:`, e, dateString);
        return dateString;
    }
}


SessionHistory();