export default function HeaderUser() {
    return (
        <div className="flex h-32 w-full items-center bg-linear-to-br from-purple-200 to-white">
            <div className="flex w-full -mt-6 max-w-lg mx-auto px-4 py-3 items-center gap-4">
                <div className="flex items-center justify-center bg-zinc-100 rounded-full w-14 h-14 shrink-0 text-base font-bold text-zinc-700">
                    EB
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-base font-bold text-zinc-900 leading-tight truncate">Olá, Ecthon!</p>
                    <p className="text-xs text-zinc-400 font-medium">CPF: 123.456.789-09</p>
                </div>
            </div>
        </div>
    )
}