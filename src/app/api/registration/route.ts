import { generateConductC1MeetingInDatabase } from "@/src/templates/generateConductC1MeetingInDatabase";
import { ACCELERATOR_TASKS_DB } from "@/src/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    generateConductC1MeetingInDatabase({
      ...data,
      parentId: ACCELERATOR_TASKS_DB,
    }); // takes forever to run, so no await

    return NextResponse.json({
      message: "Meeting task creation in progress",
    });
  } catch (error) {
    // Handle any errors that occur
    return NextResponse.json(
      {
        message: "Failed to create meeting",
        error,
      },
      { status: 500 }
    );
  }
}
