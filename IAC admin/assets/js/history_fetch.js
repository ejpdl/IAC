// DISPLAY THE DATA OF THE USER
async function loadData() {

    const token = localStorage.getItem('token');
  
    if (!token) {
  
      alert(`No token found. Please log in again`);
      return;
  
    }
  
    try {
  
      const response = await fetch(`http://localhost:3000/admin/details`, {
  
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

    }catch(error){

        console.log(error);

    }

}

function formatTime(timeString) {
    try {
        const date = new Date(`1970-01-01T${timeString}Z`); // Add a fixed date and UTC timezone
        if (isNaN(date)) throw new Error("Invalid date");
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
        console.error(`Error formatting time:`, e, timeString);
        return timeString; // Fallback to raw time if parsing fails
    }
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date)) throw new Error("Invalid date");
        return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch (e) {
        console.error(`Error formatting date:`, e, dateString);
        return dateString; // Fallback to raw date if parsing fails
    }
}

SessionHistory();