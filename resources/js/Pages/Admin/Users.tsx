import { columns } from "@/components/users_table/columns";
import { UserDataTable } from "@/components/users_table/data-table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";

type Props = {
    users: Array<any>;
};

export default function UsersPage({ users }: Props) {
    const { flash } = usePage().props;
    console.log(flash);
    return (
        <AuthenticatedLayout>
            <div className="w-full max-w-6xl bg-white mx-auto my-4 rounded-lg p-4 ">
                <p className="font-bold text-2xl">Manage Users</p>
                <UserDataTable columns={columns} data={users} />
            </div>
        </AuthenticatedLayout>
    );
}
