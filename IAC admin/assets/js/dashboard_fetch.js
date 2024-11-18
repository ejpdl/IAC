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
async function loadData(){

    const token = localStorage.getItem('token');
    
    if(!token){

        alert(`No token found. Please log in again`);
        return;

    }

    try{

        const response = await fetch(`http://localhost:3000/admin/details`, {

            method: 'GET',
            headers: {

                'Authorization' :   token

            }
        
        });

        if(!response.ok){

            const ErrorData = await response.json();
            console.error(`Error`, ErrorData);
            throw new Error(ErrorData.msg || `Failed to fetch the admin data`);
        
        }

        const data = await response.json();

        const fullname = `${data.first_name} ${data.last_name}`;

        document.querySelector(`#fullname`).textContent = fullname;
        document.querySelector(`#account-name`).textContent = data.username;


    }catch(error){

        console.log(error);

    }

}

loadData();

