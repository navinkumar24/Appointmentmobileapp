import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";

export async function downloadInvoice(data: any) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background: #f4f6f8;
      padding: 20px;
    }
    .invoice-container {
      max-width: 700px;
      margin: auto;
      background: #ffffff;
      border-radius: 10px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #1e88e5;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #1e88e5;
      margin: 0;
    }
    .header small {
      color: #555;
    }
    .section {
      margin-bottom: 18px;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #1e88e5;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 6px;
    }
    .label {
      color: #555;
    }
    .value {
      font-weight: bold;
      color: #000;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .table th, .table td {
      border: 1px solid #ddd;
      padding: 10px;
      font-size: 14px;
    }
    .table th {
      background: #f0f4ff;
      color: #1e88e5;
      text-align: left;
    }
    .total {
      text-align: right;
      margin-top: 14px;
      font-size: 16px;
      font-weight: bold;
    }
    .status {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      background: #e8f5e9;
      color: #2e7d32;
      font-weight: bold;
    }
    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="invoice-container">

    <div class="header">
      <div>
        <h1>Appointment Invoice</h1>
        <small>Invoice ID: INV-${data.appointmentID}</small>
      </div>
      <div class="status">PAID</div>
    </div>

    <div class="section">
      <div class="section-title">Patient Details</div>
      <div class="row"><span class="label">Name</span><span class="value">${data.patientName}</span></div>
      <div class="row"><span class="label">Mobile</span><span class="value">${data.patientMobile}</span></div>
      <div class="row"><span class="label">Gender</span><span class="value">${data.patientGender}</span></div>
      <div class="row"><span class="label">DOB</span><span class="value">${data.patientDOB}</span></div>
      <div class="row"><span class="label">Address</span><span class="value">${data.patientAddress}</span></div>
    </div>

    <div class="section">
      <div class="section-title">Doctor Details</div>
      <div class="row"><span class="label">Doctor Name</span><span class="value">${data.doctorName}</span></div>
    </div>

    <div class="section">
      <div class="section-title">Appointment Details</div>
      <div class="row"><span class="label">Date</span><span class="value">${data.appointmentDate}</span></div>
      <div class="row"><span class="label">Time</span><span class="value">${data.appointmentStartTime} - ${data.appointmentEndTime}</span></div>
      <div class="row"><span class="label">Appointment ID</span><span class="value">${data.appointmentID}</span></div>
    </div>

    <div class="section">
      <div class="section-title">Payment Summary</div>
      <table class="table">
        <tr>
          <th>Description</th>
          <th>Payment ID</th>
          <th>Order ID</th>
        </tr>
        <tr>
          <td>Consultation Fee</td>
          <td>${data.paymentID}</td>
          <td>${data.orderID}</td>
        </tr>
      </table>
      <div class="total">Total Paid: ₹500</div>
    </div>

    <div class="footer">
      This is a system generated invoice.<br/>
      Thank you for choosing our healthcare services.
    </div>

  </div>
</body>
</html>
`;

    // const { uri } = await Print.printToFileAsync({ html });

    // await Sharing.shareAsync(uri, {
    //     mimeType: "application/pdf",
    //     dialogTitle: "Download Appointment Invoice",
    //     UTI: "com.adobe.pdf",
    // });

    // // 1️⃣ OPEN PDF FIRST
    // await Linking.openURL(uri);

    // // 2️⃣ OPTIONAL: allow download/share AFTER preview
    // setTimeout(async () => {
    //     if (await Sharing.isAvailableAsync()) {
    //         await Sharing.shareAsync(uri, {
    //             mimeType: "application/pdf",
    //             dialogTitle: "Download Appointment Invoice",
    //             UTI: "com.adobe.pdf",
    //         });
    //     }
    // }, 800);
     await Print.printAsync({
    html,
  });

}
