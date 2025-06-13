import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import connectDB from '@/lib/mongodb';
import { FileUploadModel } from '@/lib/models/FileUpload';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all file uploads for the current user
    const fileUploads = await FileUploadModel.find({ 
      userId: session.user.email 
    }).sort({ uploadDate: -1 });

    return NextResponse.json({
      success: true,      files: fileUploads.map(file => ({
        id: file._id.toString(),
        name: file.filename,
        size: file.size,
        type: file.mimeType,
        uploadDate: file.uploadDate,
        status: file.status,
        conversationsCount: file.conversationsCount,
        sentimentSummary: file.sentimentSummary
      }))
    });

  } catch (error) {
    console.error('Get files error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch files' 
    }, { status: 500 });
  }
}
