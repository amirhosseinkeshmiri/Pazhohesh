import ExcelJS from "exceljs";

export const EXCEL_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export type ExportCell = string | number | Date | null;

export type ExportColumn = {
  header: string;
  key: string;
  width: number;
  wrap?: boolean;
  numberFormat?: string;
};

export async function createExcelExport(
  worksheetName: string,
  columns: ExportColumn[],
  rows: Record<string, ExportCell>[],
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "سامانه حمایت از پژوهش‌های کاربردی";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(worksheetName, {
    views: [{ state: "frozen", ySplit: 1, rightToLeft: true }],
  });

  worksheet.columns = columns.map(({ header, key, width }) => ({
    header,
    key,
    width,
  }));
  worksheet.addRows(rows);
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columns.length },
  };

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.height = 24;

  columns.forEach((column, index) => {
    const excelColumn = worksheet.getColumn(index + 1);
    if (column.numberFormat) excelColumn.numFmt = column.numberFormat;
    excelColumn.alignment = {
      horizontal: "right",
      vertical: "top",
      wrapText: column.wrap ?? false,
    };
  });

  return workbook.xlsx.writeBuffer();
}

export function publicUploadPath(value: string | null) {
  return value && /^\/uploads\/[a-z0-9/_-]+\.(pdf|doc|docx|zip)$/i.test(value) ? value : "";
}
