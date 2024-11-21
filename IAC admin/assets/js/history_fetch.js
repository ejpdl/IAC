// DISPLAY SESSION HISTORY
async function SessionHistory(){

    const token = localStorage.getItem('token');

    if(!token){

        alert(`No token found. Please log in again`);
        return;

    }

    try{

        const response = await fetch(`http://localhost:3000/admin/session-history`, {

            method: 'GET',
            headers: {

                'Authorization' :  token,
                'Content-Type'  :  'application/json'

            }

        });

        if(!response.ok){

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

            const formattedStartTime = formatTime(session.start_time);
            const formattedEndTime = formatTime(session.end_time);

            row.innerHTML = `
                <td>${session.PC_ID}</td>
                <td>${session.Student_ID}</td>
                <td>${session.full_name}</td>
                <td>${formattedStartTime}</td>
                <td>${formattedEndTime}</td>
            `;

            tableBody.appendChild(row);
        });

    }catch(error){

        console.log(error);

    }

}

function formatTime(isoTime) {
    try {
        const date = new Date(isoTime);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
        console.error(`Error formatting time:`, e);
        return isoTime; // Fallback to raw time if parsing fails
    }
}


SessionHistory();