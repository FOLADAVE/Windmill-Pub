// app/api/orders/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Use your actual Google Sheets Apps Script URL
    const res = await fetch(process.env.GOOGLE_SHEETS_API_URL);

    if (!res.ok) {
      throw new Error(`Google Sheets API returned ${res.status}`);
    }

    const data = await res.json();
    console.log('🔎 Raw Google Sheets data:', JSON.stringify(data));
    // If the first item exists, log its keys for header debugging
    if (Array.isArray(data) && data.length > 0) {
      console.log('🔎 First row keys:', Object.keys(data[0]));
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
