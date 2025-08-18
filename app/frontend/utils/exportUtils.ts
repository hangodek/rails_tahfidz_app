import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'

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
  
  // Group students by class
  const studentsByClass = dataToExport.reduce((acc, student) => {
    const className = student.class_level || 'No Class'
    if (!acc[className]) {
      acc[className] = []
    }
    acc[className].push(student)
    return acc
  }, {} as Record<string, Student[]>)

  // Sort classes alphabetically
  const sortedClasses = Object.keys(studentsByClass).sort()
  
  // Title page
  doc.setFontSize(24)
  doc.setTextColor(40, 40, 40)
  doc.text('Hifz Student Report', 14, 30)
  doc.text('Classified by Class', 14, 45)

  // Subtitle with date
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 60)
  doc.text(`Total Students: ${dataToExport.length}`, 14, 70)
  doc.text(`Total Classes: ${sortedClasses.length}`, 14, 80)
  
  // Overall summary statistics
  const activeStudents = dataToExport.filter(s => s.status === 'active').length
  const graduatedStudents = dataToExport.filter(s => s.status === 'graduated').length
  const inactiveStudents = dataToExport.filter(s => s.status === 'inactive').length
  
  doc.text(`Overall Status - Active: ${activeStudents} | Graduated: ${graduatedStudents} | Inactive: ${inactiveStudents}`, 14, 95)
  
  let currentY = 110
  
  // Class overview section
  doc.setFontSize(16)
  doc.setTextColor(40, 40, 40)
  doc.text('Class Overview', 14, currentY)
  currentY += 15
  
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  
  sortedClasses.forEach(className => {
    const classStudents = studentsByClass[className]
    const activeInClass = classStudents.filter(s => s.status === 'active').length
    const graduatedInClass = classStudents.filter(s => s.status === 'graduated').length
    const inactiveInClass = classStudents.filter(s => s.status === 'inactive').length
    
    doc.text(`${className}: ${classStudents.length} students (Active: ${activeInClass}, Graduated: ${graduatedInClass}, Inactive: ${inactiveInClass})`, 20, currentY)
    currentY += 8
    
    // Add new page if needed
    if (currentY > 250) {
      doc.addPage()
      currentY = 20
    }
  })
  
  // Detailed class sections
  sortedClasses.forEach((className) => {
    const classStudents = studentsByClass[className]
    
    // Add new page for each class
    doc.addPage()
    
    // Class header
    doc.setFontSize(18)
    doc.setTextColor(40, 40, 40)
    doc.text(`Class: ${className}`, 14, 25)
    
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`${classStudents.length} students`, 14, 35)
    
    // Class statistics
    const activeInClass = classStudents.filter(s => s.status === 'active').length
    const graduatedInClass = classStudents.filter(s => s.status === 'graduated').length
    const inactiveInClass = classStudents.filter(s => s.status === 'inactive').length
    
    doc.text(`Active: ${activeInClass} | Graduated: ${graduatedInClass} | Inactive: ${inactiveInClass}`, 14, 45)
    
    // Sort students by status: graduated > active > inactive
    const sortedClassStudents = classStudents.sort((a, b) => {
      const statusOrder: Record<string, number> = { 'graduated': 0, 'active': 1, 'inactive': 2 }
      return (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3)
    })

    // Prepare table data for this class
    const tableData = sortedClassStudents.map((student, index) => [
      index + 1,
      student.name,
      student.gender === 'male' ? 'M' : 'F',
      `Juz ${student.current_hifz_in_juz}`,
      `${student.current_hifz_in_pages} pages`,
      student.status.charAt(0).toUpperCase() + student.status.slice(1),
      format(new Date(student.date_joined), 'dd/MM/yyyy')
    ])
    
    // Create table for this class
    autoTable(doc, {
      head: [['No', 'Name', 'Gender', 'Current Juz', 'Pages', 'Status', 'Joined']],
      body: tableData,
      startY: 55,
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
        1: { cellWidth: 50 }, // Name
        2: { cellWidth: 20 }, // Gender
        3: { cellWidth: 25 }, // Current Juz
        4: { cellWidth: 25 }, // Pages
        5: { cellWidth: 25 }, // Status
        6: { cellWidth: 25 }, // Joined
      },
      margin: { top: 55 },
    })
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
  link.setAttribute('download', `hifz-report-${format(new Date(), 'yyyy-MM-dd')}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportStudentsToExcel = (students: Student[], filteredStudents?: Student[]) => {
  const dataToExport = filteredStudents || students
  
  // Group students by class
  const studentsByClass = dataToExport.reduce((acc, student) => {
    const className = student.class_level || 'No Class'
    if (!acc[className]) {
      acc[className] = []
    }
    acc[className].push(student)
    return acc
  }, {} as Record<string, Student[]>)

  // Sort classes alphabetically
  const sortedClasses = Object.keys(studentsByClass).sort()
  
  // Create a new workbook
  const workbook = XLSX.utils.book_new()
  
  // Summary sheet
  const summaryData = [
    ['Hifz Student Report - Summary'],
    ['Generated on:', format(new Date(), 'PPP')],
    ['Total Students:', dataToExport.length],
    ['Total Classes:', sortedClasses.length],
    [''],
    ['Overall Status Summary:'],
    ['Active Students:', dataToExport.filter(s => s.status === 'active').length],
    ['Graduated Students:', dataToExport.filter(s => s.status === 'graduated').length],
    ['Inactive Students:', dataToExport.filter(s => s.status === 'inactive').length],
    [''],
    ['Class Breakdown:'],
    ['Class Name', 'Total Students', 'Active', 'Graduated', 'Inactive']
  ]
  
  // Add class breakdown data
  sortedClasses.forEach(className => {
    const classStudents = studentsByClass[className]
    const activeInClass = classStudents.filter(s => s.status === 'active').length
    const graduatedInClass = classStudents.filter(s => s.status === 'graduated').length
    const inactiveInClass = classStudents.filter(s => s.status === 'inactive').length
    
    summaryData.push([
      className,
      classStudents.length,
      activeInClass,
      graduatedInClass,
      inactiveInClass
    ])
  })
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
  
  // Create a sheet for each class
  sortedClasses.forEach(className => {
    const classStudents = studentsByClass[className]
    
    // Sort students by status: graduated > active > inactive
    const sortedClassStudents = classStudents.sort((a, b) => {
      const statusOrder: Record<string, number> = { 'graduated': 0, 'active': 1, 'inactive': 2 }
      return (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3)
    })
    
    // Prepare data for this class
    const classData = [
      ['No', 'Name', 'Gender', 'Birth Place', 'Birth Date', 'Address', 'Current Juz', 'Pages Memorized', 'Status', 'Father Name', 'Mother Name', 'Father Phone', 'Mother Phone', 'Email', 'Phone', 'Date Joined'],
      ...sortedClassStudents.map((student, index) => [
        index + 1,
        student.name,
        student.gender.charAt(0).toUpperCase() + student.gender.slice(1),
        student.birth_place,
        student.birth_date,
        student.address || '',
        student.current_hifz_in_juz,
        student.current_hifz_in_pages,
        student.status.charAt(0).toUpperCase() + student.status.slice(1),
        student.father_name,
        student.mother_name,
        student.father_phone || '',
        student.mother_phone || '',
        student.email || '',
        student.phone || '',
        student.date_joined
      ])
    ]
    
    const classSheet = XLSX.utils.aoa_to_sheet(classData)
    
    // Auto-size columns
    const colWidths = classData[0].map((_, colIndex) => ({
      wch: Math.max(
        classData[0][colIndex].toString().length,
        ...classData.slice(1).map(row => (row[colIndex] || '').toString().length)
      ) + 2
    }))
    classSheet['!cols'] = colWidths
    
    // Clean class name for sheet name (Excel has restrictions)
    const cleanClassName = className.replace(/[\\\/\?\*\[\]]/g, '_').substring(0, 31)
    XLSX.utils.book_append_sheet(workbook, classSheet, cleanClassName)
  })
  
  // Create all students sheet
  const allStudentsData = [
    ['No', 'Name', 'Class', 'Gender', 'Birth Place', 'Birth Date', 'Address', 'Current Juz', 'Pages Memorized', 'Status', 'Father Name', 'Mother Name', 'Father Phone', 'Mother Phone', 'Email', 'Phone', 'Date Joined'],
    ...dataToExport.map((student, index) => [
      index + 1,
      student.name,
      student.class_level,
      student.gender.charAt(0).toUpperCase() + student.gender.slice(1),
      student.birth_place,
      student.birth_date,
      student.address || '',
      student.current_hifz_in_juz,
      student.current_hifz_in_pages,
      student.status.charAt(0).toUpperCase() + student.status.slice(1),
      student.father_name,
      student.mother_name,
      student.father_phone || '',
      student.mother_phone || '',
      student.email || '',
      student.phone || '',
      student.date_joined
    ])
  ]
  
  const allStudentsSheet = XLSX.utils.aoa_to_sheet(allStudentsData)
  
  // Auto-size columns for all students sheet
  const allColWidths = allStudentsData[0].map((_, colIndex) => ({
    wch: Math.max(
      allStudentsData[0][colIndex].toString().length,
      ...allStudentsData.slice(1).map(row => (row[colIndex] || '').toString().length)
    ) + 2
  }))
  allStudentsSheet['!cols'] = allColWidths
  
  XLSX.utils.book_append_sheet(workbook, allStudentsSheet, 'All Students')
  
  // Generate and download the file
  const fileName = `hifz-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
  XLSX.writeFile(workbook, fileName)
}
