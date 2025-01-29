'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname,useRouter } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathName = usePathname() // CAMINHO ATUAL
  const {replace } =  useRouter()


  function handleSearch(term:string){
    const params = new URLSearchParams(searchParams)

    if(term){
      params.set('query', term) // define parametros
    }
    else{
      params.delete('query')
    }
    replace(`${pathName}?${params.toString()}`); // substitui na url
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) =>  {
          handleSearch(e.target.value)
        }}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
