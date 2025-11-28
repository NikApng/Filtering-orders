import { FC } from "react";
import { Button } from "@/components/ui/Button";
import { NomenclatureItem } from "@/types/api";
import { CartItem } from "@/types/order";

interface ProductsSectionProps {
    productQuery: string;
    setProductQuery: (v: string) => void;
    productResults: NomenclatureItem[];
    productError: string | null;
    onSearchProducts: () => void;
    cart: CartItem[];
    onAddToCart: (item: NomenclatureItem) => void;
    onChangeQty: (id: CartItem["id"], delta: number) => void;
    onRemoveFromCart: (id: CartItem["id"]) => void;
}

export const ProductsSection: FC<ProductsSectionProps> = ({
                                                              productQuery,
                                                              setProductQuery,
                                                              productResults,
                                                              productError,
                                                              onSearchProducts,
                                                              cart,
                                                              onAddToCart,
                                                              onChangeQty,
                                                              onRemoveFromCart,
                                                          }) => {
    return (
        <section className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <h2 className="text-sm font-semibold mb-2">Товары</h2>

            <div className="flex gap-2">
                <input
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    placeholder="Поиск товара по названию или артикулу"
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" onClick={onSearchProducts}>
                    Найти
                </Button>
            </div>

            {productError && (
                <p className="text-xs text-red-600">{productError}</p>
            )}

            {productResults.length > 0 && (
                <div className="mt-2 space-y-1">
                    <p className="text-xs text-slate-500">Результаты поиска:</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                        {productResults.map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center justify-between rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{p.name}</span>
                                    {p.article && (
                                        <span className="text-slate-400">
                      Арт. {p.article}
                    </span>
                                    )}
                                    {typeof p.price === "number" && (
                                        <span className="text-slate-600">
                      {p.price.toLocaleString("ru-RU")} ₽
                    </span>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => onAddToCart(p)}
                                >
                                    Добавить
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-500">
            Выбранные позиции
          </span>
                    <span className="text-xs text-slate-400">
            {cart.length} шт.
          </span>
                </div>

                {cart.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-500">
                        Пока нет добавленных товаров. Найдите товар и добавьте в заказ.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs"
                            >
                                <div className="flex-1">
                                    <div className="font-medium text-slate-800">
                                        {item.name}
                                    </div>
                                    <div className="text-slate-500">
                                        {item.price.toLocaleString("ru-RU")} ₽ ×{" "}
                                        {item.quantity}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => onChangeQty(item.id, -1)}
                                    >
                                        -
                                    </Button>
                                    <span className="w-6 text-center text-xs">
                    {item.quantity}
                  </span>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => onChangeQty(item.id, +1)}
                                    >
                                        +
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onRemoveFromCart(item.id)}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
