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

async function addComputers(){
  
    const token = localStorage.getItem('token');

    if(!token){

      alert(`No token found. Please log in again`);
      return;

    }

    const newPc = { 

      PC_ID: document.querySelector(`#computerName`).value

    }

    try{

        const response = await fetch(`http://localhost:3000/add/pc`, {

            method: 'POST',
            headers: {

                'Authorization' :   token,
                'Content-Type'  :   'application/json'

            },
            body: JSON.stringify(newPc)
        
        });

        if(response.ok){

          document.getElementById("addComputerForm").reset();

          const successAlert = document.getElementById("successAlert");
          document.getElementById("successMessage").textContent = `${newPc.PC_ID} was added successfully!`;
          successAlert.classList.remove("d-none");
          
          setTimeout(() => {
            successAlert.classList.add("d-none");
            location.reload();
          }, 3000);
        
        }else{

          const ErrorData = await response.json();
          console.error(`Error`, ErrorData);

          const errorAlert = document.getElementById("errorAlert");
          document.getElementById("errorMessage").textContent = ErrorData.msg || `Failed to add computer.`;
          errorAlert.classList.remove("d-none");

          // Hide the alert after 3 seconds
          setTimeout(() => {
            errorAlert.classList.add("d-none");
            location.reload();
          }, 3000);

          throw new Error(ErrorData.msg || `Failed to add computer`);

        }

    }catch(error){

      console.log(error);
      const errorAlert = document.getElementById("errorAlert");
      document.getElementById("errorMessage").textContent = `PC Name is already exists`;
      errorAlert.classList.remove("d-none");

      setTimeout(() => {
        errorAlert.classList.add("d-none");
      }, 3000);

    }

}


document.getElementById("addComputerForm").addEventListener("submit", (event) => {
  event.preventDefault();
 
});

// DISPLAY COMPUTERS DYNAMICALLY
const pcListContainer = document.getElementById("pc-list");

const token = localStorage.getItem('token');

  // Fetch data from the API and render cards
  async function fetchAndRenderPCList() {
    try {
      const response = await fetch("http://localhost:3000/view_all/pc", {
        method: "GET",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PC list");
      }

      const pcList = await response.json();

      // Clear existing content
      pcListContainer.innerHTML = "";

      // Generate cards dynamically
      pcList.forEach((pc) => {
        const card = document.createElement("div");
        card.className = "col";
        card.innerHTML = `
          <div class="card h-100 computer-card shadow-sm" 
               data-status="${pc.pc_status}" 
               data-bs-toggle="modal" 
               data-bs-target="${pc.pc_status === 'available' ? '#availableComputerDetailsModal' : '#computerDetailsModal'}">
            <div class="card-body d-flex flex-column justify-content-center">
              <i class="fas fa-desktop computer-icon" style="color: #800000;"></i>
              <div class="computer-name">${pc.PC_ID}</div>
              <div class="computer-status ${pc.pc_status.toLowerCase()}">${pc.pc_status}</div>
              <div class="computer-user">${pc.Student_ID || "none"}</div>
            </div>
          </div>
        `;
        pcListContainer.appendChild(card);
      });
    } catch (error) {
      console.error("Error fetching PC list:", error);
    }
  }

  // Call the function to fetch and render the PC list
  fetchAndRenderPCList();