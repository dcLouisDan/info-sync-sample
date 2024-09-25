<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-2 gap-2">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                @php
                    $tdClass = 'p-2';
                @endphp
                <div class="p-6 text-gray-900">
                    <h1 class="font-bold text-center mb-2">Quickbase Clients</h1>
                    <table class="table-auto w-full border rounded-sm">
                        <thead class="border-b">
                            <tr>
                                <th>
                                    Client Name
                                </th>
                                <th>
                                    Contact Name
                                </th>
                                <th>
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($quickbaseClients as $client)
                                @if ($loop->last)
                                    <tr>
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Client Name'] }}
                                        </td>
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Contact Name'] }}
                                        </td>
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Email'] }}
                                        </td>
                                    </tr>
                                @else
                                    @php
                                        $tdClass = $tdClass . ' border-b';
                                    @endphp
                                    <tr class="p-2 boder-b">
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Client Name'] }}
                                        </td>
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Contact Name'] }}
                                        </td>
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Email'] }}
                                        </td>
                                    </tr>
                                @endif
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h1 class="font-bold text-center mb-2">Invoice Ninja Clients</h1>
                    <table class="table-auto w-full border rounded-sm">
                        <thead class="border-b">
                            <tr>
                                <th>
                                    Client Name
                                </th>
                                <th>
                                    Contact Name
                                </th>
                                <th>
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($invoiceClients as $client)
                                @php
                                    $tdClass = 'p-2';
                                @endphp
                                @if ($loop->last)
                                    <tr>
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Client Name'] }}
                                        </td>
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Contact Name'] }}
                                        </td>
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Email'] }}
                                        </td>
                                    </tr>
                                @else
                                    @php
                                        $tdClass = $tdClass . ' border-b';
                                    @endphp
                                    <tr class="p-2 boder-b">
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Client Name'] }}
                                        </td>
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Contact Name'] }}
                                        </td>
                                        <td class="{{ $tdClass }}">
                                            {{ $client['Email'] }}
                                        </td>
                                    </tr>
                                @endif
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
