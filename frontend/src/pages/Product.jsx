import Header  from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProductList from "../components/ProductList";
const Product = () => {
    return(
        <div className="app col-12">
            <Sidebar />
            <div className="main_content col-10">
                <Header />
                <ProductList/>
            </div>
        </div>
    );
};
export default Product;