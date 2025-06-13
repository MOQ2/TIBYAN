// Simple test script to verify the dealt-with functionality
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

// First, let's get a conversation ID
async function testDealtWithFunctionality() {
    try {
        console.log('🔍 Testing dealt-with functionality...');
        
        // Get conversations first
        const conversationsResponse = await fetch(`${BASE_URL}/api/conversations?limit=1`, {
            headers: {
                'Cookie': 'next-auth.session-token=your-session-token-here'
            }
        });
        
        if (!conversationsResponse.ok) {
            console.error('❌ Failed to fetch conversations');
            return;
        }
        
        const conversationsData = await conversationsResponse.json();
        const conversations = conversationsData.conversations || [];
        
        if (conversations.length === 0) {
            console.log('⚠️  No conversations found');
            return;
        }
        
        const testConversation = conversations[0];
        console.log(`📝 Testing with conversation ID: ${testConversation._id}`);
        console.log(`📊 Initial dealt-with status: ${testConversation.dealtWith || false}`);
        
        // Mark as dealt with
        console.log('✅ Marking as dealt with...');
        const markResponse = await fetch(`${BASE_URL}/api/conversations/${testConversation._id}/dealt-with`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'next-auth.session-token=your-session-token-here'
            },
            body: JSON.stringify({ dealtWith: true })
        });
        
        if (markResponse.ok) {
            const markResult = await markResponse.json();
            console.log('✅ Successfully marked as dealt with');
            console.log(`📊 New dealt-with status: ${markResult.conversation.dealtWith}`);
        } else {
            console.error('❌ Failed to mark as dealt with:', markResponse.status);
        }
        
        // Verify by fetching conversations again
        console.log('🔍 Verifying by re-fetching conversations...');
        const verifyResponse = await fetch(`${BASE_URL}/api/conversations?limit=10`, {
            headers: {
                'Cookie': 'next-auth.session-token=your-session-token-here'
            }
        });
        
        if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            const updatedConversation = verifyData.conversations.find(c => c._id === testConversation._id);
            if (updatedConversation) {
                console.log(`✅ Verification successful - dealt-with status: ${updatedConversation.dealtWith || false}`);
                if (updatedConversation.dealtWithAt) {
                    console.log(`📅 Dealt-with timestamp: ${updatedConversation.dealtWithAt}`);
                }
                if (updatedConversation.dealtWithBy) {
                    console.log(`👤 Dealt-with by: ${updatedConversation.dealtWithBy}`);
                }
            } else {
                console.error('❌ Could not find conversation in verification');
            }
        } else {
            console.error('❌ Failed to verify');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testDealtWithFunctionality();
