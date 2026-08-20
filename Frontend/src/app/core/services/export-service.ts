// core/services/export.service.ts
import { Injectable } from '@angular/core';
import { IProduct } from '../Models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

   //1. EXPORT TO CSV

  exportToCSV(products: IProduct[], filename: string = 'inventory-report'): void {
    // STEP 1: Define column headers
    const headers = [
      'Product ID',
      'Product Name',
      'Category',
      'Stock',
      'Reorder Level',
      'Price',
      'Status',
      'Last Updated'
    ];

    // STEP 2: Convert products to rows of data
    const rows = products.map(product => [
      product.Product_Card_Id,
      product.Product_Name,
      product.categoryRef?.Category_Name || 'Uncategorized',
      product.Product_Stock,
      product.Product_Reorder_Level,
      product.Product_Price,
      product.Product_Status,
      new Date(product.updatedAt).toLocaleDateString()
    ]);

    // STEP 3: Build CSV content
    let csvContent = headers.join(',') + '\n';
    
    rows.forEach(row => {
      // Escape commas and quotes in string values
      const escapedRow = row.map(value => {
        // If value is a string and contains comma or quote, wrap in quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          // Replace double quotes with double-double quotes (CSV escaping)
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += escapedRow.join(',') + '\n';
    });

    // STEP 4: Create and download the file

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${this.getTodayDate()}.csv`);
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }


   //2. EXPORT TO PDF

  exportToPDF(products: IProduct[], title: string = 'Inventory Report'): void {
    // STEP 1: Generate printable HTML content
    const printContent = this.generatePrintHTML(products, title);
    
    // STEP 2: Open a new window
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (!printWindow) {
      alert('Please allow popups for PDF export');
      return;
    }

    // STEP 3: Write content to the new window
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // STEP 4: Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  //Print Report
  printReport(products: IProduct[], title: string = 'Inventory Report'): void {
    const printContent = this.generatePrintHTML(products, title);
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (!printWindow) {
      alert('Please allow popups for printing');
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  // Generate Print HTML
  private generatePrintHTML(products: IProduct[], title: string): string {
    // Calculate summary statistics
    const totalProducts = products.length;
    const inStock = products.filter(p => p.Product_Stock > 0).length;
    const outOfStock = products.filter(p => p.Product_Stock === 0).length;
    const lowStock = products.filter(p => p.Product_Stock > 0 && p.Product_Stock <= p.Product_Reorder_Level).length;

    // Build table rows
    const rows = products.map(product => `
      <tr>
        <td>${product.Product_Card_Id}</td>
        <td>${product.Product_Name}</td>
        <td>${product.categoryRef?.Category_Name || 'Uncategorized'}</td>
        <td style="text-align:center">${product.Product_Stock}</td>
        <td style="text-align:center">${product.Product_Reorder_Level}</td>
        <td style="text-align:right">$${product.Product_Price.toFixed(2)}</td>
        <td style="text-align:center">
          <span style="
            display:inline-block;
            padding:2px 10px;
            border-radius:9999px;
            font-size:11px;
            font-weight:600;
            background-color:${product.Product_Status === 'Active' ? '#dcfce7' : '#fee2e2'};
            color:${product.Product_Status === 'Active' ? '#166534' : '#991b1b'};
          ">
            ${product.Product_Status}
          </span>
        </td>
        <td style="text-align:center">${new Date(product.updatedAt).toLocaleDateString()}</td>
      </tr>
    `).join('');

    // Return complete HTML document
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            /* Reset and base styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 30px;
              margin: 0;
              background: #ffffff;
              color: #1e293b;
            }
            
            /* Header styles */
            .header {
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            h1 {
              color: #0f172a;
              font-size: 26px;
              font-weight: 700;
              margin-bottom: 5px;
            }
            .subtitle {
              color: #64748b;
              font-size: 14px;
            }
            
            /* Summary cards */
            .summary {
              display: flex;
              gap: 20px;
              margin: 20px 0 25px 0;
              flex-wrap: wrap;
            }
            .summary-item {
              flex: 1;
              min-width: 120px;
              padding: 15px 20px;
              background: #f8fafc;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
              text-align: center;
            }
            .summary-value {
              font-size: 22px;
              font-weight: 700;
              color: #0f172a;
            }
            .summary-label {
              font-size: 12px;
              color: #64748b;
              margin-top: 2px;
            }
            
            /* Table styles */
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 13px;
              margin-top: 10px;
            }
            th {
              background-color: #f1f5f9;
              color: #0f172a;
              font-weight: 600;
              padding: 10px 12px;
              text-align: left;
              border-bottom: 2px solid #cbd5e1;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            td {
              padding: 8px 12px;
              border-bottom: 1px solid #e2e8f0;
              vertical-align: middle;
            }
            
            /* Alternating row colors */
            tr:nth-child(even) {
              background-color: #fafbfc;
            }
            
            /* Footer */
            .footer {
              margin-top: 25px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
              color: #94a3b8;
              font-size: 11px;
              text-align: center;
            }
            
            /* Print-specific styles */
            @media print {
              body {
                padding: 15px;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header">
            <h1>${title}</h1>
            <p class="subtitle">Generated on ${new Date().toLocaleString()}</p>
          </div>

          <!-- Summary Cards -->
          <div class="summary">
            <div class="summary-item">
              <div class="summary-value">${totalProducts}</div>
              <div class="summary-label">Total Products</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${inStock}</div>
              <div class="summary-label">In Stock</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${lowStock}</div>
              <div class="summary-label">Low Stock</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${outOfStock}</div>
              <div class="summary-label">Out of Stock</div>
            </div>
          </div>

          <!-- Table -->
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th style="text-align:center">Stock</th>
                <th style="text-align:center">Reorder Level</th>
                <th style="text-align:right">Price</th>
                <th style="text-align:center">Status</th>
                <th style="text-align:center">Updated</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <!-- Footer -->
          <div class="footer">
            ${title} &bull; Generated on ${new Date().toLocaleString()} &bull; Page 1 of 1
          </div>
        </body>
      </html>
    `;
  }

 
   //5. HELPER: GET TODAY'S DATE
  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}