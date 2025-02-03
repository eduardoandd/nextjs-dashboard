'use server';
import { custom, z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'}) // conn


const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error:'Por favor selecione o cliente'
    }),
    amount: z.coerce.number().gt(0, {message: 'Por favor insira um valor maior que R$0'}),
    status: z.enum(['pendente','pago'],{
      invalid_type_error:"Por faovr selecione um status."
    }),
    date: z.string()
})

export type State ={
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?:string | null
}

const CreateInvoice = FormSchema.omit({id:true, date:true})
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State,formData:FormData) {

    const validatedFields = CreateInvoice.safeParse( {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });

    // console.log(validatedFields.error?.flatten().fieldErrors);

    if(!validatedFields.success){
      return{
        errors:validatedFields.error.flatten().fieldErrors,
        message: "falha ao cria uma nova fatura. Campos ausentes!"
      }
    }

    // dado extraidos
    const {customerId, amount, status} = validatedFields.data;
    const amountInCents = amount *100;
    const date = new Date().toISOString().split('T')[0];

    try {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
      console.log(error);
    }
    
    revalidatePath('/dashboard/invoices'); // limpando o cache e gerando um novo
    redirect('/dashboard/invoices');    

    
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;

    try {

      await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
      
    } catch (error) {
      console.log(error);
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id:string) {
  await sql `DELETE FROM invoices WHERE id = ${id}`
  
  revalidatePath('/dashboard/invoices');
  
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciais inválidas';
        default:
          return 'Algo deu errado.';
      }
    }
    throw error;
  }
}