export default function HeaderUser() {
    return (
        <div className="flex bg-purple-100 p-4 w-full items-center gap-4">
            <div className="flex w-3xl mx-auto items-center gap-4">
                <div className="flex items-center justify-center bg-zinc-100 rounded-full w-16 h-16">EB</div>
                <div className="flex flex-col gap-0.5">
                    <p className="text-lg font-semibold text-zinc-800 leading-tight">Olá, Ecthon!</p>
                    <p className="text-xs text-zinc-500 font-medium">CPF: 123.456.789-09</p>
                </div>
            </div>
        </div>
    )
}