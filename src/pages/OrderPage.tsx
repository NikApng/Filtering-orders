import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useToken} from "@/hooks/useToken";
import {
    fetchOrganizations,
    fetchPayboxes,
    fetchPriceTypes,
    fetchWarehouses,
    fetchAllNomenclature,
    fetchContragents,
} from "@/api/meta";
import {
    Organization,
    Warehouse,
    Paybox,
    PriceType,
    Contragent,
    NomenclatureItem,
} from "@/types/api";
import {Button} from "@/components/ui/Button";
import {createSale} from "@/api/sales";
import {CartItem} from "@/types/order";
import {ClientSection} from "@/components/order/ClientSection";
import {RequisitesSection} from "@/components/order/RequisitesSection";
import {ProductsSection} from "@/components/order/ProductsSection";

export const OrderPage = () => {
    const {token, clearToken} = useToken();
    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [client, setClient] = useState<Contragent | null>(null);
    const [clientError, setClientError] = useState<string | null>(null);
    const [contragents, setContragents] = useState<Contragent[]>([]);
    const [isContragentsOpen, setIsContragentsOpen] = useState(false);

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [payboxes, setPayboxes] = useState<Paybox[]>([]);
    const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
    const [metaLoading, setMetaLoading] = useState(true);
    const [metaError, setMetaError] = useState<string | null>(null);
    const [selectedOrganization, setSelectedOrganization] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [selectedPaybox, setSelectedPaybox] = useState("");
    const [selectedPriceType, setSelectedPriceType] = useState("");

    const [allProducts, setAllProducts] = useState<NomenclatureItem[]>([]);
    const [productQuery, setProductQuery] = useState("");
    const [productResults, setProductResults] = useState<NomenclatureItem[]>([]);
    const [productError, setProductError] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);

    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [createSuccess, setCreateSuccess] = useState<string | null>(null);

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        let cancelled = false;

        const loadMeta = async () => {
            try {
                setMetaLoading(true);
                setMetaError(null);

                const [orgs, whs, pbs, pts, products, contrs] = await Promise.all([
                    fetchOrganizations(token),
                    fetchWarehouses(token),
                    fetchPayboxes(token),
                    fetchPriceTypes(token),
                    fetchAllNomenclature(token),
                    fetchContragents(token),
                ]);

                if (cancelled) return;

                setOrganizations(orgs);
                setWarehouses(whs);
                setPayboxes(pbs);
                setPriceTypes(pts);
                setAllProducts(products);
                setContragents(contrs);

                if (orgs[0]) setSelectedOrganization(String(orgs[0].id));
                if (whs[0]) setSelectedWarehouse(String(whs[0].id));
                if (pbs[0]) setSelectedPaybox(String(pbs[0].id));
                if (pts[0]) setSelectedPriceType(String(pts[0].id));
            } catch (err) {
                if (cancelled) return;
                setMetaError(
                    err instanceof Error ? err.message : "Не удалось загрузить данные"
                );
            } finally {
                if (!cancelled) setMetaLoading(false);
            }
        };

        loadMeta();

        return () => {
            cancelled = true;
        };
    }, [token, navigate]);

    const handleExit = () => {
        clearToken();
        navigate("/");
    };

    function getOrganizationLabel(org: Organization): string {
        return (
            (org as any).name ||
            (org as any).title ||
            (org as any).short_name ||
            (org as any).full_name ||
            (org as any).organization ||
            `Организация #${org.id}`
        );
    }

    const filteredContragents = useMemo(() => {
        if (!contragents.length) return [];

        const digitsFilter = phone.replace(/\D/g, "");
        if (!digitsFilter) return contragents;

        return contragents.filter((c) => {
            const raw = (c.phone ?? (c as any).phone_number ?? "").toString();
            const digits = raw.replace(/\D/g, "");
            return digits.includes(digitsFilter);
        });
    }, [contragents, phone]);

    const handleSearchProducts = () => {
        const q = productQuery.trim().toLowerCase();
        setProductError(null);
        setProductResults([]);

        if (!q) return;

        if (!allProducts.length) {
            setProductError("Товары не загружены");
            return;
        }

        const filtered = allProducts.filter((p) => {
            const name = String(p.name ?? "").toLowerCase();
            const article = String(p.article ?? "").toLowerCase();
            return name.includes(q) || article.includes(q);
        });

        if (!filtered.length) {
            setProductError("Ничего не найдено по запросу");
        }

        setProductResults(filtered.slice(0, 50));
    };

    const handleAddToCart = (item: NomenclatureItem) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.id === item.id);
            const price = typeof item.price === "number" ? item.price : 0;

            if (existing) {
                return prev.map((c) =>
                    c.id === item.id ? {...c, quantity: c.quantity + 1} : c
                );
            }

            return [
                ...prev,
                {
                    id: item.id,
                    name: item.name,
                    price,
                    quantity: 1,
                },
            ];
        });
    };

    const handleChangeQty = (id: CartItem["id"], delta: number) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? {...item, quantity: Math.max(1, item.quantity + delta)}
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleRemoveFromCart = (id: CartItem["id"]) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const buildSalePayload = (conduct: boolean): any[] | null => {
        if (!client) {
            setClientError("Выберите клиента");
            return null;
        }
        if (!selectedOrganization || !selectedWarehouse || !selectedPaybox) {
            setMetaError("Заполните реквизиты");
            return null;
        }
        if (cart.length === 0) {
            alert("Корзина пустая");
            return null;
        }

        const goods = cart.map((item) => ({
            price: item.price,
            quantity: item.quantity,
            unit: 116,
            discount: 0,
            sum_discounted: 0,
            nomenclature: item.id,
        }));

        return [
            {
                priority: 0,
                dated: Math.floor(Date.now() / 1000),
                operation: "Заказ",
                tax_included: true,
                tax_active: true,
                goods,
                settings: {},
                warehouse: Number(selectedWarehouse),
                contragent: client.id,
                paybox: Number(selectedPaybox),
                organization: Number(selectedOrganization),
                status: conduct,
                paid_rubles: total,
                paid_lt: 0,
            },
        ];
    };

    const handleCreate = async (conduct: boolean) => {
        if (!token) return;
        setCreateError(null);
        setCreateSuccess(null);

        const payload = buildSalePayload(conduct);
        if (!payload) return;

        try {
            setIsCreating(true);
            const res = await createSale(token, payload);

            setCreateSuccess(
                `Продажа создана${conduct ? " и проведена" : ""}. № ${
                    (res as any).number || (res as any).id || ""
                }`
            );
        } catch (err) {
            setCreateError(
                err instanceof Error ? err.message : "Ошибка при создании продажи"
            );
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center">
            <div className="w-full max-w-md flex flex-col bg-white">
                <header
                    className="px-4 pt-4 pb-3 border-b border-slate-200 sticky top-0 bg-white z-10 flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">Создание заказа</h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Мобильная форма оформления продажи
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleExit}
                        className="border-none bg-transparent hover:bg-transparent text-xs text-slate-500 underline underline-offset-2 px-0 py-0"
                    >
                        Сменить токен
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto px-4 pb-40 pt-3 space-y-6">
                    <ClientSection
                        phone={phone}
                        setPhone={setPhone}
                        client={client}
                        setClient={setClient}
                        clientError={clientError}
                        setClientError={setClientError}
                        filteredContragents={filteredContragents}
                        isContragentsOpen={isContragentsOpen}
                        setIsContragentsOpen={setIsContragentsOpen}
                    />

                    <RequisitesSection
                        metaLoading={metaLoading}
                        metaError={metaError}
                        organizations={organizations}
                        warehouses={warehouses}
                        payboxes={payboxes}
                        priceTypes={priceTypes}
                        selectedOrganization={selectedOrganization}
                        setSelectedOrganization={setSelectedOrganization}
                        selectedWarehouse={selectedWarehouse}
                        setSelectedWarehouse={setSelectedWarehouse}
                        selectedPaybox={selectedPaybox}
                        setSelectedPaybox={setSelectedPaybox}
                        selectedPriceType={selectedPriceType}
                        setSelectedPriceType={setSelectedPriceType}
                        getOrganizationLabel={getOrganizationLabel}
                    />

                    <ProductsSection
                        productQuery={productQuery}
                        setProductQuery={setProductQuery}
                        productResults={productResults}
                        productError={productError}
                        onSearchProducts={handleSearchProducts}
                        cart={cart}
                        onAddToCart={handleAddToCart}
                        onChangeQty={handleChangeQty}
                        onRemoveFromCart={handleRemoveFromCart}
                    />
                </main>

                <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
                    <div className="max-w-md mx-auto px-4 py-3 space-y-2">
                        {createError && (
                            <p className="text-xs text-red-600">{createError}</p>
                        )}
                        {createSuccess && (
                            <p className="text-xs text-emerald-600">{createSuccess}</p>
                        )}

                        <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">
                Итого товаров:
              </span>
                            <span className="text-xs font-medium">
                {cart.length}
              </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-xs text-slate-500">Сумма:</span>
                            <span className="text-lg font-semibold">
                {total.toLocaleString("ru-RU")} ₽
              </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                full
                                disabled={isCreating}
                                onClick={() => handleCreate(false)}
                            >
                                {isCreating ? "Создание..." : "Создать"}
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                full
                                disabled={isCreating}
                                onClick={() => handleCreate(true)}
                            >
                                {isCreating ? "Создание..." : "Создать и провести"}
                            </Button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
