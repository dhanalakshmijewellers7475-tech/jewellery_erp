
import React from 'react';

interface LayawayTransaction {
  id: string;
  date: string;
  amount: number;
  mode: string;
  reference?: string;
  notes?: string;
}

interface LayawayStatementPrintProps {
  billNo: string;
  billDate: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  transactions: LayawayTransaction[];
  isScreenPreview?: boolean;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);

export const LayawayStatementPrint: React.FC<LayawayStatementPrintProps> = ({
  billNo,
  billDate,
  customerName,
  customerPhone,
  totalAmount,
  paidAmount,
  balance,
  transactions,
  isScreenPreview = false
}) => {
  return (
    <div className={`${isScreenPreview ? 'block w-[148mm] min-h-[210mm] mx-auto shadow-2xl pt-2 pb-8 px-8 my-8' : 'hidden print:flex flex-col w-[148mm] min-h-[210mm] mx-auto pt-0 pb-[10mm] px-8'} bg-white text-[#000000] luxury-sans flex flex-col box-border`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        
        @media print {
          @page { margin: 0; size: A5 portrait; }
          body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; background-color: #ffffff !important; }
          .no-print { display: none !important; }
        }
        
        .luxury-serif { font-family: 'Playfair Display', serif; }
        .luxury-sans { font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* LUXURY HEADER - CENTERED & COMPACT */}
      <div className="flex flex-col items-center mb-1 relative -mt-4 border-b border-[#D4AF37]/20 pb-2">
        <div className="w-20 h-20 -mb-4">
           <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        
        <div className="text-center w-full">
          <h1 className="luxury-serif text-[18pt] font-medium text-[#D4AF37] tracking-[0.1em] mb-0 uppercase leading-tight">DHANALAKSHMI JEWELLERS</h1>
          <p className="luxury-sans text-[7pt] text-[#000000] tracking-[0.2em] uppercase italic mb-1 font-semibold">Luxury Redefined • Est 2024</p>
          
          <div className="luxury-sans text-[6.5pt] text-[#000000] uppercase tracking-[0.1em] space-y-1 font-bold">
             <p>297, Jain Temple Rd, Shivajinagar, Bengaluru 560001</p>
             <p className="flex items-center justify-center gap-2">
                <span>Ph: 099456 32705</span>
                <span className="opacity-30">|</span>
                <span>GSTIN: 29BBGPM2303C1Z4</span>
             </p>
          </div>
        </div>

        <div className="absolute top-0 right-0 opacity-20">
           <div className="w-6 h-6">
              <img src="/BIS_PNG.png" alt="BIS Hallmark" className="max-w-full max-h-full object-contain grayscale" />
           </div>
        </div>
      </div>

      {/* DOCUMENT TITLE & META */}
      <div className="flex justify-between items-end border-b border-[#2C3E50]/10 pb-1 mb-2">
         <div>
            <h2 className="luxury-serif text-[14pt] font-semibold text-[#000000] tracking-[0.05em] uppercase italic leading-none">
               Layaway Statement
            </h2>
         </div>
         <div className="flex gap-6 luxury-sans text-[8pt]">
            <div className="flex flex-col items-end">
               <span className="text-[6pt] text-[#2C3E50]/40 uppercase tracking-widest mb-0.5">Bill No</span>
               <span className="font-semibold text-[#2C3E50] tracking-wider">{billNo}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[6pt] text-[#2C3E50]/40 uppercase tracking-widest mb-0.5">Date</span>
               <span className="font-semibold text-[#2C3E50] tracking-wider">{formatDate(new Date().toISOString())}</span>
            </div>
         </div>
      </div>

      {/* CUSTOMER & BILL SUMMARY */}
      <div className="grid grid-cols-2 gap-8 mb-2 luxury-sans">
        <div className="border-l-2 border-[#D4AF37]/20 pl-4 py-0.5">
          <span className="text-[6.5pt] text-[#000000] uppercase tracking-[0.15em] block mb-1 font-bold">Valued Client</span>
          <div className="text-[10pt]">
            <p className="font-bold text-[#000000] tracking-tight">{customerName}</p>
            <p className="text-[#000000] text-[8.5pt] mt-0.5 tracking-wider font-bold">{customerPhone}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end justify-center">
            <span className="text-[6pt] text-[#2C3E50]/40 uppercase tracking-widest mb-1">Bill Date</span>
            <span className="font-semibold text-[#2C3E50] text-[9pt]">{formatDate(billDate)}</span>
        </div>
      </div>

      {/* FINANCIAL OVERVIEW - ELEGANT CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center luxury-sans">
        <div className="bg-white border border-[#000000]/10 p-2 rounded-sm shadow-sm">
          <p className="text-[6pt] uppercase font-bold text-[#000000]/40 tracking-widest mb-1">Total Value</p>
          <p className="text-[9pt] font-bold text-[#000000]">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-white border border-[#D4AF37]/20 p-2 rounded-sm shadow-sm">
          <p className="text-[6pt] uppercase font-bold text-[#D4AF37] tracking-widest mb-1">Amount Paid</p>
          <p className="text-[9pt] font-bold text-[#D4AF37]">{formatCurrency(paidAmount)}</p>
        </div>
        <div className="bg-white border border-[#000000]/10 p-2 rounded-sm shadow-sm">
          <p className={`text-[6pt] uppercase font-bold tracking-widest mb-1 ${balance > 0 ? 'text-[#B76E79]' : 'text-green-600'}`}>Balance Due</p>
          <p className={`text-[9pt] font-bold ${balance > 0 ? 'text-[#B76E79]' : 'text-green-700'}`}>{formatCurrency(balance)}</p>
        </div>
      </div>

      {/* TRANSACTION TABLE - MINIMALIST */}
      <div className="flex-1 mb-6">
        <h3 className="text-[8pt] font-bold text-[#D4AF37] uppercase tracking-[0.15em] mb-4 border-b border-[#2C3E50]/10 pb-2 italic">Payment History</h3>
        <table className="w-full text-left text-[8pt] border-collapse luxury-sans">
          <thead>
            <tr className="text-[#2C3E50]/40 text-[7pt] uppercase tracking-[0.1em] font-bold border-b border-[#2C3E50]/10">
              <th className="py-2 px-1 w-8">#</th>
              <th className="py-2 px-1">Date</th>
              <th className="py-2 px-1">Reference / Mode</th>
              <th className="py-2 px-1 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-[#000000]">
            {transactions.length === 0 ? (
                <tr>
                    <td colSpan={4} className="py-10 text-center text-[#000000]/40 italic">No payments recorded.</td>
                </tr>
            ) : (
                transactions.map((tx, idx) => (
                    <tr key={tx.id} className="border-b border-[#000000]/05">
                      <td className="py-1 px-1 text-[7.5pt] font-bold">{String(idx + 1).padStart(2, '0')}</td>
                      <td className="py-1 px-1 font-medium">{formatDate(tx.date)}</td>
                      <td className="py-1 px-1">
                        <span className="font-black text-[#000000] block tracking-tight uppercase text-[8pt]">{tx.mode}</span>
                        <span className="text-[7pt] text-[#000000]/60 italic font-bold">{tx.reference || '—'}</span>
                      </td>
                      <td className="py-1 px-1 text-right font-black text-[#000000]">{formatCurrency(tx.amount)}</td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="mt-auto">
          <div className="grid grid-cols-2 gap-12 mb-4 luxury-sans text-[7pt] text-[#000000] tracking-wide leading-tight border-t border-[#000000]/10 pt-2">
             <div className="italic">
                <p className="font-bold text-[#000000]/70 uppercase tracking-[0.15em] mb-1 not-italic">Note</p>
                <div className="opacity-80">
                   <p>Certified payment summary for layaway purchase.</p>
                   <p>Present this document for final settlement.</p>
                </div>
             </div>
             <div className="text-right">
                <p className="font-bold text-[#000000]/70 uppercase tracking-[0.15em] mb-1">Status</p>
                <p className={`font-black uppercase tracking-widest ${balance <= 0 ? 'text-green-600' : 'text-[#B76E79]'}`}>
                    {balance <= 0 ? 'Fully Paid' : 'Partially Paid'}
                </p>
             </div>
          </div>
          
          <div className="flex justify-between items-end mt-4 luxury-sans px-2">
              <div className="text-center w-32">
                 <div className="border-t border-[#000000]/20 pt-1">
                    <p className="text-[6.5pt] uppercase tracking-[0.15em] font-black text-[#000000]/30">Client</p>
                 </div>
              </div>
              <div className="text-center w-48">
                 <div className="border-t border-[#D4AF37]/50 pt-1">
                    <p className="text-[7pt] uppercase tracking-[0.2em] font-black text-[#000000]">DHANALAKSHMI JEWELLERS</p>
                    <p className="text-[6pt] mt-0.5 text-[#D4AF37] italic font-bold">Authorized Signatory</p>
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};
