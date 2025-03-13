import { useState, useEffect } from "react";
import axios from "axios";
import '../styles/MemberList.css';
import '../styles/Overlay.css';
const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [editMember, setEditMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    description: ""
  });

  useEffect(() => {
    fetchMembers("http://127.0.0.1:8000/api/member/get?page=1");
  }, []);

  const fetchMembers = (url) => {
    axios.post(url, { action: "get" }).then((response) => {
      setMembers(response.data.data.data);
      setPagination({
        prev_page: response.data.data.prev_page_url,
        next_page: response.data.data.next_page_url,
      });
    });
  };

  const handleEditClick = (member) => {
    setEditMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      image: member.image,
      address: member.address,
      role: member.role,
      description: member.description
    });
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    if(name === "image"){
        const fileName = value.split('\\').pop().split('/').pop();
        setFormData({ ...formData, [name]: `/images/members/${fileName}` });
    }else{
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSaveEdit = () => {
    axios
      .post("http://127.0.0.1:8000/api/member/edit", { id: editMember.id, ...formData, action: "edit" })
      .then((response) => {
        alert("Cập nhật thành công!");
        setShowEditModal(false);
        fetchMembers("http://127.0.0.1:8000/api/member/get?page=1");
      })
      .catch((error) => alert("Lỗi khi cập nhật!"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) {
      axios
        .post("http://127.0.0.1:8000/api/member/delete", { id, action: "delete" })
        .then((response) => {
          alert("Xóa thành công!");
          fetchMembers("http://127.0.0.1:8000/api/member/get?page=1");
        })
        .catch((error) => alert("Lỗi khi xóa!"));
    }
  };

  const handleCreateClick = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      role: "",
      description: ""
    });
    setShowCreateModal(true);
  };

  const handleSaveCreate = () => {
    axios
      .post("http://127.0.0.1:8000/api/member/add", { ...formData, action: "add" })
      .then((response) => {
        alert("Thêm thành viên thành công!");
        setShowCreateModal(false);
        fetchMembers("http://127.0.0.1:8000/api/member/get?page=1");
      })
      .catch((error) => alert("Lỗi khi thêm thành viên!"));
  };

  return (
    <div className="container">
        <div className="add_button_wrap row p-3">
            <button className="btn btn-primary" onClick={handleCreateClick}>Add Member</button>
        </div>
      <div className="row p-3">
        {members.map((member) => (
          <div key={member.id} className="col-md-3 mb-3">
            <div className="card card_member shadow-sm">
                <img
                    src={member.image.startsWith("http") ? member.image : `http://127.0.0.1:8000${member.image}`}
                    className="card-img-top"
                    alt={member.name}
                    style={{ height: "280px", objectFit: "cover" }}
                />
              <div className="card-body">
                <h5 className="card-title text-center">{member.name}</h5>
                <p className="card-text">
                  <strong>Email:</strong> {member.email} <br />
                  <strong>Phone:</strong> {member.phone} <br />
                  <strong>Address:</strong> {member.address} <br />
                  <strong>Role:</strong> {member.role} <br />
                  <strong>Description:</strong> {member.description}
                </p>
              </div>
              <div className="d-flex justify-content-between gap-2">
                <button className="btn btn-warning w-50" onClick={() => handleEditClick(member)}>
                  Sửa
                </button>
                <button className="btn btn-danger w-50" onClick={() => handleDelete(member.id)}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center mt-4">
        {pagination.prev_page && (
          <button className="btn btn-secondary mx-2" onClick={() => fetchMembers(pagination.prev_page)}>
            Trang trước
          </button>
        )}
        {pagination.next_page && (
          <button className="btn btn-secondary mx-2" onClick={() => fetchMembers(pagination.next_page)}>
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
                <h5 className="modal-title">Chỉnh sửa thành viên</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên thành viên</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
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
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={formData.description}
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
                <h5 className="modal-title">Thêm thành viên mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên thành viên</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
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
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveCreate}>
                  Thêm thành viên
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;