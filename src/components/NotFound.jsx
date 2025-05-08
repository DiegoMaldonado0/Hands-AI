const NotFound = () => {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-10 from-white to-slate-100 dark:from-[#0b1120] dark:to-[#0f172a]">
        <h1 className="text-5xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Ups... La página que estás buscando no existe.
        </p>
        <a
          href="/"
          className="bg-white text-black px-6 py-3 rounded-xl shadow-lg hover:bg-primary/90 transition-all"
        >
          Volver al inicio
        </a>
      </section>
    );
  };
  
  export default NotFound;
  