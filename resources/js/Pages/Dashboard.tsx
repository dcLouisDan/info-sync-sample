import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

type Props = {};

export default function Dashboard({}: Props) {
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <AuthenticatedLayout>
                <div className="mx-auto bg-white w-full max-w-4xl p-4 my-4 rounded-lg shadow">
                    <p className="font-bold">Dashboard</p>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
