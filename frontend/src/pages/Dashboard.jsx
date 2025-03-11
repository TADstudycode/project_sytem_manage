import Header  from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';
const Dashboard = () => {
    return(
        <div className="app col-12">
                <Sidebar />
            <div className="main_content col-10">
                <Header />
            </div>
        </div>
    )
};
export default Dashboard;