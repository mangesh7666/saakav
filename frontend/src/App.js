import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import Login from "./auth/Login";
import Register from "./auth/Register";

/* ADMIN */
import AdminLogin from "./admin_components/AdminLogin";
import AdminLayout from "./admin_components/AdminLayout";
import AdminDashboard from "./admin_components/AdminDashboard";
import AdminProfile from "./admin_components/AdminProfile";
import AdminHelp from "./admin_components/help";
import AdminBankUPI from "./admin_components/bank_UPI";
import AdminPayments from "./admin_components/payments";
import AdminUploadedCrops from "./admin_components/uploaded-crop";
import AdminApprovedCrops from "./admin_components/approved-crops";
import AdminCancelledCrops from "./admin_components/cancelled-crops";
import AdminPendingCrops from "./admin_components/pending-crops";
import AdminCustomerOrders from "./admin_components/orders";
import AdminHistory from "./admin_components/history";
import AdminLegal from "./admin_components/legal";
import AdminSettings from "./admin_components/settings";
import AdminPublishCrop from "./admin_components/publishcrop";
/* FARMER */
import FarmerLayout from "./farmer_component/FarmerLayout";
import FarmerDashboard from "./farmer_component/FarmerDashboard";
import FarmerProfile from "./farmer_component/FarmerProfile";
import FarmerHelp from "./farmer_component/FarmerHelp";
import FarmerSettings from "./farmer_component/FarmerSettings";
import FarmerBankUPI from "./farmer_component/FarmerBankUPI";
import FarmerPayments from "./farmer_component/FarmerPayments";
import FarmerHistory from "./farmer_component/FarmerHistory";
import FarmerUploadCrop from "./farmer_component/FarmerUploadCrop";
import FarmerPendingCrops from "./farmer_component/FarmerPendingCrops";
import FarmerApprovedCrops from "./farmer_component/FarmerApprovedCrops";
import FarmerCancelledCrops from "./farmer_component/FarmerCancelledCrops";
import FarmerLegal from "./farmer_component/FarmerLegal";

/* USER */
import UserDashboard from "./user_component/UserDashboard";
import PremiumFooter from "./user_component/footer";
import MyProfile from "./user_component/myprofile";
import UserLayout from "./user_component/UserLayout";
import HelpCenter from "./user_component/helpcenter";
import UserSettings from "./user_component/settings";
import CropListing from "./user_component/products";
import UserLegal from "./user_component/legal";
import Cart from "./user_component/cart";
import Wishlist from "./user_component/wishlist";
import MyOrders from "./user_component/orders";
/* ORGANIZATION */
import OrgDashboard from "./organization_component/OrgDashboard";

/* PROTECTED */
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= ADMIN ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="help" element={<AdminHelp />} />
          <Route path="bank-upi" element={<AdminBankUPI />} />
          <Route path="payments" element={<AdminPayments />} />
           <Route path="uploaded-crops" element={<AdminUploadedCrops />} />
           <Route path="pending-crops" element={<AdminPendingCrops />} />
           <Route path="cancelled-crops" element={<AdminCancelledCrops />} />
           <Route path="approved-crops" element={<AdminApprovedCrops />} />
          <Route path="orders" element={<AdminCustomerOrders />} />
          <Route path="history" element={<AdminHistory />} />
          <Route path="legal" element={<AdminLegal />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="publishcrop" element={<AdminPublishCrop />} />

          {/* future admin pages go here */}
        </Route>

        {/* ================= FARMER ================= */}
        <Route
          path="/farmer"
          element={
            <ProtectedRoute roles={["farmer"]}>
              <FarmerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="profile" element={<FarmerProfile />} />
          <Route path="help" element={<FarmerHelp />} />
          <Route path="settings" element={<FarmerSettings />} />
          <Route path="bank-upi" element={<FarmerBankUPI />} />
          <Route path="payments" element={<FarmerPayments />} />
          <Route path="history" element={<FarmerHistory />} />
          <Route path="upload-crop" element={<FarmerUploadCrop />} />
          <Route path="pending-crops" element={<FarmerPendingCrops />} />
          <Route path="approved-crops" element={<FarmerApprovedCrops />} />
          <Route path="cancelled-crops" element={<FarmerCancelledCrops />} />
          <Route path="legal" element={<FarmerLegal />} />
        </Route>

        {/* ================= USER ================= */}
        <Route
          path="/user"
          element={
            <ProtectedRoute roles={["user"]}>
              <UserLayout />
              <PremiumFooter/>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="myprofile" element={<MyProfile />} />
          <Route path="helpcenter" element={<HelpCenter />} />
          <Route path="settings" element={<UserSettings />} />
           <Route path="products" element={<CropListing />} />
           <Route path="legal" element={<UserLegal />} />
           <Route path="cart" element={<Cart />} />
           <Route path="wishlist" element={<Wishlist />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>

        {/* ================= ORGANIZATION ================= */}
        <Route
          path="/organization/dashboard"
          element={
            <ProtectedRoute roles={["organization"]}>
              <OrgDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= 404 ================= */}
        <Route
          path="*"
          element={<h2 style={{ textAlign: "center" }}>404 Page Not Found</h2>}
        />
      </Routes>
    </Router>
  );
}

export default App;
