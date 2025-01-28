import { BanknotesIcon  } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center gap-x-2 leading-none text-white`}
    >
      <BanknotesIcon  className="h-[30px] w-[30px] rotate-[15deg] flex-shrink-0" />
      <p className="text-[30px]">Financeiro</p>
    </div>
  );
}
