import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Enhanced Excel Export - supports multiple sheets and better formatting
 */
export async function exportToExcel(data: any[], filename: string, sheetName: string = 'Données') {
  if (data.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Define columns based on data keys
  const firstItem = data[0];
  const columns = Object.keys(firstItem).map(key => ({
    header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
    key: key,
    width: 20
  }));

  worksheet.columns = columns;

  // Add rows
  worksheet.addRows(data);

  // Stylize header
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' } // Blue-500
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Realistic PDF Export using html2canvas and jsPDF
 * Captures the current visible page content (including charts)
 */
export async function exportToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found for PDF export:", elementId);
    return;
  }

  try {
    // Add temporary class for print styling if needed
    element.classList.add('export-pdf-printing');

    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Split into multiple pages if needed
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    element.classList.remove('export-pdf-printing');
    pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error("PDF generation failed:", error);
    element.classList.remove('export-pdf-printing');
  }
}

export function handlePrint() {
  window.print();
}

/**
 * Downloads a CSV template for user import
 */
export function downloadUserTemplateCSV() {
  const headers = "first_name,last_name,email,department,position,seniority,language";
  const exampleRow = "Jean,Dupont,jean.dupont@entreprise.com,IT,Développeur,senior,fr";
  const csvContent = `${headers}\n${exampleRow}`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `template_import_utilisateurs_kira.csv`);
}
