import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import connectDB from '@/lib/mongodb';
import { ConversationModel } from '@/lib/models/Conversation';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('PATCH /api/conversations/[id]/dealt-with called with ID:', id);
    
    // Get session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('No authenticated session');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Authenticated user:', session.user.email);

    const { dealtWith } = await request.json();
    console.log('Request body dealtWith:', dealtWith);
    
    if (typeof dealtWith !== 'boolean') {
      console.log('Invalid dealtWith value:', dealtWith);
      return NextResponse.json(
        { success: false, message: 'Invalid dealtWith value' },
        { status: 400 }
      );
    }    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Update the conversation
    const updateData: {
      dealtWith: boolean;
      dealtWithBy: string;
      dealtWithAt?: Date | null;
    } = {
      dealtWith,
      dealtWithBy: session.user.email,
    };

    if (dealtWith) {
      updateData.dealtWithAt = new Date();
    } else {
      updateData.dealtWithAt = null;
    }

    console.log('Update data:', updateData);    const conversation = await ConversationModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    console.log('Updated conversation:', conversation);

    if (!conversation) {
      console.log('Conversation not found with ID:', id);
      return NextResponse.json(
        { success: false, message: 'Conversation not found' },
        { status: 404 }
      );
    }

    console.log('Successfully updated conversation dealt with status');
    return NextResponse.json({
      success: true,
      conversation,
      message: dealtWith ? 'تم وضع علامة كمحلول' : 'تم إلغاء علامة المحلول'
    });

  } catch (error) {
    console.error('Error updating dealt with status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
