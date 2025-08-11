import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

interface Student {
  id: string
  name: string
  current_hifz_in_juz: string
  current_hifz_in_pages: string
  avatar?: string
  class_level: string
  phone?: string
  email?: string
  status: string
  gender: string
  birth_place: string
  birth_date: string
  address?: string
  father_name: string
  mother_name: string
  father_phone?: string
  mother_phone?: string
  date_joined: string
  created_at: string
  updated_at: string
}

export const exportStudentsToPDF = (students: Student[], filteredStudents?: Student[]) => {
  const doc = new jsPDF()
  const dataToExport = filteredStudents || students
  
  // Title
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text('Hifz Student Report', 14, 22)

  // Subtitle with date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 30)
  doc.text(`Total Students: ${dataToExport.length}`, 14, 36)
  
  // Summary statistics
  const activeStudents = dataToExport.filter(s => s.status === 'active').length
  const graduatedStudents = dataToExport.filter(s => s.status === 'graduated').length
  const inactiveStudents = dataToExport.filter(s => s.status === 'inactive').length
  
  doc.text(`Active: ${activeStudents} | Graduated: ${graduatedStudents} | Inactive: ${inactiveStudents}`, 14, 42)
  
  // Prepare table data
  const tableData = dataToExport.map((student, index) => [
    index + 1,
    student.name,
    student.class_level,
    student.gender === 'male' ? 'M' : 'F',
    `Juz ${student.current_hifz_in_juz}`,
    `${student.current_hifz_in_pages} pages`,
    student.status.charAt(0).toUpperCase() + student.status.slice(1),
    format(new Date(student.date_joined), 'dd/MM/yyyy')
  ])
  
  // Create table
  autoTable(doc, {
    head: [['No', 'Name', 'Class', 'Gender', 'Current Juz', 'Pages', 'Status', 'Joined']],
    body: tableData,
    startY: 50,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Light gray
    },
    columnStyles: {
      0: { cellWidth: 15 }, // No
      1: { cellWidth: 40 }, // Name
      2: { cellWidth: 20 }, // Class
      3: { cellWidth: 15 }, // Gender
      4: { cellWidth: 25 }, // Current Juz
      5: { cellWidth: 25 }, // Pages
      6: { cellWidth: 20 }, // Status
      7: { cellWidth: 25 }, // Joined
    },
    margin: { top: 50 },
  })
  
  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    
    // Center the title
    const pageWidth = doc.internal.pageSize.width
    const title = 'Hifz Management System'
    const titleWidth = doc.getTextWidth(title)
    const titleX = (pageWidth - titleWidth) / 2
    
    doc.text(title, titleX, doc.internal.pageSize.height - 10)
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10)
  }
  
  // Save the PDF
  const fileName = `hifz-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`
  doc.save(fileName)
}

export const exportStudentsToCSV = (students: Student[], filteredStudents?: Student[]) => {
  const dataToExport = filteredStudents || students
  
  // Define CSV headers
  const headers = [
    'No',
    'Name',
    'Class',
    'Gender',
    'Birth Place',
    'Birth Date',
    'Address',
    'Current Juz',
    'Pages Memorized',
    'Status',
    'Father Name',
    'Mother Name',
    'Father Phone',
    'Mother Phone',
    'Email',
    'Phone',
    'Date Joined'
  ]
  
  // Prepare CSV data
  const csvData = dataToExport.map((student, index) => [
    index + 1,
    student.name,
    student.class_level,
    student.gender,
    student.birth_place,
    student.birth_date,
    student.address || '',
    student.current_hifz_in_juz,
    student.current_hifz_in_pages,
    student.status,
    student.father_name,
    student.mother_name,
    student.father_phone || '',
    student.mother_phone || '',
    student.email || '',
    student.phone || '',
    student.date_joined
  ])
  
  // Convert to CSV format
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(field => 
      typeof field === 'string' && field.includes(',') 
        ? `"${field}"` 
        : field
    ).join(','))
  ].join('\n')
  
  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `tahfidz-students-${format(new Date(), 'yyyy-MM-dd')}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
