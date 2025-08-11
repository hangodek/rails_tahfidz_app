declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf'
  
  interface AutoTableOptions {
    head?: any[][]
    body?: any[][]
    startY?: number
    styles?: {
      fontSize?: number
      cellPadding?: number
    }
    headStyles?: {
      fillColor?: number[]
      textColor?: number[]
      fontStyle?: string
    }
    alternateRowStyles?: {
      fillColor?: number[]
    }
    columnStyles?: {
      [key: number]: {
        cellWidth?: number
      }
    }
    margin?: {
      top?: number
    }
  }
  
  function autoTable(doc: jsPDF, options: AutoTableOptions): void
  export default autoTable
}
