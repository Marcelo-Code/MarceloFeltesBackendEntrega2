//inicializa el socket
const socket = io();

// Función para validar el formulario
const validateForm = (formData) => {
  const errors = [];

  if (formData.name.length < 3) {
    errors.push("El nombre debe tener al menos 3 caracteres");
  }

  if (formData.description.trim() === "") {
    errors.push("La descripción es requerida");
  }

  if (formData.stock < 0) {
    errors.push("El stock no puede ser negativo");
  }

  if (formData.price <= 0) {
    errors.push("El precio debe ser mayor a 0");
  }

  return errors;
};

// Función para crear un nuevo producto
const createProduct = (formData) => {
  // Validar el formulario
  const errors = validateForm(formData);

  if (errors.length > 0) {
    errorMessage(errors.join(". "), "error");
    return false;
  }

  // Mostrar mensaje de éxito
  successMessage("Producto creado correctamente");

  socket.emit("newProduct", formData);

  return true;
};

//Función para eliminar un producto
const deleteProduct = (index) => {
  confirmMessage("¿Estás seguro de eliminar el producto?", () =>
    socket.emit("deleteProduct", index)
  );
};

//Escucha el evento deletedProduct, de confirmación de eliminación de producto
socket.on("deletedProduct", (data) => {
  const { products, deletedProduct } = data;
  successMessage(`Producto eliminado ${deletedProduct.name}`);
  renderProductList(products);
});

//Escucha el evento createdProduct, de confirmación de creación de producto
socket.on("createdProduct", (products) => {
  successMessage("Nuevo producto agregado");
  renderProductList(products);
});

// Escuchar el evento submit del formulario
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Crear objeto con los datos del formulario
  const formData = {
    name: this.name.value.trim(),
    description: this.description.value.trim(),
    stock: parseInt(this.stock.value),
    price: parseFloat(this.price.value),
  };

  // Intentar crear el producto
  if (createProduct(formData)) {
    // Limpiar el formulario solo si el producto se creó exitosamente
    this.reset();
  }
});

//Función para renderizar la lista de productos
const renderProductList = (products) => {
  const productList = document.getElementById("productList");

  if (products.length === 0) {
    productList.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }
  const productHTML = products
    .map(
      (product, index) => `
      <div class="product-card">
          <div class="product-info">
              <h3>${product.name}</h3>
              <p class="description">${product.description}</p>
              <div class="product-details">
                  <span class="stock">Stock: ${product.stock}</span>
                  <span class="price">$${product.price}</span>
                  <span><button class="delete-button" onclick="deleteProduct(${index})">Eliminar</button></span>
              </div>
          </div>
      </div>
  `
    )
    .join("");

  productList.innerHTML = productHTML;
};

//Función para mostrar el formulario de creación de producto
const showCreateProduct = () => {
  document.getElementById("createProductView").style.display = "block";
  document.getElementById("productListView").style.display = "none";
  document
    .querySelectorAll(".nav-button")
    .forEach((btn) => btn.classList.remove("active"));
  document.querySelector(".nav-button:first-child").classList.add("active");
};

//Función para mostrar la lista de productos
const showProductList = () => {
  document.getElementById("createProductView").style.display = "none";
  document.getElementById("productListView").style.display = "block";
  document
    .querySelectorAll(".nav-button")
    .forEach((btn) => btn.classList.remove("active"));
  document.querySelector(".nav-button:last-child").classList.add("active");

  socket.emit("newUser", socket.id);
  socket.on("products", (products) => {
    renderProductList(products);
  });
};
document.addEventListener("DOMContentLoaded", function () {
  showCreateProduct();
});
