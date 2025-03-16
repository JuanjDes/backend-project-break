// lógica para manejar las solicitudes CRUD de los productos. Devolverá las respuestas en formato HTML.

const Product = require('../models/Product');

// HTML base
const baseHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tienda de Ropa</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
`;

const getNavBar = (isDashboard = false) => `
  <nav>
    <a href="/products">Productos</a>
    <a href="/products/camisetas">Camisetas</a>
    <a href="/products/pantalones">Pantalones</a>
    <a href="/products/zapatos">Zapatos</a>
    <a href="/products/accesorios">Accesorios</a>
    <a href="/dashboard">Login</a>
    ${isDashboard ? '<a href="/dashboard/new">Nuevo Producto</a>' : ''}
  </nav>
`;

const getProductCards = (products, isDashboard = false) => {
  let html = '<div class="product-list">';
  for (let product of products) {
    html += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>${product.price}€</p>
        <a href="/products/${product._id}">Ver detalle</a>
        ${isDashboard ? `<a href="/dashboard/${product._id}/edit">Editar</a>` : ''}
        <br><br>
        ${isDashboard ? `<form action="/dashboard/${product._id}/delete" method="POST"><button type="submit">Eliminar</button></form>` : ''}
      </div>
    `;
  }
  html += '</div>';
  return html;
};

// Función para mostrar todos los productos
const showProducts = async (req, res) => {
  const products = await Product.find();
  const isDashboard = req.path === '/dashboard';
  const productCards = getProductCards(products, isDashboard);
  const html = `${baseHtml}${getNavBar(isDashboard)}
    <div class = "tituloProducto">Productos</div>
    ${productCards}</body></html>`;
  res.send(html);
};


// Función para mostrar solo camisetas
const showCamisetas = async (req, res) => {
  const camisetas = await Product.find({ category: 'Camisetas' });
  const productCards = getProductCards(camisetas, false); // No es dashboard, así que false
  const html = `
    ${baseHtml}
    ${getNavBar()}
    <div class = "tituloProducto">Camisetas</div>
    ${productCards}
    </body></html>
  `;
  res.send(html);
};


// Función para mostrar solo pantalones
const showPantalones = async (req, res) => {
  const pantalones = await Product.find({ category: 'Pantalones' });
  const productCards = getProductCards(pantalones, false); // No es dashboard, así que false
  const html = `
    ${baseHtml}
    ${getNavBar()}
    <div class = "tituloProducto">Pantalones</div>
    ${productCards}
    </body></html>
  `;
  res.send(html);
};


// Función para mostrar solo zapatos
const showZapatos = async (req, res) => {
  const zapatos = await Product.find({ category: 'Zapatos' });
  const productCards = getProductCards(zapatos, false); // No es dashboard, así que false
  const html = `
    ${baseHtml}
    ${getNavBar()}
    <div class = "tituloProducto">Zapatos</div>
    ${productCards}
    </body></html>
  `;
  res.send(html);
};


// Función para mostrar solo accesorios
const showAccesorios = async (req, res) => {
  const accesorios = await Product.find({ category: 'Accesorios' });
  const productCards = getProductCards(accesorios, false); // No es dashboard, así que false
  const html = `
    ${baseHtml}
    ${getNavBar()}
    <div class = "tituloProducto">Accesorios</div>
    ${productCards}
    </body></html>
  `;
  res.send(html);
};


// Función para mostrar productos por ID
const showProductById = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.send('Producto no encontrado');
  const html = `
    ${baseHtml}
    ${getNavBar()}
    <br><br>
    <div class = "product-list">
      <div class = "product-card">
        <h1>${product.name}</h1>
        <img src="${product.image}" alt="${product.name}">
        <p>${product.description}</p>
        <p>Categoría: ${product.category}</p>
        <p>Talla: ${product.size}</p>
        <p>Precio: ${product.price}€</p>
      </div>
    </div>
    </body></html>
  `;
  res.send(html);
};


// Formulario para crear un nuevo producto
const showNewProduct = (req, res) => {
  const html = `
    ${baseHtml}
    ${getNavBar(true)}
    <div class = "tituloProducto">Nuevo Producto</div>
    <div class = "new-product">
      <form action="/dashboard" method="POST">
        <label>Nombre</label>
        <input type="text" name="name" required><br>
        <label>Descripción</label>
        <textarea name="description" required></textarea><br>
        <label>Imagen (URL)</label>
        <input type="text" name="image" required><br>
        
        <label>Categoría</label>
        <select name="category" required>
          <option value="Camisetas">Camisetas</option>
          <option value="Pantalones">Pantalones</option>
          <option value="Zapatos">Zapatos</option>
          <option value="Accesorios">Accesorios</option>
        </select>
        <br>
        <label>Talla</label>
        <select name="size" required>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
        <br>
        <label>Precio</label>
        <input type="number" name="price" step="0.01" required>
        <br><hr style = "color: white; width: 50%;">
        <button type="submit">Crear</button>
      </form>
    </div>
    </body></html>
  `;
  res.send(html);
};


// Función que crea el producto nuevo
const createProduct = async (req, res) => {
  const { name, description, image, category, size, price } = req.body;
  const product = new Product({ name, description, image, category, size, price });
  await product.save();
  res.redirect('/dashboard');
};


// Formulario para editar un producto
const showEditProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.send('Producto no encontrado');
  const html = `
    ${baseHtml}
    ${getNavBar(true)}
    <h1>Editar Producto</h1>
    <form action="/dashboard/${product._id}" method="POST">
      <label>Nombre: <input type="text" name="name" value="${product.name}" required></label><br>
      <label>Descripción: <textarea name="description" required>${product.description}</textarea></label><br>
      <label>Imagen (URL): <input type="text" name="image" value="${product.image}" required></label><br>
      <label>Categoría: 
        <select name="category" required>
          <option value="Camisetas" ${product.category === 'Camisetas' ? 'selected' : ''}>Camisetas</option>
          <option value="Pantalones" ${product.category === 'Pantalones' ? 'selected' : ''}>Pantalones</option>
          <option value="Zapatos" ${product.category === 'Zapatos' ? 'selected' : ''}>Zapatos</option>
          <option value="Accesorios" ${product.category === 'Accesorios' ? 'selected' : ''}>Accesorios</option>
        </select>
      </label><br>
      <label>Talla: 
        <select name="size" required>
          <option value="XS" ${product.size === 'XS' ? 'selected' : ''}>XS</option>
          <option value="S" ${product.size === 'S' ? 'selected' : ''}>S</option>
          <option value="M" ${product.size === 'M' ? 'selected' : ''}>M</option>
          <option value="L" ${product.size === 'L' ? 'selected' : ''}>L</option>
          <option value="XL" ${product.size === 'XL' ? 'selected' : ''}>XL</option>
        </select>
      </label><br>
      <label>Precio: <input type="number" name="price" step="0.01" value="${product.price}" required></label><br>
      <button type="submit">Actualizar</button>
    </form>
    </body></html>
  `;
  res.send(html);
};


// Función que actualiza el producto editado
const updateProduct = async (req, res) => {
  const { name, description, image, category, size, price } = req.body;
  await Product.findByIdAndUpdate(req.params.productId, { name, description, image, category, size, price });
  res.redirect('/dashboard');
};


// Función para borrar un producto
const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.productId);
  res.redirect('/dashboard');
};


// Exportamos todos los modulos o funciones
module.exports = {
  showProducts,
  showProductById,
  showNewProduct,
  createProduct,
  showEditProduct,
  updateProduct,
  deleteProduct,
  showCamisetas,
  showPantalones,
  showZapatos,
  showAccesorios,
};