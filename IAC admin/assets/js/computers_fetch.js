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

    const fullname = `${data.first_name} ${data.last_name}`;

    document.querySelector(`#fullname`).textContent = fullname;
    document.querySelector(`#account-name`).textContent = data.username;


  } catch (error) {

    console.log(error);

  }

}

loadData();

async function addComputers() {

  const token = localStorage.getItem('token');
  if (!token) {
    alert(`No token found. Please log in again`);
    return;
  }
  const newPc = {
    PC_ID: document.querySelector(`#computerName`).value
  }
  try {
    const response = await fetch(`http://localhost:3000/add/pc`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPc)

    });
    if (response.ok) {
      document.getElementById("ComputerForm").reset();
      const successAlert = document.getElementById("successAlert");
      document.getElementById("successMessage").textContent = `${newPc.PC_ID} was added successfully!`;
      successAlert.classList.remove("d-none");

      setTimeout(() => {
        successAlert.classList.add("d-none");
        location.reload();
      }, 3000);

    } else {
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
  } catch (error) {
    console.log(error);
    const errorAlert = document.getElementById("errorAlert");
    document.getElementById("errorMessage").textContent = `PC Name is already exists`;
    errorAlert.classList.remove("d-none");
    setTimeout(() => {
      errorAlert.classList.add("d-none");
    }, 3000);
  }
}
document.getElementById("ComputerForm").addEventListener("submit", (event) => {
  event.preventDefault();

});

async function deleteComputers() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert(`No token found. Please log in again`);
    return;
  }

  const deletePc = {
    PC_ID: document.querySelector(`#computerName`).value
  };

  try {
    const response = await fetch(`http://localhost:3000/delete/pc`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deletePc)
    });

    console.log('Response Status:', response.status); // Log status code

    if (response.ok) {
      document.getElementById("ComputerForm").reset();
      const successAlert = document.getElementById("successAlert");
      document.getElementById("successMessage").textContent = `${deletePc.PC_ID} was deleted successfully!`;
      successAlert.classList.remove("d-none");

      setTimeout(() => {
        successAlert.classList.add("d-none");
        location.reload();
      }, 3000);
    } else {
      const errorData = await response.json();
      console.error('Error Response:', errorData); // Log error response
      const errorAlert = document.getElementById("errorAlert");
      document.getElementById("errorMessage").textContent = errorData.msg || `Failed to delete computer.`;
      errorAlert.classList.remove("d-none");

      setTimeout(() => {
        errorAlert.classList.add("d-none");
        location.reload();
      }, 3000);

      throw new Error(errorData.msg || `Failed to delete computer`);
    }
  } catch (error) {
    console.error('Caught error:', error); // Log the error
    const errorAlert = document.getElementById("errorAlert");
    document.getElementById("errorMessage").textContent = `PC Name does not exist or an error occurred.`;
    errorAlert.classList.remove("d-none");

    setTimeout(() => {
      errorAlert.classList.add("d-none");
    }, 3000);
  }
}

