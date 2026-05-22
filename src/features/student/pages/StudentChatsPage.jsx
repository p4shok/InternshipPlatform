import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { ROUTES } from "../../../routes/routePaths";
import { getAccessToken } from "../../auth/utils/session";
import { getChatConnection } from "../../chat/utils/chatHub";
import {
    isOwnMessage,
    mapChatDetails,
    mapChatListItem,
    parseJwtPayload,
} from "../../chat/utils/chatMappers";
import {
    getStudentChatMessages,
    getStudentChats,
    markStudentChatAsRead,
} from "../api/chats.api";

const StudentChatsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const messagesEndRef = useRef(null);
    const accessTokenPayload = useMemo(
        () => parseJwtPayload(getAccessToken()),
        []
    );
    const [chatItems, setChatItems] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(location.state?.chatId || null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");

    const loadChats = async (preferredChatId = null) => {
        const chatList = await getStudentChats();
        const mapped = chatList.map((chat) => mapChatListItem(chat, "student"));
        setChatItems(mapped);

        const nextChatId =
            preferredChatId ||
            selectedChatId ||
            location.state?.chatId ||
            mapped[0]?.id ||
            null;

        if (nextChatId) {
            setSelectedChatId(nextChatId);
        }

        return mapped;
    };

    const loadChatMessages = async (chatId) => {
        if (!chatId) {
            setSelectedChat(null);
            return;
        }

        const chat = await getStudentChatMessages(chatId);
        setSelectedChat(mapChatDetails(chat, "student"));
        await markStudentChatAsRead(chatId);
        setChatItems((prev) =>
            prev.map((item) =>
                item.id === chatId
                    ? {
                          ...item,
                          unreadMessagesCount: 0,
                      }
                    : item
            )
        );
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                setIsLoading(true);
                setError("");
                await loadChats(location.state?.chatId || null);
            } catch (loadError) {
                setError(
                    loadError?.response?.data?.message || "Не удалось загрузить чаты."
                );
            } finally {
                setIsLoading(false);
            }
        };

        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!selectedChatId) {
            return undefined;
        }

        let isActive = true;
        let connection;

        const joinChat = async () => {
            try {
                setError("");
                await loadChatMessages(selectedChatId);
                connection = await getChatConnection();
                await connection.invoke("JoinChat", selectedChatId);

                const handleReceiveMessage = (message) => {
                    if (!isActive) {
                        return;
                    }

                    setSelectedChat((prev) =>
                        prev && prev.id === selectedChatId
                            ? {
                                  ...prev,
                                  messages: [...prev.messages, message],
                              }
                            : prev
                    );
                    setChatItems((prev) =>
                        prev.map((item) =>
                            item.id === selectedChatId
                                ? {
                                      ...item,
                                      lastMessage: message,
                                  }
                                : item
                        )
                    );
                };

                const handleChatUpdate = async (chatId) => {
                    if (!isActive) {
                        return;
                    }

                    await loadChats(chatId === selectedChatId ? selectedChatId : chatId);

                    if (chatId === selectedChatId) {
                        await loadChatMessages(chatId);
                    }
                };

                connection.off("ReceiveMessage");
                connection.off("ChatUpdate");
                connection.on("ReceiveMessage", handleReceiveMessage);
                connection.on("ChatUpdate", handleChatUpdate);
            } catch (joinError) {
                if (isActive) {
                    setError(joinError?.message || "Не удалось подключиться к чату.");
                }
            }
        };

        joinChat();

        return () => {
            isActive = false;

            if (connection) {
                connection.invoke("LeaveChat", selectedChatId).catch(() => {});
                connection.off("ReceiveMessage");
                connection.off("ChatUpdate");
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedChat?.messages]);

    const handleSend = async (event) => {
        event.preventDefault();

        if (!messageText.trim() || !selectedChatId) {
            return;
        }

        try {
            setIsSending(true);
            const connection = await getChatConnection();
            await connection.invoke("SendMessage", {
                chatId: selectedChatId,
                content: messageText.trim(),
            });
            setMessageText("");
        } catch (sendError) {
            setError(sendError?.message || "Не удалось отправить сообщение.");
        } finally {
            setIsSending(false);
        }
    };

    const handleLeaveChat = () => {
        setSelectedChatId(null);
        setSelectedChat(null);
        setMessageText("");
        navigate(location.pathname, { replace: true, state: null });
    };

    const handleViewVacancy = () => {
        if (!selectedChat?.vacancyId) {
            return;
        }

        navigate(ROUTES.STUDENT_VACANCY_DETAILS(selectedChat.vacancyId));
    };

    return (
        <AuthLayout>
            <div className="w-full space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Чаты с работодателями</h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-500">
                                Сообщения приходят в realtime через `ChatHub`. Здесь можно продолжить
                                диалог после отклика.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_APPLICATIONS)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Отклики
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.STUDENT_VACANCIES)}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                К вакансиям
                            </button>
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                    <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Список диалогов</h2>
                            <button
                                type="button"
                                onClick={() => loadChats(selectedChatId)}
                                className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Обновить
                            </button>
                        </div>

                        {isLoading ? (
                            <p className="text-sm text-slate-500">Загрузка чатов...</p>
                        ) : chatItems.length > 0 ? (
                            <div className="space-y-3">
                                {chatItems.map((chat) => (
                                    <button
                                        key={chat.id}
                                        type="button"
                                        onClick={() => setSelectedChatId(chat.id)}
                                        className={`w-full rounded-2xl border p-4 text-left transition ${
                                            chat.id === selectedChatId
                                                ? "border-indigo-200 bg-indigo-50"
                                                : "border-slate-200 bg-white hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {chat.counterpartName}
                                                </p>
                                                <p className="mt-1 truncate text-xs text-slate-500">
                                                    {chat.vacancyTitle}
                                                </p>
                                            </div>
                                            {chat.unreadMessagesCount > 0 && (
                                                <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                                                    {chat.unreadMessagesCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-3 truncate text-sm text-slate-600">
                                            {chat.lastMessage?.content || "Сообщений пока нет"}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">
                                Чаты появятся после откликов и первого сообщения.
                            </p>
                        )}
                    </aside>

                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        {selectedChat ? (
                            <>
                                <div className="border-b border-slate-200 pb-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-900">
                                                {selectedChat.counterpartName}
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {selectedChat.vacancyTitle}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleViewVacancy}
                                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Просмотр вакансии
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleLeaveChat}
                                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Выйти из чата
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 h-[420px] space-y-3 overflow-y-auto pr-2">
                                    {selectedChat.messages.map((message) => {
                                        const own = isOwnMessage(message, accessTokenPayload);

                                        return (
                                            <div
                                                key={message.id}
                                                className={`flex ${own ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm ${
                                                        own
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-slate-100 text-slate-700"
                                                    }`}
                                                >
                                                    <p className="whitespace-pre-line">{message.content}</p>
                                                    <p
                                                        className={`mt-2 text-[11px] ${
                                                            own ? "text-indigo-100" : "text-slate-400"
                                                        }`}
                                                    >
                                                        {new Date(message.createdAt).toLocaleString("ru-RU")}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSend} className="mt-4 flex gap-3">
                                    <textarea
                                        rows={3}
                                        value={messageText}
                                        onChange={(event) => setMessageText(event.target.value)}
                                        placeholder="Напишите сообщение работодателю"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSending}
                                        className="shrink-0 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {isSending ? "..." : "Отправить"}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex h-full min-h-[420px] items-center justify-center text-center">
                                <p className="max-w-sm text-sm text-slate-500">
                                    Выберите диалог слева, чтобы увидеть сообщения и продолжить общение.
                                </p>
                            </div>
                        )}
                    </article>
                </section>
            </div>
        </AuthLayout>
    );
};

export default StudentChatsPage;
