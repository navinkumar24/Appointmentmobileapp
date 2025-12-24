import * as Print from "expo-print";
import getCalculatedAge from "./getCalculatedAge";
import getenvValues from "./getenvValues";



// Utility to convert numbers to words (same as yours)
const numberToWords = (num: any) => {
    if (!num && num !== 0) return "Zero Rupees Only";
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
        "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
        "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const inWords: any = (n: any) => {
        if (n === 0) return "";
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
        if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + inWords(n % 100) : "");
        if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + inWords(n % 1000) : "");
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + inWords(n % 100000) : "");
        return "";
    };
    const words = inWords(Math.floor(num)).trim();
    return words ? words + " Rupees Only" : "Zero Rupees Only";
};

export async function downloadInvoice(data: any) {

    const { companyAddress, companyGmail, companyMobile, companyName } = getenvValues()

    const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Invoice - GS NEUROSCIENCE</title>
  <style>
    :root{
      --bg: #f4f7fb;
      --card: #ffffff;
      --muted: #6b7280;
      --accent: #164e9f;
      --accent-2: #0ea5a3;
      --shadow: 0 12px 34px rgba(12,32,63,0.08);
      --radius: 14px;
      --gutter: 20px;
      --font-sans: "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    /* Page & centering */
    html,body{
      height:100%;
      margin:0;
      font-family:var(--font-sans);
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
      background:var(--bg);
      color:#0f172a;
    }

    /* center the document on screen and preserve when printing */
    .page-wrap{
      display:flex;
      align-items:center;
      justify-content:center;
      padding:28px;
    }

    .invoice{
      width:100%;
      max-width:820px;
      background:var(--card);
      border-radius:var(--radius);
      box-shadow:var(--shadow);
      padding:28px;
      position:relative;
      overflow:hidden;
      border: 1px solid rgba(10,36,84,0.04);
    }

    /* left accent stripe for a refined brand touch */
    .invoice::before{
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 8px;
      background: linear-gradient(180deg, var(--accent), var(--accent-2));
      border-top-left-radius: var(--radius);
      border-bottom-left-radius: var(--radius);
    }

    .header{
      display:flex;
      gap:var(--gutter);
      align-items:center;
      justify-content:space-between;
      padding-bottom: 14px;
      border-bottom: 1px solid #eef6fb;
      margin-bottom:18px;
    }

    .brand{
      display:flex;
      gap:16px;
      align-items:center;
    }

    .brand img{
      width:68px;
      height:68px;
      object-fit:contain;
      border-radius:10px;
      background:#fff;
      padding:8px;
      box-shadow: 0 4px 12px rgba(16,24,40,0.04);
      border:1px solid #f1f5f9;
    }

    .company{
      font-weight:800;
      color:var(--accent);
      font-size:18px;
      letter-spacing:0.2px;
      margin-bottom:4px;
    }

    .tagline{
      font-size:12px;
      color:var(--muted);
    }

    .meta{
      text-align:right;
      min-width:240px;
    }

    .meta .title{
      font-weight:800;
      font-size:16px;
      color:#071233;
      margin-bottom:6px;
    }

    .meta-row{
      color:var(--muted);
      font-size:13px;
      margin-bottom:4px;
    }

    .status{
      display:inline-block;
      padding:6px 12px;
      border-radius:999px;
      font-weight:700;
      font-size:12px;
      color:#065f46;
      background:#ecfdf5;
      border:1px solid rgba(6,95,70,0.06);
      margin-top:8px;
    }

    /* two-column blocks */
    .blocks{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap:18px;
      margin-top:18px;
      margin-bottom:18px;
    }

    .card{
      background:#fbfdff;
      border-radius:10px;
      padding:14px;
      border:1px solid #eef6fb;
    }

    .heading{
      font-size:12px;
      font-weight:800;
      color:var(--accent);
      letter-spacing:0.6px;
      text-transform:uppercase;
      margin-bottom:10px;
    }

    .kv{ display:flex; gap:12px; margin-bottom:10px; align-items:flex-start; }
    .k{ width:140px; color:var(--muted); font-weight:700; font-size:13px; }
    .v{ flex:1; color:#071233; font-weight:700; font-size:13px; word-break:break-word; }

    /* items table */
    .items{ margin-top:6px; border-radius:8px; overflow:hidden; border:1px solid #e6eef7; }
    table{ width:100%; border-collapse:collapse; font-size:13px; }
    thead th{
      text-align:left;
      padding:14px 16px;
      background: linear-gradient(180deg,#f8fbff,#f1f7ff);
      color:var(--accent);
      font-weight:800;
      border-bottom:1px solid #e6eef7;
      font-size:13px;
    }
    tbody td{
      padding:12px 16px;
      border-bottom:1px dashed #eef6fb;
      vertical-align:middle;
      color:#071233;
    }
    tbody tr:last-child td{ border-bottom:none; }

    .col-desc{ width:62%; }
    .col-qty{ width:12%; text-align:right; color:var(--muted); font-weight:700; }
    .col-rate{ width:26%; text-align:right; font-weight:800; }

    /* summary / totals */
    .summary{
      display:flex;
      justify-content:flex-end;
      margin-top:14px;
      gap:12px;
    }

    .summary-box{
      width:320px;
      border-radius:10px;
      padding:14px;
      background:#fff;
      border:1px solid #eef5fb;
      box-shadow: 0 6px 18px rgba(12,32,63,0.03);
    }

    .st-row{ display:flex; justify-content:space-between; padding:8px 0; color:var(--muted); font-size:13px; }
    .st-row.total{ font-weight:900; color:#071233; font-size:15px; padding-top:12px; margin-top:6px; }

    /* footer */
    .footer{
      margin-top:20px;
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:20px;
      color:var(--muted);
      font-size:13px;
      border-top:1px dashed #e6eef7;
      padding-top:14px;
    }

    .signature{ text-align:right; font-size:13px; }
    .sig-line{ display:inline-block; margin-top:10px; border-top:1px solid #cbd5e1; padding-top:6px; min-width:180px; color:var(--muted); font-weight:700; }
  </style>
</head>
<body>
  <div class="page-wrap">
    <div class="invoice" role="document" aria-label="Receipt for GS NEUROSCIENCE">

      <!-- Header -->
      <div class="header">
        <div class="brand" aria-hidden="false">
          <div>
            <div class="company">GS NEUROSCIENCE</div>
            <div class="tagline">Clinic & Research Centre</div>
          </div>
        </div>

        <div class="meta" aria-hidden="false">
          <div class="title">RECEIPT</div>
          <div class="meta-row"><strong>Receipt Date:</strong>&nbsp; ${data.appointmentDate || ''}</div>
        </div>
      </div>

      <!-- Blocks -->
      <div class="blocks" role="group" aria-label="Patient and appointment details">
        <div class="card">
          <div class="heading">Patient Details</div>
          <div class="kv"><div class="k">Name</div><div class="v">${data?.patientName || '-'}</div></div>
          <div class="kv"><div class="k">Mobile</div><div class="v">${data?.patientMobile || '-'}</div></div>
          <div class="kv"><div class="k">Gender</div><div class="v">${data?.patientGender || '-'}</div></div>
          <div class="kv"><div class="k">Age</div><div class="v">${getCalculatedAge(data?.patientDOB, data?.appointmentDate) || '-'}</div></div>
          <div class="kv"><div class="k">Address</div><div class="v">${data?.patientAddress || '-'}</div></div>
        </div>
        <div class="card">
          <div class="heading">Appointment & Doctor</div>
          <div class="kv"><div class="k">Doctor</div><div class="v">${data?.doctorName || '-'}</div></div>
          <div class="kv"><div class="k">Appointment ID</div><div class="v">GSNAP${data?.appointmentID || '-'}</div></div>
          <div class="kv"><div class="k">Payment ID</div><div class="v">${data?.paymentID || '-'}</div></div>
          <div class="kv"><div class="k">Appointment Date</div><div class="v">${data?.appointmentDate || '-'}</div></div>
          <div class="kv"><div class="k">Time Slot</div><div class="v">${data?.appointmentStartTime || '-'}&nbsp; - &nbsp;${data?.appointmentEndTime || '-'}</div></div>
        </div>
      </div>

      <!-- Items -->
      <div class="items" role="region" aria-label="Payment items">
        <table>
          <thead>
            <tr>
              <th class="col-desc">Description</th>
              <th class="col-qty">Qty</th>
              <th class="col-rate">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-desc"><div style="font-weight:700;">Consultation Fee</div></td>
              <td class="col-qty">1</td>
              <td class="col-rate">₹ &nbsp;${" " + (data?.amount || 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="summary" role="complementary">
          <div class="st-row total"><div>Total Paid ₹ &nbsp;</div><div> ${" " + (data.amount || 0)}</div></div>
      </div>
        <h2 style="font-size: small; font-weight: 500; font-style: italic;">
                <span style="font-weight: bold;">PAID : </span>
                <span>${numberToWords(data?.amount || 0)}</span>
        </h2>

      <!-- Footer -->
      <div class="footer" role="contentinfo">
        <div>
          <div style="font-weight:800; color:var(--accent); margin-bottom:6px;">${companyName}</div>
          <div style="color:var(--muted);">${companyAddress}</div>
          <div style="color:var(--muted); margin-top:6px;">Phone: ${companyMobile} <br> Email: ${companyGmail}</div>
        </div>

        <div class="signature">
          <div style="color:var(--muted); font-size:13px;">Authorised signatory</div>
          <div class="sig-line">${companyName}</div>
        </div>
      </div>

    </div>
  </div>

</body>
</html>
`;
    await Print.printAsync({ html });
}