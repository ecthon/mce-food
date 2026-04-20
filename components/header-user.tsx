export default function HeaderUser() {
    return (
        <div className="flex bg-purple-100 w-full items-center">
            <div className="flex w-full max-w-lg mx-auto px-4 py-3 items-center gap-4">
                <div className="flex items-center justify-center bg-zinc-100 rounded-full w-12 h-12 shrink-0 text-sm font-semibold text-zinc-700">
                    EB
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-base font-semibold text-zinc-800 leading-tight truncate">Olá, Ecthon!</p>
                    <p className="text-xs text-zinc-500 font-medium">CPF: 123.456.789-09</p>
                </div>
            </div>
        </div>
    )
}