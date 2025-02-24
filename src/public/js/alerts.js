const successMessage = (message) => {
  Swal.fire({
    title: `${message}`,
    icon: "success",
    showConfirmButton: false,
    timer: 1000,
  });
};

const errorMessage = (message) => {
  Swal.fire({
    title: `${message}`,
    icon: "error",
    showConfirmButton: false,
    timer: 1000,
  });
};

const confirmMessage = (message, callbackFunction) => {
  Swal.fire({
    text: `${message}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      callbackFunction();
    }
  });
};
