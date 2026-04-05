
import React from 'react';
import { BillItem, Customer, PaymentRecord } from '../types';

interface InvoicePrintProps {
  billNo: string;
  billDate: string;
  saleType: 'GST' | 'NON GST';
  customer: Customer | null;
  items: BillItem[];
  allMetalRates: Record<string, number>;
  totals: {
    itemsSubtotal: number;
    baseTaxable: number;
    gstAmount: number;
    grandTotal: number;
  };
  oldGold: {
    weight: number;
    purity: number | string;
    rate: number;
    total: number;
    description?: string;
  };
  mcValueAdded: {
    weight: number;
    rate: number;
    total: number;
  };
  paymentMethods: PaymentRecord[];
  isScreenPreview?: boolean;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return new Date().toLocaleDateString('en-GB');
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);

const numberToWords = (num: number): string => {
  const n = Math.floor(num);
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty ', 'Thirty ', 'Forty ', 'Fifty ', 'Sixty ', 'Seventy ', 'Eighty ', 'Ninety '];

  const convert = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n/10)] + a[n%10];
    if (n < 1000) return a[Math.floor(n/100)] + 'Hundred ' + (n%100 !== 0 ? 'and ' + convert(n%100) : '');
    if (n < 100000) return convert(Math.floor(n/1000)) + 'Thousand ' + (n%1000 !== 0 ? convert(n%1000) : '');
    if (n < 10000000) return convert(Math.floor(n/100000)) + 'Lakh ' + (n%100000 !== 0 ? convert(n%100000) : '');
    return 'Large Amount ';
  };

  if (n === 0) return 'Zero Rupees Only';
  return convert(n).trim() + ' Rupees Only';
};

const metalLabels: Record<string, string> = {
  'gold': 'Std Gold',
  'gold_916': '22k Gold',
  'gold_750': '18k Gold',
  'silver_92': 'Silver 925',
  'silver_70': 'Silver 70',
  'selam_silver': 'Selam',
  'service': 'Service'
};

