'use client'

export default function CustomersEmail({ email }: { email: string }) {
   
   return (
      <>
         <p className='emailContainerStyle'
         onClick={() => navigator.clipboard.writeText(email)}
         >{email}</p>
      </>
   )
}