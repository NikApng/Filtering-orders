import {Routes, Route, Navigate} from "react-router-dom";
import {TokenPage} from "@/pages/TokenPage";
import {OrderPage} from "@/pages/OrderPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<TokenPage/>}/>
            <Route path="/order" element={<OrderPage/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
}

export default App;
