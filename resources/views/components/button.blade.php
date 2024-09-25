<button {{ $attributes->merge(['type' => $type, 'class' => 'inline-flex bg-red-500 text-red-500']) }}>
    {{ $slot }}
</button>
