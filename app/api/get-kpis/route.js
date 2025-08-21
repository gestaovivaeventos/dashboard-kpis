import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // --- CÓDIGO DE DIAGNÓSTICO ---
  console.log("--- INICIANDO DIAGNÓSTICO DA API NA VERCEL ---");
  console.log("GOOGLE_SHEET_ID:", process.env.GOOGLE_SHEET_ID ? "Encontrado" : "!!! NÃO ENCONTRADO !!!");
  console.log("GOOGLE_SERVICE_ACCOUNT_EMAIL:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? "Encontrado" : "!!! NÃO ENCONTRADO !!!");
  console.log("GOOGLE_PRIVATE_KEY:", process.env.GOOGLE_PRIVATE_KEY ? "Encontrado" : "!!! NÃO ENCONTRADO !!!");
  console.log("---------------------------------------------");
  // --------------------------------

  try {
    // ... (o restante do código continua o mesmo)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'KPIS!A:T',
    });
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No data found in sheet.' }, { status: 404 });
    }
    const headers = rows.shift();
    const data = rows.map((row) => {
      const rowData = {};
      headers.forEach((header, index) => { rowData[header] = row[index]; });
      return rowData;
    });
    return NextResponse.json({ data });
  } catch (error) {
    console.error('ERRO DETALHADO DA API:', error); 
    return NextResponse.json(
      { error: 'Failed to fetch spreadsheet data due to a server error.' },
      { status: 500 }
    );
  }
}