import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function Home() {
    return (
        <Card className="m-4">
            <CardHeader>
                <CardTitle>🏠 Home</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Welcome to the Home page.</p>
            </CardContent>
        </Card>
    );
}
