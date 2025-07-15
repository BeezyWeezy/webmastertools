import {useState} from "react";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {CardContent} from "../ui/card";

export default function CookiesCounter() {
    const [cookies, setCookies] = useState<string>("");
    const [cookiesCount, setCookiesCount] = useState<number | null>(null);

    const calculateCookies = () => {
        try {
            const toJsonCookies = JSON.parse(cookies);
            const count =
                Array.isArray(toJsonCookies)
                    ? toJsonCookies.filter(
                        (item) => typeof item === "object" && item !== null
                    ).length
                    : 0;

            setCookiesCount(count);
        } catch (error) {
            console.log(error);
            setCookiesCount(0);
        }
    };

    return (
        <CardContent className="flex flex-col gap-4">
            <Input
                placeholder="Paste your JSON array here"
                value={cookies}
                onChange={(e) => setCookies(e.target.value)}
            />
            <Button onClick={calculateCookies}>Count cookies</Button>
            {cookiesCount !== null && (
                <div className="text-sm text-muted-foreground">
                    Found {cookiesCount} COOKIE{cookiesCount !== 1 && "s"} in JSON array.
                </div>
            )}
        </CardContent>
    );
}
