import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportRevenuePDF({
  summary,
  plans,
  monthly,
  yearly,
  purchases,
  groupBy,
}) {
  const doc = new jsPDF();
  const orange = [249, 115, 22];
  const dark   = [15, 23, 42];
  const gray   = [100, 116, 139];
  const light  = [248, 250, 252];

  let y = 0;

  // Header Banner 
  doc.setFillColor(...orange);
  doc.rect(0, 0, 210, 28, "F");

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("LoanHub — Revenue Report", 14, 13);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated: ${new Date().toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })}`,
    14, 22
  );

  // Page number placeholder (right side)
  doc.text("Page 1", 185, 22, { align: "right" });

  y = 36;

  //  Summary Cards Row 
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...dark);
  doc.text("Summary Overview", 14, y);
  y += 6;

  const summaryItems = [
    { label: "Total Revenue",        value: `Rs. ${summary.totalRevenue?.toLocaleString() || "0"}` },
    { label: "Total Purchases",       value: String(summary.totalPurchases || 0) },
    { label: "Avg. Per Purchase",     value: `Rs. ${summary.averageRevenuePerPurchase?.toLocaleString() || "0"}` },
    { label: "Active Plans",          value: String(summary.activePlansCount || 0) },
  ];

  const cardW = 43;
  const cardH = 20;
  const cardGap = 4;

  summaryItems.forEach((item, i) => {
    const x = 14 + i * (cardW + cardGap);
    doc.setFillColor(...light);
    doc.setDrawColor(...orange);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, cardW, cardH, 2, 2, "FD");

    // orange top bar
    doc.setFillColor(...orange);
    doc.roundedRect(x, y, cardW, 2.5, 1, 1, "F");

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text(item.label.toUpperCase(), x + 3, y + 8);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text(item.value, x + 3, y + 16);
  });

  y += cardH + 10;

  //  Helper: section heading 
  const sectionHeading = (title) => {
    doc.setFillColor(...orange);
    doc.rect(14, y, 182, 7, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(title, 17, y + 5);
    y += 11;
  };

  //  Revenue by Plan 
  if ((groupBy === "all" || groupBy === "plan") && plans.length > 0) {
    sectionHeading("Revenue by Plan");

    autoTable(doc, {
      startY: y,
      head: [["Plan Name", "Duration", "Price/Month", "Total Revenue", "Purchases", "Active", "Expired", "Avg."]],
      body: plans.map((p) => [
        p.planName || "N/A",
        p.duration || "N/A",
        `Rs. ${p.priceMonthly?.toLocaleString() || "0"}`,
        `Rs. ${p.totalRevenue?.toLocaleString() || "0"}`,
        p.totalPurchases ?? 0,
        p.activePurchases ?? 0,
        p.expiredPurchases ?? 0,
        `Rs. ${p.averageRevenuePerPurchase?.toLocaleString() || "0"}`,
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: dark,
        lineColor: [226, 232, 240],
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: [255, 247, 237],
        textColor: orange,
        fontStyle: "bold",
        fontSize: 7.5,
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        0: { fontStyle: "bold" },
        3: { textColor: [22, 163, 74], fontStyle: "bold" },
      },
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  // ── Monthly Revenue ────────────────────────────────────────
  if ((groupBy === "all" || groupBy === "month") && monthly.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }
    sectionHeading("Monthly Revenue");

    const totalRev = monthly.reduce((s, m) => s + (m.totalRevenue || 0), 0);

    autoTable(doc, {
      startY: y,
      head: [["Month", "Total Revenue", "Purchases", "Share %"]],
      body: monthly.map((m) => [
        m.monthName || "N/A",
        `Rs. ${m.totalRevenue?.toLocaleString() || "0"}`,
        m.totalPurchases ?? 0,
        totalRev ? `${((m.totalRevenue / totalRev) * 100).toFixed(1)}%` : "0%",
      ]),
      styles: { fontSize: 8, cellPadding: 3, textColor: dark, lineColor: [226, 232, 240], lineWidth: 0.3 },
      headStyles: { fillColor: [255, 247, 237], textColor: orange, fontStyle: "bold", fontSize: 7.5 },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        1: { textColor: [22, 163, 74], fontStyle: "bold" },
      },
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  //  Yearly Revenue 
  if ((groupBy === "all" || groupBy === "year") && yearly.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }
    sectionHeading("Yearly Revenue");

    const totalRev = yearly.reduce((s, yr) => s + (yr.totalRevenue || 0), 0);

    autoTable(doc, {
      startY: y,
      head: [["Year", "Total Revenue", "Purchases", "Share %"]],
      body: yearly.map((yr) => [
        String(yr.year),
        `Rs. ${yr.totalRevenue?.toLocaleString() || "0"}`,
        yr.totalPurchases ?? 0,
        totalRev ? `${((yr.totalRevenue / totalRev) * 100).toFixed(1)}%` : "0%",
      ]),
      styles: { fontSize: 8, cellPadding: 3, textColor: dark, lineColor: [226, 232, 240], lineWidth: 0.3 },
      headStyles: { fillColor: [255, 247, 237], textColor: orange, fontStyle: "bold", fontSize: 7.5 },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        1: { textColor: [22, 163, 74], fontStyle: "bold" },
      },
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  //  Recent Purchases
  if (groupBy === "all" && purchases.length > 0) {
    if (y > 210) { doc.addPage(); y = 20; }
    sectionHeading("Recent Purchases");

    const formatDate = (iso) => {
      if (!iso) return "N/A";
      const d = new Date(iso);
      return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
    };

    autoTable(doc, {
      startY: y,
      head: [["#", "Plan Name", "Purchase Date", "Expiry Date", "Status", "Amount"]],
      body: purchases.map((p, i) => [
        i + 1,
        p.planName || "N/A",
        formatDate(p.purchaseDate),
        formatDate(p.expiryDate),
        p.remainingDays > 0 ? `${p.remainingDays} days left` : "Expired",
        `Rs. ${p.price?.toLocaleString() || "0"}`,
      ]),
      styles: { fontSize: 8, cellPadding: 3, textColor: dark, lineColor: [226, 232, 240], lineWidth: 0.3 },
      headStyles: { fillColor: [255, 247, 237], textColor: orange, fontStyle: "bold", fontSize: 7.5 },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        4: {
          // status color handled via didParseCell
        },
        5: { textColor: [22, 163, 74], fontStyle: "bold", halign: "right" },
      },
      didParseCell: (data) => {
        if (data.column.index === 4 && data.section === "body") {
          const val = String(data.cell.raw);
          data.cell.styles.textColor = val === "Expired" ? [220, 38, 38] : [22, 163, 74];
          data.cell.styles.fontStyle = "bold";
        }
      },
      foot: [[
        "", "", "", "",
        { content: `Total (${purchases.length} purchases)`, styles: { fontStyle: "bold", textColor: dark } },
        {
          content: `Rs. ${purchases.reduce((s, p) => s + (p.price || 0), 0).toLocaleString()}`,
          styles: { fontStyle: "bold", textColor: [22, 163, 74], halign: "right" },
        },
      ]],
      footStyles: { fillColor: [249, 250, 251], lineColor: [226, 232, 240], lineWidth: 0.3 },
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  //  Footer on all pages 
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 287, 210, 10, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text("LoanHub — Confidential Revenue Report", 14, 293);
    doc.text(`Page ${i} of ${pageCount}`, 196, 293, { align: "right" });
  }

  //  Save 
  const fileName = `LoanHub_Revenue_${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}.pdf`;
  doc.save(fileName);
}