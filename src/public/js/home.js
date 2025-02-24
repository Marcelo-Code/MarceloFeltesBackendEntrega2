//inicializa el socket
const socket = io();

const deleteProduct = (index) => {
  confirmMessage("¿Estás seguro de eliminar el producto?", () =>
    socket.emit("deleteProduct", index)
  );
};

socket.on("deletedProduct", (data) => {
  const { products, deletedProduct } = data;
  successMessage(`Producto eliminado ${deletedProduct.name}`);
  renderProductList(products);
});

socket.on("createdProduct", (products) => {
  successMessage("Nuevo producto agregado");
  renderProductList(products);
});

// Escuchar el evento submit del formulario

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

const showProductList = () => {
  document.getElementById("productListView").style.display = "block";
  socket.emit("newUser", socket.id);
  socket.on("products", (products) => {
    renderProductList(products);
  });
};
