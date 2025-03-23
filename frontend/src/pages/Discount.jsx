import Header  from '../components/Header';
import DiscountList from '../components/DiscountList';
import Sidebar from '../components/Sidebar';
const Discount = () => {
    return (
        <div className="app col-12">
            <Sidebar />
            <div className="main_content col-10">
                <Header />
                <DiscountList />
            </div>
        </div>
    );
}
export default Discount;