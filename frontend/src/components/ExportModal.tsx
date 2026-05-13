import React, { useState } from "react";
import { X, FileText, FileJson, FileSpreadsheet, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useApp, getCurrencyCode } from "@/src/context/AppContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = "csv" | "json" | "pdf";

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { transactions, formatCurrency, profile } = useApp();
  const [format, setFormat] = useState<ExportFormat>("pdf");

  const handleExport = () => {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `spendly_export_${dateStr}`;
    const currencyCode = getCurrencyCode(profile.currency);
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (format === "csv") {
      const headers = ["Date", "Type", "Category", "Merchant", "Amount", "Note"];
      const rows = sortedTransactions.map(tx => {
        const formattedAmount = formatCurrency(tx.amount).replace(/,/g, ''); 
        return [
          new Date(tx.date).toLocaleDateString(),
          tx.type,
          tx.category,
          `"${tx.merchant.replace(/"/g, '""')}"`,
          `"${formattedAmount}"`,
          `"${tx.note ? tx.note.replace(/"/g, '""') : ''}"`
        ].join(",");
      });

      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      downloadBlob(blob, `${filename}.csv`);
    } else if (format === "json") {
      const dataToExport = sortedTransactions.map(tx => ({
        ...tx,
        localAmount: formatCurrency(tx.amount)
      }));
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
      downloadBlob(blob, `${filename}.json`);
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Spendly Transactions Export", 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Currency: ${currencyCode}`, 14, 36);

      const tableColumn = ["Date", "Type", "Category", "Merchant", `Amount (${currencyCode})`];
      const tableRows = sortedTransactions.map(tx => {
        const rawFormatted = formatCurrency(tx.amount);
        const numericPart = rawFormatted.replace(/[^\d.,]/g, '').trim();
        const sign = tx.type === "income" ? "+" : "-";
        return [
          new Date(tx.date).toLocaleDateString(),
          tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
          tx.category,
          tx.merchant,
          `${sign} ${numericPart}`
        ];
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 4) {
            const val = data.cell.raw as string;
            if (val.startsWith('+')) {
              data.cell.styles.textColor = [39, 174, 96]; // green
            } else if (val.startsWith('-')) {
              data.cell.styles.textColor = [231, 76, 60]; // red
            }
          }
        }
      });

      doc.save(`${filename}.pdf`);
    }
    onClose();
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formats = [
    { id: "pdf", label: "PDF Document", icon: FileText, desc: "Best for printing and sharing" },
    { id: "csv", label: "CSV Spreadsheet", icon: FileSpreadsheet, desc: "Best for Excel and accounting tools" },
    { id: "json", label: "JSON Data", icon: FileJson, desc: "Best for developers and backups" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-surface-variant/40 backdrop-blur-sm z-[60]"
          />
          <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-6">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-md bg-surface/95 backdrop-blur-[32px] rounded-t-[32px] md:rounded-[32px] border-t md:border border-outline-variant/30 shadow-2xl pointer-events-auto flex flex-col pt-8 pb-12 px-6 md:px-10"
            >
              <header className="flex justify-between items-center mb-8 shrink-0">
                <button 
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
                >
                  <X className="w-6 h-6 stroke-[1.5px]" />
                </button>
                <h2 className="font-sans text-sm font-medium text-on-surface uppercase tracking-[0.2em]">Export Data</h2>
                <div className="w-10 h-10" />
              </header>

              <div className="flex flex-col gap-4 mb-8">
                {formats.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id as ExportFormat)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                      format === f.id
                        ? "bg-secondary-container border-secondary-container text-on-secondary-container"
                        : "bg-surface-container border-outline-variant/30 text-on-surface hover:bg-surface-container-high"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      format === f.id ? "bg-on-secondary-container/10" : "bg-surface-variant/50 text-on-surface-variant"
                    )}>
                      <f.icon className="w-6 h-6 stroke-[1.5px]" />
                    </div>
                    <div>
                      <h3 className="font-sans font-medium text-base">{f.label}</h3>
                      <p className={cn(
                        "font-sans text-xs mt-1",
                        format === f.id ? "text-on-secondary-container/80" : "text-on-surface-variant"
                      )}>{f.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <motion.button 
                onClick={handleExport}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-8 rounded-full bg-primary text-on-primary hover:opacity-90 font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 stroke-[2px]" />
                <span>Export as {format.toUpperCase()}</span>
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
