export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-azul-noite text-branco relative">
      {/* Background decoration with laranja-energia */}
      <div className="absolute top-0 left-0 w-full h-1 bg-laranja-energia" />
      
      <div className="z-10 w-full max-w-5xl items-center justify-center font-sans text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-laranja-energia">A2</span>Max
        </h1>
        
        <h2 className="text-xl md:text-2xl font-medium mb-8 text-areia-clara">
          Performance e Inteligência de Negócios
        </h2>
        
        <p className="text-sm md:text-base font-light text-branco/80 max-w-lg mx-auto p-4 border border-branco/10 rounded-lg bg-branco/5">
          Fundação do novo site oficial.
        </p>
      </div>
    </main>
  );
}
