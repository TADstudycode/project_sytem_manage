// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// import {useEffect, useState} from "react";
// import axios from "axios";

// function App(){
//   const [data, setData] = useState(null);

//   useEffect(() =>{
//     axios.get("http://127.0.0.1:8000/index.php")
//     .then(response => setData(response.data))
//     .catch(error => console.error("lỗi khi gọi API", error));
//   }, []);

//   return (
//     <div>
//       <h1>Quản lí thiết bị và linh kiện máy tính</h1>
//       <p>{data ? data.message: "đang tải dữ liệu..."}</p>
//     </div>
//   );
// }

// export default App;
import AppRoutes from "./routes";

function App() {
  return <AppRoutes />;
}

export default App;