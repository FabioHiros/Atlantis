import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Navbar = () => {
  const today = format(new Date(), "PPPP", { locale: ptBR });
  
  return (
    <header className="bg-white shadow py-3 px-4 md:py-4 md:px-6 fixed w-full md:relative z-10">
      <div className="flex items-center justify-around">
        <div className="pl-8 md:pl-0"> {/* Add padding-left on mobile to avoid overlap with menu button */}
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Bem-vindo ao Atlantis
          </h2>
          <p className="text-xs md:text-sm text-gray-600">
            {today}
          </p>
        </div>
        
      
      </div>
    </header>
  );
};

export default Navbar;