
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

async function editStudent(Student_ID) {
  
  const token = localStorage.getItem('token');

  if(!token){

    console.log(`No token found. Redirecting to login page...`);
    return;

  }

  try{

    const response = await fetch(`http://127.0.0.1:4000/list/students/${Student_ID}`, {

      method: 'GET',
      headers: {

        'Authorization' : token

      }

    });

    const data = await response.json();

    if(response.ok && data){

      document.querySelector(`#editFirstName`).value = data.first_name;
      document.querySelector(`#editLastName`).value = data.last_name;
      document.querySelector(`#editYearLevel`).value = data.year_level;
      document.querySelector(`#editCourse`).value = data.course;
      document.querySelector(`#editPassword`).value = '';
      // Add placeholder to indicate password behavior
      document.querySelector(`#editPassword`).placeholder = 'Enter new password (leave blank to keep current)';
      

      document.querySelector(`#editStudentId`).value = data.Student_ID;


      const editModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
      editModal.show();
      
    }

  }catch(error){

    console.log(error);

  }

  const edit_information = document.querySelector(`#editbutton`);

  if(edit_information){

    edit_information.onclick = async (e) => {

      e.preventDefault();
      const newPassword = document.querySelector(`#editPassword`).value;
            

      const newData = {

        first_name: document.querySelector(`#editFirstName`).value,
        last_name: document.querySelector(`#editLastName`).value,
        year_level: document.querySelector(`#editYearLevel`).value,
        course: document.querySelector(`#editCourse`).value,
        Student_ID: document.querySelector(`#editStudentId`).value

      };

      if (newPassword.trim()) {
        newData.password = newPassword;
    }

      try{

        const updateResponse = await fetch(`http://127.0.0.1:4000/update/student/`, {

          method: 'PUT',
          headers: {

            'Authorization': token,
            'Content-Type': 'application/json',

          },
          body: JSON.stringify(newData)

        });

        const result = await updateResponse.json();

        if(updateResponse.ok && result){

            alert(`Successfully Updated`);
            location.reload();

          }else{

            console.log(result.error);
            alert(`Error updating user: ${result.error}`);

          }

      }catch(error){

        console.log(error);

      }

    }

  }

}

async function deleteStudent(Student_ID) {
  // Set the student ID in the hidden input
  document.getElementById('deleteStudentId').value = Student_ID;

  // Show the delete confirmation modal
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteStudentModal'));
  deleteModal.show();

}

// TO DELETE A USER
async function confirmDeleteStudent(){

  const Student_ID = document.getElementById('deleteStudentId').value;
  
  const token = localStorage.getItem("token");

  try {
      const response = await fetch(`http://127.0.0.1:4000/delete/student/${Student_ID}`, {
          method: 'DELETE',
          headers: {
              'Authorization': token
          }
      });

      if (response.ok) {
          alert(`User deleted successfully`);
          location.reload();
      } else {
          const errorData = await response.json();
          alert(`Error Data: ${JSON.stringify(errorData)}`);
      }

  } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
  }
  
}
