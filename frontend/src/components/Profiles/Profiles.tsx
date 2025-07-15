import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/table";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { motion, AnimatePresence } from "framer-motion";

type Profile = {
    id: string;
    title: string;
    description?: string;
    status: number;
    proxy?: {
        mode: string;
        host: string;
        port: number;
    };
    created_at: string;
    updated_at: string;
};

const statusLabels: Record<number, string> = {
    0: "inactive",
    1: "active",
    2: "suspended",
};

export default function Profiles() {
    const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [sortField, setSortField] = useState<keyof Profile | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [pageLoading, setPageLoading] = useState<boolean>(false);

    const API_URL = 'https://webmastertools.onrender.com/api/profiles';

    const fetchProfiles = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${API_URL}?fields=title,description,proxy,status,created_at,updated_at&ordering=active`,
                {
                    method: "GET",
                }
            );
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const response = await res.json();
            if (!response.data) {
                throw new Error("Данные отсутствуют в ответе");
            }
            setAllProfiles(response.data);
        } catch (err) {
            console.error("Ошибка при загрузке профилей:", err);
            setError(err instanceof Error ? err.message : "Ошибка загрузки профилей");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const totalPages = Math.ceil(allProfiles.length / pageSize);

    const handlePreviousPage = () => {
        setPageLoading(true);
        setTimeout(() => {
            setCurrentPage((prev) => Math.max(0, prev - 1));
            setPageLoading(false);
        }, 300);
    };

    const handleNextPage = () => {
        setPageLoading(true);
        setTimeout(() => {
            setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
            setPageLoading(false);
        }, 300);
    };

    const handleSort = (field: keyof Profile) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const formatProxyInfo = (proxy?: Profile["proxy"]) => {
        if (!proxy) return "-";
        return `${proxy.mode}://${proxy.host}:${proxy.port}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const filteredProfiles = allProfiles
        .filter((p) => {
            const title = (p.title || "").toLowerCase();
            const statusStr = statusLabels[Number(p.status)]?.toLowerCase() || "";
            return (
                title.includes(search.toLowerCase()) ||
                statusStr.includes(search.toLowerCase())
            );
        })
        .sort((a, b) => {
            if (!sortField) return 0;
            const aValue = a[sortField];
            const bValue = b[sortField];
            if (sortField === "created_at") {
                const aDate = new Date(aValue as string).getTime();
                const bDate = new Date(bValue as string).getTime();
                return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
            }
            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortDirection === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            return 0;
        });

    const currentProfiles = filteredProfiles.slice(
        currentPage * pageSize,
        currentPage * pageSize + pageSize
    );

    return (
        <Card className="m-4">
            <CardHeader>
                <CardTitle className="flex flex-col gap-2">
                    🧩 Профили Octo Browser
                    <div className="flex gap-2">
                        <Input
                            placeholder="Поиск по названию или статусу..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="max-w-sm"
                        />
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(v) => {
                                setPageSize(parseInt(v));
                                setCurrentPage(0);
                            }}
                        >
                            <SelectTrigger className="w-24">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full" />
                        ))}
                    </div>
                )}
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {!loading && currentProfiles.length > 0 && (
                    <>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage + search + sortField + sortDirection}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead
                                                onClick={() => handleSort("title")}
                                                className="cursor-pointer"
                                            >
                                                Название
                                            </TableHead>
                                            <TableHead
                                                onClick={() => handleSort("status")}
                                                className="cursor-pointer"
                                            >
                                                Статус
                                            </TableHead>
                                            <TableHead>Описание</TableHead>
                                            <TableHead>Прокси</TableHead>
                                            <TableHead
                                                onClick={() => handleSort("created_at")}
                                                className="cursor-pointer"
                                            >
                                                Создан
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentProfiles.map((profile) => (
                                            <TableRow key={profile.id}>
                                                <TableCell>{profile.title}</TableCell>
                                                <TableCell>
                                                    {statusLabels[Number(profile.status)] || "-"}
                                                </TableCell>
                                                <TableCell>{profile.description || "-"}</TableCell>
                                                <TableCell>{formatProxyInfo(profile.proxy)}</TableCell>
                                                <TableCell>{formatDate(profile.created_at)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </motion.div>
                        </AnimatePresence>
                        <div className="flex justify-between mt-4 items-center">
                            <Button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 0}
                                variant="outline"
                            >
                                Предыдущая
                            </Button>
                            <span className="flex items-center gap-2">
                Страница {currentPage + 1} из {Math.max(1, totalPages)}
                                {pageLoading && <Loader2 className="animate-spin w-4 h-4" />}
              </span>
                            <Button
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages - 1}
                                variant="outline"
                            >
                                Следующая
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
