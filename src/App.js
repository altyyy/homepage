import logo from './logo.svg';
import './App.css';
import{Routes,Route} from "react-router-dom"
import { Submit } from './components/pages/Submit';
import { Result } from './components/pages/Result';
function App() {
  return (
    <>
     <Routes>
     <Route path="/" element={<Submit/>}></Route>
     <Route path="/result" element={<Result/>}></Route>
     </Routes>
    </>
  );
}

export default App;
