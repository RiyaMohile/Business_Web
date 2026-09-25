import { NextRequest, NextResponse } from "next/server";

const requests: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      phone,
      email,
      requestType,
      reason,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name and phone are required",
        },
        { status: 400 }
      );
    }

    // Check duplicate pending request
    const existingRequest = requests.find(
      (item) =>
        item.phone === phone &&
        item.status === "pending"
    );

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You already have a pending deletion request.",
        },
        { status: 409 }
      );
    }

    const newRequest = {
      id: Date.now().toString(),
      referenceId: `TH-${Date.now()}`,
      fullName,
      phone,
      email: email || null,
      requestType,
      reason: reason || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    requests.push(newRequest);

    return NextResponse.json(
      {
        success: true,
        message: "Deletion request submitted successfully",
        referenceId: newRequest.referenceId,
        data: newRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit deletion request",
      },
      { status: 500 }
    );
  }
}