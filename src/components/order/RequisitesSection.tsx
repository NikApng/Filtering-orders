import { FC } from "react";
import {
    Organization,
    Warehouse,
    Paybox,
    PriceType,
} from "@/types/api";

interface RequisitesSectionProps {
    metaLoading: boolean;
    metaError: string | null;
    organizations: Organization[];
    warehouses: Warehouse[];
    payboxes: Paybox[];
    priceTypes: PriceType[];
    selectedOrganization: string;
    setSelectedOrganization: (v: string) => void;
    selectedWarehouse: string;
    setSelectedWarehouse: (v: string) => void;
    selectedPaybox: string;
    setSelectedPaybox: (v: string) => void;
    selectedPriceType: string;
    setSelectedPriceType: (v: string) => void;
    getOrganizationLabel: (org: Organization) => string;
}

export const RequisitesSection: FC<RequisitesSectionProps> = ({
                                                                  metaLoading,
                                                                  metaError,
                                                                  organizations,
                                                                  warehouses,
                                                                  payboxes,
                                                                  priceTypes,
                                                                  selectedOrganization,
                                                                  setSelectedOrganization,
                                                                  selectedWarehouse,
                                                                  setSelectedWarehouse,
                                                                  selectedPaybox,
                                                                  setSelectedPaybox,
                                                                  selectedPriceType,
                                                                  setSelectedPriceType,
                                                                  getOrganizationLabel,
                                                              }) => {
    return (
        <section className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <h2 className="text-sm font-semibold mb-2">Реквизиты</h2>

            {metaLoading && (
                <p className="text-xs text-slate-500">Загрузка данных...</p>
            )}
            {metaError && (
                <p className="text-xs text-red-600 mb-2">{metaError}</p>
            )}

            {!metaLoading && !metaError && (
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium mb-1">
                            Организация
                        </label>
                        <select
                            value={selectedOrganization}
                            onChange={(e) => setSelectedOrganization(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                        >
                            <option value="">Выберите организацию…</option>
                            {organizations.map((org) => (
                                <option key={org.id} value={org.id}>
                                    {getOrganizationLabel(org)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1">
                            Склад
                        </label>
                        <select
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                        >
                            {warehouses.length === 0 && (
                                <option value="">Нет доступных складов</option>
                            )}
                            {warehouses.map((wh) => (
                                <option key={wh.id} value={wh.id}>
                                    {wh.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1">
                            Счёт (касса)
                        </label>
                        <select
                            value={selectedPaybox}
                            onChange={(e) => setSelectedPaybox(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                        >
                            {payboxes.length === 0 && (
                                <option value="">Нет доступных счетов</option>
                            )}
                            {payboxes.map((pb) => (
                                <option key={pb.id} value={pb.id}>
                                    {pb.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1">
                            Тип цен
                        </label>
                        <select
                            value={selectedPriceType}
                            onChange={(e) => setSelectedPriceType(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                        >
                            {priceTypes.length === 0 && (
                                <option value="">Нет доступных типов цен</option>
                            )}
                            {priceTypes.map((pt) => (
                                <option key={pt.id} value={pt.id}>
                                    {pt.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </section>
    );
};