document.getElementById("ComputerForm").addEventListener("delete", (event) => {
  event.preventDefault();
  deleteComputers(); // Ensure deleteComputers is called on form submission
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






// Function to handle PC request response (accept/decline)
async function handleRequestResponse(pcId, action) {
  try {
    const response = await fetch('http://localhost:3000/api/request-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pcId, action }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Failed to ${action} request`);
    }

    // Show success message
    showAlert(`Request ${action}ed successfully`, 'success');

    if (action === 'accept') {
      const gridCard = document.querySelector(`[data-pc-id="${pcId}"]`);
      let timerElement = gridCard.querySelector('.timer-container');

      // Create timer container if not present
      if (!timerElement) {
        timerElement = document.createElement('div');
        timerElement.className = 'timer-container';
        gridCard.querySelector('.card-body').appendChild(timerElement);
      }

      // Start the timer for the PC
      PCTimer.startTimer(pcId, timerElement);
    }

    // Refresh PC status
    loadPCStatus();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.querySelector('#reqComputerDetailsModal'));
    modal.hide();
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

// Function to load PC status
async function loadPCStatus() {
  try {
    const response = await fetch('http://localhost:3000/api/pc-status');
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to load PC status');
    }

    // Update the grid with new data
    updatePCGrid(data);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

// Function to update PC grid
function updatePCGrid(pcs) {
  const grid = document.querySelector('.row-cols-1');
  grid.innerHTML = '';

  pcs.forEach(pc => {
    const card = createPCCard(pc);
    grid.appendChild(card);
  });
}

// Function to create PC card
function createPCCard(pc) {
  const col = document.createElement('div');
  col.className = 'col';

  const statusClass = pc.pc_status.toLowerCase();
  const modalTarget = getModalTarget(pc.pc_status);

  col.innerHTML = `
    <div class="card h-100 computer-card shadow-sm" 
         data-status="${statusClass}"
         data-bs-toggle="modal"
         data-bs-target="#${modalTarget}"
         data-pc-id="${pc.PC_ID}">
      <div class="card-body d-flex flex-column justify-content-center">
        <i class="fas fa-desktop computer-icon" style="color: #800000;"></i>
        <div class="computer-name">${pc.PC_ID}</div>
        <div class="computer-status ${statusClass}">Status: ${pc.pc_status}</div>
        <div class="computer-user">by: ${pc.Student_ID || 'none'}</div>
      </div>
    </div>
  `;

  // If PC is Occupied, start the timer

  const card = col.querySelector('.computer-card');
  card.addEventListener('click', () => handlePCClick(pc));

  return col;
}

// Function to handle PC card click
function handlePCClick(pc) {
  const modalId = getModalTarget(pc.pc_status);
  const modal = document.querySelector(`#${modalId}`);

  if (modal) {
    updateModalContent(modal, pc);
  }
}

// Function to update modal content
function updateModalContent(modal, pc) {
  const nameEl = modal.querySelector('.computer-name');
  const statusEl = modal.querySelector('.computer-status');
  const userEl = modal.querySelector('.computer-user');
  const endSessionButton = document.getElementById('endSessionBtn');

  if (nameEl) nameEl.textContent = pc.PC_ID;
  if (statusEl) {
    statusEl.textContent = pc.pc_status;
    statusEl.className = `computer-status ${pc.pc_status.toLowerCase()}`;
  }

  if (userEl) {
    // Create a container for user info and timer
    const userContainer = document.createElement('div');
    userContainer.innerHTML = pc.pc_status === 'Pending'
      ? `<strong>Requesting:</strong> ${pc.Student_ID}`
      : `<strong>Student:</strong> ${pc.Student_ID || 'none'}`;

    // Add timer for Occupied PCs
    if (pc.pc_status === 'Occupied') {
      const timerContainer = document.createElement('div');
      timerContainer.className = 'timer-container';
      timerContainer.textContent = 'Remaining Time: Loading...';
      userContainer.appendChild(timerContainer);

      const modalBody = modal.querySelector('.modal-body div');
      if (modalBody) {
        userEl.innerHTML = '';
        userEl.appendChild(userContainer);

        // Start timer
        PCTimer.startTimer(pc.PC_ID, timerContainer);
      }

      // Set data-pc-id for the button
      if (endSessionButton) {
        endSessionButton.setAttribute('data-pc-id', pc.PC_ID);
        endSessionButton.onclick = () => handleEndSession(pc.PC_ID);
      }
    }

    // Handle Pending status
    if (pc.pc_status === 'Pending') {
      const acceptBtn = modal.querySelector('.btn-success');
      const declineBtn = modal.querySelector('.btn-info');
      if (acceptBtn) {
        acceptBtn.onclick = () => handleRequestResponse(pc.PC_ID, 'accept');
      }
      if (declineBtn) {
        declineBtn.onclick = () => handleRequestResponse(pc.PC_ID, 'decline');
      }
    }

    userEl.innerHTML = '';
    userEl.appendChild(userContainer);
  }
}


// Helper function to get modal target based on status
function getModalTarget(status) {
  switch (status) {
    case 'Occupied':
      return 'computerDetailsModal';
    case 'Pending':
      return 'reqComputerDetailsModal';
    case 'Available':
      return 'availableComputerDetailsModal';
    default:
      return 'computerDetailsModal';
  }
}

// Timer management
const PCTimer = {
  timers: new Map(),

  formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  async startTimer(pcId, displayElement) {
    this.stopTimer(pcId);

    try {
      const response = await fetch(`http://localhost:3000/api/pc-time/${pcId}`);
      const data = await response.json();

      if (!data.isActive) {
        displayElement.textContent = 'Session ended';
        return;
      }

      const updateDisplay = () => {
        // Fetch current remaining time from backend each interval
        fetch(`http://localhost:3000/api/pc-time/${pcId}`)
          .then(response => response.json())
          .then(data => {
            if (!data.isActive || data.remainingTime <= 0) {
              this.stopTimer(pcId);
              displayElement.textContent = 'Session ended';
              return;
            }

            displayElement.textContent = `Remaining Time: ${this.formatTime(data.remainingTime)}`;
          })
          .catch(error => {
            console.error('Error updating timer:', error);
            displayElement.textContent = 'Error loading timer';
          });
      };

      // Initial update
      updateDisplay();

      // Set up interval to continuously update
      const timerId = setInterval(updateDisplay, 1000);
      this.timers.set(pcId, timerId);

    } catch (error) {
      console.error('Error loading timer:', error);
      displayElement.textContent = 'Error loading timer';
    }
  },

  stopTimer(pcId) {
    const timerId = this.timers.get(pcId);
    if (timerId) {
      clearInterval(timerId);
      this.timers.delete(pcId);
    }
  }
};

// Function to show alerts
function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  const container = document.querySelector('.container-fluid.page-content');
  container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => alertDiv.remove(), 5000);
}

async function handleEndSession(pcId) {
  try {
    const response = await fetch('http://localhost:3000/api/end-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pcId }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to end session');
    }

    alert('Session ended successfully');
    loadPCStatus();

    // Close the modal if it's open
    const modal = bootstrap.Modal.getInstance(document.querySelector('#computerDetailsModal'));
    if (modal) modal.hide();
  } catch (error) {
    alert('Error ending session: ' + error.message);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const endSessionButton = document.getElementById('endSessionBtn');

  if (endSessionButton) {
    endSessionButton.addEventListener('click', async function () {
      const pcId = endSessionButton.getAttribute('data-pc-id');
      if (pcId) {
        await handleEndSession(pcId);
      }
    });
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadPCStatus();
  setInterval(loadPCStatus, 30000);

  // Check for expired sessions every minute!
  setInterval(async () => {
    try {
      await fetch('http://localhost:3000/api/check-expired-sessions');
    } catch (error) {
      console.error('Error checking expired sessions:', error);
    }
  }, 10000);
});