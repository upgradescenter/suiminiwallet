
import {NextRequest, NextResponse} from 'next/server';

// This is a dummy salt service. In a real app, you would need to
// persist the salt for each user.
const userSalts = new Map<string, string>();

export async function POST(req: NextRequest) {
  const {subject} = await req.json();

  if (!subject) {
    return NextResponse.json({error: 'Subject is required'}, {status: 400});
  }

  let salt = userSalts.get(subject);

  if (!salt) {
    // In a real app, you would generate a new salt and persist it.
    // For this example, we'll use a fixed salt for simplicity.
    salt = '123456789123456789'; // This should be a large random number string
    userSalts.set(subject, salt);
  }

  return NextResponse.json({salt});
}