export const InvoicePrint: React.FC<InvoicePrintProps> = ({
  billNo,
  billDate,
  saleType,
  customer,
  items,
  allMetalRates,
  totals,
  oldGold,
  mcValueAdded,
  paymentMethods,
  isScreenPreview = false
}) => {
  
  const cgst = saleType === 'GST' ? totals.gstAmount / 2 : 0;
  const sgst = saleType === 'GST' ? totals.gstAmount / 2 : 0;

  const activeMetals = Array.from(new Set(items.map(i => i.metal_type).filter(m => m && m !== 'service'))) as string[];

  return (
    <div className={`${isScreenPreview ? 'block w-[210mm] min-h-[297mm] mx-auto shadow-2xl pt-0 pb-8 px-8 my-8' : 'hidden print:flex w-[210mm] min-h-[297mm] mx-auto pt-0 pb-[10mm] px-[15mm]'} bg-white text-[#000000] luxury-sans flex flex-col box-border`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        
        @media print {
          @page { margin: 0; size: A4 portrait; }
          body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; background-color: #ffffff !important; }
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
                {/* {saleType === 'GST' && <span className="opacity-30">|</span>} */}
                {/* {saleType === 'GST' && <span>GSTIN: 29BBGPM2303C1Z4</span>} */}
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
      <div className="flex justify-between items-end border-b border-[#E0E0E0] pb-1 mb-2">
         <div>
            <h2 className="luxury-serif text-[14pt] font-semibold text-[#2C3E50] tracking-[0.05em] uppercase italic leading-none">
               {saleType === 'GST' ? 'Tax Invoice' : 'Retail Invoice'}
            </h2>
         </div>
         <div className="flex gap-10 luxury-sans text-[8.5pt]">
            <div className="flex flex-col items-end">
               <span className="text-[7pt] text-[#2C3E50]/40 uppercase tracking-widest mb-1">Invoice No</span>
               <span className="font-semibold text-[#2C3E50] tracking-wider">{billNo}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[7pt] text-[#2C3E50]/40 uppercase tracking-widest mb-1">Date</span>
               <span className="font-semibold text-[#2C3E50] tracking-wider">{formatDate(billDate)}</span>
            </div>
         </div>
      </div>

      {/* INFO SECTION: CUSTOMER & METAL RATES */}
      <div className="grid grid-cols-2 gap-12 mb-2 luxury-sans">
        <div className="border-l-2 border-[#D4AF37]/20 pl-6 py-1">
          <span className="text-[7pt] text-[#000000] uppercase tracking-[0.2em] block mb-2 font-bold">Valued Client</span>
          <div className="text-[10.5pt]">
            <p className="font-bold text-[#000000] tracking-tight">{customer?.name || 'Walk-in Customer'}</p>
            <p className="text-[#000000] text-[8.5pt] mt-1 tracking-wider font-medium">{customer?.phone}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end justify-center">
           {activeMetals.length > 0 && (
             <div className="flex gap-8 uppercase text-[8pt] text-[#2C3E50]/50 tracking-[0.15em]">
                {activeMetals.map((m) => (
                  <div key={m} className="text-right">
                    <span className="text-[6pt] block mb-1 opacity-60">{metalLabels[m || ''] || m} Rate</span>
                    <span className="font-bold text-[#2C3E50]">₹{(allMetalRates[m || ''] || 0).toLocaleString()}</span>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* ITEMS TABLE - COMPACT LUXURY */}
      <div className="flex-1 mb-1 overflow-hidden">
        <table className="w-full text-left text-[8.5pt] border-collapse luxury-sans">
          <thead>
            <tr className="border-y border-[#2C3E50]/10 text-[#D4AF37] text-[8pt] uppercase tracking-[0.15em] font-bold">
              <th className="py-4 px-2 w-[40px]">#</th>
              <th className="py-4 px-2">Description</th>
              <th className="py-4 px-2 text-center">HUID</th>
              <th className="py-4 px-2 text-center">Gross</th>
              <th className="py-4 px-2 text-center">Wastage</th>
              <th className="py-4 px-2 text-center">Net</th>
              <th className="py-4 px-2 text-right">Rate</th>
              <th className="py-4 px-2 text-right">MC</th>
              <th className="py-4 px-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="text-[#2C3E50]">
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b border-[#000000]/10">
                <td className="py-1 px-2 text-[8pt] font-bold">{idx + 1}</td>
                <td className="py-1 px-2 font-black tracking-tight uppercase text-[8.5pt]">{item.item_name}</td>
                <td className="py-1 px-2 text-center text-[7.5pt] font-bold tracking-widest uppercase">{item.huid || '—'}</td>
                <td className="py-1 px-2 text-center italic text-[#000000]">{item.gross_weight?.toFixed(3) || item.weight.toFixed(3)}g</td>
                <td className="py-1 px-2 text-center text-[#000000]">{item.wastage?.toFixed(3) || '—'}g</td>
                <td className="py-1 px-2 text-center font-black">{item.net_weight?.toFixed(3) || item.weight.toFixed(3)}g</td>
                <td className="py-1 px-2 text-right font-semibold">{(item.rate).toLocaleString('en-IN')}</td>
                <td className="py-1 px-2 text-right text-[7.5pt] font-bold">{(item.making_charges).toLocaleString('en-IN')}</td>
                <td className="py-1 px-2 text-right font-black tracking-tight">{(item.line_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
            
            {mcValueAdded.total > 0 && (
              <tr className="border-b border-[#000000]/10 italic text-[#000000]">
                 <td className="py-1 px-2 text-[8pt] font-bold">{items.length + 1}</td>
                 <td colSpan={6} className="py-1 px-2 uppercase text-[7.5pt] tracking-wider font-bold">Service & Value Added MC</td>
                 <td className="py-1 px-2 text-right font-black">{(mcValueAdded.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SETTLEMENT & TOTALS */}
      <div className="grid grid-cols-2 gap-16 luxury-sans mb-1">
        <div className="flex flex-col justify-end">
           {paymentMethods && paymentMethods.length > 0 && (
             <div className="border-t border-[#2C3E50]/10 pt-6 w-full">
                <p className="text-[7pt] text-[#D4AF37] uppercase tracking-[0.2em] font-bold mb-4">Payment Breakdown</p>
                <div className="space-y-3">
                   {paymentMethods.map((pm, idx) => {
                      const amt = parseFloat(pm.amount) || 0;
                      if (amt <= 0) return null;
                      return (
                        <div key={idx} className="flex justify-between items-center text-[9pt]">
                           <span className="text-[#2C3E50]/60 capitalize italic tracking-wide">{pm.type}</span>
                           <span className="font-bold text-[#2C3E50] tracking-tight">₹ {amt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                      );
                   })}
                </div>
             </div>
           )}
        </div>

        <div className="space-y-3">
           <div className="flex justify-between text-[9.5pt] items-center text-[#2C3E50]/60 border-b border-[#2C3E50]/05 pb-2">
              <span className="tracking-[0.15em] uppercase text-[7.5pt]">Subtotal</span>
              <span className="font-medium">₹ {(totals.itemsSubtotal + (mcValueAdded.total || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
           </div>

           {oldGold.total > 0 && (
             <div className="flex justify-between text-[9.5pt] items-center text-[#B76E79] border-b border-[#2C3E50]/05 pb-2">
                <span className="tracking-[0.15em] uppercase text-[7.5pt]">Old Gold Credit</span>
                <span className="font-bold">- ₹ {oldGold.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
             </div>
           )}

           <div className="flex justify-between text-[9.5pt] items-center text-[#2C3E50]/80 border-b border-[#2C3E50]/05 pb-2">
              <span className="tracking-[0.15em] uppercase text-[7.5pt] font-semibold">Taxable Amount</span>
              <span className="font-medium">₹ {totals.baseTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
           </div>

           {saleType === 'GST' && (
             <div className="space-y-2 text-[8.5pt] text-[#2C3E50]/50 italic border-b border-[#2C3E50]/05 pb-2">
               <div className="flex justify-between">
                  <span>Central GST (1.5%)</span>
                  <span>₹ {cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between">
                  <span>State GST (1.5%)</span>
                  <span>₹ {sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
               </div>
             </div>
           )}

           <div className="flex justify-between items-center pt-6 mt-2">
              <span className="luxury-serif text-[11pt] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">Grand Total</span>
              <span className="luxury-serif text-[20pt] font-black text-[#000000] leading-none tracking-tight">
                ₹ {totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
           </div>
           
           <div className="text-right border-t border-[#D4AF37]/40 mt-4 pt-2">
              <p className="text-[8.5pt] text-[#000000] italic uppercase tracking-[0.05em] font-black leading-relaxed">
                {numberToWords(totals.grandTotal)}
              </p>
           </div>
        </div>
      </div>

      {/* FOOTER: TERMS & SIGNATURES */}
      <div className="mt-auto border-t border-[#000000]/20 pt-1">
          <div className="grid grid-cols-2 gap-20 mb-1 luxury-sans text-[7.5pt] text-[#000000] tracking-wide leading-tight">
             <div className="italic">
                <p className="font-bold text-[#2C3E50]/70 uppercase tracking-[0.15em] mb-3 not-italic">Terms of Sale</p>
                <div className="space-y-1 opacity-80">
                   <p>• Returns & Exchanges honored within 7 days in original condition.</p>
                   <p>• Buy-back policy: 5% deduction from current market gold rate.</p>
                   <p>• Purity Guaranteed: 22k (916) & 18k (750) BIS Hallmarked ornaments.</p>
                   <p>• Advance rate bookings valid for a period of 7 days only.</p>
                </div>
             </div>
             <div className="text-right">
                <p className="font-bold text-[#2C3E50]/70 uppercase tracking-[0.15em] mb-3">Store Protocol</p>
                <div className="space-y-1 opacity-80">
                   <p>Hours: 11:00 AM — 8:30 PM (Monday through Sunday)</p>
                   <p>Accepted: UPI, Major Credit/Debit Cards, Bank Transfer</p>
                   <p>Location: Shivaji Nagar, Bengaluru</p>
                </div>
             </div>
          </div>
          
          <div className="flex justify-between items-end mt-2 luxury-sans px-4">
              <div className="text-center w-56">
                 <div className="border-t border-[#000000]/20 pt-1">
                    <p className="text-[7pt] uppercase tracking-[0.2em] font-black text-[#000000]/40">Client Acknowledgement</p>
                 </div>
              </div>
              <div className="text-center w-72">
                 <div className="border-t border-[#D4AF37]/50 pt-1">
                    <p className="text-[8.5pt] uppercase tracking-[0.2em] font-black text-[#000000]">DHANALAKSHMI JEWELLERS</p>
                    <p className="text-[7pt] mt-0.5 text-[#D4AF37] italic font-bold">Authorized Signature</p>
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};
