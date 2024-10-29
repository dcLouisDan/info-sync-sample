import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { AxiosInstance } from "axios";
import { route as ziggyRoute } from "ziggy-js";
import { PageProps as AppPageProps, PageProps } from "./";

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    var route: typeof ziggyRoute;
}

declare module "@inertiajs/core" {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}

interface FlashMessages {
    success?: string;
    error?: string;
    message?: string;
}

interface InertiaPageProps {
    flash: FlashMessages;
}
