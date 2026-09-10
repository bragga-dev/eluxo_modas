import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AccountLayout } from "@/layouts/AccountLayout";
import { ProtectedRoute } from "./ProtectedRoute";

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

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/produtos" element={<CatalogPage />} />
        <Route path="/produtos/:productId" element={<ProductDetailPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/sobre" element={<AboutPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route element={<AccountLayout />}>
            <Route path="/minha-conta" element={<AccountPage />} />
            <Route path="/minha-conta/enderecos" element={<AddressesPage />} />
            <Route path="/minha-conta/pedidos" element={<OrdersPage />} />
            <Route path="/minha-conta/pedidos/:orderId" element={<OrderDetailPage />} />
            <Route path="/minha-conta/seguranca" element={<SecurityPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
        <Route path="/verificacao-concluida" element={<VerifyEmailPage />} />
      </Route>
    </Routes>
  );
}
