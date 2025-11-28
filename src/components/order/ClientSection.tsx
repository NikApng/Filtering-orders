import { FC } from "react";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Contragent } from "@/types/api";

interface ClientSectionProps {
    phone: string;
    setPhone: (value: string) => void;
    client: Contragent | null;
    setClient: (c: Contragent | null) => void;
    clientError: string | null;
    setClientError: (msg: string | null) => void;
    filteredContragents: Contragent[];
    isContragentsOpen: boolean;
    setIsContragentsOpen: (open: boolean) => void;
}

export const ClientSection: FC<ClientSectionProps> = ({
                                                          phone,
                                                          setPhone,
                                                          client,
                                                          setClient,
                                                          clientError,
                                                          setClientError,
                                                          filteredContragents,
                                                          isContragentsOpen,
                                                          setIsContragentsOpen,
                                                      }) => {
    const handleSelectContragent = (c: Contragent) => {
        const phoneLabel = c.phone || (c as any).phone_number || "—";
        setClient(c);
        setClientError(null);
        setPhone(phoneLabel);
        setIsContragentsOpen(false);
    };

    const handleClearPhone = () => {
        setPhone("");
        setClient(null);
        setClientError(null);
    };

    return (
        <section className="bg-slate-50 rounded-2xl p-4">
            <h2 className="text-sm font-semibold mb-3">Контрагент</h2>

            <div className="mb-3">
                <label className="block text-xs font-medium mb-1">
                    Контрагент (поиск по телефону)
                </label>

                <div className="relative">
                    <PhoneInput
                        value={phone}
                        onChange={setPhone}
                        onFocus={() => setIsContragentsOpen(true)}
                    />

                    {phone && (
                        <button
                            onClick={() => {
                                setPhone("");
                                setClient(null);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            ✕
                        </button>
                    )}
                </div>

            </div>

            <div className="text-xs">
                {clientError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-red-700 mb-2">
                        {clientError}
                    </div>
                )}

                {isContragentsOpen &&
                    (filteredContragents.length === 0 ? (
                        <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-500">
                            Контрагентов не найдено. Попробуйте изменить фильтр.
                        </div>
                    ) : (
                        <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 cursor-pointer">
                            {filteredContragents.map((c) => {
                                const phoneLabel = c.phone || (c as any).phone_number || "—";
                                const isActive = client && client.id === c.id;

                                return (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => handleSelectContragent(c)}
                                        className={
                                            "w-full text-left px-3 py-2 flex items-center justify-between gap-2 text-xs " +
                                            (isActive
                                                ? "bg-blue-50 text-blue-700"
                                                : "hover:bg-slate-50 text-slate-800")
                                        }
                                    >
                                        <span className="font-mono">{phoneLabel}</span>
                                        <span className="flex-1 truncate text-right">
                      {c.name || "Без имени"}
                    </span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}

                {client && (
                    <div className="mt-2 rounded-xl bg-white border border-emerald-200 px-3 py-2 text-emerald-700">
                        Выбран контрагент:{" "}
                        <span className="font-medium">
              {client.name || "Без имени"}
            </span>
                    </div>
                )}
            </div>
        </section>
    );
};
