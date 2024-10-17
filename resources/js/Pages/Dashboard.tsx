import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

type Props = {
};


export default function Dashboard({
}: Props) {
    return (
        <AuthenticatedLayout>
            <div className="mx-auto bg-white w-full max-w-4xl p-4 my-4 rounded-lg shadow">
                <p className="font-bold text-2xl">Dashboard</p>
            </div>
            </AuthenticatedLayout>
    )
}
