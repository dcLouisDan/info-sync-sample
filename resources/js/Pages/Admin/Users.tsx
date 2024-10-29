import { columns } from "@/components/users_table/columns";
import { UserDataTable } from "@/components/users_table/data-table";
import { useToast } from "@/hooks/use-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FlashMessages } from "@/types/global";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

type Props = {
    users: Array<any>;
};

export default function UsersPage({ users }: Props) {
    const props = usePage().props;
    const flash = props.flash as FlashMessages;
    const { toast } = useToast();

    useEffect(() => {
        if (flash.success) {
            toast({ description: flash.success });
        }

        if (flash.error) {
            toast({ variant: "destructive", description: flash.error });
        }
    }, [flash]);

    return (
        <AuthenticatedLayout>
            <div className="w-full max-w-6xl bg-white mx-auto my-4 rounded-lg p-4 ">
                <p className="font-bold text-2xl">Manage Users</p>
                <UserDataTable columns={columns} data={users} />
            </div>
        </AuthenticatedLayout>
    );
}
