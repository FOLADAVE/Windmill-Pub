// app/api/orders/route.js
import { NextResponse } from "next/server";

// GET orders from Google Sheets
export async function GET() {
  try {
    const res = await fetch(process.env.GOOGLE_SHEETS_API_URL);

    if (!res.ok) {
      throw new Error(`Google Sheets API returned ${res.status}`);
    }

    const data = await res.json();
    console.log("🔎 Raw Google Sheets data:", JSON.stringify(data));

    if (Array.isArray(data) && data.length > 0) {
      console.log("🔎 First row keys:", Object.keys(data[0]));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new order to Google Sheets
export async function POST(request) {
  try {
    const orderData = await request.json();

    const res = await fetch(process.env.GOOGLE_SHEETS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      throw new Error(`Google Sheets API returned ${res.status}`);
    }

    const result = await res.json();
    console.log("✅ Order saved:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error saving order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
