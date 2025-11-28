import {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useToken} from "@/hooks/useToken";
import {Button} from "@/components/ui/Button";

export const TokenPage = () => {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const {setToken} = useToken();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;
        setToken(trimmed);
        navigate("/order");
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
                <h1 className="text-xl font-semibold mb-4 text-center">
                    Подключение кассы
                </h1>
                <p className="text-sm text-slate-500 mb-6 text-center">
                    Введите токен кассы для авторизации.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Токен кассы
                        </label>
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="af1874..."
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-xl bg-blue-600 text-white py-2.5 text-sm font-medium active:scale-[0.99]"
                    >
                        Войти
                    </Button>
                </form>
            </div>

        </div>
    );
};
