import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';

const generateTicketPDF = (ticketData, res) => {
    // Correct the path to the 'tickets' directory
    const directoryPath = path.join(__dirname, '../tickets'); // Use __dirname to get the current directory

    // Ensure the 'tickets' directory exists
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true }); // Create directory if it doesn't exist
    }

    const fileName = `ticket_${ticketData.customerName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    const filePath = path.join(directoryPath, fileName);

    // Now you can generate the PDF and save it to the filePath
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    // Add content to the PDF (this is just an example)
    doc.text(`Customer Name: ${ticketData.customerName}`);
    doc.text(`Email: ${ticketData.customerEmail}`);
    // Add other ticket data as needed

    doc.end();

    // After generating the PDF, return the file path
    return filePath;
};

export default generateTicketPDF;
