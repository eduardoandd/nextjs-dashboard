'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
} : {
    error: Error & {digest?: string};
    reset : () => void
}){
    useEffect(() => {
        console.log(error);
        
    }, [error] // var em analise 
    );

    return(
        <main className="flex h-full flex-col items-center justify-center">
        <h2 className="text-center">Algo deu errado!</h2>
        <button
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700"
          onClick={
            // Attempt to recover by trying to re-render the invoices route
            () => reset()
          }
        >
          Tentar novamente
        </button>
      </main>
    )

}
