import { http } from "./client";
import type { Address, AddressCreatePayload, AddressUpdatePayload } from "@/types/address";

export async function listMyAddresses(): Promise<Address[]> {
  const { data } = await http.get<Address[]>("/address/my-addresses");
  return data;
}

export async function countMyAddresses(): Promise<number> {
  const { data } = await http.get<{ count: number }>("/address/my-addresses/count");
  return data.count;
}

export async function getMyAddress(addressId: string): Promise<Address> {
  const { data } = await http.get<Address>(`/address/my-addresses/${addressId}`);
  return data;
}

export async function getPreferentialAddress(): Promise<Address | null> {
  try {
    const { data } = await http.get<Address>("/address/my-addresses/preferential");
    return data;
  } catch {
    return null;
  }
}

export async function getDefaultAddress(): Promise<Address | null> {
  try {
    const { data } = await http.get<Address>("/address/my-addresses/default");
    return data;
  } catch {
    return null;
  }
}

export async function createMyAddress(payload: AddressCreatePayload): Promise<Address> {
  const { data } = await http.post<Address>("/address/my-addresses", payload);
  return data;
}

export async function updateMyAddress(addressId: string, payload: AddressUpdatePayload): Promise<Address> {
  const { data } = await http.patch<Address>(`/address/my-addresses/${addressId}`, payload);
  return data;
}

export async function deleteMyAddress(addressId: string): Promise<void> {
  await http.delete(`/address/my-addresses/${addressId}`);
}

export async function setPreferentialAddress(addressId: string): Promise<Address> {
  const { data } = await http.post<Address>(`/address/my-addresses/${addressId}/set-preferential`);
  return data;
}
