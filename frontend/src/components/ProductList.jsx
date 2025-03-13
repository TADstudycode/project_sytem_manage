import { useState, useEffect } from "react";
import axios from "axios";
import '../styles/ProductList.css';
import '../styles/Overlay.css';
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    product_code: "",
    import_price: "",
    sale_price: "",
    image: "",
    description: "",
    brand: "",
    quantity: ""
  });

  useEffect(() => {
    fetchProducts("http://127.0.0.1:8000/api/product/get?page=1");
  }, []);

  const fetchProducts = (url) => {
    axios.post(url, { action: "get" }).then((response) => {
      setProducts(response.data.data.data);
      setPagination({
        prev_page: response.data.data.prev_page_url,
        next_page: response.data.data.next_page_url,
      });
    });
  };
  const handleEditClick = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      product_code: product.product_code,
      import_price: product.import_price,
      sale_price: product.sale_price,
      image: product.image,
      description: product.description,
      brand: product.brand,
      quantity: product.quantity
    });
    setShowEditModal(true);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSaveEdit = () => {
    axios
      .post("http://127.0.0.1:8000/api/product/edit", { id: editProduct.id, ...formData, action:"edit" })
      .then((response) => {
        alert("Cập nhật thành công!");
        setShowEditModal(false);
        fetchProducts("http://127.0.0.1:8000/api/product/get?page=1");
      })
      .catch((error) => alert("Lỗi khi cập nhật!"));
  };
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      axios
        .post("http://127.0.0.1:8000/api/product/delete", { id , action:"delete"})
        .then((response) => {
          alert("Xóa thành công!");
          fetchProducts("http://127.0.0.1:8000/api/product/get?page=1");
        })
        .catch((error) => alert("Lỗi khi xóa!"));
    }
  };
  const handleCreateClick = () => {
    setFormData({ name:"", 
                  category:"", 
                  product_code:"", 
                  import_price:"", 
                  sale_price:"", 
                  image:"",
                  description:"", 
                  brand:"",
                  quantity:"" 
    });
    setShowCreateModal(true);
  };

  const handleSaveCreate = () =>{
    axios
        .post("http://127.0.0.1:8000/api/product/add", {...formData, action:"add"})
        .then((response)=>{
          alert("Thêm sản phẩm thành công!");
          setShowEditModal(false);
          fetchProducts("http://127.0.0.1:8000/api/product/get?page=1");
        })
        .catch((error)=>alert("Lỗi khi thêm sản phẩm!"));
  };

  return (
    <div className="container">
      <div className="add_button_wrap row p-3">
        <button className="btn btn-primary" onClick={handleCreateClick}>Add Product</button>
      </div>
      <div className="row p-3">
        {products.map((product) => (
          <div key={product.id} className="col-md-3 mb-3">
            <div className="card shadow-sm">
            <img
                src={product.image ? (product.image.startsWith("http") ? product.image : `http://127.0.0.1:8000${product.image}`) : "/default-image.jpg"}
                className="card-img-top"
                alt={product.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title text-center">{product.name}</h5>
                <p className="card-text">
                  <strong>Loại:</strong> {product.category}<br />
                  <strong>Số lượng:</strong> {product.quantity} <br />
                  <strong>Giá nhập:</strong> {product.import_price} VND <br />
                  <strong>Giá bán:</strong> {product.sale_price} VND

                </p>
              </div>
              <div className="d-flex justify-content-between gap-2">
                  <button className="btn btn-warning w-50" onClick={() => handleEditClick(product)}>
                    Sửa
                  </button>
                  <button className="btn btn-danger w-50" onClick={() => handleDelete(product.id)}>
                    Xóa
                  </button>
                </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center my-4">
        {pagination.prev_page && (
          <button className="btn btn-secondary mx-2" onClick={() => fetchProducts(pagination.prev_page)}>
            Trang trước
          </button>
        )}
        {pagination.next_page && (
          <button className="btn btn-secondary mx-2" onClick={() => fetchProducts(pagination.next_page)}>
            Trang sau
          </button>
        )}
      </div>
      {(showEditModal || showCreateModal) && <div className="overlay"></div>}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa sản phẩm</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên sản phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Loại sản phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mã sản phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="product_code"
                    value={formData.product_code}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Hình ảnh</label>
                  <input
                    type="text"
                    className="form-control"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Giá nhập</label>
                  <input
                    type="number"
                    className="form-control"
                    name="import_price"
                    value={formData.import_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Giá bán</label>
                  <input
                    type="number"
                    className="form-control"
                    name="sale_price"
                    value={formData.sale_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Thương hiệu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số lượng</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm sản phẩm mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên sản phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Loại sản phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mã sản phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="product_code"
                    value={formData.product_code}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Hình ảnh</label>
                  <input
                    type="text"
                    className="form-control"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Giá nhập</label>
                  <input
                    type="number"
                    className="form-control"
                    name="import_price"
                    value={formData.import_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Giá bán</label>
                  <input
                    type="number"
                    className="form-control"
                    name="sale_price"
                    value={formData.sale_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Thương hiệu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số lượng</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveCreate}>
                  Thêm sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
