import React, { useState, useEffect } from "react";
import api from "../api";
const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [productToUpdate, setProductToUpdate] = useState(null);

    const handleShowConfirmModal = (product) => {
        setProductToUpdate(product);
        setShowConfirmModal(true);
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.post("http://127.0.0.1:8000/api/order/get");
            if (response.data && response.data.data) {
                const groupedOrders = response.data.data.reduce((acc, order) => {
                    if (!acc[order.order_number]) {
                        acc[order.order_number] = {
                            order_number: order.order_number,
                            customer_name: order.customer_name,
                            customer_phone: order.customer_phone,
                            customer_email: order.customer_email,
                            customer_address: order.customer_address,
                            order_status: order.order_status,
                            total_price: 0,
                            products: [],
                        };
                    }
                    acc[order.order_number].products.push(order);
                    acc[order.order_number].total_price += parseFloat(order.total_price);
                    return acc;
                }, {});
                setOrders(Object.values(groupedOrders));
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            setOrders([]);
        }
    };

    const handleConfirmUpdate = async () => {
        try {
            const updatedProduct = {
                ...productToUpdate,
                quantity: parseInt(productToUpdate.quantity),
            };
            const response = await api.post("http://127.0.0.1:8000/api/order/update", {
                order_number: selectedOrder.order_number,
                product_id: updatedProduct.product_id,
                quantity: updatedProduct.quantity,
            });
            setAlertMessage(response.data.message);
            setShowAlertModal(true);
            fetchOrders();
            setSelectedOrder(null);
        } catch (error) {
            setAlertMessage(error.response?.data?.message || "Đã xảy ra lỗi!");
            setShowAlertModal(true);
        } finally {
            setShowConfirmModal(false);
        }
    };
    const handleUpdateProduct = (product) => {
        const newQuantity = prompt("Nhập số lượng mới:", product.quantity);
        if (newQuantity) {
            handleShowConfirmModal({ ...product, quantity: newQuantity });
        }
    };

    const handleUpdateOrderStatus = async () => {
        try {
            const response = await api.post("http://127.0.0.1:8000/api/order/update", {
                order_number: selectedOrder.order_number,
                order_status: selectedOrder.order_status,
                customer_name: selectedOrder.customer_name,
                customer_phone: selectedOrder.customer_phone,
                customer_email: selectedOrder.customer_email,
                customer_address: selectedOrder.customer_address,

            });
            setAlertMessage(response.data.message);
            setShowAlertModal(true);
            fetchOrders();
            setSelectedOrder(null);
        } catch (error) {
            setAlertMessage(error.response?.data?.message || "Đã xảy ra lỗi!");
            setShowAlertModal(true);
        }
    };

    const filteredOrders = orders.filter((order) => {
        return (
            order.order_number.includes(search) &&
            (filterStatus === "" || order.order_status === filterStatus)
        );
    });

    const deleteOrder = async (orderNumber) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${orderNumber}?`)) {
            try {
                const response = await api.post("http://127.0.0.1:8000/api/order/delete", {
                    order_number: orderNumber
                });
                setAlertMessage(response.data.message);
                setShowAlertModal(true);
                fetchOrders();
            } catch (error) {
                setAlertMessage(error.response?.data?.message || "Đã xảy ra lỗi khi xóa đơn hàng!");
                setShowAlertModal(true);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Quản lý đơn hàng</h2>

            {/* Tìm kiếm và lọc */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo mã đơn hàng"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <select
                        className="form-control"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Danh sách đơn hàng */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th>Tên khách hàng</th>
                        <th>Trạng thái</th>
                        <th>Tổng giá trị</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.order_number}>
                            <td>{order.order_number}</td>
                            <td>{order.customer_name}</td>
                            <td>{order.order_status}</td>
                            <td>{order.total_price.toFixed(2)} VND</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    Xem chi tiết
                                </button>
                                <button
                                    className="btn btn-danger btn-sm ms-2"
                                    onClick={() => deleteOrder(order.order_number)}
                                >
                                    Xoá
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal cập nhật đơn hàng */}
            {selectedOrder && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết đơn hàng: {selectedOrder.order_number}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedOrder(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label><strong>Tên khách hàng:</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedOrder.customer_name}
                                        onChange={(e) =>
                                            setSelectedOrder({
                                                ...selectedOrder,
                                                customer_name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label><strong>Số điện thoại:</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedOrder.customer_phone}
                                        onChange={(e) =>
                                            setSelectedOrder({
                                                ...selectedOrder,
                                                customer_phone: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label><strong>Email:</strong></label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={selectedOrder.customer_email}
                                        onChange={(e) =>
                                            setSelectedOrder({
                                                ...selectedOrder,
                                                customer_email: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label><strong>Địa chỉ:</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedOrder.customer_address}
                                        onChange={(e) =>
                                            setSelectedOrder({
                                                ...selectedOrder,
                                                customer_address: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label><strong>Trạng thái:</strong></label>
                                    <select
                                        className="form-control"
                                        value={selectedOrder.order_status}
                                        onChange={(e) =>
                                            setSelectedOrder({
                                                ...selectedOrder,
                                                order_status: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Tên sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Giá bán</th>
                                            <th>VAT</th>
                                            <th>Tổng giá trị</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.products.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.product_name}</td>
                                                <td>{product.quantity}</td>
                                                <td>{product.sale_price} VND</td>
                                                <td>{product.VAT} VND</td>
                                                <td>{product.total_price} VND</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleUpdateProduct(product)}
                                                    >
                                                        Cập nhật
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => handleUpdateOrderStatus()}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận cập nhật</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowConfirmModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    Bạn có chắc chắn muốn cập nhật số lượng sản phẩm{" "}
                                    <strong>{productToUpdate?.product_name}</strong> thành{" "}
                                    <strong>{productToUpdate?.quantity}</strong> không?
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleConfirmUpdate}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAlertModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thông báo</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAlertModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>{alertMessage}</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setShowAlertModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;