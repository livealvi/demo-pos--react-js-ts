import React, { createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import NotFound from "./components/NotFound/NotFound";
import WithNav from "./components/WithNav/WithNav";
import WithoutNav from "./components/WithoutNav/WithoutNav";
import About from "./components/About/About";
import Navbar from "./components/Navbar/Navbar";
import AddStock from "./components/Stock/AddStock";
import AllStock from "./components/Stock/AllStock";
import OutOfStock from "./components/Stock/OutOfStock";
import Sale from "./components/Sale/Sale";
import Setting from "./components/Setting/Setting";
import AllUsers from "./components/User/AllUsers";
import AddUser from "./components/User/AddUser";
import AllCategory from "./components/Category/AllCategory";
import AddCategory from "./components/Category/AddCategory";
import AllOrder from "./components/Order/AllOrder";
import AllRack from "./components/Rack/AllRack";
import AddRack from "./components/Rack/AddRack";
import AllLevel from "./components/Level/AllLevel";
import AddLevel from "./components/Level/AddLevel";
import AllCustomer from "./components/Customer/AllCustomer";
import CategoryItem from "./components/Category/CategoryItem";
import FilterSale from "./components/FilterSale/FilterSale";
import AllBarcode from "./components/Barcode/AllBarcode";
import AddBarcode from "./components/Barcode/AddBarcode";
import FilterDue from "./components/Due/FilterDue";
import ReadyToPrint from "./components/Order/ReadyToPrint";
export const StockContext = React.createContext({} as any);
export const IdContext = React.createContext([] as any);

function App() {
  let [updateData, setUpdateData] = useState({});
  let [idData, setIdData] = useState({});

  return (
    <StockContext.Provider value={[updateData, setUpdateData] as any}>
      <IdContext.Provider value={[idData, setIdData] as any}>
        <Router>
          <Routes>
            <Route element={<WithNav />}>
              <Route path="/" element={<Dashboard />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              <Route path="/category/view/all" element={<AllCategory />} />
              <Route
                path="/category/by/item/:id/view/all"
                element={<CategoryItem />}
              />
              <Route path="/category/add/" element={<AddCategory />} />

              <Route path="/barcode/view/all" element={<AllBarcode />} />
              <Route path="/barcode/add/" element={<AddBarcode />} />

              <Route path="/stock/view/all" element={<AllStock />} />
              <Route path="/stock/add" element={<AddStock />} />
              <Route path="/stock/stock/out" element={<OutOfStock />} />
              <Route path="/sale/product" element={<Sale />} />
              <Route path="/sale/:filter" element={<FilterSale />} />

              <Route path="/rack/view/all" element={<AllRack />} />
              <Route path="/rack/add" element={<AddRack />} />

              <Route path="/level/view/all" element={<AllLevel />} />
              <Route path="/level/add" element={<AddLevel />} />

              <Route path="/customer/view/all" element={<AllCustomer />} />

              <Route path="/user/view/all" element={<AllUsers />} />
              <Route path="/user/add" element={<AddUser />} />

              <Route path="/order/view/all" element={<AllOrder />} />

              <Route path="/due/:filter" element={<FilterDue />} />

              <Route path="/setting" element={<Setting />} />
              <Route path="/print/all" element={<ReadyToPrint />} />

              <Route path="/about" element={<About />} />
            </Route>

            <Route element={<WithoutNav />}>
              <Route path="/page-not-found-404" element={<NotFound />} />

              <Route
                path="*"
                element={<Navigate to="/page-not-found-404" replace />}
              />
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </Router>
      </IdContext.Provider>
    </StockContext.Provider>
  );
}

export default App;
