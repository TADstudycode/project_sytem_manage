import Header  from '../components/Header';
import MemberList from '../components/MemberList';
import Sidebar from '../components/Sidebar';
const Member = () => {
    return (
        <div className="app col-12">
            <Sidebar />
            <div className="main_content col-10">
                <Header />
                <MemberList />
            </div>
        </div>
    );
}
export default Member;