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

let sessionHistory = [];
let currentPage = 1;
let entriesPerPage = 10; // Default to 10 rows per page

// Function to load session history with pagination
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

        sessionHistory = await response.json();

        // Sort sessions by date_used in descending order
        sessionHistory.sort((a, b) => new Date(b.date_used) - new Date(a.date_used));

        // Render the current page
        renderPage(currentPage);

        // Update pagination controls
        updatePagination();
    } catch (error) {
        console.log(error);
    }
}

// Function to render sessions for the current page
function renderPage(page) {
    const tableBody = document.getElementById("sessionHistoryTable");
    tableBody.innerHTML = ""; // Clear any previous content

    const start = (page - 1) * entriesPerPage;
    const end = page * entriesPerPage;
    const pageSessions = sessionHistory.slice(start, end);

    pageSessions.forEach(session => {
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
}

// Update pagination controls based on the current state
function updatePagination() {
    const totalPages = Math.ceil(sessionHistory.length / entriesPerPage);
    const paginationContainer = document.querySelector('.pagination');

    // Show current page and total pages
    const currentPageDisplay = document.getElementById("currentPageDisplay");
    currentPageDisplay.textContent = `Page ${currentPage} of ${totalPages}`;

    // Disable previous/next buttons if on the first/last page
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");

    if (currentPage === 1) {
        prevPage.classList.add('disabled');
    } else {
        prevPage.classList.remove('disabled');
    }

    if (currentPage === totalPages) {
        nextPage.classList.add('disabled');
    } else {
        nextPage.classList.remove('disabled');
    }
}

// Change page by a specific offset (previous or next)
function changePage(offset) {
    const totalPages = Math.ceil(sessionHistory.length / entriesPerPage);

    // Only change the page if the new page is within the valid range
    const newPage = currentPage + offset;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderPage(currentPage);
        updatePagination();
    }
}

// Update the number of rows per page based on dropdown selection
function updateRowsPerPage() {
    const rowsPerPageSelect = document.getElementById('rowsPerPage');
    entriesPerPage = parseInt(rowsPerPageSelect.value);
    currentPage = 1; // Reset to first page
    renderPage(currentPage);
    updatePagination();
}

// Format the time as you already did
function formatTime(timeString) {
    try {
        const today = new Date();
        const [hours, minutes, seconds] = timeString.split(':');
        today.setHours(parseInt(hours));
        today.setMinutes(parseInt(minutes));
        today.setSeconds(parseInt(seconds));

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

// Format the date as you already did
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date)) throw new Error("Invalid date");

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

// Initialize the session history when the page is ready
SessionHistory();

// Attach the updateRowsPerPage function to the select dropdown
document.getElementById('rowsPerPage').addEventListener('change', updateRowsPerPage);
