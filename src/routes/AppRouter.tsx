import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AccountLayout } from "@/layouts/AccountLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

import { HomePage } from "@/pages/HomePage";
import { CatalogPage } from "@/pages/CatalogPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { ContactPage } from "@/pages/ContactPage";
import { AboutPage } from "@/pages/AboutPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { VerifyEmailPage } from "@/pages/VerifyEmailPage";

import { AccountPage } from "@/pages/AccountPage";
import { AddressesPage } from "@/pages/AddressesPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { OrderDetailPage } from "@/pages/OrderDetailPage";
import { SecurityPage } from "@/pages/SecurityPage";

import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminProfilePage } from "@/pages/admin/AdminProfilePage";
import { AdminSecurityPage } from "@/pages/admin/AdminSecurityPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminUserDetailPage } from "@/pages/admin/AdminUserDetailPage";
import { AdminComingSoonPage } from "@/pages/admin/AdminComingSoonPage";

import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { AdminProductFormPage } from "@/pages/admin/AdminProductFormPage";
import { AdminCategoriesPage } from "@/pages/admin/AdminCategoriesPage";
import { AdminCampaignsPage } from "@/pages/admin/AdminCampaignsPage";
import { AdminCampaignFormPage } from "@/pages/admin/AdminCampaignFormPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/produtos" element={<CatalogPage />} />
        <Route path="/produtos/:productId" element={<ProductDetailPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/sobre" element={<AboutPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route element={<AccountLayout />}>
            <Route path="/minha-conta" element={<AccountPage />} />
            <Route path="/minha-conta/sacola" element={<CartPage />} />
            <Route path="/minha-conta/enderecos" element={<AddressesPage />} />
            <Route path="/minha-conta/pedidos" element={<OrdersPage />} />
            <Route path="/minha-conta/pedidos/:orderId" element={<OrderDetailPage />} />
            <Route path="/minha-conta/seguranca" element={<SecurityPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/perfil" element={<AdminProfilePage />} />
              <Route path="/admin/seguranca" element={<AdminSecurityPage />} />
              <Route path="/admin/usuarios" element={<AdminUsersPage />} />
              <Route path="/admin/usuarios/:userId" element={<AdminUserDetailPage />} />
              <Route path="/admin/produtos" element={<AdminComingSoonPage resource="produtos" />} />
              <Route path="/admin/categorias" element={<AdminComingSoonPage resource="categorias" />} />
              <Route path="/admin/pedidos" element={<AdminComingSoonPage resource="pedidos" />} />
              <Route path="/admin/avaliacoes" element={<AdminComingSoonPage resource="avaliações" />} />
              <Route path="/admin/site" element={<AdminComingSoonPage resource="conteúdo do site" />} />
              <Route path="/admin/produtos" element={<AdminProductsPage />} />
              <Route path="/admin/produtos/novo" element={<AdminProductFormPage />} />
              <Route path="/admin/produtos/:productId" element={<AdminProductFormPage />} />
              <Route path="/admin/categorias" element={<AdminCategoriesPage />} />
              <Route path="/admin/campanhas" element={<AdminCampaignsPage />} />
              <Route path="/admin/campanhas/nova" element={<AdminCampaignFormPage />} />
              <Route path="/admin/campanhas/:campaignId" element={<AdminCampaignFormPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/recuperar-senha" element={<ResetPasswordPage />} />
        <Route path="/verificacao-concluida" element={<VerifyEmailPage />} />
      </Route>
    </Routes>
  );
}