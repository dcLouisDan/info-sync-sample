import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function ClientCombobox({
    clientList,
    value,
    setValue,
}: {
    clientList: Array<any>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [open, setOpen] = React.useState(false);
    const clients = clientList.map((client) => ({
        value: client?.customer.trim(),
        label: client?.customer.trim(),
        id: client?.recordId,
    }));
    console.log(clients);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[500px] justify-between"
                >
                    {value
                        ? clients.find((client) => client.value === value)
                              ?.label
                        : "Select client..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[500px] p-0">
                <Command>
                    <CommandInput placeholder="Search client..." />
                    <CommandList>
                        <CommandEmpty>No client found.</CommandEmpty>
                        <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem
                                    key={client.value}
                                    value={client.value}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === client.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {client.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
