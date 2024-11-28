// DISPLAY THE DATA OF THE USER
async function loadData() {

  const token = localStorage.getItem('token');

  if (!token) {

    console.log(`No token found. Redirecting to login page...`);
    return;

  }

  try {

    const response = await fetch(`https://iac-admin-api.onrender.com/admin/details`, {

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

