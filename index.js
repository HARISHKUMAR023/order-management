// // Wait for the DOM to load

// document.addEventListener('DOMContentLoaded', function () {
//     // Get a reference to the contact form
//     var contactForm = document.getElementById('uploadForm');
  
//     // Add a submit event listener to the form
//     contactForm.addEventListener('submit', function (event) {
//       event.preventDefault(); // Prevent form submission
  
//       // Get the input values
//       const name = document.getElementById('name').value;
//       console.log(name)
//       const price = parseFloat(document.getElementById('price').value);
//       console.log(price)
//       const category = document.getElementById('category').value;
  
//       // Create an object with the form data
//       var formData = {
//         name: name,
//         price: price,
//         category:category
//       };
  
//       // Save the form data to Firebase
//       var database = firebase.database();
//       var dataRef = database.ref('products'); // Replace with your desired database path
  
//       dataRef.push(formData)
//         .then(function () {
//           console.log('Form data stored in Firebase successfully!');
//           alert("The form Data is sotred in Firebase successfully!")
//           // Optionally, you can reset the form after submitting
//           contactForm.reset();
//         })
//         .catch(function (error) {
//           console.error('Error storing form data in Firebase:', error);
//         });
//     });
//   });
document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the contact form
    var contactForm = document.getElementById('uploadForm');

    // Add a submit event listener to the form
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent form submission

      // Get the input values
      const name = document.getElementById('name').value;
      const price = parseFloat(document.getElementById('price').value);
      const category = document.getElementById('category').value;

      // Save the form data to Firestore
      db.collection('products').add({
        name: name,
        price: price,
        category: category
      })
      .then(function (docRef) {
        console.log('Document written with ID:', docRef.id);
        alert("Product uploaded successfully!");
        // Optionally, you can reset the form after submitting
        contactForm.reset();
      })
      .catch(function (error) {
        console.error('Error uploading product:', error);
        alert('Failed to upload product.');
      });
    });
  });