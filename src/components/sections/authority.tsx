export function Authority() {
    return (
        <section className="py-10 md:py-14 border-y border-border/40 bg-muted/20">
            <div className="container text-center space-y-10">
                <p className="font-semibold text-muted-foreground uppercase tracking-[0.2em] text-xs md:text-sm">Reconocidos por la excelencia en</p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 hover:opacity-100 transition-opacity duration-500">
                    {["Vogue Novias", "Zankyou Weddings", "Matrimonio.com.pe", "Revista Cosas"].map((brand) => (
                        <span key={brand} className="text-2xl md:text-3xl font-serif font-black text-foreground/80 tracking-tighter">{brand}</span>
                    ))}
                </div>
            </div>
        </section>
    )
}
