import CookieCounter from "../components/CookieCounter/CookieCounter";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function CookiesCounter() {
    return (
        <Card className="m-4">
            <CardHeader>
                <CardTitle>🍪 Cookies Counter</CardTitle>
            </CardHeader>
            <CardContent>
                <CookieCounter />
            </CardContent>
        </Card>
    );
}
