import React, { useState, useEffect } from "react";
import api from "../api";
const API_BASE_URL = "http://127.0.0.1:8000/api/discount";
const fetchDiscountsAPI = async () => {
    try {
        const response = await api.post(`${API_BASE_URL}/get`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách mã giảm giá:", error);
        throw error;
    }
};
const createDiscountAPI = async (discount) => {
    try {
        const response = await api.post(`${API_BASE_URL}/create`, discount);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm mã giảm giá:", error);
        throw error;
    }
};
const updateDiscountAPI = async (discount) => {
    try {
        const response = await api.post(`${API_BASE_URL}/update`, discount);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi sửa mã giảm giá:", error);
        throw error;
    }
};
const deleteDiscountAPI = async (id) => {
    try {
        const response = await api.post(`${API_BASE_URL}/delete`, { id });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa mã giảm giá:", error);
        throw error;
    }
};
const DiscountList = () => {
    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [discountToDelete, setDiscountToDelete] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlertModal, setShowAlertModal] = useState(false);
    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        try {
            const data = await fetchDiscountsAPI();
            setDiscounts(data);
        } catch (error) {
            setAlertMessage("Lỗi khi lấy danh sách mã giảm giá!");
            setShowAlertModal(true);
        }
    };

    const handleSaveDiscount = async () => {
        try {
            if (selectedDiscount?.id) {
                await updateDiscountAPI(selectedDiscount);
            } else {
                await createDiscountAPI(selectedDiscount);
            }
            fetchDiscounts();
            setShowAddEditModal(false);
        } catch (error) {
            setAlertMessage("Lỗi khi lưu mã giảm giá!");
            setShowAlertModal(true);
        }
    };

    const handleDeleteDiscount = async () => {
        try {
            await deleteDiscountAPI(discountToDelete.id);
            fetchDiscounts();
            setShowDeleteConfirmModal(false);
        } catch (error) {
            setAlertMessage("Lỗi khi xóa mã giảm giá!");
            setShowAlertModal(true);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Quản lý mã giảm giá</h2>
            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setSelectedDiscount(null);
                    setShowAddEditModal(true);
                }}
            >
                Thêm mã giảm giá
            </button>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Tên mã giảm giá</th>
                        <th>Giảm giá</th>
                        <th>Trạng thái</th>
                        <th>Loại giảm giá</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {discounts.map((discount) => (
                        <tr key={discount.id}>
                            <td>{discount.name}</td>
                            <td>
                                {discount.type === "percentage"
                                    ? `${discount.value*100}%`
                                    : `${discount.value} VND`}
                            </td>
                            <td>{discount.status === "active" ? "Hoạt động" : "Không hoạt động"}</td>
                            <td>{discount.type === "fixed" ? "Cố định" : "Phần trăm"}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => {
                                        setSelectedDiscount(discount);
                                        setShowAddEditModal(true);
                                    }}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="btn btn-danger btn-sm ms-2"
                                    onClick={() => {
                                        setDiscountToDelete(discount);
                                        setShowDeleteConfirmModal(true);
                                    }}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Thêm/Sửa */}
            {showAddEditModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedDiscount ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAddEditModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label>Tên mã giảm giá</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedDiscount?.name || ""}
                                        onChange={(e) =>
                                            setSelectedDiscount({
                                                ...selectedDiscount,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>% Giảm giá</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={selectedDiscount?.value || ""}
                                        onChange={(e) =>
                                            setSelectedDiscount({
                                                ...selectedDiscount,
                                                value: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Trạng thái</label>
                                    <select
                                        className="form-control"
                                        value={selectedDiscount?.status || "active"}
                                        onChange={(e) =>
                                            setSelectedDiscount({
                                                ...selectedDiscount,
                                                status: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="inactive">Không hoạt động</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label>Loại giảm giá</label>
                                    <select
                                        className="form-control"
                                        value={selectedDiscount?.type || ""}
                                        onChange={(e) =>
                                            setSelectedDiscount({
                                                ...selectedDiscount,
                                                type: e.target.value,
                                            })
                                        }
                                    >
                                        <option value=""></option>
                                        <option value="percentage">Phần trăm</option>
                                        <option value="fixed">Cố định</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAddEditModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveDiscount}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xác Nhận Xóa */}
            {showDeleteConfirmModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận xóa</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDeleteConfirmModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    Bạn có chắc chắn muốn xóa mã giảm giá{" "}
                                    <strong>{discountToDelete?.name}</strong> không?
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteConfirmModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDeleteDiscount}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Thông Báo */}
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

export default DiscountList;