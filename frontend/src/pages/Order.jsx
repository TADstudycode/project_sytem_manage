import Header  from '../components/Header';
import OrderList from '../components/OrderList';
import Sidebar from '../components/Sidebar';
const Order = () => {
    return (
        <div className="app col-12">
            <Sidebar />
            <div className="main_content col-10">
                <Header />
                <OrderList />
            </div>
        </div>
    );
}
export default Order;