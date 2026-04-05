
import React from 'react';
import { Customer } from '../types';

interface ExchangePrintProps {
  voucherNo: string;
  date: string;
  customer: Customer | null;
  exchangeData: {
    particulars: string;
    weight: number;
    purity: number | string;
    rate: number;
    total: number;
    hsn_code: string;
  };
  isScreenPreview?: boolean;
}

export const ExchangePrint: React.FC<ExchangePrintProps> = ({
  voucherNo,
  date,
  customer,
  exchangeData,
  isScreenPreview = false
}) => {
  // Format date from ISO string to DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return new Date().toLocaleDateString('en-GB');
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);

  const customerName = customer?.name || 'Walk-in Customer';
  const finalHsnCode = exchangeData.hsn_code || '7113';

  return (
    <div className={`${isScreenPreview ? 'block w-[210mm] min-h-[297mm] mx-auto shadow-2xl pt-0 pb-8 px-12 my-8' : 'hidden print:flex w-[210mm] min-h-[297mm] mx-auto pt-0 pb-[10mm] px-[15mm]'} bg-white text-[#000000] luxury-sans flex flex-col box-border`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        
        @media print {
          @page { margin: 0; size: A4 portrait; }
          body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; background-color: #ffffff !important; font-family: 'Calibri', 'Candara', 'Segoe', 'Segoe UI', 'Optima', 'Arial', sans-serif; }
          .no-print { display: none !important; }
        }
        
        body { font-family: 'Calibri', 'Candara', 'Segoe', 'Segoe UI', 'Optima', 'Arial', sans-serif; }
        .luxury-serif { font-family: 'Calibri', sans-serif; font-weight: bold; }
        .luxury-sans { font-family: 'Calibri', sans-serif; }
      `}</style>

      {/* LUXURY HEADER - CENTERED & COMPACT */}
      <div className="flex flex-col items-center mb-1 relative -mt-4 border-b border-[#D4AF37]/20 pb-2">
        <div className="w-24 h-24 -mb-4">
           <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        
        <div className="text-center w-full">
          <h1 className="luxury-serif text-[22pt] font-medium text-[#D4AF37] tracking-[0.2em] mb-0 uppercase leading-tight">DHANALAKSHMI JEWELLERS</h1>
          <p className="luxury-sans text-[8pt] text-[#000000] tracking-[0.3em] uppercase italic mb-2 font-semibold">Luxury Redefined • Est 2024</p>
          
          <div className="luxury-sans text-[8pt] text-[#000000] uppercase tracking-[0.1em] space-y-1 font-bold">
             <p>297, Jain Temple Rd, near Jain Temple, Sulthangunta, Shivaji Nagar, Bengaluru, Karnataka 560001</p>
              <p className="flex items-center justify-center gap-3">
                <span>Ph: 9980364227 / 9148936147</span>
                {/* <span className="opacity-30">|</span> */}
                {/* <span>GSTIN: 29BBGPM2303C1Z4</span> */}
              </p>
          </div>
        </div>

        <div className="absolute top-0 right-0 opacity-20">
           <div className="w-8 h-8">
              <img src="/BIS_PNG.png" alt="BIS Hallmark" className="max-w-full max-h-full object-contain grayscale" />
           </div>
        </div>
      </div>

      {/* DOCUMENT TITLE & META */}
      <div className="flex justify-between items-end border-b border-[#E0E0E0] pb-2 mb-4">
         <div>
            <h2 className="luxury-serif text-[18pt] font-semibold text-[#2C3E50] tracking-[0.1em] uppercase italic leading-none">
               Exchange Voucher
            </h2>
         </div>
         <div className="flex gap-10 luxury-sans text-[9pt]">
            <div className="flex flex-col items-end">
               <span className="text-[7pt] text-[#2C3E50]/40 uppercase tracking-widest mb-1">Voucher No</span>
               <span className="font-semibold text-[#2C3E50] tracking-wider">{voucherNo}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[7pt] text-[#2C3E50]/40 uppercase tracking-widest mb-1">Date</span>
               <span className="font-semibold text-[#2C3E50] tracking-wider">{formatDate(date)}</span>
            </div>
         </div>
      </div>

      {/* CUSTOMER INFO */}
      <div className="mb-4 luxury-sans">
        <div className="border-l-2 border-[#D4AF37]/20 pl-6 py-1">
          <span className="text-[7pt] text-[#2C3E50]/40 uppercase tracking-[0.2em] block mb-2">Valued Client</span>
          <div className="text-[10.5pt]">
            <p className="font-bold text-[#2C3E50] tracking-tight">{customerName}</p>
            <p className="text-[#2C3E50]/50 text-[8.5pt] mt-1 tracking-wider">{customer?.phone || '—'}</p>
          </div>
        </div>
      </div>

      {/* EXCHANGE TABLE - MINIMALIST */}
      <div className="flex-1 mb-2">
        <h3 className="text-[9pt] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-4 border-b border-[#2C3E50]/10 pb-2 italic text-[#2C3E50]/50">Exchange Details</h3>
        <table className="w-full text-left text-[10pt] border-collapse luxury-sans">
          <thead>
            <tr className="text-[#2C3E50]/40 text-[8pt] uppercase tracking-[0.15em] font-bold border-b border-[#2C3E50]/10">
              <th className="py-4 px-2">Description</th>
              <th className="py-4 px-2 text-center w-24">HSN</th>
              <th className="py-4 px-2 text-center w-32">Weight (g)</th>
              <th className="py-4 px-2 text-center w-24">Purity</th>
              <th className="py-4 px-2 text-right w-32">Market Rate</th>
              <th className="py-4 px-2 text-right w-40">Valuation</th>
            </tr>
          </thead>
          <tbody className="text-[#000000]">
            <tr className="border-b border-[#2C3E50]/05">
              <td className="py-2 px-2 font-black tracking-tight uppercase text-[9pt]">
                 {exchangeData.particulars || 'Old Gold Ornaments'}
              </td>
              <td className="py-2 px-2 text-center text-[8pt] opacity-50 tracking-widest">{finalHsnCode}</td>
              <td className="py-2 px-2 text-center italic font-bold">{exchangeData.weight.toFixed(3)}g</td>
              <td className="py-2 px-2 text-center text-[8pt] opacity-70 font-black italic">{exchangeData.purity || '—'}</td>
              <td className="py-2 px-2 text-right">₹ {exchangeData.rate.toLocaleString()}</td>
              <td className="py-2 px-2 text-right font-black text-[10pt] tracking-tight">{formatCurrency(exchangeData.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* VALUATION SUMMARY */}
      <div className="flex justify-end luxury-sans mb-4">
        <div className="w-80 space-y-3">
           <div className="flex justify-between items-center pt-6 border-t border-[#D4AF37]/20">
              <span className="luxury-serif text-[11pt] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">Net Credit Value</span>
              <span className="luxury-serif text-[20pt] font-black text-[#2C3E50] leading-none tracking-tight">
                {formatCurrency(exchangeData.total)}
              </span>
           </div>
           <p className="text-right text-[6.5pt] text-[#D4AF37] italic uppercase tracking-[0.05em] font-medium mt-4">
              Value credited to purchase account
           </p>
        </div>
      </div>

      {/* FOOTER: TERMS & SIGNATURES */}
      <div className="mt-auto">
          <div className="flex justify-between items-end mt-4 luxury-sans px-4">
              <div className="text-center w-64">
                 <div className="border-t border-[#2C3E50]/20 pt-3 opacity-60">
                    <p className="text-[7pt] uppercase tracking-[0.2em] font-semibold text-[#2C3E50]">Client Signature</p>
                 </div>
              </div>
              <div className="text-center w-72">
                 <div className="border-t border-[#D4AF37]/50 pt-3">
                    <p className="text-[9pt] uppercase tracking-[0.25em] font-bold text-[#2C3E50]">DHANALAKSHMI JEWELLERS</p>
                    <p className="text-[6.5pt] mt-1 text-[#D4AF37] italic font-medium">Authorized Internal Assessment</p>
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};
